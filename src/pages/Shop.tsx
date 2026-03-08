import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, IndianRupee, X, ZoomIn } from "lucide-react";
import { useCart } from "@/hooks/useCart";

import warliImg from "@/assets/shop-warli-painting.jpg";
import madhubaniImg from "@/assets/shop-madhubani-canvas.jpg";
import pichwaiImg from "@/assets/shop-pichwai-art.jpg";
import gondImg from "@/assets/shop-gond-art.jpg";
import kalamkariImg from "@/assets/shop-kalamkari-textile.jpg";
import mandalaImg from "@/assets/shop-mandala-print.jpg";

const fallbackImages = [warliImg, madhubaniImg, pichwaiImg, gondImg, kalamkariImg, mandalaImg];

function getProductImage(product: any, index: number): string {
  if (product.image_url) return product.image_url;
  return fallbackImages[index % fallbackImages.length];
}

export default function Shop() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
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

  const handleAdd = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    addToCart({ id: product.id, name: product.name, price: product.price, image_url: product.image_url, quantity: 1 });
    toast({ title: "Added to cart", description: product.name });
  };

  return (
    <Layout>
      <section className="py-24 bg-background min-h-screen">
        <div className="container">
          <div className="text-center mb-16">
            <p className="font-body text-secondary tracking-[0.3em] uppercase text-sm mb-3">Handcrafted Art</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">Crafted with Culture</h1>
          </div>

          {/* Coming Soon Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-12 rounded-2xl border-2 border-dashed border-secondary/40 bg-secondary/5 p-8 md:p-12 text-center"
          >
            <motion.p
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="font-display text-3xl md:text-4xl font-bold text-secondary mb-3"
            >
              Coming Soon
            </motion.p>
            <p className="font-body text-muted-foreground text-sm md:text-base max-w-md mx-auto">
              Our handcraft store is being curated with love. Stay tuned for authentic, handcrafted artwork from master artisans across India.
            </p>
          </motion.div>

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
                  whileHover={{ y: -10 }}
                  onClick={() => setSelectedProduct(i)}
                  className="group relative rounded-2xl overflow-hidden border border-border bg-card shadow-lg hover:shadow-2xl transition-shadow duration-500 cursor-pointer"
                  style={{ perspective: 1000 }}
                >
                  {/* Image */}
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={getProductImage(p, i)}
                      alt={p.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                    {/* Zoom icon on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <motion.div
                        initial={false}
                        className="w-14 h-14 rounded-full bg-secondary/80 backdrop-blur-sm flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-500"
                      >
                        <ZoomIn className="h-6 w-6 text-secondary-foreground" />
                      </motion.div>
                    </div>

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
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="font-display text-xl font-bold text-foreground mb-1 group-hover:text-secondary transition-colors duration-300">
                      {p.name}
                    </h3>
                    <p className="font-body text-sm text-muted-foreground line-clamp-2 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                      {p.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox / Full Image View */}
      <AnimatePresence>
        {selectedProduct !== null && products[selectedProduct] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 md:p-8"
            onClick={() => setSelectedProduct(null)}
          >
            {/* Close button */}
            <motion.button
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10"
              whileHover={{ scale: 1.1, rotate: 90 }}
              onClick={() => setSelectedProduct(null)}
            >
              <X className="h-8 w-8" />
            </motion.button>

            <div className="flex flex-col md:flex-row items-center gap-8 max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
              {/* Image */}
              <motion.img
                key={selectedProduct}
                src={getProductImage(products[selectedProduct], selectedProduct)}
                alt={products[selectedProduct].name}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="max-w-full md:max-w-[60%] max-h-[70vh] rounded-2xl object-contain shadow-2xl"
              />

              {/* Product details */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="text-center md:text-left"
              >
                <h2 className="font-display text-3xl md:text-4xl text-white font-bold mb-3">
                  {products[selectedProduct].name}
                </h2>
                <p className="font-body text-white/70 mb-6 leading-relaxed max-w-md">
                  {products[selectedProduct].description}
                </p>
                <div className="flex items-center gap-1 font-display text-3xl text-secondary font-bold mb-6 justify-center md:justify-start">
                  <IndianRupee className="h-6 w-6" />
                  {products[selectedProduct].price}
                </div>
                <Button
                  size="lg"
                  onClick={(e) => {
                    handleAdd(e, products[selectedProduct]);
                    setSelectedProduct(null);
                  }}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-body gap-2 text-lg px-8"
                >
                  <ShoppingCart className="h-5 w-5" /> Add to Cart
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
