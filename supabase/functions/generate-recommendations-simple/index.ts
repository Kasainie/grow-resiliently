import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
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

    console.log("Generating recommendations for farm:", farm.name);

    const prompt = `You are an expert agricultural consultant. Generate 5 farm recommendations in JSON format ONLY. Do not include any other text.

Farm: ${farm.name}, ${farm.area_ha}ha, Soil: ${farm.soil_type || "Unknown"}, Irrigation: ${farm.has_irrigation ? "Yes" : "No"}

Generate this JSON EXACTLY:
{
  "recommendations": [
    {"title": "Soil Testing", "description": "Conduct soil analysis", "type": "soil", "priority": "high"},
    {"title": "Crop Rotation", "description": "Rotate crops for soil health", "type": "crop_management", "priority": "high"},
    {"title": "Water Management", "description": "Monitor soil moisture", "type": "irrigation", "priority": "medium"},
    {"title": "Pest Prevention", "description": "Implement integrated pest management", "type": "pest_management", "priority": "high"},
    {"title": "Regular Monitoring", "description": "Scout for diseases weekly", "type": "monitoring", "priority": "high"}
  ]
}`;

    let recommendations = [];
    let usedProvider = "fallback";

    // Try Hugging Face if API key available
    if (HF_API_KEY) {
      try {
        console.log("Using Hugging Face for recommendations...");
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
                max_new_tokens: 600,
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
            recommendations = parsed.recommendations || [];
            usedProvider = "huggingface";
          }
        }
      } catch (e) {
        console.error("Hugging Face failed:", e);
      }
    }

    // Fallback recommendations if AI is unavailable
    if (recommendations.length === 0) {
      recommendations = [
        {
          title: "Soil Testing & Analysis",
          description:
            "Conduct a comprehensive soil test to determine pH, nutrient levels, organic matter, and microbial activity.",
          type: "soil",
          priority: "high",
        },
        {
          title: "Implement Crop Rotation Plan",
          description:
            "Establish a 3-4 year crop rotation cycle to maintain soil health and reduce pest/disease buildup.",
          type: "crop_management",
          priority: "high",
        },
        {
          title: farm.has_irrigation
            ? "Optimize Irrigation System"
            : "Install Drip Irrigation",
          description: farm.has_irrigation
            ? "Review and optimize your irrigation schedule based on seasonal rainfall and crop water needs."
            : "Consider installing a drip irrigation system to improve water efficiency and reduce costs.",
          type: "irrigation",
          priority: "high",
        },
        {
          title: "Integrated Pest Management (IPM)",
          description:
            "Use cultural, biological, and chemical controls to manage pests while minimizing pesticide use.",
          type: "pest_management",
          priority: "high",
        },
        {
          title: "Weekly Farm Monitoring Schedule",
          description:
            "Scout fields weekly for pests, diseases, and weeds. Keep detailed records of all observations.",
          type: "monitoring",
          priority: "high",
        },
      ];
      usedProvider = "fallback";
    }

    // Insert recommendations into database
    const recsToInsert = recommendations.map((rec) => ({
      farm_id: farmId,
      title: rec.title,
      description: rec.description,
      type: rec.type || "general",
      priority: rec.priority || "medium",
    }));

    const { error: insertError } = await supabase
      .from("recommendations")
      .insert(recsToInsert);

    if (insertError) {
      console.error("Error inserting recommendations:", insertError);
      throw insertError;
    }

    console.log(
      `Recommendations generated using ${usedProvider}:`,
      recommendations.length,
    );

    return new Response(
      JSON.stringify({
        success: true,
        recommendations_count: recommendations.length,
        recommendations: recommendations,
        provider: usedProvider,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error in generate-recommendations function:", error);
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


