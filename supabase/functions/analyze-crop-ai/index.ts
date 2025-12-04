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

    const prompt = `You are an expert agricultural pathologist and crop specialist. Provide a comprehensive analysis of this crop image.

ANALYZE AND PROVIDE IN JSON FORMAT ONLY:
{
  "disease": "Primary issue or 'Healthy'",
  "severity": "low|medium|high|critical",
  "confidence": 0-100,
  "cropType": "Type of crop visible",
  "growthStage": "Seedling|Vegetative|Flowering|Fruiting|Mature|Harvest",
  "overallHealth": "Brief overall health assessment",
  "description": "Detailed visual assessment (5-6 sentences about what you observe)",
  "symptoms": ["List", "of", "visible", "symptoms", "or", "signs"],
  "possibleCauses": ["Potential", "causes", "or", "factors"],
  "riskFactors": "Environmental or management factors that may contribute",
  "immediateActions": "Urgent steps to take in next 24-48 hours",
  "shortTermTreatment": "Treatment plan for next 1-2 weeks",
  "longTermManagement": "Prevention and management strategy for future",
  "recommendedProducts": ["Fungicide name", "Pesticide name", "Fertilizer name"],
  "monitoringSchedule": "How often to inspect and what to look for",
  "weatherConsiderations": "How current/future weather may affect the crop",
  "alternativeSolutions": "Organic or non-chemical alternatives if applicable"
}

Be thorough, specific, and practical in your recommendations.`;

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
            max_tokens: 1500,
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
        disease: "Analysis pending",
        severity: "low",
        confidence: 0,
        cropType: "Unknown",
        growthStage: "Unknown",
        overallHealth: "Unable to assess - API keys not configured",
        description: "Could not perform detailed analysis. Please ensure OPENAI_API_KEY and GEMINI_API_KEY are configured in Supabase secrets.",
        symptoms: ["No analysis available"],
        possibleCauses: ["API keys not configured"],
        riskFactors: "Unable to assess",
        immediateActions: "Configure API keys in Supabase Dashboard",
        shortTermTreatment: "Pending API configuration",
        longTermManagement: "Pending API configuration",
        recommendedProducts: ["Pending analysis"],
        monitoringSchedule: "Monitor daily for changes",
        weatherConsiderations: "Consider local weather patterns",
        alternativeSolutions: "Consult local agricultural experts"
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
