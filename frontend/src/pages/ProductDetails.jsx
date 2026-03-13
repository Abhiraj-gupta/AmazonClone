import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useToast } from "../components/useToast";
import { ProductDetailSkeleton } from "../components/Skeletons";
import ProductCard, { getDiscount, getMRP } from "../components/ProductCard";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { handleImageFallback, productFallbackImage, resolveProductImage } from "../lib/productImage";

function Star({ type }) {
  if (type === "full") {
    return (
      <svg viewBox="0 0 20 20" className="h-5 w-5 text-[#FFA41C]" aria-hidden="true">
        <path fill="currentColor" d="M9.999 1.5 12.6 6.77l5.82.846-4.21 4.104.994 5.794L10 14.78l-5.204 2.734.994-5.794L1.58 7.616l5.82-.846L9.999 1.5Z" />
      </svg>
    );
  }
  if (type === "half") {
    return (
      <svg viewBox="0 0 20 20" className="h-5 w-5" aria-hidden="true">
        <defs>
          <linearGradient id="halfDetail">
            <stop offset="50%" stopColor="#FFA41C" />
            <stop offset="50%" stopColor="#E0E0E0" />
          </linearGradient>
        </defs>
        <path fill="url(#halfDetail)" d="M9.999 1.5 12.6 6.77l5.82.846-4.21 4.104.994 5.794L10 14.78l-5.204 2.734.994-5.794L1.58 7.616l5.82-.846L9.999 1.5Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 20 20" className="h-5 w-5 text-[#E0E0E0]" aria-hidden="true">
      <path fill="currentColor" d="M9.999 1.5 12.6 6.77l5.82.846-4.21 4.104.994 5.794L10 14.78l-5.204 2.734.994-5.794L1.58 7.616l5.82-.846L9.999 1.5Z" />
    </svg>
  );
}

function renderStars(rating) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push("full");
    else if (rating >= i - 0.5) stars.push("half");
    else stars.push("empty");
  }
  return stars;
}

function formatPrice(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [addingRelatedId, setAddingRelatedId] = useState(null);
  const toast = useToast();
  const { user } = useAuth();
  const { wishlistIds, toggle: toggleWishlist } = useWishlist();
  const inWishlist = wishlistIds.has(Number(id));

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/products/${id}`);
        if (cancelled) return;
        setProduct(res.data);
        setSelectedImage(0);

        // Load related products from the same category
        if (res.data?.category_id) {
          try {
            const related = await api.get("/products", {
              params: { category: res.data.category_id, limit: 4 },
            });
            if (!cancelled) {
              setRelatedProducts(
                (related.data?.items ?? []).filter((p) => p.id !== res.data.id).slice(0, 4)
              );
            }
          } catch {
            // non-critical
          }
        }
      } catch (e) {
        if (cancelled) return;
        setError(
          e?.response?.status === 404
            ? "Product not found."
            : e?.response?.data?.message ?? "Failed to load product."
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // Check wishlist status — handled by WishlistContext globally

  async function handleToggleWishlist() {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      const result = await toggleWishlist(id);
      if (result === "removed") toast.success("Removed from wishlist");
      else toast.success("Added to wishlist");
    } catch {
      toast.error("Failed to update wishlist");
    }
  }

  const images =
    product?.images?.length > 0
      ? product.images
      : [{ image_url: "https://placehold.co/600x600?text=No+Image", alt_text: product?.name }];

  const currentImage = images[selectedImage] ?? images[0];

  const inStock = (product?.stock ?? 0) > 0;
  const rating = Math.max(0, Math.min(5, Number(product?.rating ?? 0)));
  const stars = renderStars(rating);

  function prevImage() {
    setSelectedImage((i) => (i === 0 ? images.length - 1 : i - 1));
  }

  function nextImage() {
    setSelectedImage((i) => (i === images.length - 1 ? 0 : i + 1));
  }

  async function handleAddToCart() {
    if (!product) return;
    setAddingToCart(true);
    try {
      await api.post("/cart", { product_id: product.id, quantity: qty });
      toast.success(`${product.name} added to cart`);
      window.dispatchEvent(new Event("cart-updated"));
    } catch {
      toast.error("Failed to add item to cart");
    } finally {
      setAddingToCart(false);
    }
  }

  async function handleBuyNow() {
    if (!product) return;
    setAddingToCart(true);
    try {
      await api.post("/cart", { product_id: product.id, quantity: qty });
      toast.success("Item added — redirecting to checkout");
      window.dispatchEvent(new Event("cart-updated"));
      navigate("/checkout");
    } catch {
      toast.error("Failed to add item to cart");
      setAddingToCart(false);
    }
  }

  if (loading) {
    return <ProductDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-5xl p-6">
        <div className="text-sm">
          <Link className="underline" to="/">Home</Link>
        </div>
        <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-500">
        <Link className="hover:underline" to="/">Home</Link>
        {product?.category_name && (
          <>
            <span className="mx-1">/</span>
            <Link className="hover:underline" to={`/?category=${product.category_id}`}>
              {product.category_name}
            </Link>
          </>
        )}
        <span className="mx-1">/</span>
        <span className="text-slate-900">{product?.name}</span>
      </nav>

      <div className="mt-6 grid gap-8 md:grid-cols-2">
        {/* ── Image Carousel ── */}
        <div>
          <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white cursor-zoom-in">
            <img
              src={resolveProductImage({ id: product?.id, name: product?.name, image_url: currentImage.image_url }, productFallbackImage(product, 600))}
              onError={(e) => handleImageFallback(e, productFallbackImage(product, 600))}
              alt={currentImage.alt_text ?? product?.name}
              className="aspect-square w-full object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-110"
              loading="lazy"
            />

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-white"
                  aria-label="Previous image"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow hover:bg-white"
                  aria-label="Next image"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={img.id ?? i}
                  type="button"
                  onClick={() => setSelectedImage(i)}
                  className={`flex-shrink-0 rounded-lg border-2 p-1 ${
                    i === selectedImage
                      ? "border-amber-400"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <img
                    src={resolveProductImage({ id: product?.id, name: product?.name, image_url: img.image_url }, productFallbackImage(product, 64))}
                    onError={(e) => handleImageFallback(e, productFallbackImage(product, 64))}
                    alt={img.alt_text ?? `Thumbnail ${i + 1}`}
                    className="h-16 w-16 object-contain"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Product Info ── */}
        <div className="flex flex-col gap-4">
          <p className="text-xs text-[#007185] hover:text-[#C7511F] cursor-pointer">
            Visit the {product?.category_name ?? "Amazon"} Store
          </p>
          <h1 className="text-2xl font-semibold text-[#0F1111] leading-snug">{product?.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5" aria-label={`Rating ${rating} out of 5`}>
              {stars.map((type, i) => (
                <Star key={i} type={type} />
              ))}
            </div>
            <span className="text-sm text-[#007185] hover:text-[#C7511F] cursor-pointer">
              {rating.toFixed(1)} ({(product?.review_count ?? 0).toLocaleString()} ratings)
            </span>
          </div>

          <hr className="border-slate-200" />

          {/* Price */}
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-red-600 font-medium">-{getDiscount(id)}%</span>
              <span className="text-3xl font-medium text-[#0F1111]">
                {formatPrice(product?.price)}
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              M.R.P.: <span className="line-through">{formatPrice(getMRP(product?.price ?? 0, getDiscount(id)))}</span>
            </p>
            <p className="mt-0.5 text-xs text-slate-500">Inclusive of all taxes</p>
          </div>

          {/* EMI */}
          <p className="text-sm text-slate-700">
            EMI from <span className="font-bold">{formatPrice(Math.ceil((product?.price ?? 0) / 6))}/month</span>
            <span className="ml-1 text-[#007185] cursor-pointer hover:text-[#C7511F]">EMI options</span>
          </p>

          <hr className="border-slate-200" />

          {/* Offers */}
          <div>
            <h3 className="text-sm font-bold text-[#0F1111] mb-2">Available Offers</h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-green-600 text-xs font-bold bg-green-50 px-1.5 py-0.5 rounded">Offer</span>
                <p className="text-sm text-slate-700">
                  <span className="font-medium">Bank Offer:</span> 10% instant discount on SBI Credit Cards, up to ₹1,500
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-green-600 text-xs font-bold bg-green-50 px-1.5 py-0.5 rounded">Offer</span>
                <p className="text-sm text-slate-700">
                  <span className="font-medium">No Cost EMI:</span> Upto ₹{Math.ceil((product?.price ?? 0) / 12).toLocaleString("en-IN")} EMI interest savings
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-green-600 text-xs font-bold bg-green-50 px-1.5 py-0.5 rounded">Offer</span>
                <p className="text-sm text-slate-700">
                  <span className="font-medium">Cashback:</span> 5% Unlimited Cashback on Amazon Pay ICICI Bank Credit Card
                </p>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-green-600 text-xs font-bold bg-green-50 px-1.5 py-0.5 rounded">Offer</span>
                <p className="text-sm text-slate-700">
                  <span className="font-medium">Partner Offer:</span> Purchase this product and get up to ₹500 off on Amazon Pantry
                </p>
              </div>
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* Delivery info */}
          <div className="rounded-lg border border-slate-200 p-3">
            <div className="flex items-center gap-2 text-sm">
              <svg className="h-5 w-5 text-[#007185]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"/>
              </svg>
              <span className="text-slate-700">Deliver to <span className="font-bold">Bennett University, Greater Noida</span></span>
            </div>
            <p className="mt-2 text-sm text-green-700 font-bold">FREE delivery Tomorrow</p>
            <p className="text-xs text-slate-500">Order within 8 hrs 42 mins</p>
          </div>

          {/* Stock status */}
          <div className="flex items-center gap-2">
            <span
              className={`inline-block h-2.5 w-2.5 rounded-full ${
                inStock ? "bg-green-500" : "bg-red-500"
              }`}
            />
            {inStock ? (
              <span className="text-lg font-medium text-green-700">
                In Stock
              </span>
            ) : (
              <span className="text-lg font-medium text-red-700">Out of Stock</span>
            )}
          </div>

          {/* Seller info */}
          <p className="text-sm text-slate-600">
            Sold by <span className="text-[#007185] cursor-pointer hover:text-[#C7511F]">AmazonClone Retail</span>
            {" "}and <span className="text-[#007185] cursor-pointer hover:text-[#C7511F]">Fulfilled by Amazon</span>
          </p>

          <hr className="border-slate-200" />

          {/* Description */}
          <div>
            <h2 className="text-sm font-semibold text-slate-700">About this item</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600">
              {product?.description || "No description available."}
            </p>
          </div>

          <hr className="border-slate-200" />

          {/* Action buttons */}
          <div className="mt-auto flex flex-col gap-3">
            {/* Quantity */}
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-[#0F1111]" htmlFor="qty-select">Qty:</label>
              <select
                id="qty-select"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="rounded-lg border border-[#D5D9D9] bg-[#F0F2F2] px-3 py-1.5 text-sm text-[#0F1111] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F3A847]"
              >
                {Array.from({ length: Math.min(10, product?.stock ?? 10) }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <button
              type="button"
              disabled={!inStock || addingToCart}
              onClick={handleAddToCart}
              className="w-full rounded-full bg-[#FFD814] py-3 text-sm font-semibold text-[#0F1111] hover:bg-[#F7CA00] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {addingToCart ? "Adding…" : "Add to Cart"}
            </button>

            <button
              type="button"
              disabled={!inStock || addingToCart}
              onClick={handleBuyNow}
              className="w-full rounded-full bg-[#FFA41C] py-3 text-sm font-semibold text-[#0F1111] hover:bg-[#FA8900] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Buy Now
            </button>

            <button
              type="button"
              onClick={handleToggleWishlist}
              className={`flex w-full items-center justify-center gap-2 rounded-full border py-3 text-sm font-semibold transition ${
                inWishlist
                  ? "border-[#CC0C39] bg-[#FFF0F0] text-[#CC0C39]"
                  : "border-[#DDD] bg-white text-[#0F1111] hover:bg-[#F7F7F7]"
              }`}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill={inWishlist ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
              {inWishlist ? "In Wishlist" : "Add to Wishlist"}
            </button>
          </div>

          {/* Trust badges */}
          <div className="mt-2 grid grid-cols-4 gap-2 text-center">
            <div className="flex flex-col items-center gap-1">
              <svg className="h-6 w-6 text-slate-500" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2Zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2Zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2Z"/></svg>
              <span className="text-[10px] text-slate-500">Secure Payment</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <svg className="h-6 w-6 text-slate-500" viewBox="0 0 24 24" fill="currentColor"><path d="M21 5H3c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2Zm0 12H3V7h18v10Zm-2-1H5v-2h14v2Zm0-4H5V9h14v3Z"/></svg>
              <span className="text-[10px] text-slate-500">Free Delivery</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <svg className="h-6 w-6 text-slate-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12.5 6.9c1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-.53.12-1.03.3-1.48.54l1.47 1.47c.41-.17.91-.27 1.51-.27ZM5.33 4.06 4.06 5.33 7.5 8.77c0 2.08 1.56 3.22 3.91 3.91l2.51 2.51c-.69.25-1.51.32-2.42.32-2.18 0-3.07-.93-3.26-2.1H6.03c.2 2.19 1.76 3.42 3.97 3.83V19h3v-2.15c1.17-.25 2.15-.78 2.81-1.52l3.86 3.86 1.27-1.27L5.33 4.06Z"/></svg>
              <span className="text-[10px] text-slate-500">Pay on Delivery</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <svg className="h-6 w-6 text-slate-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4Zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8Z"/></svg>
              <span className="text-[10px] text-slate-500">Amazon Fulfilled</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Related Products ── */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-slate-900">Related Products</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                adding={addingRelatedId === p.id}
                onAddToCart={async (product) => {
                  setAddingRelatedId(product.id);
                  try {
                    await api.post("/cart", { product_id: product.id, quantity: 1 });
                    toast.success(`${product.name} added to cart`);
                    window.dispatchEvent(new Event("cart-updated"));
                  } catch {
                    toast.error("Failed to add item to cart");
                  } finally {
                    setAddingRelatedId(null);
                  }
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

