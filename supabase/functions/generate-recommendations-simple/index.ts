import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { farmId } = await req.json();
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase credentials");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: farm } = await supabase
      .from("farms").select("*").eq("id", farmId).maybeSingle();

    if (!farm) throw new Error("Farm not found");

    const recommendations = [
      { title: "Soil Testing & Analysis", description: "Conduct comprehensive soil test for pH, nutrients, and organic matter.", type: "soil", priority: "high" },
      { title: "Implement Crop Rotation Plan", description: "Establish 3-4 year crop rotation to maintain soil health.", type: "crop_management", priority: "high" },
      { title: farm.has_irrigation ? "Optimize Irrigation System" : "Install Drip Irrigation", description: farm.has_irrigation ? "Review irrigation schedule based on rainfall and crop needs." : "Install drip irrigation for water efficiency.", type: "irrigation", priority: "high" },
      { title: "Integrated Pest Management", description: "Use cultural, biological, and chemical controls to manage pests effectively.", type: "pest_management", priority: "high" },
      { title: "Weekly Farm Monitoring", description: "Scout fields weekly for pests, diseases, and weeds. Keep detailed records.", type: "monitoring", priority: "high" },
    ];

    const recsToInsert = recommendations.map((r) => ({
      farm_id: farmId,
      title: r.title,
      description: r.description,
      type: r.type,
      priority: r.priority,
    }));

    await supabase.from("recommendations").insert(recsToInsert);

    return new Response(
      JSON.stringify({ success: true, recommendations_count: recommendations.length, recommendations }),
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



