import { useState, useEffect, useCallback } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  quantity: number;
}

const CART_KEY = "shadow-arts-cart";

function getStoredCart(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}

// Simple event bus for cross-component updates
const listeners = new Set<() => void>();
function notifyCartChange() {
  listeners.forEach((fn) => fn());
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(getStoredCart);

  useEffect(() => {
    const sync = () => setItems(getStoredCart());
    listeners.add(sync);
    return () => { listeners.delete(sync); };
  }, []);

  const save = useCallback((newItems: CartItem[]) => {
    localStorage.setItem(CART_KEY, JSON.stringify(newItems));
    setItems(newItems);
    notifyCartChange();
  }, []);

  const addToCart = useCallback((item: CartItem) => {
    const current = getStoredCart();
    const existing = current.find((c) => c.id === item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      current.push({ ...item, quantity: 1 });
    }
    save(current);
  }, [save]);

  const removeFromCart = useCallback((id: string) => {
    save(getStoredCart().filter((c) => c.id !== id));
  }, [save]);

  const updateQuantity = useCallback((id: string, qty: number) => {
    if (qty <= 0) return removeFromCart(id);
    const current = getStoredCart();
    const item = current.find((c) => c.id === id);
    if (item) item.quantity = qty;
    save(current);
  }, [save, removeFromCart]);

  const clearCart = useCallback(() => save([]), [save]);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return { items, addToCart, removeFromCart, updateQuantity, clearCart, total, count: items.reduce((s, i) => s + i.quantity, 0) };
}
