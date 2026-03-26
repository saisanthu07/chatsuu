import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Search } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [search, setSearch] = useState("");
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => { getUsers(); }, [getUsers]);

  const filtered = users
    .filter((u) => !showOnlineOnly || onlineUsers.includes(u._id))
    .filter((u) =>
      !search.trim() ||
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.username?.toLowerCase().includes(search.toLowerCase())
    );

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      {/* Header */}
      <div className="border-b border-base-300 w-full p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Users className="size-5 text-primary" />
          <span className="font-semibold hidden lg:block">Messages</span>
        </div>

        {/* Search */}
        <div className="hidden lg:flex items-center gap-2 bg-base-200 rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-base-content/40 flex-shrink-0" />
          <input
            className="bg-transparent text-sm outline-none w-full placeholder:text-base-content/40"
            placeholder="Search friends..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Online filter */}
        <div className="hidden lg:flex items-center justify-between">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-xs checkbox-primary"
            />
            <span className="text-xs text-base-content/60">Online only</span>
          </label>
          <span className="text-xs text-base-content/40 bg-base-200 px-2 py-0.5 rounded-full">
            {onlineUsers.length - 1} online
          </span>
        </div>
      </div>

      {/* Friend list */}
      <div className="overflow-y-auto w-full py-2 flex-1">
        {filtered.length === 0 ? (
          <div className="text-center text-base-content/40 py-8 px-4 text-sm hidden lg:block">
            {search ? "No friends match your search" : "No friends yet — add some in Friends!"}
          </div>
        ) : (
          filtered.map((user) => (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`w-full p-3 flex items-center gap-3 hover:bg-base-200 transition-colors ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-inset ring-primary/30" : ""}`}
            >
              <div className="relative mx-auto lg:mx-0 flex-shrink-0">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt=""
                  className="size-11 object-cover rounded-full"
                />
                {onlineUsers.includes(user._id) && (
                  <span className="absolute bottom-0 right-0 size-3 bg-success rounded-full ring-2 ring-base-100" />
                )}
              </div>
              <div className="hidden lg:block text-left min-w-0 flex-1">
                <div className="font-medium text-sm truncate">{user.fullName}</div>
                <div className="text-xs text-base-content/50 truncate">
                  {onlineUsers.includes(user._id) ? (
                    <span className="text-success">● Online</span>
                  ) : (
                    <span>@{user.username}</span>
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </aside>
  );
};
export default Sidebar;
