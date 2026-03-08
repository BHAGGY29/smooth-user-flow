import { Link } from "react-router-dom";
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin } from "lucide-react";

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

          {/* Social */}
          <div>
            <h4 className="font-display text-sm font-semibold text-primary-foreground uppercase tracking-widest mb-4">Follow Us</h4>
            <div className="flex gap-4">
              {[Instagram, Facebook, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="p-2 rounded-full border border-primary-foreground/20 hover:border-secondary hover:text-secondary transition-colors">
                  <Icon className="h-5 w-5" />
                </a>
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
