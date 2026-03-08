import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Palette, Brush, PenTool, Flower2, Star, Gem, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

import warliImg from "@/assets/art-warli.jpg";
import madhubaniImg from "@/assets/art-madhubani.jpg";
import kalamkariImg from "@/assets/art-kalamkari.jpg";
import mandalaImg from "@/assets/art-mandala.jpg";
import pichwaiImg from "@/assets/art-pichwai.jpg";
import gondImg from "@/assets/art-gond.jpg";

const programs = [
  { name: "Warli Art", desc: "Tribal art from Maharashtra using geometric patterns and daily life scenes.", icon: Palette, image: warliImg, color: "from-orange-900/80 to-red-900/80" },
  { name: "Madhubani", desc: "Vibrant folk art from Bihar with intricate patterns and mythological themes.", icon: Brush, image: madhubaniImg, color: "from-rose-900/80 to-pink-900/80" },
  { name: "Kalamkari", desc: "Ancient textile art using natural dyes and hand-painted mythological narratives.", icon: PenTool, image: kalamkariImg, color: "from-teal-900/80 to-cyan-900/80" },
  { name: "Mandala Art", desc: "Meditative circular designs symbolizing cosmic harmony and spiritual growth.", icon: Flower2, image: mandalaImg, color: "from-indigo-900/80 to-blue-900/80" },
  { name: "Pichwai", desc: "Devotional paintings from Rajasthan depicting Lord Krishna's tales.", icon: Star, image: pichwaiImg, color: "from-emerald-900/80 to-green-900/80" },
  { name: "Gond Art", desc: "Indigenous tribal art from Madhya Pradesh with dots, dashes, and nature motifs.", icon: Gem, image: gondImg, color: "from-amber-900/80 to-yellow-900/80" },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 60, rotateX: 15 },
  visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

export default function Programs() {
  return (
    <Layout>
      <section className="py-24 bg-background min-h-screen">
        <div className="container">
          {/* Hero header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.p
              initial={{ opacity: 0, letterSpacing: "0.1em" }}
              animate={{ opacity: 1, letterSpacing: "0.3em" }}
              transition={{ duration: 1, delay: 0.2 }}
              className="font-body text-secondary tracking-[0.3em] uppercase text-sm mb-3"
            >
              What We Teach
            </motion.p>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-4">
              Our Art Programs
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="font-body text-muted-foreground max-w-2xl mx-auto text-lg"
            >
              Dive deep into the rich heritage of Indian art forms. Each program is crafted
              to take you from beginner to confident artist.
            </motion.p>
          </motion.div>

          {/* Programs grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {programs.map((p) => (
              <motion.div
                key={p.name}
                variants={cardVariants}
                whileHover={{ y: -12, scale: 1.02 }}
                className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-500"
                style={{ perspective: 1000 }}
              >
                {/* Background image */}
                <div className="aspect-[4/5] relative">
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${p.color} opacity-70 group-hover:opacity-85 transition-opacity duration-500`} />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6">
                    <motion.div
                      initial={false}
                      className="transform group-hover:-translate-y-2 transition-transform duration-500"
                    >
                      <div className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center mb-4 group-hover:bg-secondary/30 transition-colors duration-300">
                        <p.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-display text-2xl font-bold text-white mb-2">{p.name}</h3>
                      <p className="font-body text-sm text-white/80 leading-relaxed mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-0">
                        {p.desc}
                      </p>
                      <div className="flex items-center gap-2 text-secondary font-body text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                        Explore <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-center mt-16"
          >
            <Link to="/workshops">
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-body text-lg px-10">
                Browse Workshops <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
