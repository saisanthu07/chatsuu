import { MessageSquare, Users, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useChatStore } from "../store/useChatStore";

const NoChatSelected = () => {
  const { users } = useChatStore();

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-base-100/50 text-center">
      <div className="max-w-sm space-y-5">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
          <MessageSquare className="w-10 h-10 text-primary" />
        </div>

        {users.length === 0 ? (
          <>
            <h2 className="text-xl font-bold">No friends yet</h2>
            <p className="text-base-content/60 text-sm">
              Add friends to start chatting. Only accepted friends can message each other.
            </p>
            <Link to="/friends" className="btn btn-primary gap-2">
              <Users className="w-4 h-4" />
              Find & add friends
            </Link>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold">Select a conversation</h2>
            <p className="text-base-content/60 text-sm">
              Choose a friend from the sidebar to start chatting
            </p>
            <div className="flex items-center gap-2 bg-base-200 rounded-full px-4 py-2 text-sm text-base-content/50">
              <Search className="w-4 h-4" />
              Search friends in the sidebar
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default NoChatSelected;
