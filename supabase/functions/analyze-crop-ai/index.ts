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
    const { farmId, userId, imageData, imageName } = await req.json();

    if (!farmId || !userId || !imageData) {
      return new Response(
        JSON.stringify({ error: "farmId, userId, and imageData are required" }),
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

    console.log("Starting crop image analysis...");

    const prompt = `You are an expert agricultural pathologist. Analyze this crop image and identify:
1. Any visible diseases, pests, or stress conditions
2. Severity level (low, medium, high, critical)
3. Specific treatment recommendations

Respond in JSON format only:
{"disease": "Disease name or 'Healthy'", "severity": "low|medium|high", "confidence": 0-100, "description": "What you see", "recommendations": "Treatment steps"}`;

    let analysis = null;

    // Try ChatGPT with vision first
    if (OPENAI_API_KEY) {
      try {
        console.log("Using ChatGPT Vision for crop analysis...");
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "user",
                content: [
                  { type: "text", text: prompt },
                  {
                    type: "image_url",
                    image_url: { url: imageData },
                  },
                ],
              },
            ],
            max_tokens: 500,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          const content = result.choices?.[0]?.message?.content || "";
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            analysis = JSON.parse(jsonMatch[0]);
          }
        }
      } catch (e) {
        console.error("ChatGPT Vision failed:", e);
      }
    }

    // Try Gemini Vision if ChatGPT failed
    if (!analysis && GEMINI_API_KEY) {
      try {
        console.log("Using Gemini Vision for crop analysis...");
        const base64Image = imageData.split(",")[1] || imageData;
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { text: prompt },
                    {
                      inlineData: {
                        mimeType: "image/jpeg",
                        data: base64Image,
                      },
                    },
                  ],
                },
              ],
            }),
          }
        );

        if (response.ok) {
          const result = await response.json();
          const content = result.candidates?.[0]?.content?.parts?.[0]?.text || "";
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            analysis = JSON.parse(jsonMatch[0]);
          }
        }
      } catch (e) {
        console.error("Gemini Vision failed:", e);
      }
    }

    // Fallback analysis
    if (!analysis) {
      analysis = {
        disease: "Image analysis pending",
        severity: "low",
        confidence: 0,
        description: "Could not analyze image with AI. Please check your API keys.",
        recommendations: "Ensure API keys are configured in Supabase secrets.",
      };
    }

    // Save image record
    const { data: imageRecord, error: imageError } = await supabase
      .from("images")
      .insert({
        farm_id: farmId,
        user_id: userId,
        storage_path: `crop-images/${userId}/${Date.now()}-${imageName || "crop.jpg"}`,
        captured_at: new Date().toISOString(),
        ai_label: analysis.disease,
        ai_confidence: (analysis.confidence || 0) / 100,
      })
      .select();

    if (imageError) throw imageError;

    // Save analysis results
    if (imageRecord && imageRecord.length > 0) {
      const { error: analysisError } = await supabase
        .from("analysis_results")
        .insert({
          image_id: imageRecord[0].id,
          user_id: userId,
          farm_id: farmId,
          analysis_text: JSON.stringify(analysis),
          severity_level: analysis.severity,
          recommendations: analysis.recommendations,
        });

      if (analysisError) throw analysisError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        analysis: analysis,
        imageRecord: imageRecord?.[0] || null,
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
