import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Heart, Eye, Users, Sparkles, ArrowRight,
  Instagram, Twitter, Facebook, Mail,
} from "lucide-react";

import aboutWorkshop from "@/assets/about-workshop.jpg";
import aboutHeroBg from "@/assets/about-hero-bg.jpeg";
import aboutHeroBg2 from "@/assets/about-hero-bg-2.jpeg";
import aboutHeroBg3 from "@/assets/hero-home-bg.jpeg";
import teamArunkumar from "@/assets/team-arunkumar.png";
import teamChandhana from "@/assets/team-chandhana.png";
import mouCbit from "@/assets/mou-cbit.png";
import mouPidilite from "@/assets/mou-pidilite.png";
import mouVaagdevi from "@/assets/mou-vaagdevi.png";
import mouSrUniversity from "@/assets/mou-sr-university.png";

/* ── Data from the GitHub repo ── */

const teamMembers = [
  { name: "Arunkumar Parkala", role: "Founder & CEO", image: teamArunkumar },
  { name: "Chandhana", role: "Chief Creative Officer & Managing Director", image: teamChandhana },
];

const mouPartners = [
  { name: "Chaitanya Bharathi Institute of Technology", image: mouCbit },
  { name: "Pidilite", image: mouPidilite },
  { name: "Vaagdevi College of Engineering", image: mouVaagdevi },
  { name: "SR University", image: mouSrUniversity },
];

const values = [
  { icon: Eye, title: "Vision", desc: "To redefine boundaries of artistic expression through the convergence of light, shadow, and creativity." },
  { icon: Heart, title: "Passion", desc: "A deep love for art that drives us to curate and showcase unique perspectives from artists worldwide." },
  { icon: Users, title: "Community", desc: "Building a vibrant online community where artists and enthusiasts connect and appreciate the beauty of shadows in art." },
  { icon: Sparkles, title: "Innovation", desc: "Pushing the limits of contemporary art by exploring new mediums, techniques, and digital experiences." },
];

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "Gallery", to: "/programs" },
  { label: "Exhibitions", to: "/workshops" },
];

const resources = [
  { label: "For Artists", to: "/workshops" },
  { label: "For Collectors", to: "/shop" },
  { label: "Press Kit", to: "/contact" },
];

/* ── Animation helpers ── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay },
});

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function About() {
  const { ref: storyRef, isVisible: storyVisible } = useScrollReveal(0.2);
  const { ref: artistsRef, isVisible: artistsVisible } = useScrollReveal(0.15);
  const { ref: valuesRef, isVisible: valuesVisible } = useScrollReveal(0.15);
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollReveal(0.2);

  return (
    <Layout>
      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative min-h-[70vh] flex items-center bg-primary overflow-hidden">
        <div className="absolute inset-0">
          <img src={aboutHeroBg2} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ animation: 'heroFade 8s ease-in-out infinite', opacity: 0 }} />
          <img src={aboutHeroBg3} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ animation: 'heroFade 8s ease-in-out 4s infinite', opacity: 0 }} />
        </div>
        <div className="absolute inset-0 bg-primary/50" />
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 w-72 h-72 border border-primary-foreground rounded-full" />
          <div className="absolute bottom-10 left-16 w-56 h-56 border border-primary-foreground rounded-full" />
          <div className="absolute top-1/3 left-2/3 w-40 h-40 border border-primary-foreground rounded-full" />
        </div>
        <div className="container relative z-10 py-20">
          <motion.p {...fadeUp()} className="font-body text-secondary tracking-[0.3em] uppercase text-sm mb-6">
            Who We Are
          </motion.p>
          <motion.h1 {...fadeUp(0.15)} className="font-display text-5xl md:text-7xl font-bold text-primary-foreground leading-[1.1] mb-6">
            About <span className="text-secondary italic">Shadow Arts</span>
          </motion.h1>
          <motion.p {...fadeUp(0.3)} className="font-body text-lg md:text-xl text-primary-foreground/70 max-w-2xl leading-relaxed mb-8">
            Shadow Arts explores the convergence of light, shadow, and creativity
            through various forms of artistic expression. Our mission is to provide
            a platform for artists to showcase their unique perspectives and redefine
            boundaries.
          </motion.p>
          <motion.p {...fadeUp(0.4)} className="font-body text-sm text-primary-foreground/40 tracking-widest uppercase">
            Exploring the interplay of light and darkness through contemporary art since 2020.
          </motion.p>
        </div>
      </section>

      {/* ═══════════════ OUR STORY + IMAGE ═══════════════ */}
      <section ref={storyRef} className="py-24 bg-background overflow-hidden">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={storyVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <p className="font-body text-secondary tracking-[0.3em] uppercase text-sm mb-4">Our Journey</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-8">Our Story</h2>
              <div className="space-y-5">
                <p className="font-body text-lg text-muted-foreground leading-relaxed">
                  Founded in 2025, Shadow Arts started as a small exhibition space but
                  quickly grew into an online community where artists and enthusiasts
                  could connect and appreciate the beauty of shadows in art.
                </p>
                <p className="font-body text-lg text-muted-foreground leading-relaxed">
                  What began as an intimate gallery celebrating the interplay of light
                  and darkness has evolved into a comprehensive platform — offering
                  immersive workshops, handcrafted artwork from master artisans, and
                  curated programs that preserve and celebrate India's rich cultural
                  heritage through traditional art forms.
                </p>
                <p className="font-body text-lg text-muted-foreground leading-relaxed">
                  Today, Shadow Arts bridges the gap between ancient artistic traditions
                  and contemporary expression, making these timeless art forms accessible
                  to a new generation of creators and collectors.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={storyVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img src={aboutWorkshop} alt="Shadow Arts workshop" className="w-full h-[420px] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="font-display text-2xl text-primary-foreground font-semibold">Where Shadows Come to Life</p>
                  <p className="font-body text-sm text-primary-foreground/70 mt-1">Our studio, est. 2020</p>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 border-2 border-secondary/30 rounded-2xl -z-10" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 border-2 border-secondary/20 rounded-2xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURED ARTISTS ═══════════════ */}
      <section ref={artistsRef} className="py-24 bg-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={artistsVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="font-body text-secondary tracking-[0.3em] uppercase text-sm mb-4">The People Behind Shadow Arts</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">Team ShadowArts</h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={artistsVisible ? "show" : "hidden"}
            className="grid md:grid-cols-2 gap-10 max-w-2xl mx-auto"
          >
            {teamMembers.map((a) => (
              <motion.div key={a.name} variants={staggerItem} className="text-center group">
                <div className="relative w-40 h-40 mx-auto mb-6">
                  <img
                    src={a.image}
                    alt={a.name}
                    className="w-full h-full rounded-full object-cover border-4 border-secondary/30 group-hover:border-secondary transition-colors duration-300"
                  />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-1">{a.name}</h3>
                <p className="font-body text-sm text-muted-foreground">{a.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* ═══════════════ MOU PARTNERS ═══════════════ */}
      <section className="py-24 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="font-body text-secondary tracking-[0.3em] uppercase text-sm mb-4">Our Partners</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">MOUs & Collaborations</h2>
            <p className="font-body text-muted-foreground mt-4 max-w-2xl mx-auto">
              We are proud to collaborate with leading institutions and organizations to promote art education and cultural heritage.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {mouPartners.map((partner, i) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-background rounded-2xl p-6 flex flex-col items-center text-center shadow-md hover:shadow-lg transition-shadow group"
              >
                <div className="w-28 h-28 mb-4 flex items-center justify-center rounded-xl bg-white p-2">
                  <img
                    src={partner.image}
                    alt={partner.name}
                    className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-display text-sm font-semibold text-foreground leading-tight">{partner.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ VALUES ═══════════════ */}
      <section ref={valuesRef} className="py-24 bg-primary">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={valuesVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="font-body text-secondary tracking-[0.3em] uppercase text-sm mb-4">What Drives Us</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground">Our Values</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                animate={valuesVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center group"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-secondary/20 flex items-center justify-center group-hover:bg-secondary/30 transition-colors">
                  <v.icon className="h-7 w-7 text-secondary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-primary-foreground mb-3">{v.title}</h3>
                <p className="font-body text-sm text-primary-foreground/60 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ QUICK LINKS + RESOURCES (from repo footer) ═══════════════ */}
      <section className="py-16 bg-primary/95">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <h3 className="font-display text-lg font-semibold text-primary-foreground mb-4">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="font-body text-sm text-primary-foreground/60 hover:text-secondary transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-primary-foreground mb-4">Resources</h3>
              <ul className="space-y-3">
                {resources.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="font-body text-sm text-primary-foreground/60 hover:text-secondary transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-primary-foreground mb-4">Follow Us</h3>
              <div className="flex gap-4">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary hover:bg-secondary/30 transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary hover:bg-secondary/30 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary hover:bg-secondary/30 transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ CONTACT CTA (from repo) ═══════════════ */}
      <section ref={ctaRef} className="py-24 bg-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={ctaVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto text-center"
          >
            <p className="font-body text-secondary tracking-[0.3em] uppercase text-sm mb-4">Get In Touch</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
              Have Questions? Let's Talk.
            </h2>
            <p className="font-body text-lg text-muted-foreground leading-relaxed mb-4">
              Interested in collaborating? Want to exhibit your work? Reach out to us!
            </p>
            <p className="font-body text-muted-foreground mb-10">
              We believe every shadow tells a story, every brushstroke carries a legacy, and every art form deserves to be preserved, celebrated, and shared with the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-body group px-8">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Message
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/shop">
                <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-muted font-body px-8">
                  Shop Art
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
