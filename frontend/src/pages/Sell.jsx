import { useState } from "react";
import { Link } from "react-router-dom";

function formatPrice(v) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(v);
}

const BENEFITS = [
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Sell to millions",
    desc: "List your products in front of crores of Amazon.in customers from day one.",
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
    title: "Easy fulfillment",
    desc: "Use Fulfillment by Amazon (FBA) and let Amazon handle storage, packing, and delivery.",
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: "Powerful analytics",
    desc: "Track your sales, inventory, and performance with Seller Central dashboard — real time.",
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "Safe & secure payments",
    desc: "Receive payments directly into your bank account every 7 days. Zero fraud risk to you.",
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: "24/7 Seller support",
    desc: "Dedicated seller support team available round-the-clock to help you grow.",
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.37M18.795 3a23.74 23.74 0 01.38 4.505c0 1.66-.18 3.276-.52 4.83M18.795 3a23.74 23.74 0 00-4.51-.38c-1.64 0-3.238.182-4.785.525" />
      </svg>
    ),
    title: "Advertise & grow",
    desc: "Boost visibility with Sponsored Products, Display Ads, and Brand Store to maximize sales.",
  },
];

const HOW_STEPS = [
  { num: 1, title: "Register as a seller", desc: "Create your seller account with your business & bank details. Takes less than 30 minutes." },
  { num: 2, title: "List your products", desc: "Add your products using our simple listing tool. Upload photos, write descriptions, set your price." },
  { num: 3, title: "Customers buy your products", desc: "Your products become available to millions of Amazon.in shoppers immediately after listing." },
  { num: 4, title: "Ship or use FBA", desc: "Ship orders yourself or let Amazon's fulfillment network handle it end-to-end." },
  { num: 5, title: "Get paid", desc: "Payments are deposited directly into your bank account every 7 days, minus Amazon fees." },
];

const FAQS = [
  {
    q: "What does it cost to sell on Amazon?",
    a: "Individual plan: ₹0/month with ₹20 per item sold. Professional plan: ₹999/month with no per-item fee. Referral fees (8–15% of sale price) apply to both plans.",
  },
  {
    q: "What documents do I need?",
    a: "You need a GST number, bank account details, address proof, and a PAN card. For some categories, additional documents may be required.",
  },
  {
    q: "How long does it take to start selling?",
    a: "After submitting your documents and they are verified (typically 1–3 business days), you can start listing and selling immediately.",
  },
  {
    q: "Can I sell in multiple categories?",
    a: "Yes! You can list products across all categories from a single seller account. Some categories require additional approval.",
  },
  {
    q: "What is Fulfillment by Amazon (FBA)?",
    a: "FBA lets you store your products in Amazon's warehouses. Amazon handles packing, shipping, customer service, and returns — you just focus on sourcing and listing.",
  },
  {
    q: "How are returned items handled?",
    a: "Items returned by customers are inspected. Sellable items are returned to your inventory. Unsellable items can be disposed of or sent back to you.",
  },
];

const CATEGORIES = [
  "Clothing & Apparel", "Electronics & Computers", "Home & Kitchen",
  "Books & Stationery", "Sports & Outdoors", "Automotive Parts",
  "Beauty & Personal Care", "Toys & Games", "Food & Grocery",
  "Health & Wellness", "Jewellery & Watches", "Others",
];

const emptyForm = {
  fullName: "", businessName: "", email: "", phone: "",
  city: "", state: "", pincode: "", category: "", gstin: "", agree: false,
};

export default function Sell() {
  const [form, setForm] = useState(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  function handle(e) {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const inputClass = "w-full rounded-md border border-[#DDD] bg-white px-3 py-2 text-sm text-[#0F1111] outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900]";

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="w-full max-w-lg rounded-2xl border border-green-200 bg-green-50 p-10 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-green-800">Application Submitted!</h2>
          <p className="mt-3 text-sm text-green-700 leading-relaxed">
            Thank you, <strong>{form.businessName || form.fullName}</strong>! Your seller application has been received.
            Our team will review your details and contact you at <strong>{form.email}</strong> within 1–3 business days.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/"
              className="rounded-full bg-[#FFD814] px-6 py-2.5 text-sm font-semibold text-[#0F1111] hover:bg-[#F7CA00] transition-colors"
            >
              Back to Shopping
            </Link>
            <button
              onClick={() => { setSubmitted(false); setForm(emptyForm); }}
              className="rounded-full border border-[#DDD] bg-white px-6 py-2.5 text-sm font-semibold text-[#0F1111] hover:bg-[#F7F7F7] transition-colors"
            >
              Submit Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EAEDED]">

      {/* ── Hero ── */}
      <div className="bg-[#131921] text-white">
        <div className="mx-auto max-w-[1500px] px-4 py-14 sm:py-20 text-center">
          <p className="text-[#FF9900] text-sm font-semibold uppercase tracking-widest mb-3">Amazon Seller Central</p>
          <h1 className="text-3xl sm:text-5xl font-bold leading-tight">
            Start Selling on <span className="text-[#FF9900]">Amazon.in</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-[#ccc] text-base sm:text-lg leading-relaxed">
            Reach crores of customers across India. List your products, grow your brand, and get paid — all on one platform.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="#register"
              className="rounded-full bg-[#FF9900] px-8 py-3 text-base font-bold text-white hover:bg-[#E88900] transition-colors shadow-lg"
            >
              Start Selling Today →
            </a>
            <a
              href="#pricing"
              className="rounded-full bg-white/10 border border-white/30 px-8 py-3 text-base font-semibold text-white hover:bg-white/20 transition-colors"
            >
              View Pricing Plans
            </a>
          </div>
          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { val: "8 Crore+", label: "Active Customers" },
              { val: "4 Lakh+", label: "Active Sellers" },
              { val: "75,000+", label: "Cities Covered" },
              { val: "₹0", label: "Setup Cost" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-bold text-[#FF9900]">{s.val}</p>
                <p className="text-xs text-[#ccc] mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Benefits ── */}
      <div className="bg-white py-14">
        <div className="mx-auto max-w-[1500px] px-4">
          <h2 className="text-center text-2xl font-bold text-[#0F1111]">Why sell on Amazon.in?</h2>
          <p className="mt-2 text-center text-sm text-[#565959]">Everything you need to build and grow your online business</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="flex gap-4 rounded-xl border border-[#EEE] bg-[#FAFAFA] p-5 hover:border-[#FF9900] hover:shadow-md transition-all duration-200"
              >
                <div className="flex-shrink-0 text-[#FF9900]">{b.icon}</div>
                <div>
                  <h3 className="font-semibold text-[#0F1111]">{b.title}</h3>
                  <p className="mt-1 text-sm text-[#565959] leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── How it works ── */}
      <div className="bg-[#EAEDED] py-14">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-center text-2xl font-bold text-[#0F1111]">How it works</h2>
          <p className="mt-2 text-center text-sm text-[#565959]">Start selling in just a few days</p>
          <div className="mt-10 space-y-4">
            {HOW_STEPS.map((step) => (
              <div key={step.num} className="flex gap-4 rounded-xl bg-white p-5 shadow-sm">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#FF9900] text-white font-bold text-lg">
                  {step.num}
                </div>
                <div>
                  <h3 className="font-semibold text-[#0F1111]">{step.title}</h3>
                  <p className="mt-1 text-sm text-[#565959]">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Pricing plans ── */}
      <div id="pricing" className="bg-white py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-center text-2xl font-bold text-[#0F1111]">Choose your selling plan</h2>
          <p className="mt-2 text-center text-sm text-[#565959]">Select the plan that fits your business size</p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {/* Individual */}
            <div className="rounded-2xl border-2 border-[#DDD] bg-white p-7 flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#565959]">Individual</p>
              <p className="mt-2 text-3xl font-bold text-[#0F1111]">₹0<span className="text-base font-normal text-[#565959]">/month</span></p>
              <p className="mt-1 text-sm text-[#565959]">+ ₹20 per item sold</p>
              <ul className="mt-6 space-y-2 flex-1">
                {[
                  "Up to 40 listings/month",
                  "Access to all product categories",
                  "Order management tools",
                  "Sell.in dashboard",
                  "Pay-as-you-go model",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[#0F1111]">
                    <svg className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <a href="#register" className="mt-6 block w-full rounded-full border-2 border-[#FF9900] py-2.5 text-center text-sm font-semibold text-[#FF9900] hover:bg-[#FF9900] hover:text-white transition-colors">
                Start Free
              </a>
            </div>
            {/* Professional */}
            <div className="rounded-2xl border-2 border-[#FF9900] bg-white p-7 flex flex-col relative shadow-lg">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#FF9900] px-4 py-1 text-xs font-bold text-white">
                MOST POPULAR
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#FF9900]">Professional</p>
              <p className="mt-2 text-3xl font-bold text-[#0F1111]">{formatPrice(999)}<span className="text-base font-normal text-[#565959]">/month</span></p>
              <p className="mt-1 text-sm text-[#565959]">No per-item fee</p>
              <ul className="mt-6 space-y-2 flex-1">
                {[
                  "Unlimited listings",
                  "Access to all product categories",
                  "Sponsored Products advertising",
                  "Brand Store & A+ content",
                  "FBA eligibility",
                  "Bulk listing & inventory tools",
                  "Advanced analytics & reports",
                  "Priority seller support",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[#0F1111]">
                    <svg className="h-4 w-4 text-[#FF9900] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <a href="#register" className="mt-6 block w-full rounded-full bg-[#FF9900] py-2.5 text-center text-sm font-bold text-white hover:bg-[#E88900] transition-colors">
                Start Professional →
              </a>
            </div>
          </div>
          <p className="mt-6 text-center text-xs text-[#565959]">
            Referral fees of 8–15% apply on every sale. <a href="#faq" className="text-[#007185] hover:underline">See FAQ for details.</a>
          </p>
        </div>
      </div>

      {/* ── Register form ── */}
      <div id="register" className="bg-[#EAEDED] py-14">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-center text-2xl font-bold text-[#0F1111]">Register to Start Selling</h2>
          <p className="mt-2 text-center text-sm text-[#565959]">Fill in the details below and our team will get in touch within 1–3 business days</p>

          <form onSubmit={handleSubmit} className="mt-8 rounded-2xl bg-white p-7 shadow-sm space-y-5">
            {/* Row 1 */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-[#0F1111] mb-1">Full Name <span className="text-red-500">*</span></label>
                <input className={inputClass} name="fullName" value={form.fullName} onChange={handle} placeholder="Your full name" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0F1111] mb-1">Business / Brand Name <span className="text-red-500">*</span></label>
                <input className={inputClass} name="businessName" value={form.businessName} onChange={handle} placeholder="e.g. GuptajiShop" required />
              </div>
            </div>
            {/* Row 2 */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-[#0F1111] mb-1">Email Address <span className="text-red-500">*</span></label>
                <input className={inputClass} name="email" type="email" value={form.email} onChange={handle} placeholder="seller@example.com" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0F1111] mb-1">Mobile Number <span className="text-red-500">*</span></label>
                <input className={inputClass} name="phone" type="tel" value={form.phone} onChange={handle} placeholder="+91 98765 43210" required pattern="[0-9+\s\-()]{7,15}" />
              </div>
            </div>
            {/* Row 3 */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-semibold text-[#0F1111] mb-1">City <span className="text-red-500">*</span></label>
                <input className={inputClass} name="city" value={form.city} onChange={handle} placeholder="New Delhi" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0F1111] mb-1">State <span className="text-red-500">*</span></label>
                <input className={inputClass} name="state" value={form.state} onChange={handle} placeholder="Delhi" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0F1111] mb-1">PIN Code <span className="text-red-500">*</span></label>
                <input className={inputClass} name="pincode" value={form.pincode} onChange={handle} placeholder="110001" required pattern="[0-9]{6}" maxLength={6} />
              </div>
            </div>
            {/* Row 4 */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-[#0F1111] mb-1">Primary Category <span className="text-red-500">*</span></label>
                <select className={inputClass} name="category" value={form.category} onChange={handle} required>
                  <option value="">Select a category</option>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#0F1111] mb-1">GSTIN <span className="text-[#565959] font-normal">(optional)</span></label>
                <input className={inputClass} name="gstin" value={form.gstin} onChange={handle} placeholder="22AAAAA0000A1Z5" maxLength={15} />
              </div>
            </div>

            {/* Pricing plan */}
            <div>
              <label className="block text-xs font-semibold text-[#0F1111] mb-2">Selling Plan</label>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { id: "individual", label: "Individual", sub: "₹0/month + ₹20/item" },
                  { id: "professional", label: "Professional", sub: "₹999/month, no per-item fee" },
                ].map((plan) => (
                  <label
                    key={plan.id}
                    className={`flex items-center gap-3 rounded-lg border-2 px-4 py-3 cursor-pointer transition-colors ${
                      form.plan === plan.id ? "border-[#FF9900] bg-[#FFF8EE]" : "border-[#DDD]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="plan"
                      value={plan.id}
                      checked={form.plan === plan.id}
                      onChange={handle}
                      className="accent-[#FF9900]"
                    />
                    <div>
                      <p className="text-sm font-semibold text-[#0F1111]">{plan.label}</p>
                      <p className="text-xs text-[#565959]">{plan.sub}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Agreement */}
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="agree"
                checked={form.agree}
                onChange={handle}
                required
                className="mt-0.5 accent-[#FF9900]"
              />
              <span className="text-xs text-[#565959] leading-relaxed">
                I agree to Amazon's{" "}
                <span className="text-[#007185] hover:underline cursor-pointer">Seller Agreement</span>,{" "}
                <span className="text-[#007185] hover:underline cursor-pointer">Privacy Notice</span>, and{" "}
                <span className="text-[#007185] hover:underline cursor-pointer">Conditions of Use</span>.
                I confirm all information provided is accurate.
              </span>
            </label>

            <button
              type="submit"
              disabled={!form.agree}
              className="w-full rounded-full bg-[#FF9900] py-3 text-base font-bold text-white hover:bg-[#E88900] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
            >
              Submit Application
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-[#565959]">
            Already a seller?{" "}
            <a href="https://sellercentral.amazon.in" target="_blank" rel="noreferrer" className="text-[#007185] hover:underline">
              Sign in to Seller Central
            </a>
          </p>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div id="faq" className="bg-white py-14">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-center text-2xl font-bold text-[#0F1111]">Frequently Asked Questions</h2>
          <div className="mt-8 space-y-3">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl border border-[#DDD] overflow-hidden"
              >
                <button
                  className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-[#0F1111] hover:bg-[#F7F7F7] transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  {faq.q}
                  <svg
                    className={`h-5 w-5 flex-shrink-0 text-[#565959] transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="border-t border-[#EEE] px-5 py-4 text-sm text-[#565959] leading-relaxed bg-[#FAFAFA]">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom CTA ── */}
      <div className="bg-[#232F3E] py-12 text-center text-white">
        <h2 className="text-2xl font-bold">Ready to grow your business?</h2>
        <p className="mt-2 text-[#ccc] text-sm">Join 4 lakh+ sellers already selling on Amazon.in</p>
        <a
          href="#register"
          className="mt-6 inline-block rounded-full bg-[#FF9900] px-10 py-3 text-base font-bold text-white hover:bg-[#E88900] transition-colors shadow-lg"
        >
          Start Selling Now →
        </a>
      </div>
    </div>
  );
}
