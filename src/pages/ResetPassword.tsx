import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout/Layout";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check for recovery token in hash
    const hash = window.location.hash;
    if (!hash.includes("type=recovery")) {
      toast({ title: "Invalid reset link", variant: "destructive" });
      navigate("/login");
    }
  }, [navigate, toast]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Password updated!" });
      navigate("/login");
    }
  };

  return (
    <Layout>
      <section className="min-h-[80vh] flex items-center justify-center py-20">
        <div className="w-full max-w-md mx-auto p-8">
          <h1 className="font-display text-3xl font-bold text-foreground text-center mb-8">Set New Password</h1>
          <form onSubmit={handleUpdate} className="space-y-5">
            <div>
              <Label className="font-body">New Password</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="mt-1" />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-body">
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </div>
      </section>
    </Layout>
  );
}
