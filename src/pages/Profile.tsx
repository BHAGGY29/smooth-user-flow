import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { User, Calendar, ShoppingBag, IndianRupee } from "lucide-react";
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
      // Fetch profile, bookings, orders in parallel
      Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).single(),
        supabase.from("bookings").select("*, workshops(title, date, city, venue)").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("orders").select("*, order_items(*, products(name))").eq("user_id", user.id).order("created_at", { ascending: false }),
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

  return (
    <Layout>
      <section className="py-24 bg-background min-h-screen">
        <div className="container max-w-4xl">
          <h1 className="font-display text-3xl font-bold text-foreground mb-8">My Account</h1>

          <Tabs defaultValue="profile">
            <TabsList className="mb-6">
              <TabsTrigger value="profile" className="font-body"><User className="h-4 w-4 mr-1" /> Profile</TabsTrigger>
              <TabsTrigger value="bookings" className="font-body"><Calendar className="h-4 w-4 mr-1" /> Bookings</TabsTrigger>
              <TabsTrigger value="orders" className="font-body"><ShoppingBag className="h-4 w-4 mr-1" /> Orders</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4">
              <div className="rounded-lg border border-border bg-card p-6 space-y-4">
                <div>
                  <Label className="font-body">Email</Label>
                  <Input value={user.email || ""} disabled className="mt-1" />
                </div>
                <div>
                  <Label className="font-body">Full Name</Label>
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label className="font-body">Phone</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1" />
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleSave} disabled={saving} className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-body">
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button variant="outline" onClick={handleLogout} className="font-body">Log Out</Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="bookings">
              {bookings.length === 0 ? (
                <p className="font-body text-muted-foreground text-center py-12">No bookings yet.</p>
              ) : (
                <div className="space-y-3">
                  {bookings.map((b) => (
                    <div key={b.id} className="rounded-lg border border-border bg-card p-4">
                      <h3 className="font-display font-semibold text-foreground">{b.workshops?.title || "Workshop"}</h3>
                      <p className="font-body text-sm text-muted-foreground">
                        {b.workshops?.city} — {b.workshops?.venue} • {b.workshops?.date ? new Date(b.workshops.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : ""}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-body text-sm flex items-center"><IndianRupee className="h-3 w-3" />{b.amount}</span>
                        <span className="text-xs font-body px-2 py-1 rounded bg-secondary/20 text-secondary">{b.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="orders">
              {orders.length === 0 ? (
                <p className="font-body text-muted-foreground text-center py-12">No orders yet.</p>
              ) : (
                <div className="space-y-3">
                  {orders.map((o) => (
                    <div key={o.id} className="rounded-lg border border-border bg-card p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-body text-sm text-muted-foreground">{new Date(o.created_at).toLocaleDateString("en-IN")}</p>
                          <div className="mt-1 space-y-1">
                            {o.order_items?.map((oi: any) => (
                              <p key={oi.id} className="font-body text-sm text-foreground">{oi.products?.name} × {oi.quantity}</p>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-display font-bold flex items-center"><IndianRupee className="h-3 w-3" />{o.total}</span>
                          <span className="text-xs font-body px-2 py-1 rounded bg-secondary/20 text-secondary">{o.status}</span>
                        </div>
                      </div>
                    </div>
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
