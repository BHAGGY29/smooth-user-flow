import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import CartDrawer from "@/components/CartDrawer";
import type { User as SupaUser } from "@supabase/supabase-js";

const links = [
  { to: "/", label: "Home" },
  { to: "/programs", label: "Programs" },
  { to: "/workshops", label: "Workshops" },
  { to: "/shop", label: "Shop" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<SupaUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase.from("user_roles").select("role").eq("user_id", session.user.id).eq("role", "admin").then(({ data }) => {
          setIsAdmin(!!data && data.length > 0);
        });
      } else {
        setIsAdmin(false);
      }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase.from("user_roles").select("role").eq("user_id", session.user.id).eq("role", "admin").then(({ data }) => {
          setIsAdmin(!!data && data.length > 0);
        });
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-sm border-b border-primary-foreground/10">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="font-display text-2xl font-bold text-primary-foreground tracking-wide">
          Shadow <span className="text-secondary">Arts</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className={`text-sm font-body tracking-wide transition-colors hover:text-secondary ${location.pathname === l.to ? "text-secondary" : "text-primary-foreground/80"}`}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <CartDrawer />
          {user ? (
            <>
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="outline" size="sm" className="border-secondary/40 text-primary-foreground hover:bg-secondary hover:text-secondary-foreground">
                    <Shield className="h-4 w-4 mr-1" /> Admin
                  </Button>
                </Link>
              )}
              <Link to="/profile">
                <Button variant="outline" size="sm" className="border-secondary/40 text-primary-foreground hover:bg-secondary hover:text-secondary-foreground">
                  <User className="h-4 w-4 mr-1" /> Dashboard
                </Button>
              </Link>
            </>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm" className="border-secondary/40 text-primary-foreground hover:bg-secondary hover:text-secondary-foreground">
                Login
              </Button>
            </Link>
          )}
        </div>

        <div className="md:hidden flex items-center gap-2">
          <CartDrawer />
          <button className="text-primary-foreground" onClick={() => setOpen(!open)}>
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-primary border-t border-primary-foreground/10 overflow-hidden">
            <nav className="container py-4 flex flex-col gap-3">
              {links.map((l) => (
                <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className={`font-body text-lg py-2 transition-colors ${location.pathname === l.to ? "text-secondary" : "text-primary-foreground/80"}`}>
                  {l.label}
                </Link>
              ))}
              {user ? (
                <>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setOpen(false)}>
                      <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 mt-2"><Shield className="h-4 w-4 mr-1" /> Admin</Button>
                    </Link>
                  )}
                  <Link to="/profile" onClick={() => setOpen(false)}>
                    <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 mt-2"><User className="h-4 w-4 mr-1" /> Dashboard</Button>
                  </Link>
                </>
              ) : (
                <Link to="/login" onClick={() => setOpen(false)}>
                  <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 mt-2">Login</Button>
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
