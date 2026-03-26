import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User, AtSign, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", username: "", email: "", password: "" });
  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.username.trim()) return toast.error("Username is required");
    if (!/^[a-z0-9_]{3,30}$/.test(formData.username.toLowerCase())) return toast.error("Username: 3-30 chars, letters/numbers/underscores only");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm() === true) signup({ ...formData, username: formData.username.toLowerCase() });
  };

  const field = (label, key, type, Icon, placeholder, extra = {}) => (
    <div className="form-control">
      <label className="label"><span className="label-text font-medium">{label}</span></label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="size-5 text-base-content/40" />
        </div>
        <input
          type={type}
          className="input input-bordered w-full pl-10"
          placeholder={placeholder}
          value={formData[key]}
          onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
          {...extra}
        />
        {key === "password" && (
          <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff className="size-5 text-base-content/40" /> : <Eye className="size-5 text-base-content/40" />}
          </button>
        )}
      </div>
      {key === "username" && formData.username && (
        <label className="label"><span className="label-text-alt text-base-content/50">Your handle: @{formData.username.toLowerCase()}</span></label>
      )}
    </div>
  );

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
              <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <MessageSquare className="size-6 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create your account</h1>
              <p className="text-base-content/60">Join chatsuu and start chatting privately</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {field("Full Name", "fullName", "text", User, "John Doe")}
            {field("Username", "username", "text", AtSign, "johndoe")}
            {field("Email", "email", "email", Mail, "you@example.com")}
            {field("Password", "password", showPassword ? "text" : "password", Lock, "••••••••")}
            <button type="submit" className="btn btn-primary w-full mt-2" disabled={isSigningUp}>
              {isSigningUp ? <><Loader2 className="size-5 animate-spin" /> Creating account...</> : "Create Account"}
            </button>
          </form>

          <p className="text-center text-base-content/60 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="link link-primary font-medium">Sign in</Link>
          </p>
        </div>
      </div>

      {/* Right — Visual panel */}
      <div className="hidden lg:flex flex-1 bg-primary/5 items-center justify-center p-12 border-l border-base-300">
        <div className="max-w-sm text-center space-y-6">
          <div className="grid grid-cols-3 gap-3">
            {["cupcake","synthwave","nord","forest","dracula","coffee","aqua","sunset","cyberpunk"].map((t) => (
              <div key={t} data-theme={t} className="bg-base-100 rounded-xl p-3 border border-base-300">
                <div className="flex gap-1 justify-center">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <div className="w-3 h-3 rounded-full bg-secondary" />
                  <div className="w-3 h-3 rounded-full bg-accent" />
                </div>
                <p className="text-[10px] mt-1.5 capitalize text-center">{t}</p>
              </div>
            ))}
          </div>
          <div>
            <h2 className="text-xl font-bold">32 themes await you</h2>
            <p className="text-sm text-base-content/60 mt-1">Personalise your chat experience from day one.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SignUpPage;
