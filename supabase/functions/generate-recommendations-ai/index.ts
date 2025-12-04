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
    const { farmId, userId } = await req.json();

    if (!farmId) {
      return new Response(
        JSON.stringify({ error: "farmId is required" }),
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

    console.log("Generating recommendations for farm:", farm.name);

    const prompt = `Generate 5 farm recommendations for: ${farm.name} (${farm.area_ha}ha, ${farm.soil_type || "unknown"} soil, irrigation: ${farm.has_irrigation ? "yes" : "no"}) in JSON only:
{"recommendations": [{"title": "Soil Testing", "description": "Test soil", "type": "planting", "priority": "high"}]}`;

    let recommendations = [];

    // Try ChatGPT first
    if (OPENAI_API_KEY) {
      try {
        console.log("Using ChatGPT for recommendations...");
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
            recommendations = Array.isArray(parsed.recommendations) ? parsed.recommendations : [];
          }
        }
      } catch (e) {
        console.error("ChatGPT failed:", e);
      }
    }

    // Try Gemini if ChatGPT failed
    if (recommendations.length === 0 && GEMINI_API_KEY) {
      try {
        console.log("Using Gemini for recommendations...");
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
            recommendations = Array.isArray(parsed.recommendations) ? parsed.recommendations : [];
          }
        }
      } catch (e) {
        console.error("Gemini failed:", e);
      }
    }

    // Fallback recommendations
    if (recommendations.length === 0) {
      recommendations = [
        { title: "Soil Testing", description: "Conduct soil analysis", type: "fertilizer", priority: "high" },
        { title: "Crop Rotation", description: "Implement rotation plan", type: "planting", priority: "high" },
        { title: farm.has_irrigation ? "Optimize Irrigation" : "Install Irrigation", description: "Manage water", type: "irrigation", priority: "high" },
        { title: "Integrated Pest Management", description: "Use IPM practices", type: "pesticide", priority: "high" },
        { title: "Weekly Farm Monitoring", description: "Scout fields", type: "harvest", priority: "high" },
      ];
    }

    // Map types to valid database values
    const validTypes = ['planting', 'irrigation', 'fertilizer', 'pesticide', 'harvest'];
    const recsToInsert = recommendations.map((rec) => {
      let type = (rec.type || "fertilizer").toLowerCase();
      if (!validTypes.includes(type)) type = "fertilizer";
      
      return {
        farm_id: farmId,
        title: rec.title,
        description: rec.description,
        type: type,
        priority: rec.priority || "medium",
      };
    });

    // Insert recommendations
    const { data, error: insertError } = await supabase
      .from("recommendations")
      .insert(recsToInsert)
      .select();

    if (insertError) throw insertError;

    return new Response(
      JSON.stringify({
        success: true,
        count: data?.length || 0,
        recommendations: data,
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
