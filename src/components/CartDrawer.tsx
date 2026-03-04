import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus, Trash2, IndianRupee } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CartDrawer() {
  const { items, removeFromCart, updateQuantity, clearCart, total, count } = useCart();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({ title: "Please log in to checkout", variant: "destructive" });
      navigate("/login");
      return;
    }
    if (items.length === 0) return;

    setLoading(true);
    // Create order
    const { data: order, error: orderErr } = await supabase.from("orders").insert({
      user_id: user.id,
      total,
      status: "confirmed",
    }).select().single();

    if (orderErr || !order) {
      toast({ title: "Order failed", description: orderErr?.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    // Create order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsErr } = await supabase.from("order_items").insert(orderItems);
    if (itemsErr) {
      toast({ title: "Order items failed", description: itemsErr.message, variant: "destructive" });
    } else {
      clearCart();
      toast({ title: "Order placed!", description: `Order total: ₹${total}` });
    }
    setLoading(false);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-primary-foreground/80 hover:text-secondary hover:bg-primary-foreground/5">
          <ShoppingCart className="h-5 w-5" />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-body">
              {count}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-card border-border w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-display text-foreground">Your Cart</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <p className="font-body text-muted-foreground text-center py-12">Your cart is empty</p>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto space-y-4 py-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 p-3 rounded-lg border border-border">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-16 h-16 rounded object-cover bg-muted" />
                  ) : (
                    <div className="w-16 h-16 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">No img</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-sm font-semibold text-foreground truncate">{item.name}</p>
                    <p className="font-body text-sm text-muted-foreground flex items-center"><IndianRupee className="h-3 w-3" />{item.price}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-muted rounded"><Minus className="h-3 w-3" /></button>
                      <span className="font-body text-sm w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-muted rounded"><Plus className="h-3 w-3" /></button>
                      <button onClick={() => removeFromCart(item.id)} className="p-1 hover:bg-destructive/20 rounded ml-auto"><Trash2 className="h-3 w-3 text-destructive" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex justify-between font-display text-lg font-bold text-foreground">
                <span>Total</span>
                <span className="flex items-center"><IndianRupee className="h-4 w-4" />{total}</span>
              </div>
              <Button onClick={handleCheckout} disabled={loading} className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-body">
                {loading ? "Placing Order..." : "Place Order"}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
