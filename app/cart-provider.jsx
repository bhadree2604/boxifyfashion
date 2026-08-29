'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    if (typeof window === 'undefined') return [];
    const saved = window.localStorage.getItem('boxify-cart');
    if (!saved) return [];
    try { return JSON.parse(saved); } catch (_) { return []; }
  });

  useEffect(() => {
    // sync in case multiple tabs modify
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem('boxify-cart') : null;
    if (saved) {
      try { setCart(JSON.parse(saved)); } catch (_) {}
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('boxify-cart', JSON.stringify(cart));
    }
  }, [cart]);

  const addItem = (item) => {
    setCart((prev) => {
      const exists = prev.find((p) => p.id === item.id && p.color === item.color && p.size === item.size);
      if (exists) {
        return prev.map((p) =>
          p.id === item.id && p.color === item.color && p.size === item.size
            ? { ...p, qty: (p.qty || 1) + 1 }
            : p
        );
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQty = (item, delta) => {
    setCart((prev) => {
      return prev
        .map((p) =>
          p.id === item.id && p.color === item.color && p.size === item.size
            ? { ...p, qty: Math.max(1, (p.qty || 1) + delta) }
            : p
        )
        .filter((p) => (p.qty || 1) > 0);
    });
  };

  const removeItem = (item) => {
    setCart((prev) => prev.filter((p) => !(p.id === item.id && p.color === item.color && p.size === item.size)));
  };

  const updateVariant = (item, color, size) => {
    if (!color || !size) return;
    setCart((prev) => {
      return prev.reduce((acc, p) => {
        if (p.id === item.id && p.color === item.color && p.size === item.size) {
          const newItem = { ...p, color, size };
          const dupIndex = acc.findIndex((x) => x.id === newItem.id && x.color === newItem.color && x.size === newItem.size);
          if (dupIndex >= 0) {
            acc[dupIndex] = { ...acc[dupIndex], qty: (acc[dupIndex].qty || 1) + (newItem.qty || 1) };
            return acc;
          }
          acc.push(newItem);
          return acc;
        }
        acc.push(p);
        return acc;
      }, []);
    });
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, clearCart, updateQty, updateVariant }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
