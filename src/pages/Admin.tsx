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
import { IndianRupee, Plus, Pencil, Trash2 } from "lucide-react";

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

  useEffect(() => {
    checkAdmin();
  }, []);

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

  return (
    <Layout>
      <section className="py-24 bg-background min-h-screen">
        <div className="container">
          <h1 className="font-display text-3xl font-bold text-foreground mb-8">Admin Dashboard</h1>
          <Tabs defaultValue="workshops">
            <TabsList className="mb-6 flex-wrap">
              <TabsTrigger value="workshops" className="font-body">Workshops</TabsTrigger>
              <TabsTrigger value="products" className="font-body">Products</TabsTrigger>
              <TabsTrigger value="bookings" className="font-body">Bookings</TabsTrigger>
              <TabsTrigger value="orders" className="font-body">Orders</TabsTrigger>
              <TabsTrigger value="messages" className="font-body">Messages</TabsTrigger>
            </TabsList>

            <TabsContent value="workshops">
              <WorkshopManager workshops={workshops} onRefresh={fetchAll} />
            </TabsContent>
            <TabsContent value="products">
              <ProductManager products={products} onRefresh={fetchAll} />
            </TabsContent>
            <TabsContent value="bookings">
              <BookingsTable bookings={bookings} />
            </TabsContent>
            <TabsContent value="orders">
              <OrdersTable orders={orders} />
            </TabsContent>
            <TabsContent value="messages">
              <MessagesTable messages={messages} />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
}

// --- Workshop Manager ---
function WorkshopManager({ workshops, onRefresh }: { workshops: any[]; onRefresh: () => void }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const { toast } = useToast();

  const defaults = { title: "", description: "", art_type: "", city: "", venue: "", date: "", price: 0, seats_total: 30, seats_available: 30, image_url: "", is_active: true };
  const [form, setForm] = useState(defaults);

  const openNew = () => { setEditing(null); setForm(defaults); setOpen(true); };
  const openEdit = (w: any) => { setEditing(w); setForm({ ...defaults, ...w, date: w.date?.slice(0, 16) || "" }); setOpen(true); };

  const handleSave = async () => {
    const payload = { ...form, price: Number(form.price), seats_total: Number(form.seats_total), seats_available: Number(form.seats_available) };
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

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-display text-xl font-semibold text-foreground">Workshops ({workshops.length})</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button onClick={openNew} className="bg-secondary text-secondary-foreground font-body"><Plus className="h-4 w-4 mr-1" /> Add</Button></DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle className="font-display">{editing ? "Edit Workshop" : "New Workshop"}</DialogTitle></DialogHeader>
            <div className="space-y-3">
              {(["title", "art_type", "city", "venue", "image_url"] as const).map((f) => (
                <div key={f}><Label className="font-body capitalize">{f.replace("_", " ")}</Label><Input value={(form as any)[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} className="mt-1" /></div>
              ))}
              <div><Label className="font-body">Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1" /></div>
              <div><Label className="font-body">Date & Time</Label><Input type="datetime-local" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="mt-1" /></div>
              <div className="grid grid-cols-3 gap-3">
                <div><Label className="font-body">Price</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="mt-1" /></div>
                <div><Label className="font-body">Total Seats</Label><Input type="number" value={form.seats_total} onChange={(e) => setForm({ ...form, seats_total: Number(e.target.value) })} className="mt-1" /></div>
                <div><Label className="font-body">Available</Label><Input type="number" value={form.seats_available} onChange={(e) => setForm({ ...form, seats_available: Number(e.target.value) })} className="mt-1" /></div>
              </div>
              <Button onClick={handleSave} className="w-full bg-secondary text-secondary-foreground font-body">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-lg border border-border overflow-x-auto">
        <Table>
          <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>City</TableHead><TableHead>Date</TableHead><TableHead>Seats</TableHead><TableHead>Price</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {workshops.map((w) => (
              <TableRow key={w.id}>
                <TableCell className="font-body font-medium">{w.title}</TableCell>
                <TableCell className="font-body">{w.city}</TableCell>
                <TableCell className="font-body">{new Date(w.date).toLocaleDateString("en-IN")}</TableCell>
                <TableCell className="font-body">{w.seats_available}/{w.seats_total}</TableCell>
                <TableCell className="font-body">₹{w.price}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(w)}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(w.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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

// --- Product Manager ---
function ProductManager({ products, onRefresh }: { products: any[]; onRefresh: () => void }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const { toast } = useToast();

  const defaults = { name: "", description: "", price: 0, stock: 10, category: "", image_url: "", is_active: true };
  const [form, setForm] = useState(defaults);

  const openNew = () => { setEditing(null); setForm(defaults); setOpen(true); };
  const openEdit = (p: any) => { setEditing(p); setForm({ ...defaults, ...p }); setOpen(true); };

  const handleSave = async () => {
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

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-display text-xl font-semibold text-foreground">Products ({products.length})</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button onClick={openNew} className="bg-secondary text-secondary-foreground font-body"><Plus className="h-4 w-4 mr-1" /> Add</Button></DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle className="font-display">{editing ? "Edit Product" : "New Product"}</DialogTitle></DialogHeader>
            <div className="space-y-3">
              {(["name", "category", "image_url"] as const).map((f) => (
                <div key={f}><Label className="font-body capitalize">{f.replace("_", " ")}</Label><Input value={(form as any)[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })} className="mt-1" /></div>
              ))}
              <div><Label className="font-body">Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="font-body">Price</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="mt-1" /></div>
                <div><Label className="font-body">Stock</Label><Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} className="mt-1" /></div>
              </div>
              <Button onClick={handleSave} className="w-full bg-secondary text-secondary-foreground font-body">Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-lg border border-border overflow-x-auto">
        <Table>
          <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Category</TableHead><TableHead>Price</TableHead><TableHead>Stock</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-body font-medium">{p.name}</TableCell>
                <TableCell className="font-body">{p.category}</TableCell>
                <TableCell className="font-body">₹{p.price}</TableCell>
                <TableCell className="font-body">{p.stock}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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

// --- Bookings Table ---
function BookingsTable({ bookings }: { bookings: any[] }) {
  return (
    <div className="rounded-lg border border-border overflow-x-auto">
      <Table>
        <TableHeader><TableRow><TableHead>Workshop</TableHead><TableHead>User</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
        <TableBody>
          {bookings.map((b) => (
            <TableRow key={b.id}>
              <TableCell className="font-body">{b.workshops?.title || "-"}</TableCell>
              <TableCell className="font-body text-xs">{b.user_id?.slice(0, 8)}...</TableCell>
              <TableCell className="font-body">₹{b.amount}</TableCell>
              <TableCell><span className="text-xs font-body px-2 py-1 rounded bg-secondary/20 text-secondary">{b.status}</span></TableCell>
              <TableCell className="font-body">{new Date(b.created_at).toLocaleDateString("en-IN")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// --- Orders Table ---
function OrdersTable({ orders }: { orders: any[] }) {
  return (
    <div className="rounded-lg border border-border overflow-x-auto">
      <Table>
        <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Items</TableHead><TableHead>Total</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
        <TableBody>
          {orders.map((o) => (
            <TableRow key={o.id}>
              <TableCell className="font-body text-xs">{o.id.slice(0, 8)}...</TableCell>
              <TableCell className="font-body text-sm">{o.order_items?.map((oi: any) => oi.products?.name).filter(Boolean).join(", ") || "-"}</TableCell>
              <TableCell className="font-body">₹{o.total}</TableCell>
              <TableCell><span className="text-xs font-body px-2 py-1 rounded bg-secondary/20 text-secondary">{o.status}</span></TableCell>
              <TableCell className="font-body">{new Date(o.created_at).toLocaleDateString("en-IN")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// --- Messages Table ---
function MessagesTable({ messages }: { messages: any[] }) {
  return (
    <div className="rounded-lg border border-border overflow-x-auto">
      <Table>
        <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Message</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
        <TableBody>
          {messages.map((m) => (
            <TableRow key={m.id}>
              <TableCell className="font-body font-medium">{m.name}</TableCell>
              <TableCell className="font-body text-sm">{m.email}</TableCell>
              <TableCell className="font-body text-sm max-w-xs truncate">{m.message}</TableCell>
              <TableCell className="font-body">{new Date(m.created_at).toLocaleDateString("en-IN")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
