import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { ShoppingCart, IndianRupee } from "lucide-react";
import { useCart } from "@/hooks/useCart";

import warliImg from "@/assets/art-warli.jpg";
import madhubaniImg from "@/assets/art-madhubani.jpg";
import pichwaiImg from "@/assets/art-pichwai.jpg";
import gondImg from "@/assets/art-gond.jpg";
import kalamkariImg from "@/assets/art-kalamkari.jpg";
import mandalaImg from "@/assets/art-mandala.jpg";

const fallbackImages = [warliImg, madhubaniImg, pichwaiImg, gondImg, kalamkariImg, mandalaImg];

function getProductImage(product: any, index: number): string {
  if (product.image_url) return product.image_url;
  return fallbackImages[index % fallbackImages.length];
}

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 40, rotateX: 10 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.6, ease: "easeOut" }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group relative rounded-2xl overflow-hidden border border-border bg-card shadow-lg hover:shadow-2xl transition-shadow duration-500"
                  style={{ perspective: 1000 }}
                >
                  {/* Image */}
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <motion.img
                      src={getProductImage(p, i)}
                      alt={p.name}
                      loading="lazy"
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.12 }}
                      transition={{ duration: 0.7 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                    
                    {/* Floating price badge */}
                    <div className="absolute top-4 right-4">
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.1 + 0.3, type: "spring" }}
                        className="inline-flex items-center gap-0.5 px-3 py-1.5 rounded-full bg-secondary/90 text-secondary-foreground font-display text-sm font-bold backdrop-blur-sm shadow-md"
                      >
                        <IndianRupee className="h-3.5 w-3.5" />{p.price}
                      </motion.span>
                    </div>
                  </div>

                  {/* Content overlay at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 transform group-hover:-translate-y-1 transition-transform duration-500">
                    <h3 className="font-display text-xl font-bold text-foreground mb-1 group-hover:text-secondary transition-colors duration-300">
                      {p.name}
                    </h3>
                    <p className="font-body text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                      {p.description}
                    </p>
                    <Button
                      size="sm"
                      onClick={() => handleAdd(p)}
                      className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-body gap-2 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-400"
                    >
                      <ShoppingCart className="h-4 w-4" /> Add to Cart
                    </Button>
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
