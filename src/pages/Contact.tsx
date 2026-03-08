import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin } from "lucide-react";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(20).optional(),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => { fieldErrors[err.path[0] as string] = err.message; });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    const { error } = await supabase.from("contact_messages").insert([{
      name: result.data.name,
      email: result.data.email,
      phone: result.data.phone || null,
      message: result.data.message,
    }]);
    setLoading(false);
    if (error) {
      toast({ title: "Failed to send", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Message sent!", description: "We'll get back to you soon." });
      setForm({ name: "", email: "", phone: "", message: "" });
    }
  };

  return (
    <Layout>
      <section className="py-24 bg-background min-h-screen">
        <div className="container max-w-4xl">
          <div className="text-center mb-16">
            <p className="font-body text-secondary tracking-[0.3em] uppercase text-sm mb-3">Get In Touch</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">Contact Us</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label className="font-body">Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1" />
                {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <Label className="font-body">Email</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1" />
                {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
              </div>
              <div>
                <Label className="font-body">Phone (optional)</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1" />
              </div>
              <div>
                <Label className="font-body">Message</Label>
                <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={5} className="mt-1" />
                {errors.message && <p className="text-destructive text-sm mt-1">{errors.message}</p>}
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-body">
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </form>

            <div className="space-y-8">
              <div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-4">Contact Info</h3>
                <div className="space-y-4 font-body text-muted-foreground">
                  <a href="mailto:shadowartsteam@gmail.com" className="flex items-center gap-3 hover:text-secondary transition-colors"><Mail className="h-5 w-5 text-secondary" /> shadowartsteam@gmail.com</a>
                  <a href="tel:+919701360746" className="flex items-center gap-3 hover:text-secondary transition-colors"><Phone className="h-5 w-5 text-secondary" /> +91 97013 60746</a>
                  <a href="https://maps.google.com/?q=16-4-1402/1,+Pallavi+Hospital+Line,+Under+Bridge+Rd,+Shiva+Nagar,+Warangal,+Telangana+506002" target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 hover:text-secondary transition-colors"><MapPin className="h-5 w-5 text-secondary mt-0.5" /> 16-4-1402/1, Pallavi Hospital Line, Under Bridge Rd, Shiva Nagar, Warangal, Telangana 506002</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
