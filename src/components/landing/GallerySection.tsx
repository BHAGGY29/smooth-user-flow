import { useScrollReveal } from "@/hooks/useScrollReveal";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, ZoomIn } from "lucide-react";

import warliImg from "@/assets/art-warli.jpg";
import madhubaniImg from "@/assets/art-madhubani.jpg";
import kalamkariImg from "@/assets/art-kalamkari.jpg";
import mandalaImg from "@/assets/art-mandala.jpg";
import pichwaiImg from "@/assets/art-pichwai.jpg";
import gondImg from "@/assets/art-gond.jpg";

const images = [
  { url: warliImg, title: "Warli Art", category: "Tribal" },
  { url: madhubaniImg, title: "Madhubani", category: "Folk" },
  { url: mandalaImg, title: "Mandala", category: "Meditative" },
  { url: kalamkariImg, title: "Kalamkari", category: "Textile" },
  { url: pichwaiImg, title: "Pichwai", category: "Devotional" },
  { url: gondImg, title: "Gond Art", category: "Indigenous" },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 40 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function GallerySection() {
  const { ref, isVisible } = useScrollReveal();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <>
      <section ref={ref} className="py-24 bg-primary overflow-hidden">
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

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6"
          >
            {images.map((img, i) => (
              <motion.div
                key={img.title}
                variants={itemVariants}
                whileHover={{ scale: 1.04, zIndex: 10 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedImage(i)}
                className={`group relative rounded-xl overflow-hidden cursor-pointer shadow-lg ${
                  i === 0 ? "md:row-span-2 md:aspect-auto aspect-square" : "aspect-[3/2]"
                }`}
              >
                <motion.img
                  src={img.url}
                  alt={img.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.15 }}
                  transition={{ duration: 0.7 }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <motion.div
                    initial={false}
                    className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500"
                  >
                    <ZoomIn className="h-8 w-8 text-secondary mb-3 mx-auto" />
                    <p className="font-display text-xl text-primary-foreground font-bold">{img.title}</p>
                    <p className="font-body text-sm text-secondary">{img.category}</p>
                  </motion.div>
                </div>
                {/* Bottom label */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent md:opacity-0 md:group-hover:opacity-0 opacity-100">
                  <p className="font-body text-xs text-white/90">{img.title}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.button
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
              whileHover={{ scale: 1.1, rotate: 90 }}
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-8 w-8" />
            </motion.button>
            <motion.img
              key={selectedImage}
              src={images[selectedImage].url}
              alt={images[selectedImage].title}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="max-w-full max-h-[85vh] rounded-xl object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute bottom-8 text-center"
            >
              <p className="font-display text-2xl text-white font-bold">{images[selectedImage].title}</p>
              <p className="font-body text-secondary text-sm">{images[selectedImage].category}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
