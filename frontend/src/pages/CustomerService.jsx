import { Link } from "react-router-dom";

const HELP_TOPICS = [
  {
    title: "Your Orders",
    desc: "Track, cancel, or return orders",
    icon: "📦",
    link: "/orders",
  },
  {
    title: "Returns & Refunds",
    desc: "Return or exchange items",
    icon: "🔄",
    link: "/orders",
  },
  {
    title: "Account Settings",
    desc: "Manage your account, address, and payments",
    icon: "👤",
    link: "/login",
  },
  {
    title: "Delivery Issues",
    desc: "Missing, late, or damaged deliveries",
    icon: "🚚",
    link: "/orders",
  },
  {
    title: "Payment & Pricing",
    desc: "Issues with charges, gift cards, or coupons",
    icon: "💳",
    link: "/",
  },
  {
    title: "Amazon App",
    desc: "Help with the Amazon shopping app",
    icon: "📱",
    link: "/",
  },
];

const FAQS = [
  {
    q: "How do I track my order?",
    a: "Go to Your Orders page to see real-time tracking information for all your orders.",
  },
  {
    q: "What is the return policy?",
    a: "Most items can be returned within 30 days of delivery. Items must be in original condition.",
  },
  {
    q: "How do I cancel an order?",
    a: "You can cancel an order before it ships from the Your Orders page.",
  },
  {
    q: "Is Cash on Delivery available?",
    a: "Yes, Cash on Delivery (COD) is available on eligible items across India.",
  },
  {
    q: "How do I contact customer support?",
    a: "You can reach us 24/7 through this help center. Our team is always ready to assist you.",
  },
];

export default function CustomerService() {
  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="text-3xl font-bold text-[#0F1111]">Customer Service</h1>
      <p className="mt-1 text-sm text-[#565959]">
        What would you like help with today?
      </p>

      {/* Help Topics Grid */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {HELP_TOPICS.map((topic) => (
          <Link
            key={topic.title}
            to={topic.link}
            className="flex items-start gap-3 rounded-lg border border-[#DDD] bg-white p-4 shadow-sm transition hover:shadow-md hover:border-[#007185]"
          >
            <span className="text-2xl">{topic.icon}</span>
            <div>
              <h3 className="font-bold text-[#007185]">{topic.title}</h3>
              <p className="mt-0.5 text-sm text-[#565959]">{topic.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-[#0F1111]">
          Frequently Asked Questions
        </h2>
        <div className="mt-4 space-y-3">
          {FAQS.map((faq) => (
            <details
              key={faq.q}
              className="group rounded-lg border border-[#DDD] bg-white shadow-sm"
            >
              <summary className="cursor-pointer px-5 py-3 text-sm font-medium text-[#0F1111] hover:text-[#C7511F]">
                {faq.q}
              </summary>
              <p className="border-t border-[#EEE] px-5 py-3 text-sm text-[#565959]">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="mt-10 rounded-lg bg-[#232F3E] p-6 text-center text-white">
        <h2 className="text-lg font-bold">Still need help?</h2>
        <p className="mt-1 text-sm text-[#ccc]">
          Our customer service team is available 24/7
        </p>
        <div className="mt-4 flex justify-center gap-4">
          <div className="rounded-lg bg-[#37475A] px-6 py-3 text-sm">
            📞 1800-XXX-XXXX (Toll Free)
          </div>
          <div className="rounded-lg bg-[#37475A] px-6 py-3 text-sm">
            ✉️ support@amazon.in
          </div>
        </div>
      </div>
    </div>
  );
}
