import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { farmId } = await req.json();

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get(
      "SUPABASE_SERVICE_ROLE_KEY",
    )!;
    const HF_API_KEY = Deno.env.get("HF_API_KEY");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Get farm details
    const { data: farm, error: farmError } = await supabase
      .from("farms")
      .select("*")
      .eq("id", farmId)
      .maybeSingle();

    if (farmError) throw farmError;
    if (!farm) throw new Error("Farm not found");

    console.log("Farm found:", farm.name);

    // Get recent analysis results
    const { data: analyses, error: analysisError } = await supabase
      .from("analysis_results")
      .select("*")
      .eq("farm_id", farmId)
      .order("created_at", { ascending: false })
      .limit(5);

    const prompt = `You are an expert agricultural AI assistant. Analyze this farm and generate 4 critical alerts in JSON format ONLY. Do not include any other text.

Farm: ${farm.name}, ${farm.area_ha}ha, Soil: ${farm.soil_type || "Unknown"}, Irrigation: ${farm.has_irrigation ? "Yes" : "No"}

Generate this JSON EXACTLY:
{
  "alerts": [
    {"level": "critical", "title": "Alert 1", "message": "Message about farm management"},
    {"level": "warning", "title": "Alert 2", "message": "Message about potential risks"},
    {"level": "warning", "title": "Alert 3", "message": "Message about maintenance"},
    {"level": "info", "title": "Alert 4", "message": "Message about recommendations"}
  ]
}`;

    let alerts = [];
    let usedProvider = "fallback";

    // Try Hugging Face if API key available
    if (HF_API_KEY) {
      try {
        console.log("Using Hugging Face for alert generation...");
        const hfResponse = await fetch(
          "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${HF_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              inputs: prompt,
              parameters: {
                max_new_tokens: 500,
                temperature: 0.7,
              },
            }),
          },
        );

        if (hfResponse.ok) {
          const result = await hfResponse.json();
          const content = result[0]?.generated_text || "";
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            alerts = parsed.alerts || [];
            usedProvider = "huggingface";
          }
        }
      } catch (e) {
        console.error("Hugging Face failed:", e);
      }
    }

    // Fallback alerts if AI is unavailable
    if (alerts.length === 0) {
      alerts = [
        {
          level: "critical",
          title: "Regular Crop Monitoring Required",
          message: `Monitor your ${farm.area_ha}ha farm regularly for signs of pest, disease, or stress.`,
        },
        {
          level: "warning",
          title: `${farm.soil_type || "Soil"} Management Alert`,
          message: `Your farm has ${farm.soil_type || "mixed"} soil. Apply appropriate amendments for optimal crop growth.`,
        },
        {
          level: "warning",
          title: farm.has_irrigation ? "Optimize Irrigation" : "Water Management Critical",
          message: farm.has_irrigation
            ? "Review irrigation schedule and ensure proper water distribution across all plots."
            : "Implement water conservation strategies and monitor soil moisture carefully.",
        },
        {
          level: "info",
          title: "Preventive Care Schedule",
          message:
            "Schedule regular field inspections weekly and maintain detailed records of all farm activities.",
        },
      ];
      usedProvider = "fallback";
    }

    // Insert alerts into database
    const alertsToInsert = alerts.map((alert) => ({
      user_id: farm.user_id,
      farm_id: farmId,
      level: alert.level || "info",
      title: alert.title,
      message: alert.message,
      is_read: false,
    }));

    const { error: insertError } = await supabase
      .from("alerts")
      .insert(alertsToInsert);

    if (insertError) {
      console.error("Error inserting alerts:", insertError);
      throw insertError;
    }

    console.log(`Alerts generated using ${usedProvider}:`, alerts.length);

    return new Response(
      JSON.stringify({
        success: true,
        alerts_count: alerts.length,
        alerts: alerts,
        provider: usedProvider,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error in generate-basic-alerts function:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});


