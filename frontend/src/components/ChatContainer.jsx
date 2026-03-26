import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { Trash2 } from "lucide-react";

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeFromMessages, deleteMessage, typingUsers } = useChatStore();
  const { authUser } = useAuthStore();
  const bottomRef = useRef(null);
  const [hoveredMsg, setHoveredMsg] = useState(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  const isTyping = typingUsers[selectedUser._id];

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {messages.length === 0 && (
          <div className="flex-1 flex items-center justify-center h-full">
            <div className="text-center text-base-content/40 py-12">
              <div className="text-4xl mb-3">👋</div>
              <p className="text-sm font-medium">Say hello to {selectedUser.fullName}!</p>
              <p className="text-xs mt-1">This is the start of your conversation.</p>
            </div>
          </div>
        )}

        {messages.map((message, i) => {
          const isMine = message.senderId === authUser._id;
          const isDeleted = message.deleted;
          const showDate = i === 0 || new Date(message.createdAt).toDateString() !== new Date(messages[i - 1]?.createdAt).toDateString();

          return (
            <div key={message._id}>
              {/* Date separator */}
              {showDate && (
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-base-300" />
                  <span className="text-xs text-base-content/40 font-medium">
                    {new Date(message.createdAt).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                  </span>
                  <div className="flex-1 h-px bg-base-300" />
                </div>
              )}

              <div
                className={`chat ${isMine ? "chat-end" : "chat-start"} group`}
                onMouseEnter={() => setHoveredMsg(message._id)}
                onMouseLeave={() => setHoveredMsg(null)}
              >
                <div className="chat-image avatar">
                  <div className="size-9 rounded-full border-2 border-base-300 overflow-hidden">
                    <img
                      src={isMine ? authUser.profilePic || "/avatar.png" : selectedUser.profilePic || "/avatar.png"}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="chat-header mb-1 flex items-center gap-2">
                  <time className="text-[11px] text-base-content/40">{formatMessageTime(message.createdAt)}</time>
                </div>

                <div className={`chat-bubble relative ${isDeleted ? "opacity-60 italic text-base-content/60 bg-base-200 text-base-content text-sm" : ""} ${isMine && !isDeleted ? "chat-bubble-primary" : ""}`}>
                  {message.image && !isDeleted && (
                    <img src={message.image} alt="Attachment" className="max-w-[200px] rounded-lg mb-2 cursor-pointer" />
                  )}
                  {message.text && <p className="text-sm leading-relaxed">{message.text}</p>}

                  {/* Delete button — only for sender, only on hover */}
                  {isMine && !isDeleted && hoveredMsg === message._id && (
                    <button
                      onClick={() => deleteMessage(message._id)}
                      className="absolute -top-2 -left-7 p-1 rounded-full bg-base-100 border border-base-300 text-error hover:bg-error hover:text-error-content transition-colors shadow-sm"
                      title="Delete message"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="chat chat-start">
            <div className="chat-image avatar">
              <div className="size-9 rounded-full border-2 border-base-300 overflow-hidden">
                <img src={selectedUser.profilePic || "/avatar.png"} alt="" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="chat-bubble bg-base-200 text-base-content flex items-center gap-1 py-3 px-4">
              <span className="w-2 h-2 bg-base-content/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 bg-base-content/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 bg-base-content/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;
