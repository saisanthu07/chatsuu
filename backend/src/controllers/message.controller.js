import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import FriendRequest from "../models/friendRequest.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

// Get friends for sidebar (only accepted friends)
export const getUsersForSidebar = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const friendships = await FriendRequest.find({
      $or: [{ sender: currentUserId, status: "accepted" }, { receiver: currentUserId, status: "accepted" }],
    }).populate("sender receiver", "-password");

    const friends = friendships.map((f) =>
      f.sender._id.toString() === currentUserId.toString() ? f.receiver : f.sender
    );

    res.status(200).json(friends);
  } catch (error) {
    console.error("Error in getUsersForSidebar:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    // Verify they are friends
    const friendship = await FriendRequest.findOne({
      $or: [
        { sender: myId, receiver: userToChatId, status: "accepted" },
        { sender: userToChatId, receiver: myId, status: "accepted" },
      ],
    });
    if (!friendship) return res.status(403).json({ error: "You can only message friends" });

    const messages = await Message.find({
      $or: [{ senderId: myId, receiverId: userToChatId }, { senderId: userToChatId, receiverId: myId }],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    // Verify friendship
    const friendship = await FriendRequest.findOne({
      $or: [
        { sender: senderId, receiver: receiverId, status: "accepted" },
        { sender: receiverId, receiver: senderId, status: "accepted" },
      ],
    });
    if (!friendship) return res.status(403).json({ error: "You can only message friends" });

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({ senderId, receiverId, text, image: imageUrl });
    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) return res.status(404).json({ error: "Message not found" });
    if (message.senderId.toString() !== userId.toString()) {
      return res.status(403).json({ error: "You can only delete your own messages" });
    }

    message.text = "This message was deleted";
    message.image = null;
    message.deleted = true;
    await message.save();

    const receiverSocketId = getReceiverSocketId(message.receiverId.toString());
    if (receiverSocketId) io.to(receiverSocketId).emit("messageDeleted", messageId);

    res.status(200).json({ message: "Message deleted" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
