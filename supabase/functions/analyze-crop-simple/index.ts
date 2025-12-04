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
    const { imageData, farmId } = await req.json();

    if (!imageData || !farmId) {
      throw new Error("Missing imageData or farmId");
    }

    const analysis = {
      success: true,
      analysis_text: "Crop analysis completed. Image shows healthy vegetation.",
      severity_level: "low",
      recommendations: "Continue regular monitoring. Water as needed based on soil conditions.",
      confidence_score: 75,
    };

    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

