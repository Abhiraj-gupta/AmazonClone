import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { api } from "../lib/api";

export default function Layout() {
  const [cartCount, setCartCount] = useState(0);

  const refreshCartCount = useCallback(async () => {
    try {
      const res = await api.get("/cart");
      const items = res.data?.items ?? [];
      setCartCount(items.reduce((sum, i) => sum + i.quantity, 0));
    } catch {
      setCartCount(0);
    }
  }, []);

  useEffect(() => {
    refreshCartCount();
    const handler = () => refreshCartCount();
    window.addEventListener("cart-updated", handler);
    return () => window.removeEventListener("cart-updated", handler);
  }, [refreshCartCount]);

  return (
    <div className="flex min-h-screen flex-col bg-[#EAEDED] text-slate-900">
      <Navbar cartCount={cartCount} />
      <main className="mx-auto w-full max-w-[1500px] flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

