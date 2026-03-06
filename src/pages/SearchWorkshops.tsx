import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { MapPin, Calendar, Users, IndianRupee, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const cities = ["Bangalore", "Delhi", "Hyderabad", "Jaipur", "Mumbai", "Pune"];
const artTypes = ["Gond", "Kalamkari", "Madhubani", "Mandala", "Pichwai", "Warli"];

export default function SearchWorkshops() {
  const [city, setCity] = useState("");
  const [artType, setArtType] = useState("");
  const [date, setDate] = useState<Date>();
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!city && !artType && !date) {
      toast({ title: "Please select at least one filter", variant: "destructive" });
      return;
    }
    setLoading(true);
    setSearched(true);

    let query = supabase.from("workshops").select("*").eq("is_active", true);
    if (city) query = query.eq("city", city);
    if (artType) query = query.eq("art_type", artType);
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query = query.gte("date", start.toISOString()).lte("date", end.toISOString());
    }
    query = query.order("date", { ascending: true });

    const { data, error } = await query;
    if (error) {
      console.error(error);
      toast({ title: "Search failed", variant: "destructive" });
    }
    setWorkshops(data || []);
    setLoading(false);
  };

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

  const handleClear = () => {
    setCity("");
    setArtType("");
    setDate(undefined);
    setWorkshops([]);
    setSearched(false);
  };

  return (
    <Layout>
      <section className="py-24 bg-background min-h-screen">
        <div className="container">
          <div className="text-center mb-12">
            <p className="font-body text-secondary tracking-[0.3em] uppercase text-sm mb-3">Discover</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">Search Workshops</h1>
            <p className="font-body text-muted-foreground mt-4 max-w-xl mx-auto">Find the perfect workshop by selecting your city, preferred art type, and date.</p>
          </div>

          {/* Filters */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="rounded-xl border border-border bg-card p-6 md:p-8 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* City */}
                <div>
                  <label className="font-body text-sm text-muted-foreground mb-2 block">City</label>
                  <Select value={city} onValueChange={setCity}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Art Type */}
                <div>
                  <label className="font-body text-sm text-muted-foreground mb-2 block">Workshop Type</label>
                  <Select value={artType} onValueChange={setArtType}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select art type" />
                    </SelectTrigger>
                    <SelectContent>
                      {artTypes.map((a) => (
                        <SelectItem key={a} value={a}>{a}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date */}
                <div>
                  <label className="font-body text-sm text-muted-foreground mb-2 block">Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleSearch} disabled={loading} className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-body flex-1 md:flex-none">
                  <Search className="h-4 w-4 mr-2" /> {loading ? "Searching..." : "Search Workshops"}
                </Button>
                <Button variant="outline" onClick={handleClear} className="font-body">
                  Clear
                </Button>
              </div>
            </div>
          </div>

          {/* Results */}
          {loading ? (
            <p className="text-center font-body text-muted-foreground">Searching workshops...</p>
          ) : searched && workshops.length === 0 ? (
            <p className="text-center font-body text-muted-foreground">No workshops found matching your criteria. Try different filters!</p>
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
