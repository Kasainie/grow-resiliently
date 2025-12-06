import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Ensure analysis object contains all expected fields and expand short descriptions
function ensureCompleteAnalysis(raw: any) {
  const defaults = {
    disease: "Unknown",
    severity: "low",
    confidence: 0,
    cropType: "Unknown",
    growthStage: "Unknown",
    overallHealth: "Unknown",
    description: "No detailed description provided.",
    symptoms: [] as string[],
    possibleCauses: [] as string[],
    riskFactors: "Not specified",
    immediateActions: "No immediate actions suggested.",
    shortTermTreatment: "No short-term treatment suggested.",
    longTermManagement: "No long-term management suggestions.",
    recommendedProducts: [] as string[],
    monitoringSchedule: "Monitor regularly",
    weatherConsiderations: "No weather considerations provided",
    alternativeSolutions: "No alternatives provided",
  };

  const analysis: any = { ...defaults, ...(raw || {}) };

  // Normalize confidence
  const conf = Number(analysis.confidence);
  analysis.confidence = isNaN(conf) ? defaults.confidence : Math.max(0, Math.min(100, Math.round(conf)));

  // Ensure arrays
  if (!Array.isArray(analysis.symptoms)) analysis.symptoms = analysis.symptoms ? [String(analysis.symptoms)] : [];
  if (!Array.isArray(analysis.possibleCauses)) analysis.possibleCauses = analysis.possibleCauses ? [String(analysis.possibleCauses)] : [];
  if (!Array.isArray(analysis.recommendedProducts)) analysis.recommendedProducts = analysis.recommendedProducts ? [String(analysis.recommendedProducts)] : [];

  // Expand short description into a longer, structured paragraph
  const desc = (analysis.description || "").toString().trim();
  if (desc.length < 120) {
    const pieces = [] as string[];
    pieces.push(`Observed primary issue: ${analysis.disease || analysis.cropType || 'unknown'}.`);
    if (analysis.symptoms && analysis.symptoms.length) {
      pieces.push(`Visible symptoms include: ${analysis.symptoms.join(', ')}.`);
    }
    if (analysis.possibleCauses && analysis.possibleCauses.length) {
      pieces.push(`Possible contributing factors: ${analysis.possibleCauses.join(', ')}.`);
    }
    pieces.push(`Severity assessed as ${analysis.severity || 'unknown'} with an estimated confidence of ${analysis.confidence}%.`);
    pieces.push(`Recommended immediate actions and monitoring guidance are provided below to help manage the issue effectively.`);
    analysis.description = pieces.join(' ');
  }

  // Make immediateActions and shortTermTreatment slightly more descriptive if still defaults
  if (!analysis.immediateActions || analysis.immediateActions === defaults.immediateActions) {
    analysis.immediateActions = `Isolate affected plants if practical, remove severely diseased tissue, avoid overhead irrigation, and apply recommended interventions based on product guidance. Re-check within 24-48 hours.`;
  }

  if (!analysis.shortTermTreatment || analysis.shortTermTreatment === defaults.shortTermTreatment) {
    analysis.shortTermTreatment = `Apply targeted treatments (biologicals or chemical, as appropriate) according to label instructions. Prioritize low-toxicity options and follow integrated pest management (IPM) principles.`;
  }

  // Ensure recommendedProducts contains readable names
  analysis.recommendedProducts = analysis.recommendedProducts.map((p: any) => String(p)).slice(0, 6);

  return analysis;
}
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
            try {
              const parsed = JSON.parse(jsonMatch[0]);
              analysis = ensureCompleteAnalysis(parsed);
            } catch (e) {
              console.error('Failed to parse ChatGPT response JSON:', e);
            }
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
            try {
              const parsed = JSON.parse(jsonMatch[0]);
              analysis = ensureCompleteAnalysis(parsed);
            } catch (e) {
              console.error('Failed to parse Gemini response JSON:', e);
            }
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
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
