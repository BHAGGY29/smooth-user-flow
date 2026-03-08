import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useRef, useState } from "react";
import { Instagram, Youtube, MessageCircle, Sparkles } from "lucide-react";

import teamArunkumar from "@/assets/team-arunkumar.png";
import teamChandhana from "@/assets/team-chandhana.png";
import teamVarshitha from "@/assets/team-varshitha.png";
import teamSushmitha from "@/assets/team-sushmitha.png";
import teamAravind from "@/assets/team-aravind.png";
import teamBhagath from "@/assets/team-bhagath.png";
import teamSrinivas from "@/assets/team-srinivas.png";

interface TeamMember {
  name: string;
  role: string;
  image: string;
  funFact: string;
  accent: string;
  glowColor: string;
  objectPosition?: string;
  socials?: { instagram?: string; youtube?: string; whatsapp?: string };
}

const topRow: TeamMember[] = [
  {
    name: "Arunkumar Parkala", role: "Founder & CEO", image: teamArunkumar,
    funFact: "Started Shadow Arts from a single workshop in 2020 — now a movement.",
    accent: "from-amber-400 via-orange-500 to-red-500", glowColor: "rgba(249,115,22,0.3)",
    socials: { instagram: "#", youtube: "#", whatsapp: "#" },
  },
  {
    name: "Varshitha", role: "Creative Head", image: teamVarshitha,
    funFact: "Can sketch your portrait in under 3 minutes flat.",
    accent: "from-yellow-300 via-amber-400 to-orange-400", glowColor: "rgba(245,158,11,0.3)",
    socials: { instagram: "#" },
  },
  {
    name: "Aravind Reddy", role: "Technical Head", image: teamAravind, objectPosition: "top",
    funFact: "The tech wizard who bridges art and code seamlessly.",
    accent: "from-emerald-400 via-teal-500 to-cyan-500", glowColor: "rgba(20,184,166,0.3)",
    socials: { instagram: "#", youtube: "#" },
  },
  {
    name: "Srinivas", role: "UI/UX Designer", image: teamSrinivas,
    funFact: "Pixel-perfect obsession meets creative engineering.",
    accent: "from-violet-400 via-purple-500 to-fuchsia-500", glowColor: "rgba(139,92,246,0.3)",
    socials: { instagram: "#" },
  },
];

const bottomRow: TeamMember[] = [
  {
    name: "Chandhana", role: "Co-Founder & CCO", image: teamChandhana,
    funFact: "Turns creative chaos into breathtaking visual stories.",
    accent: "from-blue-400 via-indigo-500 to-violet-500", glowColor: "rgba(99,102,241,0.3)",
    socials: { instagram: "#", whatsapp: "#" },
  },
  {
    name: "Sushmitha", role: "Community Head", image: teamSushmitha,
    funFact: "200+ workshops organized. Her energy is absolutely contagious.",
    accent: "from-pink-400 via-rose-500 to-red-400", glowColor: "rgba(244,63,94,0.3)",
    socials: { instagram: "#", whatsapp: "#" },
  },
  {
    name: "Bhagath Vallala", role: "R&D Engineer", image: teamBhagath, objectPosition: "top",
    funFact: "If it exists, he's already tried making art with it.",
    accent: "from-sky-400 via-cyan-500 to-teal-400", glowColor: "rgba(6,182,212,0.3)",
    socials: { instagram: "#" },
  },
];

/* ── Floating particle dots around circles ── */
function FloatingDots({ active, color }: { active: boolean; color: string }) {
  return (
    <>
      {[...Array(10)].map((_, i) => {
        const angle = (i * 36) * (Math.PI / 180);
        const radius = 95 + (i % 3) * 15;
        return (
          <motion.div
            key={i}
            animate={{
              x: active ? Math.cos(angle) * radius : 0,
              y: active ? Math.sin(angle) * radius : 0,
              opacity: active ? [0, 1, 0.8, 0] : 0,
              scale: active ? [0, 2, 1.5, 0] : 0,
            }}
            transition={{
              duration: 1.8,
              delay: i * 0.12,
              repeat: active ? Infinity : 0,
              ease: "easeInOut",
            }}
            className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full pointer-events-none"
            style={{ background: color, boxShadow: `0 0 8px 2px ${color}` }}
          />
        );
      })}
    </>
  );
}

/* ── Magnetic tilt circle card ── */
function MemberNode({
  member, index, position,
}: {
  member: TeamMember; index: number; position: "top" | "bottom";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const isTop = position === "top";

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [12, -12]), { stiffness: 200, damping: 25 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), { stiffness: 200, damping: 25 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => {
    mx.set(0); my.set(0); setHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: isTop ? -50 : 50, scale: 0.8 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center"
    >
      {/* Name & Role on top */}
      {isTop && (
        <motion.div
          animate={{ y: hovered ? -4 : 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-5"
        >
          <motion.h3
            animate={{ scale: hovered ? 1.08 : 1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-lg md:text-xl font-bold text-foreground"
          >
            {member.name}
          </motion.h3>
          <motion.p
            animate={{ opacity: hovered ? 1 : 0.6 }}
            className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mt-1"
          >
            {member.role}
          </motion.p>
        </motion.div>
      )}

      {/* Circle container with 3D tilt */}
      <motion.div
        ref={ref}
        style={{ rotateX, rotateY, transformPerspective: 800 }}
        onMouseMove={handleMouse}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleLeave}
        className="relative cursor-pointer will-change-transform"
      >
        {/* Multi-layer glow */}
        <motion.div
          animate={{
            opacity: hovered ? 1 : 0,
            scale: hovered ? 1.4 : 0.8,
          }}
          transition={{ duration: 0.5 }}
          className="absolute -inset-10 rounded-full blur-3xl pointer-events-none"
          style={{ background: member.glowColor }}
        />
        <motion.div
          animate={{
            opacity: hovered ? 0.6 : 0,
            scale: hovered ? 1.6 : 0.9,
          }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="absolute -inset-16 rounded-full blur-[60px] pointer-events-none"
          style={{ background: member.glowColor }}
        />

        {/* Spinning gradient ring — faster on hover */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: hovered ? 3 : 12, repeat: Infinity, ease: "linear" }}
          className={`absolute -inset-[5px] rounded-full bg-gradient-to-br ${member.accent} p-[3px]`}
          style={{ boxShadow: hovered ? `0 0 20px 4px ${member.glowColor}` : "none" }}
        >
          <div className="w-full h-full rounded-full bg-background" />
        </motion.div>

        {/* Second decorative dashed ring */}
        <motion.div
          animate={{
            rotate: hovered ? -360 : 0,
            opacity: hovered ? 0.7 : 0.15,
            scale: hovered ? 1.18 : 1.08,
          }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute -inset-5 rounded-full border-2 border-dashed pointer-events-none"
          style={{ borderColor: hovered ? member.glowColor : "hsl(var(--muted-foreground) / 0.2)" }}
        />

        {/* Third pulsing ring */}
        <motion.div
          animate={{
            opacity: hovered ? [0.4, 0.8, 0.4] : 0,
            scale: hovered ? [1.15, 1.25, 1.15] : 1.1,
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -inset-7 rounded-full border pointer-events-none"
          style={{ borderColor: member.glowColor }}
        />

        {/* Floating particles */}
        <FloatingDots active={hovered} color={member.glowColor} />

        {/* Photo */}
        <div className="relative w-32 h-32 md:w-40 md:h-40 lg:w-44 lg:h-44 rounded-full overflow-hidden">
          <motion.img
            src={member.image}
            alt={member.name}
            style={member.objectPosition ? { objectPosition: member.objectPosition } : undefined}
            className="w-full h-full object-cover"
            animate={{
              scale: hovered ? 1.15 : 1,
              filter: hovered ? "grayscale(0%) brightness(1.1)" : "grayscale(20%) brightness(0.92)",
            }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />

        </div>
      </motion.div>

      {/* Name & Role below for bottom row */}
      {!isTop && (
        <motion.div
          animate={{ y: hovered ? 4 : 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mt-5"
        >
          <motion.h3
            animate={{ scale: hovered ? 1.08 : 1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-lg md:text-xl font-bold text-foreground"
          >
            {member.name}
          </motion.h3>
          <motion.p
            animate={{ opacity: hovered ? 1 : 0.6 }}
            className="font-body text-xs tracking-[0.2em] uppercase text-muted-foreground mt-1"
          >
            {member.role}
          </motion.p>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function TeamSection() {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <section ref={ref} className="relative py-28 md:py-40 overflow-hidden bg-background">
      {/* Ambient background blurs */}
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-[10%] w-[350px] h-[350px] rounded-full bg-secondary/[0.05] blur-[120px] pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -25, 0], y: [0, 25, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-20 right-[10%] w-[300px] h-[300px] rounded-full bg-secondary/[0.04] blur-[100px] pointer-events-none"
      />

      <div className="container relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-20 md:mb-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div className="flex items-center justify-center gap-2 mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={isVisible ? { width: 40 } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="h-px bg-secondary/40"
              />
              <Sparkles className="w-4 h-4 text-secondary/60" />
              <motion.div
                initial={{ width: 0 }}
                animate={isVisible ? { width: 40 } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="h-px bg-secondary/40"
              />
            </motion.div>
            <p className="font-body text-muted-foreground tracking-[0.4em] uppercase text-[11px] mb-4">
              The Creatives
            </p>
            <h2 className="font-display text-5xl md:text-7xl font-bold text-foreground leading-[0.9]">
              Team
              <br />
              <span className="italic text-secondary">ShadowArts</span>
            </h2>
            <p className="font-body text-muted-foreground/60 text-sm mt-6 max-w-sm mx-auto">
              The passionate humans crafting every experience at Shadow Arts.
            </p>
          </motion.div>
        </div>

        {/* Zigzag layout */}
        <div className="relative max-w-6xl mx-auto">
          {/* Animated dashed connecting path */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block"
            viewBox="0 0 1000 520"
            preserveAspectRatio="none"
            fill="none"
          >
            <motion.path
              d="M 60 140 C 140 380, 220 400, 310 380 C 400 360, 420 140, 500 140 C 580 140, 600 380, 690 380 C 780 380, 860 140, 940 140"
              stroke="url(#curveGrad)"
              strokeWidth="1.5"
              strokeDasharray="6 8"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isVisible ? { pathLength: 1, opacity: 0.4 } : {}}
              transition={{ duration: 2.5, delay: 0.8, ease: "easeInOut" }}
            />
            <defs>
              <linearGradient id="curveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity="0.2" />
                <stop offset="50%" stopColor="hsl(var(--secondary))" stopOpacity="0.6" />
                <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0.2" />
              </linearGradient>
            </defs>
          </svg>

          {/* Top row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 relative z-10">
            {topRow.map((member, i) => (
              <MemberNode key={member.name} member={member} index={i} position="top" />
            ))}
          </div>

          {/* Bottom row — offset between top members */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-4 mt-10 md:-mt-4 relative z-10 md:px-[8%]">
            {bottomRow.map((member, i) => (
              <MemberNode key={member.name} member={member} index={i + topRow.length} position="bottom" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
