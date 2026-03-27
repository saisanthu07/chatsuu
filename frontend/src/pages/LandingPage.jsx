import { Link } from "react-router-dom";
import {
  MessageSquare, Users, Shield, Zap, Palette, Bell,
  Search, ArrowRight, Check, Star, Globe, Lock
} from "lucide-react";
import BrandLogo from "../components/BrandLogo";
import { THEMES, THEME_SYMBOLS } from "../constants";
import { useThemeStore } from "../store/useThemeStore";

const QUICK_THEMES = ["light", "dark", "cupcake", "synthwave", "cyberpunk", "nord", "forest", "dracula", "aqua", "coffee", "sunset", "luxury", "night", "dim", "lofi", "pastel"];

const FEATURES = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Friend-Only Messaging",
    desc: "Your privacy is protected. Only accepted friends can message you — no strangers, no spam.",
  },
  {
    icon: <Search className="w-6 h-6" />,
    title: "Private by Default",
    desc: "Usernames stay hidden. Connect by searching for someone directly — your inbox stays clean.",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Real-Time Messaging",
    desc: "Instant delivery with WebSocket technology. See when friends are typing in real time.",
  },
  {
    icon: <Palette className="w-6 h-6" />,
    title: "32 Themes",
    desc: "Make chatsuu yours. Choose from 32 beautiful themes — from dark mode to pastel dreamscapes.",
  },
  {
    icon: <Bell className="w-6 h-6" />,
    title: "Friend Requests",
    desc: "Send, receive, and manage friend requests with live notifications. Stay connected on your terms.",
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Online Presence",
    desc: "See who's online right now. Real-time status indicators keep you in the loop.",
  },
];

const STEPS = [
  { step: "01", title: "Create your account", desc: "Sign up with a unique username in seconds. No phone number needed." },
  { step: "02", title: "Find your friends", desc: "Search by username or name and send a friend request." },
  { step: "03", title: "Start chatting", desc: "Once accepted, open a conversation and message freely." },
];

const TESTIMONIALS = [
  { name: "Priya S.", role: "Designer", text: "Love the themes! Finally a chat app that lets me make it my own.", stars: 5 },
  { name: "Alex M.", role: "Developer", text: "The friend-only model means zero unwanted messages. Refreshing.", stars: 5 },
  { name: "Jordan K.", role: "Student", text: "Fast, clean, and the typing indicators work perfectly.", stars: 5 },
];

const LandingPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero */}
      <section className="pt-28 pb-20 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium">
            <Zap className="w-4 h-4" />
            Real-time · Private · Beautiful
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight">
            Chat on{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              your terms
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-base-content/60 max-w-2xl mx-auto leading-relaxed">
            chatsuu is a private, friend-first messaging platform. No strangers in your inbox.
            No spam. Just the people you actually want to talk to.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <Link
              to="/signup"
              className="btn btn-primary btn-lg gap-2 shadow-lg shadow-primary/30 hover:scale-105 transition-transform"
            >
              Get started free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="btn btn-outline btn-lg hover:scale-105 transition-transform"
            >
              Sign in
            </Link>
          </div>
          <p className="text-sm text-base-content/40">No credit card required · Free forever</p>
        </div>

        {/* Hero chat mockup */}
        <div className="max-w-3xl mx-auto mt-16" style={{ perspective: "1000px" }}>
          <div
            className="rounded-2xl border border-base-300 overflow-hidden shadow-2xl bg-base-100"
            style={{ transform: "rotateX(4deg) rotateY(-2deg) scale(0.97)", transformStyle: "preserve-3d" }}
          >
            {/* Fake chrome bar */}
            <div className="bg-base-200 px-4 py-3 flex items-center gap-2 border-b border-base-300">
              <div className="w-3 h-3 rounded-full bg-error/60" />
              <div className="w-3 h-3 rounded-full bg-warning/60" />
              <div className="w-3 h-3 rounded-full bg-success/60" />
              <div className="flex-1 mx-4 h-6 rounded-full bg-base-300/60 flex items-center px-3">
                <span className="text-xs text-base-content/30">chatsuu.app</span>
              </div>
            </div>
            <div className="flex h-64">
              {/* Sidebar */}
              <div className="w-48 border-r border-base-300 bg-base-200 p-3 space-y-2 hidden sm:block">
                <div className="text-xs text-base-content/40 font-semibold px-2 pb-1">FRIENDS</div>
                {["Alex M.", "Priya S.", "Jordan K."].map((name, i) => (
                  <div key={name} className={`flex items-center gap-2 p-2 rounded-lg ${i === 0 ? "bg-primary/10" : "hover:bg-base-300"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? "bg-primary text-primary-content" : "bg-base-300"}`}>
                      {name[0]}
                    </div>
                    <div>
                      <div className="text-xs font-medium truncate">{name}</div>
                      <div className="text-[10px] text-base-content/40">{i === 0 ? "Online" : "Offline"}</div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Chat area */}
              <div className="flex-1 flex flex-col">
                <div className="p-3 border-b border-base-300 flex items-center gap-2 bg-base-100">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content text-xs font-bold">A</div>
                  <div>
                    <div className="text-sm font-medium">Alex M.</div>
                    <div className="text-[10px] text-success">● Online</div>
                  </div>
                </div>
                <div className="flex-1 p-3 space-y-2 overflow-hidden">
                  <div className="flex justify-start">
                    <div className="bg-base-200 rounded-xl px-3 py-2 text-xs max-w-[70%]">Hey! Did you see the new themes? 👀</div>
                  </div>
                  <div className="flex justify-end">
                    <div className="bg-primary text-primary-content rounded-xl px-3 py-2 text-xs max-w-[70%]">Yes! The Nord one is 🔥</div>
                  </div>
                  <div className="flex justify-start">
                    <div className="bg-base-200 rounded-xl px-3 py-2 text-xs max-w-[70%]">
                      <span className="italic text-base-content/50">typing...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-base-200">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold">Everything you need, nothing you don't</h2>
            <p className="text-base-content/60 max-w-xl mx-auto">Focused on privacy, speed, and making chat feel good again.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-base-100 rounded-2xl p-6 space-y-3 border border-base-300 hover:border-primary/40 hover:-translate-y-1 transition-all">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-lg">{f.title}</h3>
                <p className="text-base-content/60 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold">How chatsuu works</h2>
            <p className="text-base-content/60">Three simple steps to start chatting privately.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <div key={s.step} className="text-center space-y-3 relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden sm:block absolute top-6 left-[60%] w-full h-px border-t-2 border-dashed border-base-300" />
                )}
                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary font-extrabold text-lg flex items-center justify-center mx-auto relative z-10">
                  {s.step}
                </div>
                <h3 className="font-semibold">{s.title}</h3>
                <p className="text-sm text-base-content/60">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Themes preview strip */}
      <section className="py-16 px-4 bg-base-200 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center mb-10 space-y-2">
          <h2 className="text-3xl font-bold">32 themes to make it yours</h2>
          <p className="text-base-content/60">From sleek dark to vibrant synthwave — pick your vibe.</p>
          <div className="max-w-xs mx-auto pt-2">
            <div data-theme={theme} className="flex items-center gap-2 bg-base-100 border border-base-300 rounded-lg px-3 py-2 mb-2">
              <span className="text-sm">{THEME_SYMBOLS[theme] || "◉"}</span>
              <span className="text-xs text-base-content/70 capitalize flex-1 text-left">Current: {theme}</span>
              <div className="flex gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                <div className="w-2.5 h-2.5 rounded-full bg-secondary" />
                <div className="w-2.5 h-2.5 rounded-full bg-accent" />
              </div>
            </div>
            <select
              className="select select-bordered w-full capitalize"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              aria-label="Select a theme"
            >
              {THEMES.map((t) => (
                <option key={t} value={t} className="capitalize">
                  {(THEME_SYMBOLS[t] || "◉") + " " + t}
                </option>
              ))}
            </select>
            <p className="text-xs text-base-content/50 mt-2">Preview themes now before creating an account.</p>
          </div>
        </div>
        <div className="flex gap-3 justify-center flex-wrap max-w-3xl mx-auto">
          {QUICK_THEMES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTheme(t)}
              data-theme={t}
              className={`flex items-center gap-1.5 bg-base-100 border rounded-full px-3 py-1.5 transition-all hover:scale-105 ${theme === t ? "border-primary ring-2 ring-primary/20" : "border-base-300"}`}
            >
              <span className="text-xs">{THEME_SYMBOLS[t] || "◉"}</span>
              <div className="flex gap-0.5">
                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                <div className="w-2.5 h-2.5 rounded-full bg-secondary" />
                <div className="w-2.5 h-2.5 rounded-full bg-accent" />
              </div>
              <span className="text-xs font-medium capitalize">{t}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 space-y-2">
            <h2 className="text-3xl font-bold">Loved by users</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-base-200 rounded-2xl p-6 space-y-3 border border-base-300">
                <div className="flex gap-0.5">
                  {Array(t.stars).fill(0).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-sm text-base-content/80 italic">"{t.text}"</p>
                <div>
                  <div className="font-medium text-sm">{t.name}</div>
                  <div className="text-xs text-base-content/50">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-base-200">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <MessageSquare className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-4xl font-bold">Ready to chat privately?</h2>
          <p className="text-base-content/60">Join chatsuu today — free, fast, and built for real conversations.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="btn btn-primary btn-lg gap-2 hover:scale-105 transition-transform">
              Create free account <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login" className="btn btn-outline btn-lg">Sign in</Link>
          </div>
          <div className="flex items-center justify-center gap-6 pt-2 text-sm text-base-content/50">
            <span className="flex items-center gap-1"><Check className="w-4 h-4 text-success" /> Free forever</span>
            <span className="flex items-center gap-1"><Lock className="w-4 h-4 text-success" /> Private by default</span>
            <span className="flex items-center gap-1"><Zap className="w-4 h-4 text-success" /> Real-time</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-base-300 text-center text-sm text-base-content/40">
        <div className="flex items-center justify-center gap-2 mb-2">
          <BrandLogo to="/" imageClassName="h-8 w-auto" />
        </div>
        <p>© {new Date().getFullYear()} chatsuu · Built with privacy in mind</p>
      </footer>
    </div>
  );
};

export default LandingPage;
