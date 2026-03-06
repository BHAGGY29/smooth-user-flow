import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.98.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Fetch workshops and products for context
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(supabaseUrl, supabaseKey);

    const [workshopsRes, productsRes] = await Promise.all([
      sb.from("workshops").select("title, art_type, city, venue, date, price, seats_available, description").eq("is_active", true).order("date", { ascending: true }).limit(20),
      sb.from("products").select("name, category, price, description, stock").eq("is_active", true).limit(20),
    ]);

    const workshopCtx = (workshopsRes.data || []).map(w =>
      `- ${w.title} (${w.art_type}) in ${w.city} at ${w.venue}, ${new Date(w.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}, ₹${w.price}, ${w.seats_available} seats left. ${w.description || ""}`
    ).join("\n");

    const productCtx = (productsRes.data || []).map(p =>
      `- ${p.name} (${p.category || "General"}), ₹${p.price}, ${p.stock} in stock. ${p.description || ""}`
    ).join("\n");

    const systemPrompt = `You are Shadow Arts Assistant — a friendly, knowledgeable chatbot for Shadow Arts, an Indian cultural arts platform. You help users discover workshops, art products, and provide personalized recommendations.

Available Workshops:
${workshopCtx || "No workshops available currently."}

Available Products:
${productCtx || "No products available currently."}

Guidelines:
- Recommend workshops based on user's city, interests, budget, or art preferences.
- Suggest products that complement their interests.
- Be warm, culturally informed, and concise.
- If a user asks about booking or purchasing, guide them to the relevant page (/workshops, /shop, /search-workshops).
- Use ₹ for prices. Keep responses under 200 words unless detail is requested.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please try later." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
