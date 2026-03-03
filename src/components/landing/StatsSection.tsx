import { useScrollReveal } from "@/hooks/useScrollReveal";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const stats = [
  { label: "Students Trained", value: 5000, suffix: "+" },
  { label: "Cities Reached", value: 25, suffix: "+" },
  { label: "Workshops Conducted", value: 200, suffix: "+" },
  { label: "Art Forms Taught", value: 12, suffix: "" },
];

function Counter({ target, suffix, active }: { target: number; suffix: string; active: boolean }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const duration = 1500;
    const step = Math.ceil(target / (duration / 16));
    const interval = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(interval);
  }, [active, target]);

  return <span>{count.toLocaleString()}{suffix}</span>;
}

export default function StatsSection() {
  const { ref, isVisible } = useScrollReveal(0.3);

  return (
    <section ref={ref} className="py-20 bg-primary">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <p className="font-display text-4xl md:text-5xl font-bold text-secondary mb-2">
                <Counter target={s.value} suffix={s.suffix} active={isVisible} />
              </p>
              <p className="font-body text-sm text-primary-foreground/60 tracking-wide uppercase">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
