import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

// ──────────────────────────────────────────────────────────
// Conversation tree — each node has a message and quick-replies
// ──────────────────────────────────────────────────────────
const TREE = {
  start: {
    text: "Hello! I'm Alexa, Amazon's virtual assistant 👋\n\nHow can I help you today?",
    replies: [
      { label: "📦 Track my order", next: "track_order" },
      { label: "↩️ Return or replace an item", next: "return_item" },
      { label: "🚚 Delivery issues", next: "delivery" },
      { label: "❓ Product questions", next: "product_questions" },
      { label: "💳 Payment & offers", next: "payment" },
      { label: "🎧 Speak to an agent", next: "speak_agent" },
    ],
  },
  track_order: {
    text: "You can track your order in the Orders section. Click the button below or go to Account → Your Orders.",
    action: { label: "View My Orders", to: "/orders" },
    replies: [
      { label: "Order not delivered yet", next: "not_delivered" },
      { label: "Order arrived damaged", next: "damaged" },
      { label: "⬅️ Back to menu", next: "start" },
    ],
  },
  not_delivered: {
    text: "If your expected delivery date has passed:\n\n• Check the tracking link in Your Orders\n• Allow 1 extra business day for delays\n• Verify the delivery address is correct\n\nIf still not received after 3 days past the date, contact our support team.",
    replies: [
      { label: "Contact support", next: "speak_agent" },
      { label: "⬅️ Back to menu", next: "start" },
    ],
  },
  damaged: {
    text: "We're sorry your item arrived damaged! You can report this in Your Orders:\n\n1. Go to Your Orders\n2. Select the order\n3. Click 'Problem with order'\n4. Choose 'Item damaged'\n\nWe'll arrange a free replacement or full refund!",
    action: { label: "Go to My Orders", to: "/orders" },
    replies: [
      { label: "⬅️ Back to menu", next: "start" },
    ],
  },
  return_item: {
    text: "Returns are easy on Amazon! 🎉\n\nMost items can be returned within 30 days of delivery for a full refund.",
    replies: [
      { label: "How do I start a return?", next: "how_return" },
      { label: "Refund status", next: "refund_status" },
      { label: "Return window expired", next: "return_expired" },
      { label: "⬅️ Back to menu", next: "start" },
    ],
  },
  how_return: {
    text: "To start a return:\n\n1. Go to Your Orders\n2. Find the item you want to return\n3. Click 'Return or Replace Items'\n4. Select a reason and submit\n\nYou'll receive a return label by email within minutes!",
    action: { label: "Start a Return", to: "/orders" },
    replies: [
      { label: "⬅️ Back to menu", next: "start" },
    ],
  },
  refund_status: {
    text: "Refunds are typically processed within 3-5 business days after we receive your item.\n\n💳 Credit/Debit cards: 3-5 days\n🔄 Amazon Pay balance: Instant\n🏦 Bank transfer: 5-7 days",
    replies: [
      { label: "⬅️ Back to menu", next: "start" },
    ],
  },
  return_expired: {
    text: "If the return window has expired, you may still be eligible under warranty. Please contact our support team and we'll do our best to help you.",
    replies: [
      { label: "Contact support", next: "speak_agent" },
      { label: "⬅️ Back to menu", next: "start" },
    ],
  },
  delivery: {
    text: "Most Amazon orders are delivered within:\n\n🚀 Same-day: Select pin codes\n⚡ 1-day delivery: Prime members\n📦 Standard: 2-5 business days\n\nFree delivery on orders above ₹499!",
    replies: [
      { label: "Order not yet arrived", next: "not_delivered" },
      { label: "Wrong item delivered", next: "wrong_item" },
      { label: "Change delivery address", next: "change_address" },
      { label: "⬅️ Back to menu", next: "start" },
    ],
  },
  wrong_item: {
    text: "We're sorry about that! To report a wrong item:\n\n1. Go to Your Orders\n2. Select the affected order\n3. Click 'Problem with order'\n4. Choose 'Received wrong item'\n\nWe'll send the correct item as soon as possible!",
    action: { label: "Report Issue", to: "/orders" },
    replies: [
      { label: "⬅️ Back to menu", next: "start" },
    ],
  },
  change_address: {
    text: "You can change the delivery address before the order is shipped:\n\n1. Go to Your Orders\n2. Click 'Change delivery instructions'\n\nIf the order is already shipped, we may not be able to change the address, but our support team will try their best.",
    action: { label: "View My Orders", to: "/orders" },
    replies: [
      { label: "⬅️ Back to menu", next: "start" },
    ],
  },
  product_questions: {
    text: "I can help with product info! What would you like to know?",
    replies: [
      { label: "Product not as described", next: "not_as_described" },
      { label: "Check product availability", next: "availability" },
      { label: "Product recommendations", next: "recommendations" },
      { label: "⬅️ Back to menu", next: "start" },
    ],
  },
  not_as_described: {
    text: "If a product is not as described:\n\n• You can return it within 30 days for a full refund\n• Leave a review to help other customers\n• Report the listing to Amazon\n\nWould you like to start a return?",
    replies: [
      { label: "Start a return", next: "how_return" },
      { label: "⬅️ Back to menu", next: "start" },
    ],
  },
  availability: {
    text: "To check product availability:\n\n• Use the search bar at the top\n• Filter by category\n• Check stock on the product page\n\nOut-of-stock items often restock within 1-2 weeks!",
    action: { label: "Browse Products", to: "/" },
    replies: [
      { label: "⬅️ Back to menu", next: "start" },
    ],
  },
  recommendations: {
    text: "Check out our curated sections:\n\n🔥 Today's Deals — best discounts\n✨ New Releases — latest products\n⭐ Top Rated — customer favorites",
    replies: [
      { label: "Today's Deals", next: "go_deals" },
      { label: "New Releases", next: "go_new" },
      { label: "⬅️ Back to menu", next: "start" },
    ],
  },
  go_deals: {
    text: "Redirecting you to Today's Deals! 🔥",
    action: { label: "View Today's Deals", to: "/deals" },
    replies: [{ label: "⬅️ Back to menu", next: "start" }],
  },
  go_new: {
    text: "Redirecting you to New Releases! ✨",
    action: { label: "View New Releases", to: "/new-releases" },
    replies: [{ label: "⬅️ Back to menu", next: "start" }],
  },
  payment: {
    text: "We accept all major payment methods:\n\n💳 Credit & Debit cards (Visa, MasterCard, RuPay)\n📱 UPI (GPay, PhonePe, Paytm)\n🏦 Net Banking\n💰 Amazon Pay balance\n📦 Cash on Delivery (eligible orders)",
    replies: [
      { label: "Payment failed", next: "payment_failed" },
      { label: "Check for offers & coupons", next: "offers" },
      { label: "⬅️ Back to menu", next: "start" },
    ],
  },
  payment_failed: {
    text: "If your payment failed:\n\n1. Check your bank balance\n2. Ensure card details are correct\n3. Try a different payment method\n4. Contact your bank if the issue persists\n\nNote: If money was deducted but order wasn't confirmed, it will be automatically refunded in 5-7 business days.",
    replies: [
      { label: "Contact support", next: "speak_agent" },
      { label: "⬅️ Back to menu", next: "start" },
    ],
  },
  offers: {
    text: "🎉 Current offers:\n\n• 10-50% off on electronics\n• Free delivery on orders ₹499+\n• Bank discounts on select cards\n• Flash deals in Today's Deals section",
    action: { label: "See Today's Deals", to: "/deals" },
    replies: [
      { label: "⬅️ Back to menu", next: "start" },
    ],
  },
  speak_agent: {
    text: "Our customer support team is available 24/7! 🎧\n\n📞 Toll-free: 1800-3000-9009\n📧 Email: support@amazon.in\n⏰ Live chat: Mon–Sun, 6 AM – 11 PM\n\nYou can also visit our Customer Service center.",
    action: { label: "Customer Service", to: "/customer-service" },
    replies: [
      { label: "⬅️ Back to menu", next: "start" },
    ],
  },
};

// ──────────────────────────────────────────────────────────
// Main chatbot component
// ──────────────────────────────────────────────────────────
export default function AmazonChatBot() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // Show welcome message when opened for first time
  useEffect(() => {
    if (open && messages.length === 0) {
      pushBotMessage("start");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function pushBotMessage(nodeKey) {
    const node = TREE[nodeKey];
    if (!node) return;
    setTyping(true);
    const delay = Math.min(800 + node.text.length * 5, 1800);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: node.text, action: node.action, replies: node.replies, key: nodeKey },
      ]);
    }, delay);
  }

  function handleReply(reply) {
    // Add user bubble
    setMessages((prev) => [
      ...prev,
      { role: "user", text: reply.label },
    ]);
    // Clear old quick-reply options by "sealing" last bot message
    setMessages((prev) =>
      prev.map((m, i) => (i === prev.length - 2 ? { ...m, replies: [] } : m))
    );
    pushBotMessage(reply.next);
  }

  function handleActionClick(to) {
    setOpen(false);
    navigate(to);
  }

  function handleReset() {
    setMessages([]);
    pushBotMessage("start");
  }

  return (
    <>
      {/* Chat window */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 flex w-80 flex-col rounded-2xl bg-white shadow-[0_8px_40px_rgba(0,0,0,0.25)] overflow-hidden"
          style={{ animation: "fadeInUp 0.25s ease" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-[#131921] px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF9900]">
                <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 2c2.12 0 4.06.76 5.57 2H6.43C7.94 4.76 9.88 4 12 4zm-7.43 4h14.86C20.43 9.4 21 10.64 21 12s-.57 2.6-1.57 4H4.57C3.57 14.6 3 13.36 3 12s.57-2.6 1.57-4z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-white leading-tight">Alexa</p>
                <p className="text-[10px] text-[#FF9900] leading-tight">Amazon Virtual Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                title="Restart chat"
                className="text-[#999] hover:text-white transition-colors text-lg leading-none"
                aria-label="Restart"
              >↺</button>
              <button
                onClick={() => setOpen(false)}
                className="text-[#999] hover:text-white transition-colors text-xl leading-none"
                aria-label="Close chat"
              >×</button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4 bg-[#F7F8FA]" style={{ maxHeight: "360px", minHeight: "200px" }}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-line ${
                    msg.role === "user"
                      ? "bg-[#FFD814] text-[#0F1111] rounded-br-sm"
                      : "bg-white text-[#0F1111] shadow-sm rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                </div>
                {/* Action button */}
                {msg.action && (
                  <button
                    onClick={() => handleActionClick(msg.action.to)}
                    className="mt-1.5 self-start rounded-full border border-[#007185] px-3 py-1 text-xs font-medium text-[#007185] hover:bg-[#007185] hover:text-white transition-colors"
                  >
                    {msg.action.label} →
                  </button>
                )}
                {/* Quick reply chips */}
                {msg.replies && msg.replies.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {msg.replies.map((r) => (
                      <button
                        key={r.next}
                        onClick={() => handleReply(r)}
                        className="rounded-full border border-[#DDD] bg-white px-3 py-1 text-xs text-[#007185] hover:border-[#007185] hover:bg-[#E8F4F5] transition-colors"
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div className="flex items-start">
                <div className="flex gap-1 rounded-2xl rounded-bl-sm bg-white px-4 py-3 shadow-sm">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-2 w-2 rounded-full bg-[#999] animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer */}
          <div className="border-t border-[#EEE] bg-white px-4 py-2 text-center">
            <p className="text-[10px] text-[#999]">Powered by Amazon Customer Service</p>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open Amazon chat assistant"}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-300 hover:scale-110 ${
          open ? "bg-[#232F3E]" : "bg-[#FF9900]"
        }`}
      >
        {open ? (
          <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
          </svg>
        )}

        {/* Notification dot when closed */}
        {!open && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#CC0C39] text-[9px] font-bold text-white flex items-center justify-center">
            1
          </span>
        )}
      </button>
    </>
  );
}
