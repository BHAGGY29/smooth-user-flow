import { motion, AnimatePresence } from "framer-motion";
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
    funFact: "Believes every shadow tells a story. Started Shadow Arts from a single workshop in 2020.",
    socials: { instagram: "#", youtube: "#", whatsapp: "#" },
  },
  {
    name: "Chandhana",
    role: "Co-Founder & CCO",
    image: teamChandhana,
    funFact: "The creative force behind every visual identity. Turns chaos into breathtaking art.",
    socials: { instagram: "#", whatsapp: "#" },
  },
  {
    name: "Varshitha",
    role: "Creative Head",
    image: teamVarshitha,
    funFact: "Can sketch your portrait in under 3 minutes. Lives and breathes color theory.",
    socials: { instagram: "#" },
  },
  {
    name: "Sushmitha",
    role: "Workshop Community Head",
    image: teamSushmitha,
    funFact: "Has organized 200+ workshops. Her energy is contagious in every session.",
    socials: { instagram: "#", whatsapp: "#" },
  },
  {
    name: "Sangem Aravind Reddy",
    role: "Technical Head",
    image: teamAravind,
    objectPosition: "top",
    funFact: "The tech wizard who bridges art and code. Builds the digital backbone of Shadow Arts.",
    socials: { instagram: "#", youtube: "#" },
  },
  {
    name: "Bhagath Vallala",
    role: "R&D Engineer",
    image: teamBhagath,
    objectPosition: "top",
    funFact: "Always experimenting with new mediums. If it exists, he's tried to make art with it.",
    socials: { instagram: "#" },
  },
  {
    name: "Srinivas",
    role: "UI/UX Designer & Developer",
    image: teamSrinivas,
    funFact: "Obsessed with pixel-perfect designs. Bridges the gap between beautiful interfaces and flawless code.",
    socials: { instagram: "#" },
  },
];

function MemberCard({ member, index }: { member: TeamMember; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative cursor-pointer"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
        {/* Image — grayscale by default, color on hover */}
        <motion.img
          src={member.image}
          alt={member.name}
          style={member.objectPosition ? { objectPosition: member.objectPosition } : undefined}
          className="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out"
          animate={{
            filter: hovered ? "grayscale(0%)" : "grayscale(100%)",
            scale: hovered ? 1.05 : 1,
          }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Dark overlay that intensifies on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"
          animate={{ opacity: hovered ? 1 : 0.4 }}
          transition={{ duration: 0.4 }}
        />

        {/* Index number — faint watermark */}
        <span className="absolute top-4 right-5 font-display text-6xl font-bold text-white/[0.06] select-none leading-none">
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Bottom content — always visible name/role, slide-in bio on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 flex flex-col">
          {/* Name & Role — always visible */}
          <motion.div
            animate={{ y: hovered ? -8 : 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <h3 className="font-display text-lg md:text-xl font-bold text-white leading-tight">
              {member.name}
            </h3>
            <p className="text-xs tracking-[0.2em] uppercase text-secondary mt-1">
              {member.role}
            </p>
          </motion.div>

          {/* Fun fact — slides up on hover */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, y: 20, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: 10, height: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="w-8 h-px bg-secondary/60 mt-3 mb-3" />
                <p className="font-body text-sm text-white/70 leading-relaxed">
                  {member.funFact}
                </p>

                {/* Social icons */}
                {member.socials && (
                  <div className="flex items-center gap-3 mt-4">
                    {member.socials.instagram && (
                      <a
                        href={member.socials.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/80 hover:bg-secondary hover:text-primary transition-all duration-300"
                      >
                        <Instagram className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {member.socials.youtube && (
                      <a
                        href={member.socials.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/80 hover:bg-secondary hover:text-primary transition-all duration-300"
                      >
                        <Youtube className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {member.socials.whatsapp && (
                      <a
                        href={member.socials.whatsapp}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white/80 hover:bg-secondary hover:text-primary transition-all duration-300"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default function TeamSection() {
  const { ref, isVisible } = useScrollReveal(0.1);

  return (
    <section ref={ref} className="relative py-28 md:py-36 overflow-hidden bg-primary">
      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--secondary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--secondary)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="container relative z-10">
        {/* Section header */}
        <div className="max-w-2xl mx-auto text-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="font-body text-secondary/70 tracking-[0.35em] uppercase text-[11px] mb-4">
              The People
            </p>
            <h2 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground leading-[0.95]">
              Meet the <span className="italic text-secondary">Team</span>
            </h2>
            <p className="font-body text-primary-foreground/50 text-sm mt-5 max-w-md mx-auto">
              Hover to discover the humans behind Shadow Arts.
            </p>
          </motion.div>
        </div>

        {/* Grid — 2 cols on mobile, 3 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
          {teamMembers.map((member, i) => (
            <MemberCard key={member.name} member={member} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
