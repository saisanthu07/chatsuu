import { useRef, useState, useEffect, useCallback } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Image, Send, X, Smile } from "lucide-react";
import toast from "react-hot-toast";

const EMOJI_LIST = ["😀","😂","❤️","🔥","👍","😍","🙏","💯","😎","🤔","😢","🎉","✨","💪","🥳","😴","🤣","😊","👀","💀"];

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const { sendMessage, selectedUser } = useChatStore();
  const { socket, authUser } = useAuthStore();

  const emitTyping = useCallback(() => {
    if (!socket || !selectedUser) return;
    socket.emit("typing", { receiverId: selectedUser._id });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { receiverId: selectedUser._id });
    }, 1500);
  }, [socket, selectedUser]);

  useEffect(() => {
    return () => clearTimeout(typingTimeoutRef.current);
  }, []);

  const handleTextChange = (e) => {
    setText(e.target.value);
    emitTyping();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file?.type.startsWith("image/")) { toast.error("Please select an image file"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return; }
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    // Stop typing
    if (socket && selectedUser) socket.emit("stopTyping", { receiverId: selectedUser._id });
    clearTimeout(typingTimeoutRef.current);

    try {
      await sendMessage({ text: text.trim(), image: imagePreview });
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setShowEmoji(false);
    } catch (err) {
      console.error("Send failed:", err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  return (
    <div className="px-4 py-3 border-t border-base-300 bg-base-100">
      {/* Image preview */}
      {imagePreview && (
        <div className="mb-3">
          <div className="relative inline-block">
            <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover rounded-xl border-2 border-primary/30" />
            <button onClick={removeImage} className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-error text-error-content flex items-center justify-center shadow">
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Emoji picker */}
      {showEmoji && (
        <div className="mb-2 p-3 bg-base-200 rounded-xl border border-base-300 flex flex-wrap gap-2">
          {EMOJI_LIST.map((emoji) => (
            <button key={emoji} className="text-xl hover:scale-125 transition-transform" onClick={() => setText((t) => t + emoji)}>
              {emoji}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSend} className="flex items-center gap-2">
        <button type="button" className={`btn btn-circle btn-sm btn-ghost ${showEmoji ? "text-primary" : "text-base-content/50"}`} onClick={() => setShowEmoji(!showEmoji)}>
          <Smile className="w-5 h-5" />
        </button>

        <div className="flex-1 relative">
          <input
            type="text"
            className="input input-bordered w-full input-sm sm:input-md rounded-full pr-10"
            placeholder="Message..."
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
          />
        </div>

        <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />
        <button type="button" className={`btn btn-circle btn-sm btn-ghost ${imagePreview ? "text-primary" : "text-base-content/50"}`} onClick={() => fileInputRef.current?.click()}>
          <Image className="w-5 h-5" />
        </button>

        <button type="submit" className="btn btn-primary btn-circle btn-sm sm:btn-md" disabled={!text.trim() && !imagePreview}>
          <Send className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;
