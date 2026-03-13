import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { handleImageFallback, productFallbackImage, resolveProductImage } from "../lib/productImage";

// Deterministic discount based on product ID — same everywhere
export function getDiscount(id) {
  const n = Number(id) || 1;
  return ((n * 17 + 3) % 41) + 10; // 10–50%
}

export function getMRP(price, discount) {
  return Math.round(Number(price) / (1 - discount / 100));
}

function Star({ type }) {
  if (type === "full") {
    return (
      <svg viewBox="0 0 20 20" className="h-4 w-4 text-[#FFA41C]" aria-hidden="true">
        <path fill="currentColor" d="M9.999 1.5 12.6 6.77l5.82.846-4.21 4.104.994 5.794L10 14.78l-5.204 2.734.994-5.794L1.58 7.616l5.82-.846L9.999 1.5Z" />
      </svg>
    );
  }
  if (type === "half") {
    return (
      <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
        <defs>
          <linearGradient id="halfCard">
            <stop offset="50%" stopColor="#FFA41C" />
            <stop offset="50%" stopColor="#E0E0E0" />
          </linearGradient>
        </defs>
        <path fill="url(#halfCard)" d="M9.999 1.5 12.6 6.77l5.82.846-4.21 4.104.994 5.794L10 14.78l-5.204 2.734.994-5.794L1.58 7.616l5.82-.846L9.999 1.5Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 text-[#E0E0E0]" aria-hidden="true">
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

export default function ProductCard({
  product,
  onAddToCart,
  adding = false,
}) {
  const { user } = useAuth();
  const { wishlistIds, toggle } = useWishlist();
  const navigate = useNavigate();
  const [wishToggling, setWishToggling] = useState(false);

  const id = product?.id;
  const name = product?.name ?? "Untitled";
  const price = Number(product?.price ?? 0);
  const rating = Math.max(0, Math.min(5, Number(product?.rating ?? 0)));
  const reviewCount = Math.max(0, Number(product?.review_count ?? 0));
  const imageUrl = resolveProductImage(product, productFallbackImage(product, 600));

  const stars = renderStars(rating);
  const rupees = Math.floor(price);
  const discount = getDiscount(id);
  const mrp = getMRP(price, discount);
  const isWishlisted = wishlistIds.has(Number(id));

  async function handleWishlistClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { navigate("/login"); return; }
    if (wishToggling) return;
    setWishToggling(true);
    try {
      await toggle(id);
    } finally {
      setWishToggling(false);
    }
  }

  return (
    <div className="group relative flex h-full flex-col rounded-md border border-[#DDD] bg-white transition-shadow duration-300 hover:shadow-[0_4px_16px_rgba(0,0,0,0.15)]">
      {/* Discount badge */}
      <span className="absolute left-0 top-3 z-10 rounded-r-sm bg-[#CC0C39] px-2 py-0.5 text-xs font-bold text-white shadow-sm">
        {discount}% off
      </span>

      {/* Wishlist heart button */}
      <button
        type="button"
        onClick={handleWishlistClick}
        disabled={wishToggling}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-sm transition-all duration-200 hover:scale-110 hover:bg-white"
      >
        <svg
          className={`h-4 w-4 transition-colors duration-200 ${isWishlisted ? "text-[#CC0C39]" : "text-[#888]"}`}
          viewBox="0 0 24 24"
          fill={isWishlisted ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={isWishlisted ? 0 : 1.8}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>
      </button>

      <Link to={id ? `/products/${id}` : "#"} className="block overflow-hidden bg-white p-4 rounded-t-md">
        <img
          src={imageUrl}
          onError={(e) => handleImageFallback(e, productFallbackImage(product, 600))}
          alt={product?.alt_text ?? name}
          className="mx-auto aspect-square w-full object-contain transition-transform duration-500 ease-out group-hover:scale-110"
          loading="lazy"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-1.5 px-4 pb-4">
        <Link
          to={id ? `/products/${id}` : "#"}
          className="line-clamp-2 text-sm text-[#0F1111] hover:text-[#C7511F] transition-colors"
        >
          {name}
        </Link>

        <div className="flex items-center gap-1">
          <div className="flex items-center" aria-label={`Rating ${rating} out of 5`}>
            {stars.map((type, i) => (
              <Star key={i} type={type} />
            ))}
          </div>
          <Link
            to={id ? `/products/${id}` : "#"}
            className="text-xs text-[#007185] hover:text-[#C7511F]"
          >
            {reviewCount.toLocaleString()}
          </Link>
        </div>

        <div className="mt-0.5">
          <div className="flex items-baseline gap-2">
            <span className="text-sm text-[#CC0C39] font-medium">-{discount}%</span>
            <span>
              <span className="text-xs align-top">₹</span>
              <span className="text-xl font-medium text-[#0F1111]">{rupees.toLocaleString("en-IN")}</span>
            </span>
          </div>
          <p className="text-xs text-[#565959]">
            M.R.P.: <span className="line-through">₹{mrp.toLocaleString("en-IN")}</span>
          </p>
        </div>

        <p className="text-xs text-[#565959]">
          FREE delivery <span className="font-bold">Tomorrow</span>
        </p>

        <button
          type="button"
          disabled={!onAddToCart || adding}
          onClick={() => onAddToCart?.(product)}
          className="mt-auto rounded-full bg-[#FFD814] px-3 py-1.5 text-sm font-medium text-[#0F1111] shadow-sm transition-colors hover:bg-[#F7CA00] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {adding ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

