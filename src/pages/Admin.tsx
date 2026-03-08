import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { motion } from "framer-motion";
import {
  IndianRupee, Plus, Pencil, Trash2, LayoutDashboard, Palette,
  ShoppingBag, CalendarCheck, Package, Mail, Users, TrendingUp, Eye
} from "lucide-react";

export default function Admin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => { checkAdmin(); }, []);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate("/login"); return; }
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin");
    if (!data || data.length === 0) { navigate("/"); toast({ title: "Access denied", variant: "destructive" }); return; }
    setIsAdmin(true);
    setLoading(false);
    fetchAll();
  };

  const fetchAll = async () => {
    const [w, p, b, o, m] = await Promise.all([
      supabase.from("workshops").select("*").order("date", { ascending: false }),
      supabase.from("products").select("*").order("created_at", { ascending: false }),
      supabase.from("bookings").select("*, workshops(title)").order("created_at", { ascending: false }),
      supabase.from("orders").select("*, order_items(*, products(name))").order("created_at", { ascending: false }),
      supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
    ]);
    setWorkshops(w.data || []);
    setProducts(p.data || []);
    setBookings(b.data || []);
    setOrders(o.data || []);
    setMessages(m.data || []);
  };

  if (loading) return <Layout><div className="min-h-screen flex items-center justify-center font-body text-muted-foreground">Checking access...</div></Layout>;
  if (!isAdmin) return null;

  const totalRevenue = orders.reduce((s, o) => s + Number(o.total || 0), 0);
  const bookingRevenue = bookings.reduce((s, b) => s + Number(b.amount || 0), 0);
  const unreadMessages = messages.filter((m) => !m.is_read).length;

  const stats = [
    { label: "Workshops", value: workshops.length, icon: Palette, color: "text-secondary" },
    { label: "Products", value: products.length, icon: Package, color: "text-secondary" },
    { label: "Bookings", value: bookings.length, icon: CalendarCheck, color: "text-secondary" },
    { label: "Orders", value: orders.length, icon: ShoppingBag, color: "text-secondary" },
    { label: "Revenue", value: `₹${totalRevenue + bookingRevenue}`, icon: TrendingUp, color: "text-secondary" },
    { label: "Messages", value: `${unreadMessages} new`, icon: Mail, color: "text-secondary" },
  ];

  return (
    <Layout>
      <section className="py-24 bg-background min-h-screen">
        <div className="container">
          <div className="flex items-center gap-3 mb-8">
            <LayoutDashboard className="h-7 w-7 text-secondary" />
            <h1 className="font-display text-3xl font-bold text-foreground">Admin Dashboard</h1>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="rounded-lg border border-border bg-card p-4 text-center"
              >
                <s.icon className={`h-5 w-5 mx-auto mb-2 ${s.color}`} />
                <p className="font-display text-xl font-bold text-foreground">{s.value}</p>
                <p className="font-body text-xs text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </div>

          <Tabs defaultValue="workshops">
            <TabsList className="mb-6 flex-wrap">
              <TabsTrigger value="workshops" className="font-body"><Palette className="h-4 w-4 mr-1" /> Workshops</TabsTrigger>
              <TabsTrigger value="products" className="font-body"><Package className="h-4 w-4 mr-1" /> Products</TabsTrigger>
              <TabsTrigger value="bookings" className="font-body"><CalendarCheck className="h-4 w-4 mr-1" /> Bookings</TabsTrigger>
              <TabsTrigger value="orders" className="font-body"><ShoppingBag className="h-4 w-4 mr-1" /> Orders</TabsTrigger>
              <TabsTrigger value="messages" className="font-body"><Mail className="h-4 w-4 mr-1" /> Messages</TabsTrigger>
            </TabsList>

            <TabsContent value="workshops"><WorkshopManager workshops={workshops} onRefresh={fetchAll} /></TabsContent>
            <TabsContent value="products"><ProductManager products={products} onRefresh={fetchAll} /></TabsContent>
            <TabsContent value="bookings"><BookingsTable bookings={bookings} /></TabsContent>
            <TabsContent value="orders"><OrdersTable orders={orders} onRefresh={fetchAll} /></TabsContent>
            <TabsContent value="messages"><MessagesTable messages={messages} onRefresh={fetchAll} /></TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
}

/* ─── Workshop Manager ─── */
function WorkshopManager({ workshops, onRefresh }: { workshops: any[]; onRefresh: () => void }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const { toast } = useToast();

  const defaults = { title: "", description: "", art_type: "", city: "", venue: "", date: "", price: 0, seats_total: 30, seats_available: 30, duration_hours: 3, image_url: "", is_active: true };
  const [form, setForm] = useState(defaults);

  const openNew = () => { setEditing(null); setForm(defaults); setOpen(true); };
  const openEdit = (w: any) => { setEditing(w); setForm({ ...defaults, ...w, date: w.date?.slice(0, 16) || "" }); setOpen(true); };

  const handleSave = async () => {
    if (!form.title || !form.art_type || !form.city || !form.venue || !form.date) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    const payload = { ...form, price: Number(form.price), seats_total: Number(form.seats_total), seats_available: Number(form.seats_available), duration_hours: Number(form.duration_hours) };
    if (editing) {
      const { error } = await supabase.from("workshops").update(payload).eq("id", editing.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    } else {
      const { error } = await supabase.from("workshops").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    }
    toast({ title: editing ? "Workshop updated" : "Workshop created" });
    setOpen(false);
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("workshops").delete().eq("id", id);
    toast({ title: "Workshop deleted" });
    onRefresh();
  };

  const handleToggleActive = async (w: any) => {
    await supabase.from("workshops").update({ is_active: !w.is_active }).eq("id", w.id);
    toast({ title: w.is_active ? "Workshop deactivated" : "Workshop activated" });
    onRefresh();
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-display text-xl font-semibold text-foreground">Workshops ({workshops.length})</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button onClick={openNew} className="bg-secondary text-secondary-foreground font-body"><Plus className="h-4 w-4 mr-1" /> Add Workshop</Button></DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle className="font-display">{editing ? "Edit Workshop" : "New Workshop"}</DialogTitle></DialogHeader>
            <div className="space-y-3">
              {(["title", "art_type", "city", "venue", "image_url"] as const).map((f) => (
                <div key={f}><Label className="font-body capitalize">{f.replace(/_/g, " ")}</Label><Input value={(form as any)[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} className="mt-1" placeholder={f === "image_url" ? "https://..." : ""} /></div>
              ))}
              <div><Label className="font-body">Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1" rows={3} /></div>
              <div><Label className="font-body">Date & Time</Label><Input type="datetime-local" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="mt-1" /></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div><Label className="font-body">Price (₹)</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="mt-1" /></div>
                <div><Label className="font-body">Total Seats</Label><Input type="number" value={form.seats_total} onChange={(e) => setForm({ ...form, seats_total: Number(e.target.value) })} className="mt-1" /></div>
                <div><Label className="font-body">Available</Label><Input type="number" value={form.seats_available} onChange={(e) => setForm({ ...form, seats_available: Number(e.target.value) })} className="mt-1" /></div>
                <div><Label className="font-body">Hours</Label><Input type="number" value={form.duration_hours} onChange={(e) => setForm({ ...form, duration_hours: Number(e.target.value) })} className="mt-1" /></div>
              </div>
              <Button onClick={handleSave} className="w-full bg-secondary text-secondary-foreground font-body">Save Workshop</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-lg border border-border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-body">Title</TableHead>
              <TableHead className="font-body">Art Type</TableHead>
              <TableHead className="font-body">City</TableHead>
              <TableHead className="font-body">Date</TableHead>
              <TableHead className="font-body">Seats</TableHead>
              <TableHead className="font-body">Price</TableHead>
              <TableHead className="font-body">Status</TableHead>
              <TableHead className="font-body">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workshops.map((w) => (
              <TableRow key={w.id}>
                <TableCell className="font-body font-medium">{w.title}</TableCell>
                <TableCell className="font-body">{w.art_type}</TableCell>
                <TableCell className="font-body">{w.city}</TableCell>
                <TableCell className="font-body">{new Date(w.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</TableCell>
                <TableCell className="font-body">{w.seats_available}/{w.seats_total}</TableCell>
                <TableCell className="font-body">₹{w.price}</TableCell>
                <TableCell>
                  <button onClick={() => handleToggleActive(w)} className={`text-xs font-body px-2 py-1 rounded cursor-pointer transition-colors ${w.is_active ? "bg-green-500/20 text-green-700 dark:text-green-400" : "bg-muted text-muted-foreground"}`}>
                    {w.is_active ? "Active" : "Inactive"}
                  </button>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(w)}><Pencil className="h-4 w-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button size="icon" variant="ghost"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="font-display">Delete Workshop?</AlertDialogTitle>
                          <AlertDialogDescription className="font-body">This will permanently delete "{w.title}". This action cannot be undone.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="font-body">Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(w.id)} className="bg-destructive text-destructive-foreground font-body">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

/* ─── Product Manager ─── */
function ProductManager({ products, onRefresh }: { products: any[]; onRefresh: () => void }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const { toast } = useToast();

  const defaults = { name: "", description: "", price: 0, stock: 10, category: "", image_url: "", is_active: true };
  const [form, setForm] = useState(defaults);

  const openNew = () => { setEditing(null); setForm(defaults); setOpen(true); };
  const openEdit = (p: any) => { setEditing(p); setForm({ ...defaults, ...p }); setOpen(true); };

  const handleSave = async () => {
    if (!form.name || !form.price) {
      toast({ title: "Name and price are required", variant: "destructive" });
      return;
    }
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
    if (editing) {
      const { error } = await supabase.from("products").update(payload).eq("id", editing.id);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    } else {
      const { error } = await supabase.from("products").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    }
    toast({ title: editing ? "Product updated" : "Product created" });
    setOpen(false);
    onRefresh();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("products").delete().eq("id", id);
    toast({ title: "Product deleted" });
    onRefresh();
  };

  const handleToggleActive = async (p: any) => {
    await supabase.from("products").update({ is_active: !p.is_active }).eq("id", p.id);
    toast({ title: p.is_active ? "Product deactivated" : "Product activated" });
    onRefresh();
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-display text-xl font-semibold text-foreground">Products ({products.length})</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button onClick={openNew} className="bg-secondary text-secondary-foreground font-body"><Plus className="h-4 w-4 mr-1" /> Add Product</Button></DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle className="font-display">{editing ? "Edit Product" : "New Product"}</DialogTitle></DialogHeader>
            <div className="space-y-3">
              {(["name", "category", "image_url"] as const).map((f) => (
                <div key={f}><Label className="font-body capitalize">{f.replace(/_/g, " ")}</Label><Input value={(form as any)[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} className="mt-1" /></div>
              ))}
              <div><Label className="font-body">Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1" rows={3} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="font-body">Price (₹)</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="mt-1" /></div>
                <div><Label className="font-body">Stock</Label><Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} className="mt-1" /></div>
              </div>
              <Button onClick={handleSave} className="w-full bg-secondary text-secondary-foreground font-body">Save Product</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-lg border border-border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-body">Name</TableHead>
              <TableHead className="font-body">Category</TableHead>
              <TableHead className="font-body">Price</TableHead>
              <TableHead className="font-body">Stock</TableHead>
              <TableHead className="font-body">Status</TableHead>
              <TableHead className="font-body">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-body font-medium">{p.name}</TableCell>
                <TableCell className="font-body">{p.category || "—"}</TableCell>
                <TableCell className="font-body">₹{p.price}</TableCell>
                <TableCell className="font-body">{p.stock}</TableCell>
                <TableCell>
                  <button onClick={() => handleToggleActive(p)} className={`text-xs font-body px-2 py-1 rounded cursor-pointer transition-colors ${p.is_active ? "bg-green-500/20 text-green-700 dark:text-green-400" : "bg-muted text-muted-foreground"}`}>
                    {p.is_active ? "Active" : "Inactive"}
                  </button>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button size="icon" variant="ghost"><Trash2 className="h-4 w-4 text-destructive" /></Button></AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="font-display">Delete Product?</AlertDialogTitle>
                          <AlertDialogDescription className="font-body">This will permanently delete "{p.name}". This action cannot be undone.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="font-body">Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(p.id)} className="bg-destructive text-destructive-foreground font-body">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

/* ─── Bookings Table ─── */
function BookingsTable({ bookings }: { bookings: any[] }) {
  return (
    <>
      <h2 className="font-display text-xl font-semibold text-foreground mb-4">All Bookings ({bookings.length})</h2>
      <div className="rounded-lg border border-border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-body">Workshop</TableHead>
              <TableHead className="font-body">User ID</TableHead>
              <TableHead className="font-body">Amount</TableHead>
              <TableHead className="font-body">Status</TableHead>
              <TableHead className="font-body">Booked On</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center font-body text-muted-foreground py-8">No bookings yet</TableCell></TableRow>
            ) : bookings.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="font-body">{b.workshops?.title || "—"}</TableCell>
                <TableCell className="font-body text-xs text-muted-foreground">{b.user_id?.slice(0, 12)}…</TableCell>
                <TableCell className="font-body">₹{b.amount}</TableCell>
                <TableCell>
                  <span className={`text-xs font-body px-2 py-1 rounded ${b.status === "confirmed" ? "bg-green-500/20 text-green-700 dark:text-green-400" : "bg-secondary/20 text-secondary"}`}>
                    {b.status}
                  </span>
                </TableCell>
                <TableCell className="font-body">{new Date(b.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

/* ─── Orders Table ─── */
function OrdersTable({ orders, onRefresh }: { orders: any[]; onRefresh: () => void }) {
  const { toast } = useToast();

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("orders").update({ status }).eq("id", id);
    toast({ title: `Order marked as ${status}` });
    onRefresh();
  };

  return (
    <>
      <h2 className="font-display text-xl font-semibold text-foreground mb-4">All Orders ({orders.length})</h2>
      <div className="rounded-lg border border-border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-body">Order ID</TableHead>
              <TableHead className="font-body">Items</TableHead>
              <TableHead className="font-body">Total</TableHead>
              <TableHead className="font-body">Status</TableHead>
              <TableHead className="font-body">Date</TableHead>
              <TableHead className="font-body">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center font-body text-muted-foreground py-8">No orders yet</TableCell></TableRow>
            ) : orders.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-body text-xs text-muted-foreground">{o.id.slice(0, 8)}…</TableCell>
                <TableCell className="font-body text-sm">{o.order_items?.map((oi: any) => `${oi.products?.name} ×${oi.quantity}`).filter(Boolean).join(", ") || "—"}</TableCell>
                <TableCell className="font-body">₹{o.total}</TableCell>
                <TableCell>
                  <span className={`text-xs font-body px-2 py-1 rounded ${
                    o.status === "confirmed" ? "bg-green-500/20 text-green-700 dark:text-green-400" :
                    o.status === "shipped" ? "bg-blue-500/20 text-blue-700 dark:text-blue-400" :
                    o.status === "delivered" ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400" :
                    "bg-secondary/20 text-secondary"
                  }`}>{o.status}</span>
                </TableCell>
                <TableCell className="font-body">{new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {o.status === "confirmed" && <Button size="sm" variant="outline" className="text-xs font-body" onClick={() => updateStatus(o.id, "shipped")}>Ship</Button>}
                    {o.status === "shipped" && <Button size="sm" variant="outline" className="text-xs font-body" onClick={() => updateStatus(o.id, "delivered")}>Deliver</Button>}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

/* ─── Messages Table ─── */
function MessagesTable({ messages, onRefresh }: { messages: any[]; onRefresh: () => void }) {
  const { toast } = useToast();

  const markRead = async (id: string) => {
    await supabase.from("contact_messages").update({ is_read: true }).eq("id", id);
    toast({ title: "Marked as read" });
    onRefresh();
  };

  return (
    <>
      <h2 className="font-display text-xl font-semibold text-foreground mb-4">Contact Messages ({messages.length})</h2>
      <div className="rounded-lg border border-border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-body">Name</TableHead>
              <TableHead className="font-body">Email</TableHead>
              <TableHead className="font-body">Phone</TableHead>
              <TableHead className="font-body">Message</TableHead>
              <TableHead className="font-body">Date</TableHead>
              <TableHead className="font-body">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center font-body text-muted-foreground py-8">No messages yet</TableCell></TableRow>
            ) : messages.map((m) => (
              <TableRow key={m.id} className={!m.is_read ? "bg-secondary/5" : ""}>
                <TableCell className="font-body font-medium">
                  {!m.is_read && <span className="inline-block w-2 h-2 rounded-full bg-secondary mr-2" />}
                  {m.name}
                </TableCell>
                <TableCell className="font-body text-sm">{m.email}</TableCell>
                <TableCell className="font-body text-sm">{m.phone || "—"}</TableCell>
                <TableCell className="font-body text-sm max-w-xs truncate">{m.message}</TableCell>
                <TableCell className="font-body">{new Date(m.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</TableCell>
                <TableCell>
                  {!m.is_read && (
                    <Button size="sm" variant="ghost" onClick={() => markRead(m.id)} className="font-body text-xs">
                      <Eye className="h-3 w-3 mr-1" /> Read
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
