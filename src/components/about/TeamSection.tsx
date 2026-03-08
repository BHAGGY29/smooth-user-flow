import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useRef, useState } from "react";

import teamArunkumar from "@/assets/team-arunkumar.png";
import teamChandhana from "@/assets/team-chandhana.png";
import teamVarshitha from "@/assets/team-varshitha.png";
import teamSushmitha from "@/assets/team-sushmitha.png";
import teamAravind from "@/assets/team-aravind.png";
import teamBhagath from "@/assets/team-bhagath.png";

interface TeamMember {
  name: string;
  role: string;
  image: string;
  objectPosition?: string;
}

const leaders: TeamMember[] = [
  { name: "Arunkumar Parkala", role: "Founder & CEO", image: teamArunkumar },
  { name: "Chandhana", role: "Co-Founder & Chief Creative Officer", image: teamChandhana },
];

const coreTeam: TeamMember[] = [
  { name: "Varshitha", role: "Creative Head", image: teamVarshitha },
  { name: "Sushmitha", role: "Workshop Community Head", image: teamSushmitha },
  { name: "Sangem Aravind Reddy", role: "Technical Head", image: teamAravind, objectPosition: "top" },
  { name: "Bhagath Vallala", role: "R&D Engineer", image: teamBhagath, objectPosition: "top" },
];

/* ── 3D tilt card ── */
function TiltCard({ member, index, large }: { member: TeamMember; index: number; large?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
    setHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 80, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.9,
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      onMouseMove={handleMouse}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleLeave}
      className={`group relative cursor-default will-change-transform ${large ? "col-span-1" : ""}`}
    >
      <div className={`relative overflow-hidden rounded-[20px] ${large ? "h-[420px] md:h-[500px]" : "h-[320px] md:h-[380px]"}`}>
        {/* Image */}
        <motion.img
          src={member.image}
          alt={member.name}
          style={member.objectPosition ? { objectPosition: member.objectPosition } : undefined}
          animate={{ scale: hovered ? 1.08 : 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Multi-layer overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-70" />
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 bg-gradient-to-tr from-secondary/20 via-transparent to-secondary/10"
        />

        {/* Animated border glow */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 rounded-[20px] ring-1 ring-inset ring-secondary/40"
        />

        {/* Number badge */}
        <motion.span
          animate={{ opacity: hovered ? 1 : 0.3, y: hovered ? 0 : 4 }}
          transition={{ duration: 0.5 }}
          className="absolute top-5 left-5 font-display text-5xl font-bold text-secondary/30 select-none"
        >
          {String(index + 1).padStart(2, "0")}
        </motion.span>

        {/* Content area */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          {/* Animated reveal line */}
          <motion.div
            animate={{ scaleX: hovered ? 1 : 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-10 h-[2px] bg-secondary mb-4 origin-left"
          />

          <motion.span
            animate={{ y: hovered ? 0 : 8, opacity: hovered ? 1 : 0.7 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="block font-body text-xs tracking-[0.25em] uppercase text-secondary mb-2"
          >
            {member.role}
          </motion.span>

          <motion.h3
            animate={{ y: hovered ? 0 : 4 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={`font-display font-bold text-white leading-tight ${large ? "text-2xl md:text-3xl" : "text-lg md:text-xl"}`}
          >
            {member.name}
          </motion.h3>

          {/* Expanding underline */}
          <motion.div
            animate={{ width: hovered ? "100%" : "0%" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="h-px bg-gradient-to-r from-secondary/60 to-transparent mt-3"
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function TeamSection() {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <section ref={ref} className="relative py-32 md:py-40 overflow-hidden bg-primary">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--secondary)) 1px, transparent 0)`,
        backgroundSize: "40px 40px",
      }} />

      {/* Floating ambient orbs */}
      <motion.div
        animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-[15%] w-[300px] h-[300px] rounded-full bg-secondary/[0.04] blur-[100px]"
      />
      <motion.div
        animate={{ y: [0, 20, 0], x: [0, -20, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 left-[10%] w-[400px] h-[400px] rounded-full bg-secondary/[0.03] blur-[120px]"
      />

      <div className="container relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-20 md:mb-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={isVisible ? { width: 60 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-px bg-secondary mx-auto mb-8"
            />
            <p className="font-body text-secondary/80 tracking-[0.4em] uppercase text-xs mb-5">
              The Creatives
            </p>
            <h2 className="font-display text-5xl md:text-7xl font-bold text-primary-foreground leading-[0.95]">
              Meet the
              <br />
              <span className="italic text-secondary">Team</span>
            </h2>
            <motion.div
              initial={{ width: 0 }}
              animate={isVisible ? { width: 60 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="h-px bg-secondary mx-auto mt-8"
            />
          </motion.div>
        </div>

        {/* Leaders — asymmetric hero layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto mb-8 md:mb-10">
          {leaders.map((member, i) => (
            <div key={member.name} className={i === 1 ? "md:mt-16" : ""}>
              <TiltCard member={member} index={i} large />
            </div>
          ))}
        </div>

        {/* Core team — 4 column grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
          {coreTeam.map((member, i) => (
            <TiltCard key={member.name} member={member} index={i + 2} />
          ))}
        </div>
      </div>
    </section>
  );
}