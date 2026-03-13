import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ProductCard, { getDiscount, getMRP } from "../components/ProductCard";
import { ProductCardSkeleton } from "../components/Skeletons";
import { useToast } from "../components/useToast";
import { api } from "../lib/api";
import { handleImageFallback, productFallbackImage, resolveProductImage } from "../lib/productImage";

const CATEGORY_CARDS = [
  { id: 1, name: "Men", image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=300&h=300&fit=crop" },
  { id: 2, name: "Women", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=300&h=300&fit=crop" },
  { id: 3, name: "Electronics", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&h=300&fit=crop" },
  { id: 4, name: "House Essentials", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop" },
  { id: 5, name: "Car Accessories", image: "/product-images/category-car-accessories.svg" },
];

function HeroMovingProducts({ products }) {
  const featured = (products ?? []).slice(0, 10);
  if (featured.length === 0) return null;
  const stream = [...featured, ...featured];

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[380px] overflow-hidden sm:h-[440px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent_65%)]" />
      <div className="hero-shine" />

      <div className="hero-product-track hero-product-track--forward">
        {stream.map((product, idx) => (
          <div key={`f-${product.id}-${idx}`} className="hero-product-chip">
            <img
              src={resolveProductImage(product, productFallbackImage(product, 192))}
              onError={(e) => handleImageFallback(e, productFallbackImage(product, 192))}
              alt={product.name}
              className="h-28 w-28 rounded-xl object-contain bg-white/90 p-2"
              loading="lazy"
            />
            <div className="min-w-0">
              <p className="line-clamp-1 text-lg font-semibold tracking-[0.01em] text-[#F7F8FA]">{product.name}</p>
              <p className="mt-1 text-sm text-slate-300">Top pick on Amazon.in</p>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-[#232F3E]/18 via-[#232F3E]/18 to-[#232F3E]/86" />
    </div>
  );
}

function DealCarousel({ title, products }) {
  const trackRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  function updateArrows() {
    if (!trackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;
    setShowLeft(scrollLeft > 10);
    setShowRight(scrollLeft + clientWidth < scrollWidth - 10);
  }

  function scroll(dir) {
    if (!trackRef.current) return;
    const amount = trackRef.current.clientWidth * 0.8;
    trackRef.current.scrollBy({ left: dir * amount, behavior: "smooth" });
  }

  if (!products.length) return null;

  return (
    <div className="relative bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-xl font-bold text-[#0F1111]">{title}</h2>

      {/* Left arrow */}
      {showLeft && (
        <button
          onClick={() => scroll(-1)}
          className="absolute left-0 top-1/2 z-10 -translate-y-1/2 bg-white/95 border border-[#DDD] rounded-r-sm px-2 py-8 shadow-lg hover:bg-[#F7F7F7] transition-all duration-200 hover:shadow-xl"
          aria-label="Scroll left"
        >
          <svg className="h-5 w-5 text-[#555]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Track */}
      <div
        ref={trackRef}
        onScroll={updateArrows}
        className="flex gap-3 overflow-x-auto scroll-smooth px-8 hide-scrollbar"
      >
        {products.map((product) => {
          const imgUrl = resolveProductImage(product, productFallbackImage(product, 176));
          const price = Number(product.price);
          const discount = getDiscount(product.id);
          const mrp = getMRP(price, discount);
          return (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="group relative flex-shrink-0 w-48 transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="relative overflow-hidden rounded-lg bg-[#F7F7F7] p-2">
                <span className="absolute left-0 top-2 z-10 rounded-r-sm bg-[#CC0C39] px-2 py-0.5 text-[11px] font-bold text-white shadow-sm">
                  {discount}% off
                </span>
                <img
                  src={imgUrl}
                  onError={(e) => handleImageFallback(e, productFallbackImage(product, 176))}
                  alt={product.name}
                  className="mx-auto h-44 w-44 object-contain transition-transform duration-500 ease-out group-hover:scale-110"
                />
              </div>
              <div className="mt-2 px-1">
                <p className="text-sm text-[#0F1111] line-clamp-2 group-hover:text-[#C7511F] transition-colors">
                  {product.name}
                </p>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-lg font-bold text-[#0F1111]">
                    ₹{price.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-[#565959] line-through">
                    ₹{mrp.toLocaleString("en-IN")}
                  </span>
                </div>
                <p className="text-xs text-[#565959]">FREE delivery</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Right arrow */}
      {showRight && (
        <button
          onClick={() => scroll(1)}
          className="absolute right-0 top-1/2 z-10 -translate-y-1/2 bg-white/95 border border-[#DDD] rounded-l-sm px-2 py-8 shadow-lg hover:bg-[#F7F7F7] transition-all duration-200 hover:shadow-xl"
          aria-label="Scroll right"
        >
          <svg className="h-5 w-5 text-[#555]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default function Home() {
  const [searchParams] = useSearchParams();
  const urlQ = (searchParams.get("q") ?? "").trim();
  const urlCategory = (searchParams.get("category") ?? "").trim();

  const [page, setPage] = useState(1);
  const limit = 12;

  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [addingId, setAddingId] = useState(null);
  const [dealProducts, setDealProducts] = useState([]);
  const toast = useToast();

  const showHero = !urlQ && !urlCategory;

  const activeCategoryName = useMemo(() => {
    if (!urlCategory) return "";
    return CATEGORY_CARDS.find((c) => String(c.id) === urlCategory)?.name ?? "";
  }, [urlCategory]);

  const queryKey = useMemo(
    () => JSON.stringify({ q: urlQ, category: urlCategory, page, limit }),
    [urlQ, urlCategory, page, limit]
  );

  useEffect(() => {
    setPage(1);
  }, [urlQ, urlCategory]);

  // Load deal products for banner
  useEffect(() => {
    async function loadDeals() {
      try {
        const res = await api.get("/products", { params: { limit: 25 } });
        setDealProducts(res.data?.items ?? []);
      } catch {
        // non-critical
      }
    }
    loadDeals();
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/products", {
          params: {
            page,
            limit,
            category: urlCategory || undefined,
            q: urlQ || undefined,
          },
        });
        if (cancelled) return;
        setProducts(res.data?.items ?? []);
        setTotalPages(Math.max(1, Number(res.data?.totalPages ?? 1)));
      } catch (e) {
        if (cancelled) return;
        setProducts([]);
        setTotalPages(1);
        setError(e?.response?.data?.message ?? "Failed to load products");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProducts();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey]);

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

  let heading = "Today's Deals";
  let subtext = "Browse our top picks across all categories";
  if (urlQ) {
    heading = `Results for "${urlQ}"`;
    subtext = "Showing products matching your search";
  } else if (activeCategoryName) {
    heading = activeCategoryName;
    subtext = `Shop the best in ${activeCategoryName}`;
  }

  return (
    <div className="pb-8">
      {/* ─── Hero ─── */}
      {showHero && (
        <div className="relative mb-6 bg-gradient-to-b from-[#232F3E] to-[#EAEDED]">
          <HeroMovingProducts products={dealProducts} />

          <div className="relative z-10 mx-auto max-w-7xl px-4 pt-14 text-center text-white sm:pt-16">
            <h1 className="inline-block rounded-2xl bg-black/20 px-5 py-2 text-3xl font-bold tracking-tight shadow-[0_10px_40px_rgba(0,0,0,0.25)] backdrop-blur-[3px] sm:text-5xl">
              Welcome to Amazon.in
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-slate-200 sm:text-base">
              Millions of products at great prices. Free delivery on eligible orders.
            </p>
          </div>

          {/* ─── Deal Carousels ─── */}
          {dealProducts.length > 0 && (
            <div className="mx-auto mt-6 max-w-7xl space-y-4 px-4">
              <DealCarousel
                title="Today's Deals"
                products={dealProducts.slice(0, 10)}
              />
              <DealCarousel
                title="Best Sellers"
                products={dealProducts.slice(10, 20)}
              />
              <DealCarousel
                title="More to explore"
                products={dealProducts.slice(20)}
              />
            </div>
          )}

          {/* ─── Category Cards ─── */}
          <div className="relative pb-0">
            <div className="mx-auto mt-8 w-full max-w-7xl translate-y-1/2 px-4">
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
                {CATEGORY_CARDS.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/?category=${cat.id}`}
                    className="rounded-lg bg-white p-4 shadow-md hover:shadow-lg transition"
                  >
                    <img
                      src={cat.image}
                      onError={(e) => handleImageFallback(e, "/product-images/category-car-accessories.svg")}
                      alt={cat.name}
                      className="mx-auto mb-3 h-24 w-full rounded-md object-cover"
                    />
                    <h3 className="text-sm font-bold text-[#0F1111]">{cat.name}</h3>
                    <p className="mt-0.5 text-xs text-[#007185]">Shop now</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showHero && <div className="h-36 sm:h-28" />}

      {/* ─── Products Section ─── */}
      <div className="px-4">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#0F1111] sm:text-2xl">{heading}</h2>
            <p className="mt-0.5 text-sm text-slate-600">{subtext}</p>
          </div>
          {(urlQ || urlCategory) && (
            <Link to="/" className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline">
              ← Back to all
            </Link>
          )}
        </div>

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: limit }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center text-sm text-slate-600 shadow-sm">
            No products found.
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
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

        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              type="button"
              className="rounded-md border border-[#DDD] bg-white px-4 py-2 text-sm shadow-sm hover:bg-[#F7FAFA] disabled:opacity-50"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              ← Previous
            </button>
            <span className="px-3 text-sm text-slate-700">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              className="rounded-md border border-[#DDD] bg-white px-4 py-2 text-sm shadow-sm hover:bg-[#F7FAFA] disabled:opacity-50"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

