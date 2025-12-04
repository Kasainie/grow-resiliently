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
    const { farmId, userId } = await req.json();

    if (!farmId || !userId) {
      return new Response(
        JSON.stringify({ error: "farmId and userId are required" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Get farm details
    const { data: farm, error: farmError } = await supabase
      .from("farms")
      .select("*")
      .eq("id", farmId)
      .maybeSingle();

    if (farmError) throw farmError;
    if (!farm) throw new Error("Farm not found");

    console.log("Generating alerts for farm:", farm.name);

    const prompt = `Generate 4 farm alerts for ${farm.name} (${farm.area_ha}ha, ${farm.soil_type || "unknown"} soil, irrigation: ${farm.has_irrigation ? "yes" : "no"}) in JSON only:
{"alerts": [{"level": "critical", "title": "Alert 1", "message": "Msg"}, {"level": "warning", "title": "Alert 2", "message": "Msg"}, {"level": "warning", "title": "Alert 3", "message": "Msg"}, {"level": "info", "title": "Alert 4", "message": "Msg"}]}`;

    let alerts = [];

    // Try ChatGPT first
    if (OPENAI_API_KEY) {
      try {
        console.log("Using ChatGPT for alerts...");
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          const content = result.choices?.[0]?.message?.content || "";
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            alerts = Array.isArray(parsed.alerts) ? parsed.alerts : [];
          }
        }
      } catch (e) {
        console.error("ChatGPT failed:", e);
      }
    }

    // Try Gemini if ChatGPT failed
    if (alerts.length === 0 && GEMINI_API_KEY) {
      try {
        console.log("Using Gemini for alerts...");
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
            }),
          }
        );

        if (response.ok) {
          const result = await response.json();
          const content = result.candidates?.[0]?.content?.parts?.[0]?.text || "";
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            alerts = Array.isArray(parsed.alerts) ? parsed.alerts : [];
          }
        }
      } catch (e) {
        console.error("Gemini failed:", e);
      }
    }

    // Fallback alerts
    if (alerts.length === 0) {
      alerts = [
        { level: "critical", title: "Monitor Farm", message: `Check your ${farm.area_ha}ha farm for pests/diseases.` },
        { level: "warning", title: "Soil Management", message: `${farm.soil_type || "Soil"} needs proper amendments.` },
        { level: "warning", title: farm.has_irrigation ? "Optimize Irrigation" : "Water Critical", message: farm.has_irrigation ? "Review irrigation schedule." : "Manage water carefully." },
        { level: "info", title: "Weekly Inspections", message: "Scout fields weekly for issues." },
      ];
    }

    // Insert alerts
    const alertsToInsert = alerts.map((a) => ({
      user_id: userId,
      farm_id: farmId,
      level: a.level || "info",
      title: a.title,
      message: a.message,
      is_read: false,
    }));

    const { data, error: insertError } = await supabase
      .from("alerts")
      .insert(alertsToInsert)
      .select();

    if (insertError) throw insertError;

    return new Response(
      JSON.stringify({
        success: true,
        count: data?.length || 0,
        alerts: data,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
