import { X, AtSign, FileText, Calendar, MessageCircle } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useNavigate } from "react-router-dom";

/**
 * FriendProfileModal
 *
 * Props:
 *   user        — the friend object to display
 *   onClose     — called when the modal should close
 *   showMessage — if true, renders a "Send Message" button that navigates to chat
 */
const FriendProfileModal = ({ user, onClose, showMessage = false }) => {
  const { onlineUsers } = useAuthStore();
  const { setSelectedUser } = useChatStore();
  const navigate = useNavigate();

  if (!user) return null;

  const isOnline = onlineUsers.includes(user._id);
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : null;

  const handleMessage = () => {
    setSelectedUser(user);
    onClose();
    navigate("/chat");
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Blurred backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal card */}
      <div className="relative z-10 w-full max-w-sm bg-base-100 rounded-3xl shadow-2xl border border-base-300 overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 btn btn-ghost btn-sm btn-circle"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Banner + avatar */}
        <div className="relative">
          {/* Gradient banner */}
          <div className="h-24 bg-gradient-to-br from-primary/40 via-secondary/30 to-accent/20" />

          {/* Avatar */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
            <div className="relative">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.fullName}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-base-100 shadow-lg"
              />
              {isOnline && (
                <span className="absolute bottom-1 right-1 w-4 h-4 bg-success rounded-full ring-2 ring-base-100" />
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-14 pb-6 px-6 space-y-5">
          {/* Name & status */}
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold">{user.fullName}</h2>
            <p className="text-sm text-base-content/50">@{user.username}</p>
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                isOnline
                  ? "bg-success/15 text-success"
                  : "bg-base-200 text-base-content/50"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-success" : "bg-base-content/30"}`} />
              {isOnline ? "Online now" : "Offline"}
            </span>
          </div>

          {/* Bio */}
          {user.bio && (
            <div className="bg-base-200/70 rounded-2xl p-4 space-y-1">
              <div className="flex items-center gap-2 text-xs text-base-content/50 font-medium uppercase tracking-wide">
                <FileText className="w-3.5 h-3.5" />
                Bio
              </div>
              <p className="text-sm text-base-content/80 leading-relaxed">{user.bio}</p>
            </div>
          )}

          {/* Info rows */}
          <div className="space-y-2">
            <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-base-200/50 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <AtSign className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[11px] text-base-content/40 uppercase tracking-wide font-medium">Username</div>
                <div className="text-sm font-medium">@{user.username}</div>
              </div>
            </div>

            {memberSince && (
              <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-base-200/50 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary flex-shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-base-content/40 uppercase tracking-wide font-medium">Member since</div>
                  <div className="text-sm font-medium">{memberSince}</div>
                </div>
              </div>
            )}
          </div>

          {/* Action button */}
          {showMessage && (
            <button
              onClick={handleMessage}
              className="btn btn-primary w-full gap-2 rounded-2xl"
            >
              <MessageCircle className="w-4 h-4" />
              Send Message
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendProfileModal;
