import { useScrollReveal } from "@/hooks/useScrollReveal";
import { motion } from "framer-motion";
import { Palette, Brush, PenTool, Flower2, Star, Gem } from "lucide-react";

const programs = [
  { name: "Warli Art", desc: "Tribal art from Maharashtra using geometric patterns and daily life scenes.", icon: Palette },
  { name: "Madhubani", desc: "Vibrant folk art from Bihar with intricate patterns and mythological themes.", icon: Brush },
  { name: "Kalamkari", desc: "Ancient textile art using natural dyes and hand-painted mythological narratives.", icon: PenTool },
  { name: "Mandala Art", desc: "Meditative circular designs symbolizing cosmic harmony and spiritual growth.", icon: Flower2 },
  { name: "Pichwai", desc: "Devotional paintings from Rajasthan depicting Lord Krishna's tales.", icon: Star },
  { name: "Gond Art", desc: "Indigenous tribal art from Madhya Pradesh with dots, dashes, and nature motifs.", icon: Gem },
];

export default function ProgramsSection() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="py-24 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-body text-secondary tracking-[0.3em] uppercase text-sm mb-3">What We Teach</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">Our Art Programs</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group p-8 rounded-lg border border-border bg-card hover:border-secondary/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-5 group-hover:bg-secondary/20 transition-colors">
                <p.icon className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">{p.name}</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
