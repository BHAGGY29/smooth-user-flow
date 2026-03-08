import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useState } from "react";
import { Instagram, Youtube, MessageCircle } from "lucide-react";

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
  objectPosition?: string;
  socials?: {
    instagram?: string;
    youtube?: string;
    whatsapp?: string;
  };
}

const teamMembers: TeamMember[] = [
  {
    name: "Arunkumar Parkala",
    role: "Founder & CEO",
    image: teamArunkumar,
    funFact: "Started Shadow Arts from a single workshop in 2020.",
    socials: { instagram: "#", youtube: "#", whatsapp: "#" },
  },
  {
    name: "Chandhana",
    role: "Co-Founder & CCO",
    image: teamChandhana,
    funFact: "The creative force behind every visual identity.",
    socials: { instagram: "#", whatsapp: "#" },
  },
  {
    name: "Varshitha",
    role: "Creative Head",
    image: teamVarshitha,
    funFact: "Can sketch your portrait in under 3 minutes.",
    socials: { instagram: "#" },
  },
  {
    name: "Sushmitha",
    role: "Workshop Community Head",
    image: teamSushmitha,
    funFact: "Has organized 200+ workshops across India.",
    socials: { instagram: "#", whatsapp: "#" },
  },
  {
    name: "Sangem Aravind Reddy",
    role: "Technical Head",
    image: teamAravind,
    objectPosition: "top",
    funFact: "Bridges art and code — the digital backbone.",
    socials: { instagram: "#", youtube: "#" },
  },
  {
    name: "Bhagath Vallala",
    role: "R&D Engineer",
    image: teamBhagath,
    objectPosition: "top",
    funFact: "If it exists, he's tried to make art with it.",
    socials: { instagram: "#" },
  },
  {
    name: "Srinivas",
    role: "UI/UX Designer & Developer",
    image: teamSrinivas,
    funFact: "Pixel-perfect designs meet flawless code.",
    socials: { instagram: "#" },
  },
];

function SocialIcon({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-8 h-8 rounded-full bg-primary/80 backdrop-blur-sm flex items-center justify-center text-primary-foreground/70 hover:bg-secondary hover:text-primary transition-all duration-300 hover:scale-110"
    >
      {children}
    </a>
  );
}

function MemberCircle({ member, index }: { member: TeamMember; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.85 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex flex-col items-center group cursor-pointer"
    >
      {/* Circular photo container */}
      <div className="relative w-36 h-36 md:w-44 md:h-44 lg:w-52 lg:h-52 rounded-full">
        {/* Animated ring */}
        <motion.div
          animate={{
            scale: hovered ? 1.04 : 1,
            opacity: hovered ? 1 : 0,
          }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="absolute -inset-1.5 rounded-full border-2 border-secondary/50"
        />

        {/* Outer glow */}
        <motion.div
          animate={{ opacity: hovered ? 0.6 : 0, scale: hovered ? 1.1 : 1 }}
          transition={{ duration: 0.6 }}
          className="absolute -inset-4 rounded-full bg-secondary/10 blur-xl pointer-events-none"
        />

        {/* Image wrapper */}
        <div className="relative w-full h-full rounded-full overflow-hidden bg-muted">
          {/* Main photo */}
          <motion.img
            src={member.image}
            alt={member.name}
            style={member.objectPosition ? { objectPosition: member.objectPosition } : undefined}
            className="w-full h-full object-cover"
            animate={{
              scale: hovered ? 1.12 : 1,
              filter: hovered ? "grayscale(0%) brightness(1.05)" : "grayscale(30%) brightness(0.95)",
            }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Crossfade overlay — role & fun fact */}
          <motion.div
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute inset-0 rounded-full bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-center justify-end pb-6 md:pb-8"
          >
            <p className="font-body text-[10px] md:text-xs text-white/80 text-center px-6 leading-relaxed max-w-[80%]">
              {member.funFact}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Name — always visible */}
      <motion.h3
        animate={{ y: hovered ? 2 : 0 }}
        transition={{ duration: 0.3 }}
        className="font-display text-base md:text-lg font-bold text-primary-foreground mt-5 text-center leading-tight"
      >
        {member.name}
      </motion.h3>

      {/* Role — crossfades to social icons on hover */}
      <div className="relative h-8 mt-1.5 flex items-center justify-center">
        {/* Role text */}
        <motion.p
          animate={{ opacity: hovered ? 0 : 1, y: hovered ? -6 : 0 }}
          transition={{ duration: 0.25 }}
          className="font-body text-xs tracking-[0.15em] uppercase text-secondary/70 absolute"
        >
          {member.role}
        </motion.p>

        {/* Social icons — crossfade in */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6 }}
          transition={{ duration: 0.3, delay: hovered ? 0.1 : 0 }}
          className="flex items-center gap-2 absolute"
        >
          {member.socials?.instagram && (
            <SocialIcon href={member.socials.instagram}>
              <Instagram className="w-3.5 h-3.5" />
            </SocialIcon>
          )}
          {member.socials?.youtube && (
            <SocialIcon href={member.socials.youtube}>
              <Youtube className="w-3.5 h-3.5" />
            </SocialIcon>
          )}
          {member.socials?.whatsapp && (
            <SocialIcon href={member.socials.whatsapp}>
              <MessageCircle className="w-3.5 h-3.5" />
            </SocialIcon>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function TeamSection() {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <section ref={ref} className="relative py-28 md:py-36 overflow-hidden bg-primary">
      {/* Subtle radial texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--secondary)) 0.5px, transparent 0)`,
        backgroundSize: "36px 36px",
      }} />

      <div className="container relative z-10">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-body text-secondary/60 tracking-[0.35em] uppercase text-[11px] mb-3">
              The People
            </p>
            <h2 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground leading-[0.95]">
              Meet the <span className="italic text-secondary">Team</span>
            </h2>
          </motion.div>
        </div>

        {/* Leaders row — larger circles */}
        <div className="flex flex-wrap justify-center gap-10 md:gap-16 lg:gap-20 mb-14 md:mb-20">
          {teamMembers.slice(0, 2).map((member, i) => (
            <MemberCircle key={member.name} member={member} index={i} />
          ))}
        </div>

        {/* Core team — smaller circles, tighter grid */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-12 lg:gap-14">
          {teamMembers.slice(2).map((member, i) => (
            <MemberCircle key={member.name} member={member} index={i + 2} />
          ))}
        </div>
      </div>
    </section>
  );
}
