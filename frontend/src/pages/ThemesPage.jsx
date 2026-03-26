import { useThemeStore } from "../store/useThemeStore";
import { THEMES } from "../constants";
import { Check, Palette } from "lucide-react";

const THEME_CATEGORIES = {
  "Dark Modes": ["dark", "synthwave", "halloween", "forest", "black", "luxury", "dracula", "night", "dim", "coffee"],
  "Light & Bright": ["light", "cupcake", "bumblebee", "emerald", "corporate", "garden", "lofi", "pastel", "lemonade", "winter"],
  "Unique Vibes": ["retro", "cyberpunk", "valentine", "aqua", "fantasy", "wireframe", "cmyk", "autumn", "business", "acid"],
  "Special": ["nord", "sunset"],
};

const PREVIEW_MSGS = [
  { id: 1, text: "Hey! How's it going? 👋", isSent: false },
  { id: 2, text: "Great! Just vibing with this theme 😍", isSent: true },
];

const ThemesPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="min-h-screen bg-base-200 pt-20">
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Palette className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Themes</h1>
            <p className="text-base-content/60 text-sm">Personalise your chatsuu experience with {THEMES.length} themes</p>
          </div>
        </div>

        {/* Active theme preview */}
        <div className="bg-base-100 rounded-2xl border border-base-300 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-lg">Current theme</h2>
              <p className="text-base-content/60 text-sm capitalize">{theme}</p>
            </div>
            <div className="flex gap-2" data-theme={theme}>
              <div className="w-6 h-6 rounded-full bg-primary" title="Primary" />
              <div className="w-6 h-6 rounded-full bg-secondary" title="Secondary" />
              <div className="w-6 h-6 rounded-full bg-accent" title="Accent" />
              <div className="w-6 h-6 rounded-full bg-neutral" title="Neutral" />
              <div className="w-6 h-6 rounded-full bg-base-100 border border-base-300" title="Base" />
            </div>
          </div>

          {/* Live preview */}
          <div data-theme={theme} className="bg-base-100 rounded-xl border border-base-300 overflow-hidden">
            <div className="p-3 border-b border-base-300 flex items-center gap-2 bg-base-200">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content text-xs font-bold">A</div>
              <div>
                <div className="text-sm font-medium">Alex</div>
                <div className="text-xs text-success">● Online</div>
              </div>
            </div>
            <div className="p-4 space-y-3 min-h-[100px]">
              {PREVIEW_MSGS.map((m) => (
                <div key={m.id} className={`flex ${m.isSent ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] rounded-xl px-3 py-2 text-sm ${m.isSent ? "bg-primary text-primary-content" : "bg-base-200"}`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-base-300 flex gap-2">
              <div className="flex-1 bg-base-200 rounded-lg px-3 py-2 text-sm text-base-content/40">Type a message...</div>
              <button className="btn btn-primary btn-sm">Send</button>
            </div>
          </div>
        </div>

        {/* Theme categories */}
        {Object.entries(THEME_CATEGORIES).map(([category, themes]) => (
          <div key={category} className="space-y-4">
            <h2 className="font-semibold text-lg">{category}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {themes.map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  data-theme={t}
                  className={`relative bg-base-100 border-2 rounded-xl p-3 text-left transition-all hover:scale-105 hover:shadow-lg ${theme === t ? "border-primary shadow-md shadow-primary/20" : "border-base-300"}`}
                >
                  {theme === t && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-content" />
                    </div>
                  )}
                  {/* Color swatches */}
                  <div className="grid grid-cols-4 gap-1 mb-2.5">
                    <div className="h-4 rounded bg-primary" />
                    <div className="h-4 rounded bg-secondary" />
                    <div className="h-4 rounded bg-accent" />
                    <div className="h-4 rounded bg-neutral" />
                  </div>
                  {/* Mini chat preview */}
                  <div className="space-y-1.5 mb-2">
                    <div className="flex justify-start">
                      <div className="bg-base-200 rounded px-2 py-1 text-[9px] max-w-[80%]">Hey!</div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-primary text-primary-content rounded px-2 py-1 text-[9px] max-w-[80%]">Hi there!</div>
                    </div>
                  </div>
                  <div className="text-xs font-medium capitalize truncate">{t}</div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ThemesPage;
