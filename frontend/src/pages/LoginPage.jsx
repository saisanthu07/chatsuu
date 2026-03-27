import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, MessageSquare, AtSign, ArrowLeft, Shield } from "lucide-react";
import BrandLogo from "../components/BrandLogo";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ identifier: "", password: "" });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.identifier.trim()) return;
    if (!formData.password) return;
    login(formData);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left — Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 pt-24">
        <div className="w-full max-w-md space-y-6">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-base-content/50 hover:text-base-content transition-colors mb-2">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
          <div className="text-center">
            <div className="flex flex-col items-center gap-2">
              <BrandLogo clickable={false} imageClassName="h-12 sm:h-14 w-auto" />
              <h1 className="text-2xl font-bold mt-2">Welcome back</h1>
              <p className="text-base-content/60">Sign in to continue your conversations</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Email or Username</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AtSign className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className="input input-bordered w-full pl-10"
                  placeholder="you@example.com or @username"
                  value={formData.identifier}
                  onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text font-medium">Password</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-10 pr-10"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="size-5 text-base-content/40" /> : <Eye className="size-5 text-base-content/40" />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={isLoggingIn}>
              {isLoggingIn ? <><Loader2 className="size-5 animate-spin" /> Signing in...</> : "Sign In"}
            </button>
          </form>

          <p className="text-center text-base-content/60 text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="link link-primary font-medium">Create one free</Link>
          </p>
        </div>
      </div>

      {/* Right — Visual panel */}
      <div className="hidden lg:flex flex-1 bg-primary/5 items-center justify-center p-12 border-l border-base-300">
        <div className="max-w-sm space-y-8">
          <div className="space-y-4">
            {[
              { icon: <Shield className="w-5 h-5 text-primary" />, title: "Friend-only inbox", desc: "Only accepted friends can message you." },
              { icon: <AtSign className="w-5 h-5 text-primary" />, title: "Login your way", desc: "Use your email or @username — either works." },
              { icon: <MessageSquare className="w-5 h-5 text-primary" />, title: "Instant messaging", desc: "Real-time delivery with typing indicators." },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 bg-base-100 border border-base-300 rounded-xl p-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <div className="font-semibold text-sm">{item.title}</div>
                  <div className="text-xs text-base-content/60 mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;
