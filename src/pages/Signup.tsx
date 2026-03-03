import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: fullName },
      },
    });
    setLoading(false);
    if (error) {
      toast({ title: "Signup failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Account created!", description: "Please check your email to confirm." });
      navigate("/login");
    }
  };

  return (
    <Layout>
      <section className="min-h-[80vh] flex items-center justify-center py-20">
        <div className="w-full max-w-md mx-auto p-8">
          <h1 className="font-display text-3xl font-bold text-foreground text-center mb-2">Create Account</h1>
          <p className="font-body text-muted-foreground text-center mb-8">Join the Shadow Arts community</p>

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <Label className="font-body">Full Name</Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required className="mt-1" />
            </div>
            <div>
              <Label className="font-body">Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1" />
            </div>
            <div>
              <Label className="font-body">Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="mt-1" />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-body">
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>

          <p className="mt-6 text-center font-body text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-secondary hover:underline">Sign in</Link>
          </p>
        </div>
      </section>
    </Layout>
  );
}
