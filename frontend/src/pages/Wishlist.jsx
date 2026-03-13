import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { useToast } from "../components/useToast";
import { useAuth } from "../context/AuthContext";
import { handleImageFallback, productFallbackImage, resolveProductImage } from "../lib/productImage";

function formatPrice(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function Wishlist() {
  const { user } = useAuth();
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadWishlist = useCallback(async () => {
    try {
      const res = await api.get("/wishlist");
      setItems(res.data?.items ?? []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) loadWishlist();
    else setLoading(false);
  }, [user, loadWishlist]);

  async function handleRemove(productId) {
    try {
      await api.delete(`/wishlist/${productId}`);
      setItems((prev) => prev.filter((i) => i.product_id !== productId));
      toast.success("Removed from wishlist");
    } catch {
      toast.error("Failed to remove item");
    }
  }

  async function handleAddToCart(item) {
    try {
      await api.post("/cart", { product_id: item.product_id, quantity: 1 });
      toast.success(`${item.name} added to cart`);
      window.dispatchEvent(new Event("cart-updated"));
    } catch {
      toast.error("Failed to add to cart");
    }
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl p-6 text-center">
        <h1 className="text-2xl font-bold text-[#0F1111]">Your Wishlist</h1>
        <p className="mt-4 text-slate-600">Please sign in to view your wishlist.</p>
        <Link
          to="/login"
          className="mt-4 inline-block rounded-lg bg-[#FFD814] px-6 py-2 text-sm font-medium text-[#0F1111] hover:bg-[#F7CA00]"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="text-2xl font-bold text-[#0F1111]">Your Wishlist</h1>
      <p className="mt-1 text-sm text-[#565959]">
        {items.length} {items.length === 1 ? "item" : "items"}
      </p>

      {loading && (
        <p className="mt-6 animate-pulse text-slate-500">Loading wishlist…</p>
      )}

      {!loading && items.length === 0 && (
        <div className="mt-6 rounded-lg border border-[#DDD] bg-white p-8 text-center">
          <p className="text-slate-600">Your wishlist is empty.</p>
          <Link
            to="/"
            className="mt-4 inline-block rounded-lg bg-[#FFD814] px-6 py-2 text-sm font-medium text-[#0F1111] hover:bg-[#F7CA00]"
          >
            Continue Shopping
          </Link>
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <div
              key={item.product_id}
              className="flex items-center gap-4 rounded-lg border border-[#DDD] bg-white p-4 shadow-sm"
            >
              <Link to={`/products/${item.product_id}`}>
                <img
                  src={resolveProductImage(item, productFallbackImage(item, 120))}
                  onError={(e) => handleImageFallback(e, productFallbackImage(item, 120))}
                  alt={item.name}
                  className="h-24 w-24 rounded-md object-contain"
                />
              </Link>

              <div className="flex-1 min-w-0">
                <Link
                  to={`/products/${item.product_id}`}
                  className="text-sm font-medium text-[#0F1111] hover:text-[#C7511F] line-clamp-2"
                >
                  {item.name}
                </Link>
                <p className="mt-1 text-lg font-bold text-[#0F1111]">
                  {formatPrice(item.price)}
                </p>
                <p className="text-xs text-[#007600]">In Stock</p>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleAddToCart(item)}
                  className="rounded-lg bg-[#FFD814] px-4 py-2 text-sm font-medium text-[#0F1111] hover:bg-[#F7CA00] whitespace-nowrap"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleRemove(item.product_id)}
                  className="rounded-lg border border-[#DDD] bg-white px-4 py-2 text-sm text-[#0F1111] hover:bg-[#F7F7F7] whitespace-nowrap"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
