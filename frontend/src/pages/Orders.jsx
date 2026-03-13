import { useEffect, useState } from "react";
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

const STATUS_META = {
  pending:          { color: "bg-yellow-100 text-yellow-800 border border-yellow-300",  label: "Pending",          icon: "🕐" },
  confirmed:        { color: "bg-blue-100 text-blue-800 border border-blue-300",        label: "Confirmed",        icon: "✅" },
  shipped:          { color: "bg-purple-100 text-purple-800 border border-purple-300",  label: "Shipped",          icon: "🚚" },
  delivered:        { color: "bg-green-100 text-green-800 border border-green-300",     label: "Delivered",        icon: "📦" },
  cancelled:        { color: "bg-red-100 text-red-800 border border-red-300",           label: "Cancelled",        icon: "✖" },
  return_requested: { color: "bg-orange-100 text-orange-800 border border-orange-300",  label: "Return Requested", icon: "↩" },
  returned:         { color: "bg-gray-100 text-gray-600 border border-gray-300",        label: "Returned",         icon: "↩" },
};

function ConfirmModal({ type, orderId, onConfirm, onCancel, loading }) {
  const isCancelling = type === "cancel";
  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50 px-4"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${isCancelling ? "bg-red-100" : "bg-orange-100"}`}>
          {isCancelling ? (
            <svg className="h-7 w-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-7 w-7 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>
          )}
        </div>
        <h2 className="text-center text-lg font-bold text-[#0F1111]">
          {isCancelling ? "Cancel this order?" : "Request a return?"}
        </h2>
        <p className="mt-2 text-center text-sm text-[#565959]">
          {isCancelling
            ? `Order #${orderId} will be cancelled and a refund (if any) will be processed within 5–7 business days.`
            : `A return request will be raised for Order #${orderId}. Our team will contact you with pickup details within 24 hours.`}
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-full border border-[#DDD] py-2.5 text-sm font-semibold text-[#0F1111] hover:bg-[#F7F7F7] transition-colors disabled:opacity-50"
          >
            Keep Order
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 rounded-full py-2.5 text-sm font-bold text-white transition-colors disabled:opacity-50 ${
              isCancelling ? "bg-red-500 hover:bg-red-600" : "bg-[#FF9900] hover:bg-[#E88900]"
            }`}
          >
            {loading ? "Processing…" : isCancelling ? "Yes, Cancel" : "Yes, Return"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState({});
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  async function load() {
    setLoading(true);
    try {
      const res = await api.get("/orders");
      setOrders(res.data?.orders ?? []);
    } catch (e) {
      setError(e?.response?.data?.message ?? "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }

  async function handleAction() {
    if (!confirm) return;
    const { type, orderId } = confirm;
    setActionLoading((p) => ({ ...p, [orderId]: true }));
    try {
      const endpoint = type === "cancel" ? `/orders/${orderId}/cancel` : `/orders/${orderId}/return`;
      const res = await api.patch(endpoint);
      const newStatus = res.data?.order?.status;
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, status: newStatus ?? (type === "cancel" ? "cancelled" : "return_requested") }
            : o
        )
      );
      setToast({
        type: "success",
        msg: type === "cancel"
          ? `Order #${orderId} cancelled successfully.`
          : `Return request raised for Order #${orderId}.`,
      });
    } catch (err) {
      setToast({
        type: "error",
        msg: err?.response?.data?.message ?? "Action failed. Please try again.",
      });
    } finally {
      setActionLoading((p) => ({ ...p, [orderId]: false }));
      setConfirm(null);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 z-[400] -translate-x-1/2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-xl ${
            toast.type === "success" ? "bg-green-600" : "bg-red-500"
          }`}
        >
          {toast.type === "success" ? "✓ " : "✖ "}{toast.msg}
        </div>
      )}

      {/* Confirm modal */}
      {confirm && (
        <ConfirmModal
          type={confirm.type}
          orderId={confirm.orderId}
          loading={!!actionLoading[confirm.orderId]}
          onConfirm={handleAction}
          onCancel={() => setConfirm(null)}
        />
      )}

      <nav className="text-sm text-slate-500">
        <Link className="hover:underline" to="/">Home</Link>
        <span className="mx-1">/</span>
        <span className="text-slate-900">Your Orders</span>
      </nav>

      <h1 className="mt-3 text-2xl font-semibold text-[#0F1111]">Your Orders</h1>

      {loading && (
        <div className="mt-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse rounded-lg border border-slate-200 bg-white p-5">
              <div className="h-4 w-48 rounded bg-slate-200" />
              <div className="mt-3 h-3 w-32 rounded bg-slate-200" />
              <div className="mt-4 flex gap-4">
                <div className="h-16 w-16 rounded bg-slate-200" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-3/4 rounded bg-slate-200" />
                  <div className="h-3 w-1/2 rounded bg-slate-200" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="mt-6 rounded-lg border border-slate-200 bg-white p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
          <p className="mt-3 text-slate-500">You haven't placed any orders yet.</p>
          <Link
            to="/"
            className="mt-4 inline-block rounded-full bg-[#FFD814] px-6 py-2 text-sm font-medium text-[#0F1111] hover:bg-[#F7CA00]"
          >
            Start Shopping
          </Link>
        </div>
      )}

      {!loading && orders.length > 0 && (
        <div className="mt-6 space-y-4">
          {orders.map((order) => {
            const meta = STATUS_META[order.status] ?? STATUS_META.pending;
            const items = order.items ?? [];
            const canCancel = order.status === "pending" || order.status === "confirmed";
            const canReturn = order.status === "delivered";
            const isActing = !!actionLoading[order.id];
            return (
              <div key={order.id} className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
                {/* Order header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-[#F0F2F2] px-5 py-3 text-xs text-slate-600">
                  <div className="flex flex-wrap gap-6">
                    <div>
                      <span className="uppercase tracking-wide">Order Placed</span>
                      <p className="mt-0.5 font-medium text-slate-900 text-sm">
                        {new Date(order.created_at).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <span className="uppercase tracking-wide">Total</span>
                      <p className="mt-0.5 font-medium text-slate-900 text-sm">
                        {formatPrice(order.total_amount)}
                      </p>
                    </div>
                    <div>
                      <span className="uppercase tracking-wide">Ship To</span>
                      <p className="mt-0.5 font-medium text-slate-900 text-sm">
                        {order.shipping_address?.full_name ?? "—"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="uppercase tracking-wide">Order #</span>
                    <p className="mt-0.5 font-medium text-slate-900 text-sm">{order.id}</p>
                  </div>
                </div>

                {/* Order body */}
                <div className="px-5 py-4">
                  {/* Status + action buttons */}
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${meta.color}`}>
                      <span>{meta.icon}</span>
                      {meta.label}
                    </span>

                    <div className="flex gap-2">
                      {canCancel && (
                        <button
                          disabled={isActing}
                          onClick={() => setConfirm({ type: "cancel", orderId: order.id })}
                          className="rounded-full border border-red-300 bg-white px-4 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
                        >
                          {isActing ? "Processing…" : "Cancel Order"}
                        </button>
                      )}
                      {canReturn && (
                        <button
                          disabled={isActing}
                          onClick={() => setConfirm({ type: "return", orderId: order.id })}
                          className="rounded-full border border-[#FF9900] bg-white px-4 py-1.5 text-xs font-semibold text-[#C47A00] hover:bg-[#FFF8EE] disabled:opacity-50 transition-colors"
                        >
                          {isActing ? "Processing…" : "Return Items"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="flex flex-col divide-y divide-slate-100">
                    {items.map((item, idx) => (
                      <div key={item.id ?? idx} className="flex gap-4 py-3">
                        <Link to={`/products/${item.product_id}`} className="flex-shrink-0">
                          <img
                            src={resolveProductImage(item, productFallbackImage(item, 80))}
                            onError={(e) => handleImageFallback(e, productFallbackImage(item, 80))}
                            alt={item.product_name ?? `Product #${item.product_id}`}
                            className="h-20 w-20 rounded-md border border-slate-100 object-contain p-1"
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/products/${item.product_id}`}
                            className="text-sm font-medium text-[#007185] hover:text-[#C7511F] hover:underline line-clamp-2"
                          >
                            {item.product_name ?? `Product #${item.product_id}`}
                          </Link>
                          <p className="mt-1 text-sm text-slate-600">
                            {formatPrice(item.unit_price)} × {item.quantity}
                          </p>
                          {order.status === "delivered" && (
                            <Link
                              to={`/products/${item.product_id}`}
                              className="mt-1 inline-block text-xs text-[#007185] hover:underline"
                            >
                              Write a product review
                            </Link>
                          )}
                        </div>
                        <div className="flex-shrink-0 text-sm font-semibold text-[#0F1111]">
                          {formatPrice(Number(item.unit_price) * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Delivery address */}
                  {order.shipping_address && (
                    <div className="mt-3 rounded-lg border border-slate-100 bg-[#FAFAFA] px-4 py-3 text-xs text-slate-600">
                      <span className="font-semibold text-slate-800">Delivery address: </span>
                      {[
                        order.shipping_address.full_name,
                        order.shipping_address.address,
                        order.shipping_address.city,
                        order.shipping_address.state,
                        order.shipping_address.pincode,
                        order.shipping_address.phone,
                      ].filter(Boolean).join(", ")}
                    </div>
                  )}

                  {/* Status info banners */}
                  {order.status === "cancelled" && (
                    <p className="mt-3 text-xs text-red-600">
                      ✖ This order was cancelled. Refund (if applicable) will be processed within 5–7 business days.
                    </p>
                  )}
                  {order.status === "return_requested" && (
                    <p className="mt-3 text-xs text-orange-600">
                      ↩ Return request raised. Our team will contact you within 24 hours for pickup.
                    </p>
                  )}
                  {order.status === "returned" && (
                    <p className="mt-3 text-xs text-slate-500">
                      ↩ This order has been returned. Refund will be credited within 5–7 business days.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
