import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/register", { name, email, password });
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.message ?? "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-6 text-center">
          <Link to="/" className="inline-block">
            <span className="text-3xl font-bold text-[#0F1111]" style={{ fontFamily: "Arial, sans-serif" }}>
              amazon
            </span>
          </Link>
        </div>

        <div className="rounded-lg border border-[#DDD] bg-white p-6 shadow-sm">
          <h1 className="mb-4 text-2xl font-normal text-[#0F1111]">Create account</h1>

          {error && (
            <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label className="mb-1 block text-sm font-bold text-[#0F1111]">
              Your name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mb-4 w-full rounded-md border border-[#a6a6a6] px-3 py-2 text-sm outline-none focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600]"
              placeholder="First and last name"
            />

            <label className="mb-1 block text-sm font-bold text-[#0F1111]">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mb-4 w-full rounded-md border border-[#a6a6a6] px-3 py-2 text-sm outline-none focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600]"
              placeholder="you@example.com"
            />

            <label className="mb-1 block text-sm font-bold text-[#0F1111]">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="mb-4 w-full rounded-md border border-[#a6a6a6] px-3 py-2 text-sm outline-none focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600]"
              placeholder="At least 6 characters"
            />

            <label className="mb-1 block text-sm font-bold text-[#0F1111]">
              Re-enter password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="mb-4 w-full rounded-md border border-[#a6a6a6] px-3 py-2 text-sm outline-none focus:border-[#e77600] focus:ring-1 focus:ring-[#e77600]"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#FFD814] py-2 text-sm font-medium text-[#0F1111] hover:bg-[#F7CA00] disabled:opacity-60"
            >
              {loading ? "Creating account…" : "Create your Amazon account"}
            </button>
          </form>

          <p className="mt-6 text-xs text-slate-500">
            By creating an account, you agree to Amazon Clone's Conditions of Use and Privacy Notice.
          </p>

          <div className="mt-4 border-t border-[#DDD] pt-4">
            <p className="text-sm text-[#0F1111]">
              Already have an account?{" "}
              <Link to="/login" className="text-[#007185] hover:text-[#C7511F] hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
