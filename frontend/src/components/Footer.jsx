import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-auto">
      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="block w-full bg-[#37475A] py-3 text-center text-sm text-white hover:bg-[#485769]"
      >
        Back to top
      </button>

      {/* Main footer */}
      <div className="bg-[#232F3E] text-white">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {/* Column 1 */}
            <div>
              <h3 className="mb-3 text-sm font-bold">Get to Know Us</h3>
              <ul className="space-y-2 text-sm text-[#DDD]">
                <li><Link to="/" className="hover:underline">About Us</Link></li>
                <li><Link to="/" className="hover:underline">Careers</Link></li>
                <li><Link to="/" className="hover:underline">Press Releases</Link></li>
                <li><Link to="/" className="hover:underline">Amazon Science</Link></li>
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <h3 className="mb-3 text-sm font-bold">Connect with Us</h3>
              <ul className="space-y-2 text-sm text-[#DDD]">
                <li>
                  <a
                    href="https://www.instagram.com/abhiraj_gupta1?igsh=MTF5NnRtamZlOWJrNQ=="
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:underline"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z"/>
                    </svg>
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/GuptajiWebDev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:underline"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    Twitter (X)
                  </a>
                </li>
                <li><Link to="/" className="hover:underline">Facebook</Link></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h3 className="mb-3 text-sm font-bold">Make Money with Us</h3>
              <ul className="space-y-2 text-sm text-[#DDD]">
                <li><Link to="/" className="hover:underline">Sell on Amazon</Link></li>
                <li><Link to="/" className="hover:underline">Sell under Amazon Accelerator</Link></li>
                <li><Link to="/" className="hover:underline">Protect and Build Your Brand</Link></li>
                <li><Link to="/" className="hover:underline">Amazon Global Selling</Link></li>
              </ul>
            </div>

            {/* Column 4 */}
            <div>
              <h3 className="mb-3 text-sm font-bold">Let Us Help You</h3>
              <ul className="space-y-2 text-sm text-[#DDD]">
                <li><Link to="/" className="hover:underline">Your Account</Link></li>
                <li><Link to="/orders" className="hover:underline">Returns Centre</Link></li>
                <li><Link to="/" className="hover:underline">100% Purchase Protection</Link></li>
                <li><Link to="/cart" className="hover:underline">Amazon App Download</Link></li>
                <li><Link to="/" className="hover:underline">Help</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-[#131921] text-white">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            {/* Logo */}
            <div className="flex flex-col items-start leading-none">
              <div className="flex items-baseline">
                <span className="text-2xl font-bold" style={{ fontFamily: "Arial, sans-serif" }}>
                  amazon
                </span>
                <span className="text-sm font-bold" style={{ fontFamily: "Arial, sans-serif" }}>
                  .in
                </span>
              </div>
              <svg viewBox="0 0 70 10" className="-mt-1 h-[10px] w-[70px]" aria-hidden="true">
                <path d="M2 7 C 8 11, 35 12, 63 3" stroke="#FF9900" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <polygon points="59,0.5 66,3 59,5.5" fill="#FF9900" />
              </svg>
            </div>

            {/* Copyright */}
            <p className="text-xs text-[#999]">
              &copy; 1996&ndash;{new Date().getFullYear()}, Amazon Clone, Inc. or its affiliates
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/abhiraj_gupta1?igsh=MTF5NnRtamZlOWJrNQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#999] hover:text-white transition"
                aria-label="Instagram"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z"/>
                </svg>
              </a>
              <a
                href="https://x.com/GuptajiWebDev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#999] hover:text-white transition"
                aria-label="Twitter"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
