import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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

function EmailPopup({ order, cartItems, userEmail, onClose }) {
  // Stable auto-close timer
  useEffect(() => {
    const t = setTimeout(onClose, 9000);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const total = cartItems?.reduce((s, i) => s + Number(i.price) * i.quantity, 0) ?? Number(order?.total_amount ?? 0);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-4" style={{ animation: 'fadeInUp 0.25s ease' }}>
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Dark header bar */}
        <div className="bg-[#131921] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FF9900]">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] text-[#ccc]">Email Confirmation Sent</p>
              <p className="text-sm font-semibold text-white">Order #{order?.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#aaa] hover:text-white text-2xl leading-none" aria-label="Close">×</button>
        </div>

        {/* Email body preview */}
        <div className="px-5 py-4">
          <div className="mb-4 rounded-lg bg-[#F7F8F9] px-4 py-3 text-xs text-[#565959] space-y-0.5">
            <p><span className="font-semibold text-[#0F1111]">From:</span> no-reply@amazon.in</p>
            <p><span className="font-semibold text-[#0F1111]">To:</span> {userEmail || "your email"}</p>
            <p><span className="font-semibold text-[#0F1111]">Subject:</span> Your Amazon.in order #{order?.id} is confirmed</p>
          </div>

          <p className="text-sm text-[#0F1111]">Hi {userEmail ? userEmail.split("@")[0] : "there"},</p>
          <p className="mt-1.5 text-sm text-[#565959] leading-relaxed">
            Thank you for shopping on Amazon.in! Your order has been placed and will be processed shortly.
          </p>

          {/* Items list */}
          {cartItems && cartItems.length > 0 && (
            <div className="mt-3 space-y-1.5">
              {cartItems.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <img
                    src={resolveProductImage(item, productFallbackImage(item, 36))}
                    onError={(e) => handleImageFallback(e, productFallbackImage(item, 36))}
                    alt={item.name}
                    className="h-9 w-9 rounded-md object-contain border border-[#EEE] bg-white flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="line-clamp-1 font-medium text-[#0F1111]">{item.name}</p>
                    <p className="text-[#565959]">Qty: {item.quantity} · {formatPrice(Number(item.price) * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-3 rounded-lg border border-[#DDD] p-3 space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-[#565959]">Order Total</span>
              <span className="font-bold text-[#B12704]">{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-[#565959]">Estimated Delivery</span>
              <span className="font-medium text-[#007600]">2–5 Business Days</span>
            </div>
          </div>

          <p className="mt-3 text-xs text-[#565959]">
            Track your order in{" "}
            <Link to="/orders" onClick={onClose} className="text-[#007185] hover:underline font-medium">
              Your Orders
            </Link>.
          </p>
        </div>

        {/* Footer */}
        <div className="border-t border-[#EEE] bg-[#F7F8F9] px-5 py-3 flex items-center justify-between">
          <p className="text-[11px] text-[#999]">Auto-closes in a few seconds</p>
          <button
            onClick={onClose}
            className="rounded-full bg-[#FFD814] px-4 py-1.5 text-xs font-semibold text-[#0F1111] hover:bg-[#F7CA00] transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccess() {
  const location = useLocation();
  const { user } = useAuth();
  const order = location.state?.order;
  const items = location.state?.items;
  const cartItems = location.state?.cartItems; // cart items with product names & images
  const [showEmailPopup, setShowEmailPopup] = useState(false);

  // Show popup after a brief tick so the page renders first
  useEffect(() => {
    if (order) {
      const t = setTimeout(() => setShowEmailPopup(true), 300);
      return () => clearTimeout(t);
    }
  }, [order]);

  const handleClosePopup = useCallback(() => setShowEmailPopup(false), []);

  return (
    <div className="mx-auto max-w-5xl p-6">
      {showEmailPopup && (
        <EmailPopup
          order={order}
          cartItems={cartItems}
          userEmail={user?.email}
          onClose={handleClosePopup}
        />
      )}

      {/* Success header */}
      <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-green-800">Order Placed!</h1>
        <p className="mt-1 text-sm text-green-700">
          Thank you for your purchase.
        </p>
      </div>

      {order && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Order Details</h2>

          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <span className="text-slate-500">Order ID</span>
              <p className="font-medium text-slate-900">#{order.id}</p>
            </div>
            <div>
              <span className="text-slate-500">Status</span>
              <p className="font-medium capitalize text-slate-900">{order.status}</p>
            </div>
            <div>
              <span className="text-slate-500">Total</span>
              <p className="font-medium text-slate-900">{formatPrice(order.total_amount)}</p>
            </div>
            <div>
              <span className="text-slate-500">Date</span>
              <p className="font-medium text-slate-900">
                {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {order.shipping_address && (
            <div className="mt-4">
              <span className="text-sm text-slate-500">Ship to</span>
              <p className="text-sm font-medium text-slate-900">
                {order.shipping_address.full_name}
              </p>
              <p className="text-sm text-slate-600">
                {order.shipping_address.line1}
                {order.shipping_address.line2 ? `, ${order.shipping_address.line2}` : ""}
              </p>
              <p className="text-sm text-slate-600">
                {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}
              </p>
            </div>
          )}
        </div>
      )}

      {(cartItems?.length > 0 || items?.length > 0) && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Items Ordered</h2>
          <div className="mt-3 flex flex-col divide-y divide-slate-100">
            {(cartItems ?? items ?? []).map((item, i) => (
              <div key={item.id ?? i} className="flex items-center gap-3 py-3 text-sm">
                {item.image_url && (
                  <img
                    src={resolveProductImage(item, productFallbackImage(item, 56))}
                    onError={(e) => handleImageFallback(e, productFallbackImage(item, 56))}
                    alt={item.name}
                    className="h-14 w-14 rounded-md object-contain border border-[#EEE] bg-white flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 line-clamp-1">
                    {item.name ?? `Product #${item.product_id}`}
                  </p>
                  <p className="text-[#565959]">Qty: {item.quantity}</p>
                </div>
                <span className="font-medium text-slate-900 flex-shrink-0">
                  {formatPrice(Number(item.price ?? item.unit_price) * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex gap-4">
        <Link
          to="/"
          className="rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-amber-300"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

