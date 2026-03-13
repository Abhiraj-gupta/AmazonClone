import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
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

const emptyAddress = {
  fullName: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  zip: "",
  country: "India",
};

export default function Checkout() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [address, setAddress] = useState(emptyAddress);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  const loadCart = useCallback(async () => {
    setLoadingCart(true);
    try {
      const res = await api.get("/cart");
      setItems(res.data?.items ?? []);
    } catch {
      setItems([]);
    } finally {
      setLoadingCart(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  function handleField(e) {
    setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const requiredFilled =
    address.fullName.trim() &&
    address.line1.trim() &&
    address.city.trim() &&
    address.state.trim() &&
    address.zip.trim();

  async function handlePlaceOrder(e) {
    e.preventDefault();
    if (!requiredFilled || items.length === 0) return;

    setPlacing(true);
    setError("");
    try {
      const cartSnapshot = [...items]; // snapshot with product names before clearing
      const res = await api.post("/orders", {
        shipping_address: {
          full_name: address.fullName.trim(),
          line1: address.line1.trim(),
          line2: address.line2.trim(),
          city: address.city.trim(),
          state: address.state.trim(),
          zip: address.zip.trim(),
          country: address.country,
        },
        items: items.map((ci) => ({
          product_id: ci.product_id,
          quantity: ci.quantity,
        })),
      });
      // Clear the cart after successful order
      try { await api.delete("/cart"); } catch { /* non-fatal */ }
      navigate("/order-success", {
        state: { order: res.data.order, items: res.data.items, cartItems: cartSnapshot },
      });
      window.dispatchEvent(new Event("cart-updated"));
    } catch (err) {
      setError(err?.response?.data?.message ?? "Failed to place order.");
      setPlacing(false);
    }
  }

  const inputClass =
    "w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-amber-400";

  return (
    <div className="mx-auto max-w-5xl p-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-500">
        <Link className="hover:underline" to="/">Home</Link>
        <span className="mx-1">/</span>
        <Link className="hover:underline" to="/cart">Cart</Link>
        <span className="mx-1">/</span>
        <span className="text-slate-900">Checkout</span>
      </nav>

      <h1 className="mt-3 text-2xl font-semibold">Checkout</h1>

      {loadingCart && (
        <p className="mt-6 animate-pulse text-slate-500">Loading order details…</p>
      )}

      {!loadingCart && items.length === 0 && (
        <div className="mt-6 rounded-md border border-slate-200 bg-white p-8 text-center">
          <p className="text-slate-500">Your cart is empty — nothing to checkout.</p>
          <Link
            to="/"
            className="mt-4 inline-block rounded-full bg-[#FFD814] px-5 py-2 text-sm font-medium text-[#0F1111] hover:bg-[#F7CA00]"
          >
            Continue Shopping
          </Link>
        </div>
      )}

      {!loadingCart && items.length > 0 && (
        <form onSubmit={handlePlaceOrder} className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* ── Shipping Address ── */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Shipping Address</h2>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-600">Full Name *</label>
                  <input
                    name="fullName"
                    value={address.fullName}
                    onChange={handleField}
                    required
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-600">Address Line 1 *</label>
                  <input
                    name="line1"
                    value={address.line1}
                    onChange={handleField}
                    required
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-600">Address Line 2</label>
                  <input
                    name="line2"
                    value={address.line2}
                    onChange={handleField}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600">City *</label>
                  <input
                    name="city"
                    value={address.city}
                    onChange={handleField}
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600">State *</label>
                  <input
                    name="state"
                    value={address.state}
                    onChange={handleField}
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600">PIN Code *</label>
                  <input
                    name="zip"
                    value={address.zip}
                    onChange={handleField}
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600">Country</label>
                  <input
                    name="country"
                    value={address.country}
                    onChange={handleField}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* ── Items Review ── */}
            <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Review Items</h2>

              <div className="mt-4 flex flex-col divide-y divide-slate-100">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 py-3">
                    <img
                      src={resolveProductImage(item, productFallbackImage(item, 64))}
                      onError={(e) => handleImageFallback(e, productFallbackImage(item, 64))}
                      alt={item.name}
                      className="h-16 w-16 rounded-lg object-contain"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 flex-shrink-0">
                      {formatPrice(Number(item.price) * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Order Summary ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Order Summary</h2>

              <div className="mt-4 flex flex-col gap-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Items ({totalItems})</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
              </div>

              <hr className="my-4 border-slate-200" />

              <div className="flex justify-between text-lg font-bold text-slate-900">
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              {error && (
                <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={placing || !requiredFilled}
                className="mt-5 w-full rounded-full bg-[#FFD814] py-3 text-sm font-semibold text-[#0F1111] hover:bg-[#F7CA00] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {placing ? "Placing Order…" : "Place Order"}
              </button>

              <Link
                to="/cart"
                className="mt-2 block w-full text-center text-sm text-slate-500 hover:underline"
              >
                Back to Cart
              </Link>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

