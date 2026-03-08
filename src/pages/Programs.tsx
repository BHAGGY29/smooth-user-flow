import Layout from "@/components/layout/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Brush, PenTool, Flower2, Star, Gem, ArrowRight, X, MapPin, Clock, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import warliImg from "@/assets/art-warli.jpg";
import madhubaniImg from "@/assets/art-madhubani.jpg";
import kalamkariImg from "@/assets/art-kalamkari.jpg";
import mandalaImg from "@/assets/art-mandala.jpg";
import pichwaiImg from "@/assets/art-pichwai.jpg";
import gondImg from "@/assets/art-gond.jpg";

const programs = [
  {
    name: "Warli Art", desc: "Tribal art from Maharashtra using geometric patterns and daily life scenes.", icon: Palette, image: warliImg, color: "from-orange-900/80 to-red-900/80",
    origin: "Maharashtra, India",
    history: "Warli art dates back to 2500–3000 BCE, making it one of the oldest art forms in India. Practiced by the Warli tribe of the Sahyadri mountains, it uses simple geometric shapes — circles, triangles, and squares — to depict daily life, harvests, and celebrations.",
    techniques: ["Geometric patterns using rice paste", "Bamboo stick brushwork", "Natural earth pigments", "White on mud-brown base"],
    funFact: "Warli paintings were traditionally done only by married women during wedding ceremonies."
  },
  {
    name: "Madhubani", desc: "Vibrant folk art from Bihar with intricate patterns and mythological themes.", icon: Brush, image: madhubaniImg, color: "from-rose-900/80 to-pink-900/80",
    origin: "Mithila region, Bihar",
    history: "Madhubani painting originated in the Mithila region of Bihar and Nepal. Legend says King Janaka commissioned artists to create paintings for his daughter Sita's wedding to Lord Rama. The art form has been passed down through generations of women.",
    techniques: ["Finger & twig brushwork", "Natural dyes from plants", "Double-line border technique", "No empty space philosophy"],
    funFact: "In 2012, the Indian government painted Madhubani art on walls to prevent defacement of public property — and it worked!"
  },
  {
    name: "Kalamkari", desc: "Ancient textile art using natural dyes and hand-painted mythological narratives.", icon: PenTool, image: kalamkariImg, color: "from-teal-900/80 to-cyan-900/80",
    origin: "Andhra Pradesh",
    history: "Kalamkari literally means 'pen work' (kalam = pen, kari = work). This 3000-year-old art form was patronized by the Mughals and later the Golconda sultanate. Artists use a bamboo reed pen to paint elaborate mythological scenes on fabric.",
    techniques: ["Bamboo reed pen drawing", "23-step natural dyeing process", "Vegetable & mineral dyes", "Hand-block printing variant"],
    funFact: "A single Kalamkari piece can take weeks to complete due to the 23-step process of washing, dyeing, and painting."
  },
  {
    name: "Mandala Art", desc: "Meditative circular designs symbolizing cosmic harmony and spiritual growth.", icon: Flower2, image: mandalaImg, color: "from-indigo-900/80 to-blue-900/80",
    origin: "Pan-Indian tradition",
    history: "Mandala means 'circle' in Sanskrit and represents the universe in Hindu and Buddhist symbolism. These intricate circular patterns have been used for meditation and spiritual practice for thousands of years across Indian temples and manuscripts.",
    techniques: ["Compass-guided symmetry", "Dot-work precision", "Layered concentric patterns", "Metallic & vivid color palettes"],
    funFact: "Carl Jung introduced mandalas to Western psychology, using them as therapeutic tools for self-discovery."
  },
  {
    name: "Pichwai", desc: "Devotional paintings from Rajasthan depicting Lord Krishna's tales.", icon: Star, image: pichwaiImg, color: "from-emerald-900/80 to-green-900/80",
    origin: "Nathdwara, Rajasthan",
    history: "Pichwai paintings hang behind the deity of Shrinathji (Lord Krishna) in the Nathdwara temple. Created by the followers of Vallabhacharya in the 17th century, each painting corresponds to a festival or season, depicting Krishna's life and moods.",
    techniques: ["Intricate brushwork on cloth", "Natural stone pigments", "Gold & silver leaf detailing", "Large-scale devotional compositions"],
    funFact: "Pichwai paintings change with seasons and festivals — the temple has different paintings for each occasion throughout the year."
  },
  {
    name: "Gond Art", desc: "Indigenous tribal art from Madhya Pradesh with dots, dashes, and nature motifs.", icon: Gem, image: gondImg, color: "from-amber-900/80 to-yellow-900/80",
    origin: "Madhya Pradesh",
    history: "Gond art comes from one of India's largest tribal communities, the Gonds of central India. The word 'Gond' comes from 'Kond' meaning green mountains. Their art transforms everyday scenes and nature into vibrant, pattern-filled masterpieces.",
    techniques: ["Dots & dashes fill patterns", "Bright acrylic colors", "Nature-inspired motifs", "Story-telling through imagery"],
    funFact: "Gond artist Jangarh Singh Shyam was discovered by artist J. Swaminathan and went on to exhibit at galleries worldwide."
  },
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
  const [selectedProgram, setSelectedProgram] = useState<number | null>(null);

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
            {programs.map((p, i) => (
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
                      <button
                        onClick={() => setSelectedProgram(i)}
                        className="flex items-center gap-2 text-secondary font-body text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 hover:gap-3"
                      >
                        Explore <ArrowRight className="h-4 w-4" />
                      </button>
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

      {/* Art Detail Modal */}
      <AnimatePresence>
        {selectedProgram !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 md:p-8 overflow-y-auto"
            onClick={() => setSelectedProgram(null)}
          >
            <motion.button
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10"
              whileHover={{ scale: 1.1, rotate: 90 }}
              onClick={() => setSelectedProgram(null)}
            >
              <X className="h-8 w-8" />
            </motion.button>

            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 40 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative max-w-4xl w-full rounded-2xl overflow-hidden shadow-2xl my-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Hero image */}
              <div className="relative h-64 md:h-80 overflow-hidden">
                <img
                  src={programs[selectedProgram].image}
                  alt={programs[selectedProgram].name}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${programs[selectedProgram].color} opacity-80`} />
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                      {(() => { const Icon = programs[selectedProgram].icon; return <Icon className="h-7 w-7 text-white" />; })()}
                    </div>
                    <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-2">
                      {programs[selectedProgram].name}
                    </h2>
                    <div className="flex items-center gap-2 text-white/80 font-body text-sm">
                      <MapPin className="h-4 w-4" /> {programs[selectedProgram].origin}
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Content */}
              <div className="bg-card p-6 md:p-8 space-y-6">
                {/* History */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="h-5 w-5 text-secondary" />
                    <h3 className="font-display text-xl font-bold text-foreground">History & Origins</h3>
                  </div>
                  <p className="font-body text-muted-foreground leading-relaxed">
                    {programs[selectedProgram].history}
                  </p>
                </motion.div>

                {/* Techniques */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Brush className="h-5 w-5 text-secondary" />
                    <h3 className="font-display text-xl font-bold text-foreground">Key Techniques</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {programs[selectedProgram].techniques.map((t) => (
                      <div key={t} className="flex items-center gap-2 font-body text-sm text-muted-foreground bg-muted/50 rounded-lg px-4 py-2.5">
                        <span className="w-2 h-2 rounded-full bg-secondary shrink-0" />
                        {t}
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Fun fact */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-secondary/10 border border-secondary/20 rounded-xl p-5"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-secondary" />
                    <h3 className="font-display text-lg font-bold text-foreground">Did You Know?</h3>
                  </div>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">
                    {programs[selectedProgram].funFact}
                  </p>
                </motion.div>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="pt-2"
                >
                  <Link to="/workshops" onClick={() => setSelectedProgram(null)}>
                    <Button size="lg" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-body gap-2">
                      Find {programs[selectedProgram].name} Workshops <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
