import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { ShoppingCart, IndianRupee } from "lucide-react";
import { useCart } from "@/hooks/useCart";

export default function Shop() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    supabase.from("products").select("*").eq("is_active", true).order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error(error);
        setProducts(data || []);
        setLoading(false);
      });
  }, []);

  const handleAdd = (product: any) => {
    addToCart({ id: product.id, name: product.name, price: product.price, image_url: product.image_url, quantity: 1 });
    toast({ title: "Added to cart", description: product.name });
  };

  return (
    <Layout>
      <section className="py-24 bg-background min-h-screen">
        <div className="container">
          <div className="text-center mb-16">
            <p className="font-body text-secondary tracking-[0.3em] uppercase text-sm mb-3">Handcrafted Art</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">Art Shop</h1>
          </div>

          {loading ? (
            <p className="text-center font-body text-muted-foreground">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-center font-body text-muted-foreground">No products available yet. Check back soon!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="group rounded-lg border border-border bg-card overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="aspect-square overflow-hidden bg-muted">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground font-body">No Image</div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg font-semibold text-foreground mb-1">{p.name}</h3>
                    <p className="font-body text-sm text-muted-foreground mb-3 line-clamp-2">{p.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-display text-xl font-bold text-foreground flex items-center">
                        <IndianRupee className="h-4 w-4" />{p.price}
                      </span>
                      <Button size="sm" onClick={() => handleAdd(p)} className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-body">
                        <ShoppingCart className="h-4 w-4 mr-1" /> Add
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
