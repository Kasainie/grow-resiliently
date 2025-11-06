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

    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!OPENAI_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing required environment variables");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch farm details
    const { data: farm, error: farmError } = await supabase
      .from("farms")
      .select("*")
      .eq("id", farmId)
      .single();

    if (farmError) throw farmError;
    if (!farm) throw new Error("Farm not found");

    console.log("🌱 Streaming recommendations for farm:", farm.name);

    // Build the prompt
    const prompt = `
Generate 3–5 actionable climate-smart farming recommendations for the following farm.

Farm Details:
- Name: ${farm.name}
- Location: ${farm.latitude}, ${farm.longitude}
- Area: ${farm.area_ha} hectares
- Soil: ${farm.soil_type}
- Irrigation: ${farm.has_irrigation ? "Yes" : "No"}

Focus on:
- Climate adaptation strategies
- Water efficiency improvements
- Sustainable soil and crop management

Return ONLY a JSON array in this exact structure:
[
  {
    "title": "Short recommendation title (max 50 chars)",
    "description": "Detailed explanation (max 200 chars)",
    "priority": "low" | "medium" | "high",
    "type": "planting" | "irrigation" | "fertilizer" | "pesticide" | "harvest"
  }
]
`;

    // Send request to OpenAI (streaming mode)
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        stream: true,
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content:
              "You are a climate-smart agriculture expert. Always return valid JSON only — no markdown or explanations.",
          },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!response.ok || !response.body) {
      const err = await response.text();
      console.error("OpenAI stream error:", err);
      throw new Error("OpenAI stream failed");
    }

    // Stream the OpenAI output directly to the client
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          // Forward each data chunk line-by-line
          const lines = chunk.split("\n").filter((line) => line.trim() !== "");

          for (const line of lines) {
            if (line === "data: [DONE]") {
              controller.close();
              return;
            }
            if (line.startsWith("data: ")) {
              try {
                const json = JSON.parse(line.substring(6));
                const token = json.choices?.[0]?.delta?.content || "";
                if (token) {
                  controller.enqueue(new TextEncoder().encode(token));
                }
              } catch (e) {
                console.error("Stream parse error:", e);
              }
            }
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("❌ Error in generate-recommendations-stream:", error);
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
