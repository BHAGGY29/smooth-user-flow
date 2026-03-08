import { Link } from "react-router-dom";
import { Instagram, Youtube, Mail, Phone, MapPin, MessageCircle, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground/80">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="font-display text-2xl font-bold text-primary-foreground mb-4">
              Shadow <span className="text-secondary">Arts</span>
            </h3>
            <p className="font-body text-sm leading-relaxed">
              Preserving India's rich cultural heritage through art workshops, exhibitions, and handcrafted artwork.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-sm font-semibold text-primary-foreground uppercase tracking-widest mb-4">Navigation</h4>
            <ul className="space-y-2 font-body text-sm">
              {["/", "/workshops", "/shop", "/contact"].map((path) => (
                <li key={path}>
                  <Link to={path} className="hover:text-secondary transition-colors">
                    {path === "/" ? "Home" : path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-sm font-semibold text-primary-foreground uppercase tracking-widest mb-4">Contact</h4>
            <ul className="space-y-3 font-body text-sm">
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-secondary" /> shadowartsteam@gmail.com</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-secondary" /> +91 97013 60746</li>
              <li className="flex items-start gap-2"><MapPin className="h-4 w-4 text-secondary mt-0.5" /> 16-4-1402/1, Pallavi Hospital Line, Under Bridge Rd, Shiva Nagar, Warangal, Telangana 506002</li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-primary-foreground uppercase tracking-widest mb-4">Follow Us</h4>
            <div className="flex flex-col gap-3">
              {[
                { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/_shadowarts_official?igsh=MW56cjl0ZmRlZThjbw==" },
                { icon: Youtube, label: "YouTube", href: "https://www.youtube.com/@shadowarts_official" },
                { icon: MessageCircle, label: "WhatsApp", href: "https://chat.whatsapp.com/JxeRmOsZDOzH5aqs6sBOjC?mode=gi_t" },
              ].map((social, i) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-primary-foreground/20 hover:border-secondary hover:bg-secondary/10 transition-all duration-300 group"
                >
                  <social.icon className="h-5 w-5 text-secondary" />
                  <span className="font-body text-sm text-primary-foreground/80 group-hover:text-secondary transition-colors">{social.label}</span>
                  <ExternalLink className="h-3 w-3 ml-auto text-primary-foreground/40 group-hover:text-secondary transition-colors" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-6 text-center font-body text-xs text-primary-foreground/50">
          © {new Date().getFullYear()} Shadow Arts. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
