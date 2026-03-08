import { motion } from "framer-motion";
import { MapPin, Calendar, Users, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";

import warliImg from "@/assets/art-warli.jpg";
import madhubaniImg from "@/assets/art-madhubani.jpg";
import kalamkariImg from "@/assets/art-kalamkari.jpg";
import mandalaImg from "@/assets/art-mandala.jpg";
import pichwaiImg from "@/assets/art-pichwai.jpg";
import gondImg from "@/assets/art-gond.jpg";

const artImageMap: Record<string, string> = {
  Warli: warliImg,
  Madhubani: madhubaniImg,
  Kalamkari: kalamkariImg,
  Mandala: mandalaImg,
  Pichwai: pichwaiImg,
  Gond: gondImg,
};

function getWorkshopImage(workshop: any): string {
  if (workshop.image_url) return workshop.image_url;
  return artImageMap[workshop.art_type] || warliImg;
}

interface WorkshopCardProps {
  workshop: any;
  index: number;
  onBook: (workshop: any) => void;
}

export default function WorkshopCard({ workshop: w, index: i, onBook }: WorkshopCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.08, duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="group rounded-xl overflow-hidden border border-border bg-card hover:shadow-2xl transition-shadow duration-500"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <motion.img
          src={getWorkshopImage(w)}
          alt={w.title}
          loading="lazy"
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6 }}
        />
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 rounded-full bg-secondary/90 text-secondary-foreground font-body text-xs font-semibold backdrop-blur-sm">
            {w.art_type}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-secondary transition-colors">
          {w.title}
        </h3>
        <p className="font-body text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-2">
          {w.description}
        </p>
        <div className="space-y-1.5 font-body text-sm text-muted-foreground mb-5">
          <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-secondary" /> {w.city} — {w.venue}</div>
          <div className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5 text-secondary" /> {new Date(w.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</div>
          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 text-secondary" />
            <span className={w.seats_available <= 3 ? "text-red-400 font-semibold" : ""}>
              {w.seats_available} seats left
            </span>
          </div>
          <div className="flex items-center gap-2"><IndianRupee className="h-3.5 w-3.5 text-secondary" /> ₹{w.price}</div>
        </div>
        <Button
          onClick={() => onBook(w)}
          disabled={w.seats_available <= 0}
          className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-body"
        >
          {w.seats_available <= 0 ? "Fully Booked" : "Book Now"}
        </Button>
      </div>
    </motion.div>
  );
}
