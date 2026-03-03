import { useScrollReveal } from "@/hooks/useScrollReveal";
import { motion } from "framer-motion";

const images = [
  { url: "https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?w=600&h=400&fit=crop", title: "Warli Art" },
  { url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=400&fit=crop", title: "Madhubani" },
  { url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop", title: "Mandala" },
  { url: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&h=400&fit=crop", title: "Kalamkari" },
  { url: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&h=400&fit=crop", title: "Workshop" },
  { url: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=600&h=400&fit=crop", title: "Exhibition" },
];

export default function GallerySection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="py-24 bg-primary">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-body text-secondary tracking-[0.3em] uppercase text-sm mb-3">Our Work</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground">Gallery</h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img, i) => (
            <motion.div
              key={img.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative aspect-[3/2] rounded-lg overflow-hidden cursor-pointer"
            >
              <img
                src={img.url}
                alt={img.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <p className="font-display text-lg text-primary-foreground font-semibold">{img.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
