import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useFriendStore } from "../store/useFriendStore";
import { useEffect } from "react";
import { LogOut, MessageSquare, Settings, User, Users, Bell, Palette } from "lucide-react";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const { pendingRequests, getPendingRequests } = useFriendStore();
  const location = useLocation();

  useEffect(() => {
    if (authUser) getPendingRequests();
  }, [authUser]);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <Link to={authUser ? "/chat" : "/"} className="flex items-center gap-2.5 hover:opacity-80 transition-all">
            <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-lg font-bold">chatsuu</h1>
          </Link>

          <div className="flex items-center gap-1">
            {authUser ? (
              <>
                <Link to="/chat" className={`btn btn-sm gap-2 ${isActive("/chat") ? "btn-primary" : "btn-ghost"}`}>
                  <MessageSquare className="w-4 h-4" />
                  <span className="hidden sm:inline">Chat</span>
                </Link>

                <Link to="/friends" className={`btn btn-sm gap-2 relative ${isActive("/friends") ? "btn-primary" : "btn-ghost"}`}>
                  <Users className="w-4 h-4" />
                  <span className="hidden sm:inline">Friends</span>
                  {pendingRequests.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-error text-error-content text-[10px] font-bold rounded-full flex items-center justify-center">
                      {pendingRequests.length}
                    </span>
                  )}
                </Link>

                <Link to="/themes" className={`btn btn-sm gap-2 ${isActive("/themes") ? "btn-primary" : "btn-ghost"}`}>
                  <Palette className="w-4 h-4" />
                  <span className="hidden sm:inline">Themes</span>
                </Link>

                <Link to="/settings" className={`btn btn-sm gap-2 ${isActive("/settings") ? "btn-primary" : "btn-ghost"}`}>
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Settings</span>
                </Link>

                <Link to="/profile" className={`btn btn-sm gap-2 ${isActive("/profile") ? "btn-primary" : "btn-ghost"}`}>
                  {authUser.profilePic ? (
                    <img src={authUser.profilePic} className="w-5 h-5 rounded-full object-cover" alt="" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button onClick={logout} className="btn btn-sm btn-ghost gap-2 text-error hover:bg-error/10">
                  <LogOut className="size-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-sm btn-ghost">Sign in</Link>
                <Link to="/signup" className="btn btn-sm btn-primary">Get started</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
