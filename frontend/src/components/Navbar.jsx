import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";

const LANGUAGES = [
  { code: "EN", label: "English" },
  { code: "HI", label: "Hindi" },
  { code: "TA", label: "Tamil" },
  { code: "TE", label: "Telugu" },
  { code: "KN", label: "Kannada" },
  { code: "ML", label: "Malayalam" },
  { code: "BN", label: "Bengali" },
  { code: "MR", label: "Marathi" },
];

const CATEGORIES = [
  { name: "Men", id: 1 },
  { name: "Women", id: 2 },
  { name: "Electronics", id: 3 },
  { name: "House Essentials", id: 4 },
  { name: "Car Accessories", id: 5 },
];

function CartIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6.5 6.5h15l-1.5 8.5H8L6.5 6.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 6.5 6 4H3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM18 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IndiaFlag({ className }) {
  return (
    <svg className={className} viewBox="0 0 36 24" aria-hidden="true">
      <rect width="36" height="8" fill="#FF9933" />
      <rect y="8" width="36" height="8" fill="#FFFFFF" />
      <rect y="16" width="36" height="8" fill="#138808" />
      <circle cx="18" cy="12" r="3" fill="none" stroke="#000080" strokeWidth="0.5" />
      {/* Ashoka Chakra spokes */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 15 * Math.PI) / 180;
        return (
          <line
            key={i}
            x1={18}
            y1={12}
            x2={18 + 2.7 * Math.sin(angle)}
            y2={12 - 2.7 * Math.cos(angle)}
            stroke="#000080"
            strokeWidth="0.3"
          />
        );
      })}
    </svg>
  );
}

function AmazonLogo() {
  return (
    <div className="flex flex-col items-start leading-none">
      <div className="flex items-baseline">
        <span className="text-[44px] font-bold tracking-tight text-white" style={{ fontFamily: 'Arial, sans-serif' }}>
          amazon
        </span>
        <span className="text-[24px] font-bold text-white" style={{ fontFamily: 'Arial, sans-serif' }}>
          .in
        </span>
      </div>
      <svg viewBox="0 0 112 18" className="-mt-1.5 h-[18px] w-[112px]" aria-hidden="true">
        <path
          d="M2 11 C 13 18, 55 20, 100 4"
          stroke="#FF9900"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <polygon points="95,1 106,4.8 95,8.6" fill="#FF9900" />
      </svg>
    </div>
  );
}

function LocationIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Navbar({ cartCount = 0 }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQ = useMemo(() => searchParams.get("q") ?? "", [searchParams]);
  const [q, setQ] = useState(initialQ);
  const { user, logout } = useAuth();
  const [lang, setLang] = useState("EN");
  const [showLangMenu, setShowLangMenu] = useState(false);

  function onSubmit(e) {
    e.preventDefault();
    const next = q.trim();
    navigate(next ? `/?q=${encodeURIComponent(next)}` : "/");
  }

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* ─── Main bar ─── */}
      <div className="bg-[#131921] text-white">
        <div className="mx-auto flex max-w-[1500px] items-center gap-4 px-4 py-2">
          {/* Logo */}
          <Link
            to="/"
            className="flex flex-shrink-0 items-center border border-transparent px-2 py-1 hover:border-white rounded-sm"
            aria-label="Amazon Home"
          >
            <AmazonLogo />
          </Link>

          {/* Deliver to */}
          <div className="hidden sm:flex items-center gap-1 border border-transparent px-2 py-1 hover:border-white rounded-sm cursor-pointer text-xs leading-tight">
            <LocationIcon className="h-5 w-5 text-white mt-2" />
            <div className="flex flex-col">
              <span className="text-[#ccc]">Deliver to</span>
              <span className="font-bold text-sm text-white">
                Bennett University, Greater Noida
              </span>
            </div>
          </div>

          {/* Search */}
          <form onSubmit={onSubmit} className="flex flex-1 items-center">
            <label className="sr-only" htmlFor="nav-search">
              Search products
            </label>
            <input
              id="nav-search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search Amazon.in"
              className="w-full rounded-l-md border-0 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-[#F3A847]"
              type="search"
            />
            <button
              className="rounded-r-md bg-[#FEBD69] px-4 py-2 text-slate-900 hover:bg-[#F3A847]"
              type="submit"
              aria-label="Search"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
            </button>
          </form>

          {/* Language selector */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              onBlur={() => setTimeout(() => setShowLangMenu(false), 150)}
              className="flex items-center gap-1 border border-transparent px-2 py-1 hover:border-white rounded-sm text-sm text-white"
            >
              <IndiaFlag className="h-4 w-5 rounded-[1px]" />
              {lang}
              <svg className="h-3 w-3" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
                <path d="M2 4l4 4 4-4" />
              </svg>
            </button>
            {showLangMenu && (
              <div className="absolute right-0 top-full mt-1 w-36 rounded-md border border-[#DDD] bg-white py-1 shadow-lg z-50">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l.code); setShowLangMenu(false); }}
                    className={`w-full px-3 py-1.5 text-left text-sm hover:bg-[#F0F0F0] ${
                      lang === l.code ? "font-bold text-[#C7511F]" : "text-[#0F1111]"
                    }`}
                  >
                    {l.code} - {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Account */}
          {user ? (
            <div className="hidden sm:flex flex-col border border-transparent px-2 py-1 rounded-sm text-xs leading-tight">
              <span className="text-[#ccc]">Hello, {user.name}</span>
              <button
                onClick={() => { logout(); navigate("/"); }}
                className="font-bold text-sm text-left hover:text-[#F3A847]"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden sm:flex flex-col border border-transparent px-2 py-1 hover:border-white rounded-sm text-xs leading-tight"
            >
              <span className="text-[#ccc]">Hello, Sign in</span>
              <span className="font-bold text-sm">Account & Lists</span>
            </Link>
          )}

          {/* Orders */}
          <Link
            to="/orders"
            className="hidden sm:flex flex-col border border-transparent px-2 py-1 hover:border-white rounded-sm text-xs leading-tight"
          >
            <span className="text-[#ccc]">Returns</span>
            <span className="font-bold text-sm">& Orders</span>
          </Link>

          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="hidden sm:flex items-center gap-1 border border-transparent px-2 py-1 hover:border-white rounded-sm"
            aria-label="Wishlist"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative flex items-end gap-1 border border-transparent px-2 py-1 hover:border-white rounded-sm"
            aria-label={`Cart (${cartCount} items)`}
          >
            <div className="relative">
              <CartIcon className="h-8 w-8" />
              <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-[#F3A847] text-xs font-bold">
                {cartCount}
              </span>
            </div>
            <span className="text-sm font-bold leading-none mb-0.5">Cart</span>
          </Link>
        </div>
      </div>

      {/* ─── Category bar ─── */}
      <div className="bg-[#232F3E] text-white text-sm">
        <div className="mx-auto flex max-w-[1500px] items-center gap-1 overflow-x-auto px-4 py-1">
          <Link
            to="/"
            className="flex flex-shrink-0 items-center gap-1 rounded-sm border border-transparent px-3 py-1 font-bold hover:border-white"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            All
          </Link>
          <span className="h-5 border-l border-[#5C687A]" aria-hidden="true" />
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/?category=${cat.id}`}
              className="flex-shrink-0 rounded-sm border border-transparent px-3 py-1 hover:border-white"
            >
              {cat.name}
            </Link>
          ))}
          <span className="h-5 border-l border-[#5C687A]" aria-hidden="true" />
          <Link
            to="/deals"
            className="flex-shrink-0 rounded-sm border border-transparent px-3 py-1 hover:border-white"
          >
            Today&apos;s Deals
          </Link>
          <Link
            to="/customer-service"
            className="flex-shrink-0 rounded-sm border border-transparent px-3 py-1 hover:border-white"
          >
            Customer Service
          </Link>
          <Link
            to="/new-releases"
            className="flex-shrink-0 rounded-sm border border-transparent px-3 py-1 hover:border-white"
          >
            New Releases
          </Link>
          <Link
            to="/sell"
            className="flex-shrink-0 rounded-sm border border-transparent px-3 py-1 hover:border-white font-semibold text-[#FF9900]"
          >
            Sell
          </Link>
        </div>
      </div>
    </header>
  );
}

