import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { ProductCardSkeleton } from "../components/Skeletons";
import { useToast } from "../components/useToast";
import { api } from "../lib/api";

const DEAL_TAGS = [
  "Lightning Deal",
  "Deal of the Day",
  "Best Seller",
  "Limited Time",
  "Top Deal",
];

export default function TodaysDeals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const toast = useToast();

  useEffect(() => {
    async function load() {
      try {
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
      <div className="rounded-lg bg-[#232F3E] p-6 text-white">
        <h1 className="text-3xl font-bold">Today&apos;s Deals</h1>
        <p className="mt-1 text-sm text-[#ccc]">
          Great deals on top products. Updated daily!
        </p>
      </div>

      {/* Deal Tags Filter */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
        {DEAL_TAGS.map((tag) => (
          <span
            key={tag}
            className="flex-shrink-0 rounded-full border border-[#007185] px-4 py-1.5 text-sm text-[#007185] hover:bg-[#007185] hover:text-white cursor-pointer transition"
          >
            {tag}
          </span>
        ))}
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
          No deals available right now. Check back later!
        </div>
      ) : (
        <div className="mt-6 grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              adding={addingId === p.id}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}

      {/* Banner */}
      <div className="mt-8 rounded-lg bg-gradient-to-r from-[#FFA41C] to-[#FF8F00] p-6 text-center">
        <h2 className="text-xl font-bold text-white">More deals coming soon!</h2>
        <p className="mt-1 text-sm text-white/90">
          Check back regularly for new Lightning Deals and Daily Deals.
        </p>
        <Link
          to="/"
          className="mt-4 inline-block rounded-lg bg-white px-6 py-2 text-sm font-medium text-[#0F1111] hover:bg-[#F7F7F7]"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
