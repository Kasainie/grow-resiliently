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

    const alerts = [
      { level: "critical", title: "Monitor Farm", message: `Check your ${farm.area_ha} hectare farm for pests and diseases regularly.` },
      { level: "warning", title: "Soil Management", message: `${farm.soil_type || "Your"} soil needs appropriate amendments and care.` },
      { level: "warning", title: farm.has_irrigation ? "Optimize Irrigation" : "Water Management", message: farm.has_irrigation ? "Review and optimize your irrigation schedule based on rainfall." : "Implement water conservation and monitor soil moisture." },
      { level: "info", title: "Weekly Inspections", message: "Scout fields weekly for early detection of issues." },
    ];

    const alertsToInsert = alerts.map((a) => ({
      user_id: farm.user_id,
      farm_id: farmId,
      level: a.level,
      title: a.title,
      message: a.message,
      is_read: false,
    }));

    await supabase.from("alerts").insert(alertsToInsert);

    return new Response(
      JSON.stringify({ success: true, alerts_count: alerts.length, alerts }),
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



