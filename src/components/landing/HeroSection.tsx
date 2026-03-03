import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-primary overflow-hidden">
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 border border-primary-foreground rounded-full" />
        <div className="absolute bottom-20 right-10 w-96 h-96 border border-primary-foreground rounded-full" />
        <div className="absolute top-1/2 left-1/3 w-48 h-48 border border-primary-foreground rounded-full" />
      </div>

      <div className="container relative z-10">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-body text-secondary tracking-[0.3em] uppercase text-sm mb-6"
          >
            Preserving India's Cultural Heritage
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="font-display text-5xl md:text-7xl font-bold text-primary-foreground leading-[1.1] mb-6"
          >
            Discover the Art of{" "}
            <span className="text-secondary italic">Ancient India</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="font-body text-lg md:text-xl text-primary-foreground/70 max-w-xl mb-10 leading-relaxed"
          >
            Learn Warli, Madhubani, Kalamkari & more through immersive workshops.
            Shop handcrafted artwork from master artisans.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link to="/workshops">
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-body text-base px-8 group">
                Explore Workshops
                <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/shop">
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-body text-base px-8">
                Shop Art
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
