import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { ProductCardSkeleton } from "../components/Skeletons";
import { useToast } from "../components/useToast";
import { api } from "../lib/api";

export default function NewReleases() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const toast = useToast();

  useEffect(() => {
    async function load() {
      try {
        // Products are already sorted by created_at DESC in the API
        const res = await api.get("/products", { params: { limit: 25 } });
        setProducts(res.data?.items ?? []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleAddToCart(product) {
    setAddingId(product.id);
    try {
      await api.post("/cart", { product_id: product.id, quantity: 1 });
      toast.success(`${product.name} added to cart`);
      window.dispatchEvent(new Event("cart-updated"));
    } catch {
      toast.error("Failed to add item to cart");
    } finally {
      setAddingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      {/* Header */}
      <div className="rounded-lg bg-gradient-to-r from-[#232F3E] to-[#37475A] p-6 text-white">
        <h1 className="text-3xl font-bold">New Releases</h1>
        <p className="mt-1 text-sm text-[#ccc]">
          The latest additions to our catalog — be the first to explore!
        </p>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="mt-6 grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="mt-6 rounded-lg bg-white p-8 text-center text-sm text-slate-600 shadow-sm">
          No new releases right now.
        </div>
      ) : (
        <div className="mt-6 grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((p) => (
            <div key={p.id} className="relative">
              <span className="absolute right-2 top-3 z-20 rounded-full bg-[#007185] px-2 py-0.5 text-[10px] font-bold text-white shadow">
                NEW
              </span>
              <ProductCard
                product={p}
                adding={addingId === p.id}
                onAddToCart={handleAddToCart}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
