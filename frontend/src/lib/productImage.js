const OVERRIDE_BY_PRODUCT_ID = {
  10: "/product-images/oversized-knit-cardigan.svg",
  11: "/product-images/wireless-bluetooth-earbuds.svg",
  15: "/product-images/smart-led-desk-lamp.svg",
  21: "/product-images/magnetic-phone-mount.svg",
  22: "/product-images/dual-usb-car-charger.svg",
};

const OVERRIDE_BY_URL = {
  "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop": OVERRIDE_BY_PRODUCT_ID[21],
  "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600&h=600&fit=crop": OVERRIDE_BY_PRODUCT_ID[22],
};

function xmlEscape(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function hashString(value) {
  let h = 0;
  const s = String(value ?? "");
  for (let i = 0; i < s.length; i += 1) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function productFallbackImage(productLike, size = 600) {
  const id = Number(productLike?.id ?? productLike?.product_id ?? 0);
  const name = (
    productLike?.name ??
    productLike?.product_name ??
    "Product"
  ).trim();

  const palettes = [
    ["#E8F2FF", "#D7E8FF", "#2E5FA8"],
    ["#FEEFE8", "#FFDCCB", "#A94A2D"],
    ["#EAF8EC", "#D7F0DB", "#2B6E42"],
    ["#F4EEFF", "#E7DBFF", "#5A3E9C"],
    ["#FFF6E7", "#FFE7BF", "#8A5B00"],
  ];

  const [bg1, bg2, fg] = palettes[hashString(`${id}-${name}`) % palettes.length];
  const safeName = xmlEscape(name.length > 30 ? `${name.slice(0, 27)}...` : name);

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" role="img" aria-label="${safeName}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${bg1}"/>
      <stop offset="1" stop-color="${bg2}"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#g)"/>
  <rect x="${Math.round(size * 0.18)}" y="${Math.round(size * 0.14)}" width="${Math.round(size * 0.64)}" height="${Math.round(size * 0.58)}" rx="${Math.round(size * 0.06)}" fill="#ffffff" opacity="0.92"/>
  <circle cx="${Math.round(size * 0.32)}" cy="${Math.round(size * 0.32)}" r="${Math.round(size * 0.07)}" fill="${fg}" opacity="0.25"/>
  <path d="M${Math.round(size * 0.24)} ${Math.round(size * 0.58)} L${Math.round(size * 0.39)} ${Math.round(size * 0.42)} L${Math.round(size * 0.5)} ${Math.round(size * 0.53)} L${Math.round(size * 0.67)} ${Math.round(size * 0.36)} L${Math.round(size * 0.76)} ${Math.round(size * 0.58)} Z" fill="${fg}" opacity="0.22"/>
  <text x="50%" y="${Math.round(size * 0.84)}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${Math.round(size * 0.055)}" fill="#2F3440">${safeName}</text>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const DEFAULT_IMAGE = productFallbackImage({ name: "Product" }, 600);

export function resolveProductImage(productLike, fallback = DEFAULT_IMAGE) {
  const id = Number(productLike?.id ?? productLike?.product_id ?? 0);
  const raw =
    productLike?.image_url ??
    productLike?.images?.[0]?.image_url ??
    "";

  if (id && OVERRIDE_BY_PRODUCT_ID[id]) return OVERRIDE_BY_PRODUCT_ID[id];
  if (raw && OVERRIDE_BY_URL[raw]) return OVERRIDE_BY_URL[raw];
  return raw || fallback || productFallbackImage(productLike, 600);
}

export function handleImageFallback(event, fallback = DEFAULT_IMAGE) {
  const img = event?.currentTarget;
  if (!img) return;
  if (img.src !== fallback) img.src = fallback;
}
