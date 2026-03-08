import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Heart, Sun, Award, ArrowRight, Sparkles, Palette, Users, BookOpen, Leaf, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

import womenImg from "@/assets/program-women-workshop.jpg";
import summerImg from "@/assets/program-summer-camp.jpg";
import professionalImg from "@/assets/program-professional.jpg";

const programs = [
  {
    title: "Mindful Creative Women Workshop",
    subtitle: "Art · Culture · Wellness",
    image: womenImg,
    color: "from-rose-900/80 to-amber-900/70",
    icon: Heart,
    accent: "bg-rose-500/20 text-rose-300",
    description:
      "Reconnect with India's rich artistic heritage through mindful creation. Our women-exclusive workshops blend traditional art forms — Madhubani, Warli, Kalamkari — with meditative practices, helping you craft beautiful handmade products while nurturing inner peace.",
    highlights: [
      { icon: Palette, text: "Learn traditional techniques like block printing, natural dyeing & hand painting" },
      { icon: Leaf, text: "Mindfulness-based sessions to reduce stress through creative expression" },
      { icon: Sparkles, text: "Create handcrafted products — scarves, wall art, home décor & gifts" },
      { icon: Users, text: "A supportive community of women celebrating culture & creativity" },
    ],
  },
  {
    title: "Bright Minds Summer Camp",
    subtitle: "For Children · Ages 6–14",
    image: summerImg,
    color: "from-amber-900/80 to-orange-900/70",
    icon: Sun,
    accent: "bg-amber-500/20 text-amber-300",
    description:
      "A vibrant summer experience where young minds explore India's incredible art traditions! From painting mythological stories in Madhubani style to creating tribal patterns in Warli, kids build confidence, creativity, and cultural pride — all while having the time of their lives.",
    highlights: [
      { icon: Palette, text: "Hands-on projects in Warli, Gond, Mandala & more traditional art forms" },
      { icon: Star, text: "Fun storytelling sessions connecting art to India's rich mythology" },
      { icon: Users, text: "Group activities, art exhibitions & creative challenges" },
      { icon: BookOpen, text: "Take-home art portfolio and certificate of completion" },
    ],
  },
  {
    title: "Professional Art Courses",
    subtitle: "Certification · Career Track",
    image: professionalImg,
    color: "from-slate-900/80 to-stone-900/70",
    icon: Award,
    accent: "bg-emerald-500/20 text-emerald-300",
    description:
      "Elevate your artistry with in-depth professional courses designed for serious practitioners. Master advanced techniques in Pichwai, Kalamkari, Tanjore, and contemporary Indian fusion art — and build a portfolio that opens doors to exhibitions, commissions, and creative careers.",
    highlights: [
      { icon: BookOpen, text: "Structured curriculum from fundamentals to exhibition-ready mastery" },
      { icon: Award, text: "Industry-recognized certification upon course completion" },
      { icon: Sparkles, text: "Mentorship from renowned traditional and contemporary artists" },
      { icon: Palette, text: "Portfolio development, gallery exposure & career guidance" },
    ],
  },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 80 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function Programs() {
  return (
    <Layout>
      {/* Hero header */}
      <section className="py-24 bg-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <motion.p
              initial={{ opacity: 0, letterSpacing: "0.1em" }}
              animate={{ opacity: 1, letterSpacing: "0.3em" }}
              transition={{ duration: 1, delay: 0.2 }}
              className="font-body text-secondary tracking-[0.3em] uppercase text-sm mb-3"
            >
              What We Offer
            </motion.p>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-4">
              Our Programs
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="font-body text-muted-foreground max-w-2xl mx-auto text-lg"
            >
              Discover art programs designed for every age and aspiration — from mindful
              creativity to professional mastery.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Program Sections */}
      {programs.map((program, index) => {
        const isReversed = index % 2 !== 0;
        return (
          <section
            key={program.title}
            className={`py-20 ${index % 2 === 0 ? "bg-background" : "bg-muted/30"}`}
          >
            <div className="container">
              <motion.div
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
                  isReversed ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Image */}
                <motion.div
                  className={`relative ${isReversed ? "lg:order-2" : ""}`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                    <motion.img
                      src={program.image}
                      alt={program.title}
                      loading="lazy"
                      className="w-full aspect-[4/3] object-cover"
                      initial={{ scale: 1.1 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${program.color} opacity-40 group-hover:opacity-50 transition-opacity duration-500`}
                    />
                    {/* Floating badge */}
                    <motion.div
                      className={`absolute top-5 left-5 ${program.accent} backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2 text-sm font-body font-semibold`}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      <program.icon className="h-4 w-4" />
                      {program.subtitle}
                    </motion.div>
                  </div>

                  {/* Decorative element */}
                  <motion.div
                    className="absolute -bottom-4 -right-4 w-24 h-24 rounded-2xl bg-secondary/10 -z-10"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  />
                  <motion.div
                    className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-secondary/5 -z-10"
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                  />
                </motion.div>

                {/* Content */}
                <div className={isReversed ? "lg:order-1" : ""}>
                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                  >
                    <motion.div variants={itemVariants}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                          <program.icon className="h-6 w-6 text-secondary" />
                        </div>
                        <span className="font-body text-secondary text-sm tracking-wider uppercase font-semibold">
                          {program.subtitle}
                        </span>
                      </div>
                    </motion.div>

                    <motion.h2
                      variants={itemVariants}
                      className="font-display text-3xl md:text-4xl font-bold text-foreground mb-5 leading-tight"
                    >
                      {program.title}
                    </motion.h2>

                    <motion.p
                      variants={itemVariants}
                      className="font-body text-muted-foreground leading-relaxed mb-8 text-base"
                    >
                      {program.description}
                    </motion.p>

                    {/* Highlights */}
                    <motion.div variants={staggerContainer} className="space-y-4 mb-8">
                      {program.highlights.map((h) => (
                        <motion.div
                          key={h.text}
                          variants={itemVariants}
                          className="flex items-start gap-3 group/item"
                        >
                          <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0 group-hover/item:bg-secondary/20 transition-colors">
                            <h.icon className="h-4 w-4 text-secondary" />
                          </div>
                          <p className="font-body text-sm text-muted-foreground leading-relaxed pt-1.5">
                            {h.text}
                          </p>
                        </motion.div>
                      ))}
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <Link to="/workshops">
                        <Button
                          size="lg"
                          className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-body gap-2"
                        >
                          Explore Workshops <ArrowRight className="h-5 w-5" />
                        </Button>
                      </Link>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </section>
        );
      })}

      {/* Bottom CTA */}
      <section className="py-20 bg-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <Sparkles className="h-8 w-8 text-secondary mx-auto mb-4" />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Begin Your Journey?
            </h2>
            <p className="font-body text-muted-foreground mb-8">
              Whether you're seeking mindful creativity, inspiring your child, or building a
              professional art career — we have the perfect program for you.
            </p>
            <Link to="/contact">
              <Button
                size="lg"
                variant="outline"
                className="font-body gap-2 border-secondary text-secondary hover:bg-secondary/10"
              >
                Get in Touch <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
