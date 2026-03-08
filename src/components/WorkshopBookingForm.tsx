import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  CheckCircle2,
  Loader2,
  CalendarPlus,
  ExternalLink,
  Sparkles,
  Users,
  Target,
} from "lucide-react";

type BookingState = "form" | "loading" | "confirmation";
type ExperienceLevel = "beginner" | "intermediate" | "advanced";

interface BookingResult {
  bookingId: string;
  workshopTitle: string;
  workshopDate: string;
  workshopVenue: string;
  workshopCity: string;
}

export default function WorkshopBookingForm() {
  const [state, setState] = useState<BookingState>("form");
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [selectedWorkshopId, setSelectedWorkshopId] = useState("");
  const [experience, setExperience] = useState<ExperienceLevel | "">("");
  const [goals, setGoals] = useState("");
  const [user, setUser] = useState<any>(null);
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    supabase
      .from("workshops")
      .select("*")
      .eq("is_active", true)
      .gt("seats_available", 0)
      .order("date", { ascending: true })
      .then(({ data }) => setWorkshops(data || []));
  }, []);

  const generateBookingId = () => {
    const num = Math.floor(1000 + Math.random() * 9000);
    return `WRK-${num}`;
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({ title: "Please log in to book a workshop", variant: "destructive" });
      return;
    }
    if (!selectedWorkshopId || !experience) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    const workshop = workshops.find((w) => w.id === selectedWorkshopId);
    if (!workshop) return;

    setState("loading");

    // Simulate realistic processing delay
    await new Promise((r) => setTimeout(r, 1800));

    const { error } = await supabase.from("bookings").insert({
      user_id: user.id,
      workshop_id: workshop.id,
      amount: workshop.price,
      status: "confirmed",
    });

    if (error) {
      setState("form");
      toast({ title: "Booking failed", description: error.message, variant: "destructive" });
      return;
    }

    // Decrement seats
    await supabase
      .from("workshops")
      .update({ seats_available: workshop.seats_available - 1 })
      .eq("id", workshop.id);

    setBookingResult({
      bookingId: generateBookingId(),
      workshopTitle: workshop.title,
      workshopDate: new Date(workshop.date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      workshopVenue: workshop.venue,
      workshopCity: workshop.city,
    });

    setState("confirmation");
  };

  const handleAddToCalendar = () => {
    if (!bookingResult) return;
    const workshop = workshops.find((w) => w.id === selectedWorkshopId);
    if (!workshop) return;
    const start = new Date(workshop.date).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const end = new Date(new Date(workshop.date).getTime() + (workshop.duration_hours || 3) * 3600000)
      .toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(bookingResult.workshopTitle)}&dates=${start}/${end}&location=${encodeURIComponent(`${bookingResult.workshopVenue}, ${bookingResult.workshopCity}`)}&details=${encodeURIComponent("Art workshop booking via Shadow Arts")}`;
    window.open(url, "_blank");
  };

  const handleReset = () => {
    setState("form");
    setSelectedWorkshopId("");
    setExperience("");
    setGoals("");
    setBookingResult(null);
  };

  if (!user) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <Users className="h-10 w-10 text-secondary mx-auto mb-4" />
        <h3 className="font-display text-xl font-semibold text-foreground mb-2">Sign In Required</h3>
        <p className="font-body text-sm text-muted-foreground mb-4">Please log in to book a workshop and track your artistic journey.</p>
        <Button asChild className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-body">
          <a href="/login">Sign In</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <AnimatePresence mode="wait">
        {/* ── STATE 1: Form ── */}
        {state === "form" && (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="p-6 md:p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="h-5 w-5 text-secondary" />
              <h3 className="font-display text-2xl font-semibold text-foreground">Book Your Workshop</h3>
            </div>

            <div className="space-y-5">
              {/* Workshop Selection */}
              <div>
                <label className="font-body text-sm text-muted-foreground mb-2 block">
                  <Calendar className="inline h-4 w-4 mr-1.5 text-secondary" />
                  Workshop Date & Session
                </label>
                <Select value={selectedWorkshopId} onValueChange={setSelectedWorkshopId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a workshop" />
                  </SelectTrigger>
                  <SelectContent>
                    {workshops.map((w) => (
                      <SelectItem key={w.id} value={w.id}>
                        {w.title} — {new Date(w.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · {w.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Experience Level */}
              <div>
                <label className="font-body text-sm text-muted-foreground mb-2 block">
                  <Target className="inline h-4 w-4 mr-1.5 text-secondary" />
                  Experience Level
                </label>
                <Select value={experience} onValueChange={(v) => setExperience(v as ExperienceLevel)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner — New to this art form</SelectItem>
                    <SelectItem value="intermediate">Intermediate — Some prior experience</SelectItem>
                    <SelectItem value="advanced">Advanced — Looking to refine skills</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Goals */}
              <div>
                <label className="font-body text-sm text-muted-foreground mb-2 block">
                  Your Goals (optional)
                </label>
                <Textarea
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  placeholder="What would you like to learn or achieve in this workshop?"
                  className="resize-none"
                  rows={3}
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={!selectedWorkshopId || !experience}
                className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-body text-base h-12"
              >
                Confirm Booking
              </Button>
            </div>
          </motion.div>
        )}

        {/* ── STATE 2: Loading ── */}
        {state === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-8 md:p-12 flex flex-col items-center justify-center min-h-[320px]"
          >
            <Loader2 className="h-10 w-10 text-secondary animate-spin mb-5" />
            <p className="font-display text-xl font-semibold text-foreground mb-1">Processing Your Booking</p>
            <p className="font-body text-sm text-muted-foreground">Securing your seat…</p>
          </motion.div>
        )}

        {/* ── STATE 3: Confirmation ── */}
        {state === "confirmation" && bookingResult && (
          <motion.div
            key="confirmation"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="p-6 md:p-8"
          >
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.15 }}
              >
                <CheckCircle2 className="h-14 w-14 text-secondary mx-auto mb-4" />
              </motion.div>
              <h3 className="font-display text-2xl font-semibold text-foreground mb-1">Booking Confirmed!</h3>
              <p className="font-body text-sm text-muted-foreground">Your artistic journey awaits</p>
            </div>

            <div className="rounded-lg border border-border bg-background p-5 mb-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-body text-sm text-muted-foreground">Booking ID</span>
                <span className="font-display text-base font-semibold text-foreground">#{bookingResult.bookingId}</span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-between items-center">
                <span className="font-body text-sm text-muted-foreground">Workshop</span>
                <span className="font-body text-sm text-foreground text-right max-w-[60%]">{bookingResult.workshopTitle}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body text-sm text-muted-foreground">Date</span>
                <span className="font-body text-sm text-foreground">{bookingResult.workshopDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body text-sm text-muted-foreground">Location</span>
                <span className="font-body text-sm text-foreground">{bookingResult.workshopVenue}, {bookingResult.workshopCity}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body text-sm text-muted-foreground">Level</span>
                <span className="font-body text-sm text-foreground capitalize">{experience}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleAddToCalendar}
                variant="outline"
                className="flex-1 font-body"
              >
                <CalendarPlus className="h-4 w-4 mr-2" /> Add to Calendar
              </Button>
              <Button
                asChild
                variant="outline"
                className="flex-1 font-body"
              >
                <a href="https://discord.gg/shadowarts" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" /> Join Community
                </a>
              </Button>
            </div>

            <Button
              onClick={handleReset}
              variant="ghost"
              className="w-full mt-3 font-body text-muted-foreground"
            >
              Book Another Workshop
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
