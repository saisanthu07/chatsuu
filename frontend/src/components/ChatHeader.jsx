import { X, MoreVertical, UserMinus } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useFriendStore } from "../store/useFriendStore";
import { useState } from "react";
import FriendProfileModal from "./FriendProfileModal";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const { removeFriend } = useFriendStore();
  const [showMenu, setShowMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className="px-4 py-3 border-b border-base-300 bg-base-100 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          className="relative hover:opacity-80 transition-opacity"
          onClick={() => setShowProfile(true)}
          title="View profile"
        >
          <img
            src={selectedUser.profilePic || "/avatar.png"}
            alt=""
            className="w-10 h-10 rounded-full object-cover"
          />
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full ring-2 ring-base-100" />
          )}
        </button>
        <button className="text-left" onClick={() => setShowProfile(true)}>
          <h3 className="font-semibold text-sm hover:text-primary transition-colors">{selectedUser.fullName}</h3>
          <p className="text-xs text-base-content/50">
            {isOnline ? <span className="text-success">Online</span> : `@${selectedUser.username}`}
          </p>
        </button>
      </div>

      <div className="flex items-center gap-1">
        {/* Options menu */}
        <div className="relative">
          <button
            className="btn btn-ghost btn-sm btn-square"
            onClick={() => setShowMenu(!showMenu)}
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 bg-base-100 border border-base-300 rounded-xl shadow-xl z-50 w-48 overflow-hidden">
              <button
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-error hover:bg-error/10 transition-colors"
                onClick={() => {
                  if (confirm(`Remove ${selectedUser.fullName} from friends?`)) {
                    removeFriend(selectedUser._id);
                    setSelectedUser(null);
                  }
                  setShowMenu(false);
                }}
              >
                <UserMinus className="w-4 h-4" />
                Remove friend
              </button>
            </div>
          )}
        </div>

        <button onClick={() => setSelectedUser(null)} className="btn btn-ghost btn-sm btn-square">
          <X className="w-4 h-4" />
        </button>
      </div>

      {showProfile && (
        <FriendProfileModal
          user={selectedUser}
          onClose={() => setShowProfile(false)}
          showMessage={false}
        />
      )}
    </div>
  );
};
export default ChatHeader;
