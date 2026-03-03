import { useScrollReveal } from "@/hooks/useScrollReveal";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  { name: "Priya Sharma", role: "Art Enthusiast", text: "The Warli art workshop was a life-changing experience. The instructors are incredibly knowledgeable and patient." },
  { name: "Rahul Desai", role: "Interior Designer", text: "I've been incorporating Madhubani pieces from Shadow Arts into my projects. The quality and authenticity is unmatched." },
  { name: "Ananya Patel", role: "Student", text: "As a beginner, I felt so welcomed. The step-by-step approach made even complex art forms accessible and enjoyable." },
];

export default function TestimonialsSection() {
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
          <p className="font-body text-secondary tracking-[0.3em] uppercase text-sm mb-3">Testimonials</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">What Our Students Say</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="p-8 rounded-lg border border-border bg-card"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-secondary text-secondary" />
                ))}
              </div>
              <p className="font-body text-muted-foreground leading-relaxed mb-6 italic">"{t.text}"</p>
              <div>
                <p className="font-display font-semibold text-foreground">{t.name}</p>
                <p className="font-body text-sm text-muted-foreground">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
