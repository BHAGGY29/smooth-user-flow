import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type VideoTestimonial = {
  id: string;
  name: string;
  role: string;
  thumbnailUrl: string;
  videoUrl: string;
};

// Replace these with your actual YouTube/Vimeo video URLs and thumbnails
const videoTestimonials: VideoTestimonial[] = [
  {
    id: "1",
    name: "Priya Sharma",
    role: "Mandala Art Enthusiast",
    thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: "2",
    name: "Ravi Kumar",
    role: "Warli Art Student",
    thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: "3",
    name: "Anita Desai",
    role: "Kalamkari Workshop Graduate",
    thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: "4",
    name: "Vikram Patel",
    role: "Summer Camp Parent",
    thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: "5",
    name: "Meera Nair",
    role: "Women's Empowerment Batch",
    thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
];

function getEmbedUrl(url: string): string {
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;

  // Vimeo
  const vimeoMatch = url.match(/(?:vimeo\.com\/)(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;

  return url;
}

export default function VideoTestimonialsSection() {
  const { ref, isVisible } = useScrollReveal();
  const [activeVideo, setActiveVideo] = useState<VideoTestimonial | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const visibleCount = 3;
  const maxIndex = Math.max(0, videoTestimonials.length - visibleCount);

  const prev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const next = () => setCurrentIndex((i) => Math.min(maxIndex, i + 1));

  return (
    <>
      <section ref={ref} className="py-24 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="font-body text-secondary tracking-[0.3em] uppercase text-sm mb-3">
              Video Testimonials
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
              Hear It from Them
            </h2>
          </motion.div>

          <div className="relative">
            {/* Navigation arrows */}
            <Button
              variant="outline"
              size="icon"
              onClick={prev}
              disabled={currentIndex === 0}
              className="absolute -left-4 md:-left-6 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm border-border shadow-md"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={next}
              disabled={currentIndex >= maxIndex}
              className="absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm border-border shadow-md"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>

            <div className="overflow-hidden">
              <motion.div
                className="flex gap-6"
                animate={{ x: `-${currentIndex * (100 / visibleCount + 2)}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {videoTestimonials.map((video, i) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="min-w-[calc(33.333%-1rem)] flex-shrink-0 max-md:min-w-[calc(100%-1rem)]"
                  >
                    <div
                      className="group relative rounded-xl overflow-hidden border border-border bg-card cursor-pointer"
                      onClick={() => setActiveVideo(video)}
                    >
                      <div className="aspect-video relative">
                        <img
                          src={video.thumbnailUrl}
                          alt={`${video.name} testimonial`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-foreground/30 flex items-center justify-center transition-colors group-hover:bg-foreground/40">
                          <div className="h-16 w-16 rounded-full bg-secondary/90 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                            <Play className="h-7 w-7 text-secondary-foreground ml-1" fill="currentColor" />
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="font-display font-semibold text-foreground">{video.name}</p>
                        <p className="font-body text-sm text-muted-foreground">{video.role}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentIndex ? "w-8 bg-secondary" : "w-2 bg-border"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/80 backdrop-blur-sm p-4"
            onClick={() => setActiveVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl aspect-video rounded-xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="outline"
                size="icon"
                onClick={() => setActiveVideo(null)}
                className="absolute -top-12 right-0 h-10 w-10 rounded-full bg-background/20 border-none text-background hover:bg-background/40 z-10"
              >
                <X className="h-5 w-5" />
              </Button>
              <iframe
                src={getEmbedUrl(activeVideo.videoUrl)}
                title={`${activeVideo.name} testimonial`}
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
