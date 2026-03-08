import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import WorkshopBookingForm from "@/components/WorkshopBookingForm";
import WorkshopCard from "@/components/WorkshopCard";

export default function Workshops() {
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    supabase.from("workshops").select("*").eq("is_active", true).order("date", { ascending: true })
      .then(({ data, error }) => {
        if (error) console.error(error);
        setWorkshops(data || []);
        setLoading(false);
      });
  }, []);

  const handleBook = async (workshop: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Please log in to book a workshop", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("bookings").insert({
      user_id: user.id,
      workshop_id: workshop.id,
      amount: workshop.price,
      status: "confirmed",
    });
    if (error) {
      toast({ title: "Booking failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Workshop booked!", description: `You've booked ${workshop.title}` });
      await supabase.from("workshops").update({ seats_available: workshop.seats_available - 1 }).eq("id", workshop.id);
      setWorkshops((prev) => prev.map((w) => w.id === workshop.id ? { ...w, seats_available: w.seats_available - 1 } : w));
    }
  };

  return (
    <Layout>
      <section className="py-24 bg-background min-h-screen">
        <div className="container">
          <div className="text-center mb-16">
            <p className="font-body text-secondary tracking-[0.3em] uppercase text-sm mb-3">Learn & Create</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">Upcoming Workshops</h1>
          </div>

          {/* Booking Form Section */}
          <div className="max-w-lg mx-auto mb-20">
            <WorkshopBookingForm />
          </div>

          {/* All Workshops Grid */}
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground">Browse All Sessions</h2>
            <p className="font-body text-muted-foreground mt-2">Or pick from our full catalogue below</p>
          </div>

          {loading ? (
            <p className="text-center font-body text-muted-foreground">Loading workshops...</p>
          ) : workshops.length === 0 ? (
            <p className="text-center font-body text-muted-foreground">No workshops available right now. Check back soon!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workshops.map((w, i) => (
                <WorkshopCard key={w.id} workshop={w} index={i} onBook={handleBook} />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
