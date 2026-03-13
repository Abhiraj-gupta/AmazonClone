import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [loading, setLoading] = useState(false);

  const loadWishlist = useCallback(async () => {
    if (!user) {
      setWishlistIds(new Set());
      return;
    }
    setLoading(true);
    try {
      const res = await api.get("/wishlist");
      const ids = (res.data?.items ?? []).map((i) => Number(i.product_id));
      setWishlistIds(new Set(ids));
    } catch {
      setWishlistIds(new Set());
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  async function toggle(productId) {
    const id = Number(productId);
    if (!user) return false; // caller should redirect to login

    if (wishlistIds.has(id)) {
      await api.delete(`/wishlist/${id}`);
      setWishlistIds((prev) => {
        const s = new Set(prev);
        s.delete(id);
        return s;
      });
      return "removed";
    } else {
      await api.post("/wishlist", { product_id: id });
      setWishlistIds((prev) => new Set(prev).add(id));
      return "added";
    }
  }

  return (
    <WishlistContext.Provider value={{ wishlistIds, toggle, loading, reload: loadWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
