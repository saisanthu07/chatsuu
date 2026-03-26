import { Link } from "react-router-dom";
import { useThemeStore } from "../store/useThemeStore";
import { useAuthStore } from "../store/useAuthStore";
import { Palette, User, Bell, Shield, ChevronRight, Moon, Sun } from "lucide-react";

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();
  const { authUser } = useAuthStore();

  const isDark = ["dark","synthwave","halloween","forest","black","luxury","dracula","night","dim","coffee","cyberpunk"].includes(theme);

  const sections = [
    {
      title: "Appearance",
      items: [
        {
          icon: <Palette className="w-5 h-5" />,
          label: "Themes",
          desc: `Current: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`,
          to: "/themes",
        },
        {
          icon: isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />,
          label: "Quick toggle",
          desc: isDark ? "Switch to light" : "Switch to dark",
          action: () => setTheme(isDark ? "light" : "dark"),
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          icon: <User className="w-5 h-5" />,
          label: "Profile",
          desc: authUser ? `@${authUser.username}` : "Edit your info",
          to: "/profile",
        },
      ],
    },
    {
      title: "Privacy",
      items: [
        {
          icon: <Shield className="w-5 h-5" />,
          label: "Friend requests",
          desc: "Only friends can message you",
          badge: "On",
          badgeClass: "badge-success",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-base-200 pt-20">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-base-content/60 text-sm mt-1">Manage your account and app preferences</p>
        </div>

        {sections.map((section) => (
          <div key={section.title} className="space-y-2">
            <h2 className="text-xs font-semibold text-base-content/50 uppercase tracking-wider px-1">{section.title}</h2>
            <div className="bg-base-100 rounded-2xl border border-base-300 overflow-hidden divide-y divide-base-200">
              {section.items.map((item) => {
                const inner = (
                  <div className={`flex items-center gap-4 p-4 ${item.to || item.action ? "hover:bg-base-200 cursor-pointer transition-colors" : ""}`}
                    onClick={item.action || undefined}>
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{item.label}</div>
                      {item.desc && <div className="text-xs text-base-content/50 mt-0.5">{item.desc}</div>}
                    </div>
                    {item.badge && <span className={`badge badge-sm ${item.badgeClass}`}>{item.badge}</span>}
                    {(item.to || item.action) && <ChevronRight className="w-4 h-4 text-base-content/30 flex-shrink-0" />}
                  </div>
                );
                return item.to ? (
                  <Link key={item.label} to={item.to}>{inner}</Link>
                ) : (
                  <div key={item.label}>{inner}</div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default SettingsPage;
