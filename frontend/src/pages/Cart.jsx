import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { handleImageFallback, productFallbackImage, resolveProductImage } from "../lib/productImage";

function formatPrice(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function Cart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState({});

  const loadCart = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/cart");
      setItems(res.data?.items ?? []);
    } catch (e) {
      setError(e?.response?.data?.message ?? "Failed to load cart.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  async function updateQuantity(item, delta) {
    const newQty = item.quantity + delta;
    if (newQty < 1) return;

    setBusy((prev) => ({ ...prev, [item.id]: true }));
    try {
      await api.put(`/cart/${item.id}`, { quantity: newQty });
      setItems((prev) =>
        prev.map((ci) => (ci.id === item.id ? { ...ci, quantity: newQty } : ci))
      );
      window.dispatchEvent(new Event("cart-updated"));
    } catch {
      // reload to get consistent state
      await loadCart();
    } finally {
      setBusy((prev) => ({ ...prev, [item.id]: false }));
    }
  }

  async function removeItem(item) {
    setBusy((prev) => ({ ...prev, [item.id]: true }));
    try {
      await api.delete(`/cart/${item.id}`);
      setItems((prev) => prev.filter((ci) => ci.id !== item.id));
      window.dispatchEvent(new Event("cart-updated"));
    } catch {
      await loadCart();
    } finally {
      setBusy((prev) => ({ ...prev, [item.id]: false }));
    }
  }

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="mx-auto max-w-5xl p-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-500">
        <Link className="hover:underline" to="/">Home</Link>
        <span className="mx-1">/</span>
        <span className="text-slate-900">Cart</span>
      </nav>

      <h1 className="mt-3 text-2xl font-semibold">Shopping Cart</h1>

      {loading && (
        <p className="mt-6 animate-pulse text-slate-500">Loading cart…</p>
      )}

      {error && (
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="mt-6 rounded-md border border-slate-200 bg-white p-8 text-center">
          <p className="text-slate-500">Your cart is empty.</p>
          <Link
            to="/"
            className="mt-4 inline-block rounded-full bg-[#FFD814] px-5 py-2 text-sm font-medium text-[#0F1111] hover:bg-[#F7CA00]"
          >
            Continue Shopping
          </Link>
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* ── Cart Items ── */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {items.map((item) => {
              const itemBusy = busy[item.id] ?? false;
              const lineTotal = Number(item.price) * item.quantity;

              return (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  {/* Image */}
                  <Link to={`/products/${item.product_id}`} className="flex-shrink-0">
                    <img
                      src={resolveProductImage(item, productFallbackImage(item, 120))}
                      onError={(e) => handleImageFallback(e, productFallbackImage(item, 120))}
                      alt={item.name}
                      className="h-28 w-28 rounded-lg object-contain"
                      loading="lazy"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex flex-1 flex-col gap-1">
                    <Link
                      to={`/products/${item.product_id}`}
                      className="text-sm font-medium text-slate-900 hover:underline line-clamp-2"
                    >
                      {item.name}
                    </Link>

                    <p className="text-sm font-semibold text-slate-900">
                      {formatPrice(item.price)}
                    </p>

                    <p className={`text-xs ${item.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                      {item.stock > 0 ? "In Stock" : "Out of Stock"}
                    </p>

                    {/* Quantity controls */}
                    <div className="mt-auto flex items-center gap-3 pt-2">
                      <div className="flex items-center rounded-md border border-slate-200">
                        <button
                          type="button"
                          disabled={itemBusy || item.quantity <= 1}
                          onClick={() => updateQuantity(item, -1)}
                          className="px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="min-w-[2rem] text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          disabled={itemBusy}
                          onClick={() => updateQuantity(item, 1)}
                          className="px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs text-slate-400">|</span>

                      <button
                        type="button"
                        disabled={itemBusy}
                        onClick={() => removeItem(item)}
                        className="text-sm text-red-600 hover:underline disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Line total */}
                  <div className="flex-shrink-0 text-right">
                    <p className="text-sm font-semibold text-slate-900">
                      {formatPrice(lineTotal)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Order Summary ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Order Summary</h2>

              <div className="mt-4 flex flex-col gap-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
              </div>

              <hr className="my-4 border-slate-200" />

              <div className="flex justify-between text-lg font-bold text-slate-900">
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <Link
                to="/checkout"
                className="mt-5 block w-full rounded-full bg-[#FFD814] py-3 text-center text-sm font-semibold text-[#0F1111] hover:bg-[#F7CA00]"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/"
                className="mt-2 block w-full text-center text-sm text-slate-500 hover:underline"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

