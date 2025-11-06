import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageData } = await req.json();
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

    if (!OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    console.log("Starting streamed crop analysis with ChatGPT...");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
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
              "You are an expert agricultural AI assistant specializing in crop health analysis, pest identification, and disease detection. Provide detailed, actionable recommendations.",
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this crop image. Identify any diseases, pests, or stress conditions. Provide severity level (low/medium/high) and specific treatment recommendations.",
              },
              {
                type: "image_url",
                image_url: {
                  url: imageData,
                },
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to start streaming analysis" }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Pipe OpenAI's stream directly to client
    const stream = new ReadableStream({
      async start(controller) {
        const decoder = new TextDecoder("utf-8");
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n").filter((line) => line.trim().startsWith("data:"));

          for (const line of lines) {
            const data = line.replace("data: ", "").trim();
            if (data === "[DONE]") {
              controller.close();
              return;
            }

            try {
              const json = JSON.parse(data);
              const token = json.choices?.[0]?.delta?.content;
              if (token) controller.enqueue(token);
            } catch (err) {
              console.error("Stream parse error:", err);
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
      },
    });
  } catch (error) {
    console.error("Error in analyze-crop function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
