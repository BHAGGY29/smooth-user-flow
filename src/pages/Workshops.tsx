import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { MapPin, Calendar, Users, IndianRupee } from "lucide-react";
import WorkshopBookingForm from "@/components/WorkshopBookingForm";

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
                <motion.div
                  key={w.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-lg border border-border bg-card p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <h3 className="font-display text-xl font-semibold text-foreground mb-3">{w.title}</h3>
                  <p className="font-body text-sm text-muted-foreground mb-4 leading-relaxed">{w.description}</p>
                  <div className="space-y-2 font-body text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-secondary" /> {w.city} — {w.venue}</div>
                    <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-secondary" /> {new Date(w.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</div>
                    <div className="flex items-center gap-2"><Users className="h-4 w-4 text-secondary" /> {w.seats_available} seats left</div>
                    <div className="flex items-center gap-2"><IndianRupee className="h-4 w-4 text-secondary" /> ₹{w.price}</div>
                  </div>
                  <Button
                    onClick={() => handleBook(w)}
                    disabled={w.seats_available <= 0}
                    className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-body"
                  >
                    {w.seats_available <= 0 ? "Fully Booked" : "Book Now"}
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
