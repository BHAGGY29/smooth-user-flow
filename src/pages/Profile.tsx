import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  User, Calendar, ShoppingBag, IndianRupee, LogOut, LayoutDashboard,
  CalendarCheck, Package, MapPin, Clock
} from "lucide-react";
import type { User as SupaUser } from "@supabase/supabase-js";

export default function Profile() {
  const [user, setUser] = useState<SupaUser | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { navigate("/login"); return; }
      setUser(user);
      Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).single(),
        supabase.from("bookings").select("*, workshops(title, date, city, venue, art_type)").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("orders").select("*, order_items(*, products(name, image_url))").eq("user_id", user.id).order("created_at", { ascending: false }),
      ]).then(([profileRes, bookingsRes, ordersRes]) => {
        if (profileRes.data) {
          setProfile(profileRes.data);
          setFullName(profileRes.data.full_name || "");
          setPhone(profileRes.data.phone || "");
        }
        setBookings(bookingsRes.data || []);
        setOrders(ordersRes.data || []);
      });
    });
  }, [navigate]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ full_name: fullName, phone }).eq("user_id", user.id);
    setSaving(false);
    if (error) toast({ title: "Update failed", description: error.message, variant: "destructive" });
    else toast({ title: "Profile updated!" });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (!user) return null;

  const totalSpent = orders.reduce((s, o) => s + Number(o.total || 0), 0) + bookings.reduce((s, b) => s + Number(b.amount || 0), 0);

  const quickStats = [
    { label: "Bookings", value: bookings.length, icon: CalendarCheck },
    { label: "Orders", value: orders.length, icon: Package },
    { label: "Total Spent", value: `₹${totalSpent}`, icon: IndianRupee },
  ];

  return (
    <Layout>
      <section className="py-24 bg-background min-h-screen">
        <div className="container max-w-4xl">
          {/* Welcome Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center">
                <User className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  {fullName ? `Welcome, ${fullName}` : "My Dashboard"}
                </h1>
                <p className="font-body text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout} className="font-body w-fit">
              <LogOut className="h-4 w-4 mr-2" /> Log Out
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {quickStats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="rounded-lg border border-border bg-card p-4 text-center"
              >
                <s.icon className="h-5 w-5 mx-auto mb-2 text-secondary" />
                <p className="font-display text-xl font-bold text-foreground">{s.value}</p>
                <p className="font-body text-xs text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </div>

          <Tabs defaultValue="profile">
            <TabsList className="mb-6">
              <TabsTrigger value="profile" className="font-body"><User className="h-4 w-4 mr-1" /> Profile</TabsTrigger>
              <TabsTrigger value="bookings" className="font-body"><Calendar className="h-4 w-4 mr-1" /> Bookings ({bookings.length})</TabsTrigger>
              <TabsTrigger value="orders" className="font-body"><ShoppingBag className="h-4 w-4 mr-1" /> Orders ({orders.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4">
              <div className="rounded-lg border border-border bg-card p-6 space-y-4">
                <div>
                  <Label className="font-body">Email</Label>
                  <Input value={user.email || ""} disabled className="mt-1" />
                </div>
                <div>
                  <Label className="font-body">Full Name</Label>
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter your full name" className="mt-1" />
                </div>
                <div>
                  <Label className="font-body">Phone</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" className="mt-1" />
                </div>
                <Button onClick={handleSave} disabled={saving} className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-body">
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="bookings">
              {bookings.length === 0 ? (
                <div className="rounded-lg border border-border bg-card p-12 text-center">
                  <CalendarCheck className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="font-body text-muted-foreground mb-4">No bookings yet. Explore our workshops!</p>
                  <Button asChild className="bg-secondary text-secondary-foreground font-body">
                    <a href="/workshops">Browse Workshops</a>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookings.map((b, i) => (
                    <motion.div
                      key={b.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="rounded-lg border border-border bg-card p-5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <h3 className="font-display font-semibold text-foreground">{b.workshops?.title || "Workshop"}</h3>
                          <div className="font-body text-sm text-muted-foreground mt-1 space-y-1">
                            <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-secondary" /> {b.workshops?.city} — {b.workshops?.venue}</div>
                            <div className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5 text-secondary" /> {b.workshops?.date ? new Date(b.workshops.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—"}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-display text-lg font-bold text-foreground flex items-center"><IndianRupee className="h-4 w-4" />{b.amount}</span>
                          <span className={`text-xs font-body px-2 py-1 rounded ${b.status === "confirmed" ? "bg-green-500/20 text-green-700 dark:text-green-400" : "bg-secondary/20 text-secondary"}`}>{b.status}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="orders">
              {orders.length === 0 ? (
                <div className="rounded-lg border border-border bg-card p-12 text-center">
                  <ShoppingBag className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="font-body text-muted-foreground mb-4">No orders yet. Check out our art shop!</p>
                  <Button asChild className="bg-secondary text-secondary-foreground font-body">
                    <a href="/shop">Visit Shop</a>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((o, i) => (
                    <motion.div
                      key={o.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="rounded-lg border border-border bg-card p-5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            <p className="font-body text-sm text-muted-foreground">{new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                          </div>
                          <div className="space-y-1">
                            {o.order_items?.map((oi: any) => (
                              <div key={oi.id} className="flex items-center gap-2">
                                {oi.products?.image_url && <img src={oi.products.image_url} alt="" className="w-8 h-8 rounded object-cover" />}
                                <p className="font-body text-sm text-foreground">{oi.products?.name} <span className="text-muted-foreground">× {oi.quantity}</span></p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-display text-lg font-bold text-foreground flex items-center"><IndianRupee className="h-4 w-4" />{o.total}</span>
                          <span className={`text-xs font-body px-2 py-1 rounded ${
                            o.status === "confirmed" ? "bg-green-500/20 text-green-700 dark:text-green-400" :
                            o.status === "shipped" ? "bg-blue-500/20 text-blue-700 dark:text-blue-400" :
                            o.status === "delivered" ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400" :
                            "bg-secondary/20 text-secondary"
                          }`}>{o.status}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
}
