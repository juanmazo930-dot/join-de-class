import { createContext, useContext, useMemo, useState, useCallback } from 'react';

const CartContext = createContext(null);

function cartKey(item) {
  return `${item.id}-${item.color}-${item.size}`;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((product) => {
    setItems((prev) => {
      const key = cartKey(product);
      const existing = prev.find((i) => cartKey(i) === key);
      if (existing) {
        return prev.map((i) => (cartKey(i) === key ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((key) => {
    setItems((prev) => prev.filter((i) => cartKey(i) !== key));
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const total = useMemo(
    () => items.reduce((acc, i) => acc + i.price * i.qty, 0),
    [items]
  );

  const value = useMemo(
    () => ({ items, isOpen, addItem, removeItem, openCart, closeCart, total, cartKey }),
    [items, isOpen, addItem, removeItem, openCart, closeCart, total]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}
