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
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

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

    if (analysisError) {
      console.error("Error fetching analyses:", analysisError);
    }

    const prompt = `
You are an expert agricultural AI assistant. Analyze this farm data and generate 3-5 critical alerts and warnings.

Farm Details:
- Name: ${farm.name}
- Location: ${farm.latitude}, ${farm.longitude}
- Area: ${farm.area_ha} hectares
- Soil Type: ${farm.soil_type}
- Irrigation: ${farm.has_irrigation ? "Yes" : "No"}

Recent Analysis Results:
${
  analyses && analyses.length > 0
    ? analyses
        .map(
          (a) =>
            `- Disease: ${a.disease_detected}, Severity: ${a.severity_level}, Confidence: ${a.confidence_score}%`,
        )
        .join("\n")
    : "No recent analyses"
}

Generate alerts in the following categories:
1. Disease outbreak warnings based on detected issues
2. Pest management alerts
3. Weather-based crop protection recommendations
4. Irrigation and water management alerts
5. Preventive action recommendations

Return ONLY a JSON array of alerts with this exact structure:
[
  {
    "level": "critical" | "warning" | "info",
    "title": "Alert title (max 60 chars)",
    "message": "Detailed message with actionable steps (max 200 chars)"
  }
]
`;

    console.log("Starting OpenAI streaming for farm:", farmId);

    const openAIResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          stream: true,
          messages: [
            {
              role: "system",
              content:
                "You are an expert agricultural AI that generates critical farm alerts. Always return valid JSON only.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      },
    );

    if (!openAIResponse.ok || !openAIResponse.body) {
      const errorText = await openAIResponse.text();
      console.error("OpenAI stream error:", errorText);
      throw new Error("OpenAI stream request failed");
    }

    // Stream tokens to the client
    const stream = new ReadableStream({
      async start(controller) {
        const decoder = new TextDecoder("utf-8");
        const reader = openAIResponse.body.getReader();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n").filter((line) =>
            line.trim().startsWith("data:")
          );

          for (const line of lines) {
            const data = line.replace("data:", "").trim();
            if (data === "[DONE]") {
              controller.close();
              return;
            }

            try {
              const json = JSON.parse(data);
              const token = json.choices?.[0]?.delta?.content;
              if (token) {
                buffer += token;
                controller.enqueue(token);
              }
            } catch {
              // ignore non-JSON lines
            }
          }
        }

        controller.close();

        // Try to parse final JSON and insert alerts into Supabase
        try {
          const cleaned = buffer
            .replace(/```json\n?/g, "")
            .replace(/```\n?/g, "")
            .trim();
          const alerts = JSON.parse(cleaned);

          const alertsToInsert = alerts.map((alert: any) => ({
            user_id: farm.user_id,
            farm_id: farmId,
            level: alert.level,
            title: alert.title,
            message: alert.message,
            is_read: false,
          }));

          const { error: insertError } = await supabase
            .from("alerts")
            .insert(alertsToInsert);
          if (insertError) console.error("Error inserting alerts:", insertError);
          else console.log("Alerts inserted successfully");
        } catch (e) {
          console.error("Failed to parse/insert streamed alerts:", e);
        }
      },
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Error in generate-ai-alerts-stream function:", error);
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
