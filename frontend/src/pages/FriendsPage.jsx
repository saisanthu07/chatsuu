import { useEffect, useState } from "react";
import { useFriendStore } from "../store/useFriendStore";
import { useAuthStore } from "../store/useAuthStore";
import { Search, UserPlus, UserCheck, UserX, Users, Clock, Send, Loader2, UserMinus } from "lucide-react";
import FriendProfileModal from "../components/FriendProfileModal";

const Avatar = ({ user, size = "sm" }) => {
  const sz = size === "sm" ? "w-10 h-10" : "w-12 h-12";
  return (
    <img
      src={user?.profilePic || "/avatar.png"}
      alt=""
      className={`${sz} rounded-full object-cover flex-shrink-0`}
    />
  );
};

const FriendsPage = () => {
  const {
    friends, pendingRequests, sentRequests, searchResults,
    isSearching, isLoadingFriends, isLoadingPending,
    searchUsers, sendFriendRequest, respondToRequest,
    getFriends, getPendingRequests, getSentRequests, removeFriend,
  } = useFriendStore();
  const { onlineUsers, socket } = useAuthStore();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("friends"); // friends | search | pending | sent
  const [viewingUser, setViewingUser] = useState(null);

  useEffect(() => {
    getFriends();
    getPendingRequests();
    getSentRequests();
  }, []);

  // Real-time friend request notifications
  useEffect(() => {
    if (!socket) return;
    socket.on("newFriendRequest", (data) => {
      getPendingRequests();
    });
    socket.on("friendRequestResponse", (data) => {
      if (data.action === "accepted") getFriends();
      getSentRequests();
    });
    return () => {
      socket.off("newFriendRequest");
      socket.off("friendRequestResponse");
    };
  }, [socket]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => { if (tab === "search") searchUsers(query); }, 350);
    return () => clearTimeout(t);
  }, [query, tab]);

  const tabs = [
    { id: "friends", label: "Friends", icon: <Users className="w-4 h-4" />, count: friends.length },
    { id: "search", label: "Find People", icon: <Search className="w-4 h-4" /> },
    { id: "pending", label: "Requests", icon: <Clock className="w-4 h-4" />, count: pendingRequests.length, badge: true },
    { id: "sent", label: "Sent", icon: <Send className="w-4 h-4" />, count: sentRequests.length },
  ];

  return (
    <div className="min-h-screen bg-base-200 pt-20">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Friends</h1>
          <p className="text-base-content/60 text-sm mt-1">Manage your connections and discover new people</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 bg-base-100 p-1.5 rounded-xl border border-base-300 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all relative min-w-0 ${tab === t.id ? "bg-primary text-primary-content shadow-sm" : "hover:bg-base-200 text-base-content/70"}`}
            >
              {t.icon}
              <span className="hidden sm:inline truncate">{t.label}</span>
              {t.count > 0 && (
                <span className={`text-xs rounded-full px-1.5 py-0.5 ${tab === t.id ? "bg-primary-content/20 text-primary-content" : t.badge ? "bg-error text-error-content" : "bg-base-200 text-base-content/60"}`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search bar (shown on search tab) */}
        {tab === "search" && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
            <input
              className="input input-bordered w-full pl-10"
              placeholder="Search by name or @username..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            {isSearching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 animate-spin text-base-content/40" />}
          </div>
        )}

        {/* Content */}
        <div className="bg-base-100 rounded-2xl border border-base-300 overflow-hidden">

          {/* FRIENDS TAB */}
          {tab === "friends" && (
            <>
              {isLoadingFriends ? (
                <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
              ) : friends.length === 0 ? (
                <div className="p-12 text-center space-y-3">
                  <Users className="w-12 h-12 text-base-content/20 mx-auto" />
                  <p className="font-medium">No friends yet</p>
                  <p className="text-sm text-base-content/50">Use "Find People" to search for and add friends</p>
                  <button onClick={() => setTab("search")} className="btn btn-primary btn-sm">Find People</button>
                </div>
              ) : (
                <ul className="divide-y divide-base-200">
                  {friends.map((f) => (
                    <li key={f._id} className="flex items-center gap-3 p-4 hover:bg-base-200/40 transition-colors">
                      <button
                        className="relative flex-shrink-0"
                        onClick={() => setViewingUser(f)}
                        title="View profile"
                      >
                        <Avatar user={f} />
                        {onlineUsers.includes(f._id) && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full ring-2 ring-base-100" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <button
                          className="font-medium text-sm truncate hover:text-primary transition-colors text-left w-full"
                          onClick={() => setViewingUser(f)}
                        >
                          {f.fullName}
                        </button>
                        <div className="text-xs text-base-content/50">@{f.username}</div>
                        {f.bio && <div className="text-xs text-base-content/40 truncate mt-0.5">{f.bio}</div>}
                      </div>
                      <div className="flex items-center gap-2">
                        {onlineUsers.includes(f._id) && (
                          <span className="text-xs text-success font-medium hidden sm:inline">Online</span>
                        )}
                        <button
                          onClick={() => { if (confirm(`Remove ${f.fullName} from friends?`)) removeFriend(f._id); }}
                          className="btn btn-ghost btn-sm btn-square text-error hover:bg-error/10"
                          title="Remove friend"
                        >
                          <UserMinus className="w-4 h-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          {/* SEARCH TAB */}
          {tab === "search" && (
            <>
              {!query.trim() ? (
                <div className="p-12 text-center space-y-2">
                  <Search className="w-12 h-12 text-base-content/20 mx-auto" />
                  <p className="font-medium">Search for people</p>
                  <p className="text-sm text-base-content/50">Type a name or @username above to find people to add</p>
                </div>
              ) : isSearching ? (
                <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
              ) : searchResults.length === 0 ? (
                <div className="p-12 text-center space-y-2">
                  <UserX className="w-12 h-12 text-base-content/20 mx-auto" />
                  <p className="font-medium">No users found</p>
                  <p className="text-sm text-base-content/50">Try a different name or username</p>
                </div>
              ) : (
                <ul className="divide-y divide-base-200">
                  {searchResults.map((u) => (
                    <li key={u._id} className="flex items-center gap-3 p-4">
                      <button className="flex-shrink-0" onClick={() => setViewingUser(u)}>
                        <Avatar user={u} />
                      </button>
                      <div className="flex-1 min-w-0">
                        <button
                          className="font-medium text-sm truncate hover:text-primary transition-colors text-left w-full"
                          onClick={() => setViewingUser(u)}
                        >
                          {u.fullName}
                        </button>
                        <div className="text-xs text-base-content/50">@{u.username}</div>
                        {u.bio && <div className="text-xs text-base-content/40 truncate">{u.bio}</div>}
                      </div>
                      <button
                        onClick={() => sendFriendRequest(u._id)}
                        className="btn btn-primary btn-sm gap-1.5"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span className="hidden sm:inline">Add</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          {/* PENDING TAB */}
          {tab === "pending" && (
            <>
              {isLoadingPending ? (
                <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
              ) : pendingRequests.length === 0 ? (
                <div className="p-12 text-center space-y-2">
                  <Clock className="w-12 h-12 text-base-content/20 mx-auto" />
                  <p className="font-medium">No pending requests</p>
                  <p className="text-sm text-base-content/50">Friend requests you receive will appear here</p>
                </div>
              ) : (
                <ul className="divide-y divide-base-200">
                  {pendingRequests.map((req) => (
                    <li key={req._id} className="flex items-center gap-3 p-4">
                      <button className="flex-shrink-0" onClick={() => setViewingUser(req.sender)}>
                        <Avatar user={req.sender} />
                      </button>
                      <div className="flex-1 min-w-0">
                        <button
                          className="font-medium text-sm truncate hover:text-primary transition-colors text-left w-full"
                          onClick={() => setViewingUser(req.sender)}
                        >
                          {req.sender?.fullName}
                        </button>
                        <div className="text-xs text-base-content/50">@{req.sender?.username}</div>
                        {req.sender?.bio && <div className="text-xs text-base-content/40 truncate">{req.sender.bio}</div>}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => respondToRequest(req._id, "accepted")} className="btn btn-success btn-sm gap-1">
                          <UserCheck className="w-4 h-4" />
                          <span className="hidden sm:inline">Accept</span>
                        </button>
                        <button onClick={() => respondToRequest(req._id, "rejected")} className="btn btn-ghost btn-sm gap-1 text-error">
                          <UserX className="w-4 h-4" />
                          <span className="hidden sm:inline">Decline</span>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          {/* SENT TAB */}
          {tab === "sent" && (
            <>
              {sentRequests.length === 0 ? (
                <div className="p-12 text-center space-y-2">
                  <Send className="w-12 h-12 text-base-content/20 mx-auto" />
                  <p className="font-medium">No sent requests</p>
                  <p className="text-sm text-base-content/50">Friend requests you've sent will appear here</p>
                </div>
              ) : (
                <ul className="divide-y divide-base-200">
                  {sentRequests.map((req) => (
                    <li key={req._id} className="flex items-center gap-3 p-4">
                      <Avatar user={req.receiver} />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{req.receiver?.fullName}</div>
                        <div className="text-xs text-base-content/50">@{req.receiver?.username}</div>
                      </div>
                      <span className="badge badge-warning badge-sm gap-1">
                        <Clock className="w-3 h-3" /> Pending
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>

      {/* Friend profile modal */}
      {viewingUser && (
        <FriendProfileModal
          user={viewingUser}
          onClose={() => setViewingUser(null)}
          showMessage={friends.some((f) => f._id === viewingUser._id)}
        />
      )}
    </div>
  );
};
export default FriendsPage;
