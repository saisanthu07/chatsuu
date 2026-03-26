import FriendRequest from "../models/friendRequest.model.js";
import User from "../models/user.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

// Search users by username (only shows users who aren't already friends or pending)
export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const currentUserId = req.user._id;

    if (!query || query.trim().length < 1) {
      return res.status(200).json([]);
    }

    // Find accepted friends
    const friendships = await FriendRequest.find({
      $or: [{ sender: currentUserId, status: "accepted" }, { receiver: currentUserId, status: "accepted" }],
    });
    const friendIds = friendships.map((f) =>
      f.sender.toString() === currentUserId.toString() ? f.receiver : f.sender
    );

    // Find pending requests involving current user
    const pending = await FriendRequest.find({
      $or: [{ sender: currentUserId, status: "pending" }, { receiver: currentUserId, status: "pending" }],
    });
    const pendingIds = pending.map((p) =>
      p.sender.toString() === currentUserId.toString() ? p.receiver : p.sender
    );

    const excludedIds = [...friendIds, ...pendingIds, currentUserId];

    const users = await User.find({
      _id: { $nin: excludedIds },
      $or: [
        { username: { $regex: query, $options: "i" } },
        { fullName: { $regex: query, $options: "i" } },
      ],
    })
      .select("-password")
      .limit(10);

    res.status(200).json(users);
  } catch (error) {
    console.error("Error in searchUsers:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Send a friend request
export const sendFriendRequest = async (req, res) => {
  try {
    const { receiverId } = req.params;
    const senderId = req.user._id;

    if (senderId.toString() === receiverId) {
      return res.status(400).json({ message: "Cannot send request to yourself" });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) return res.status(404).json({ message: "User not found" });

    const existing = await FriendRequest.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    });

    if (existing) {
      return res.status(400).json({ message: "Friend request already exists" });
    }

    const request = await FriendRequest.create({ sender: senderId, receiver: receiverId });

    // Notify receiver via socket
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newFriendRequest", {
        request,
        sender: { _id: req.user._id, fullName: req.user.fullName, username: req.user.username, profilePic: req.user.profilePic },
      });
    }

    res.status(201).json({ message: "Friend request sent", request });
  } catch (error) {
    console.error("Error in sendFriendRequest:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Accept or reject a friend request
export const respondToRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { action } = req.body; // "accepted" or "rejected"
    const currentUserId = req.user._id;

    if (!["accepted", "rejected"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    const request = await FriendRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.receiver.toString() !== currentUserId.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    request.status = action;
    await request.save();

    // Notify sender via socket
    const senderSocketId = getReceiverSocketId(request.sender.toString());
    if (senderSocketId) {
      io.to(senderSocketId).emit("friendRequestResponse", { requestId, action, responder: { _id: req.user._id, fullName: req.user.fullName, username: req.user.username, profilePic: req.user.profilePic } });
    }

    res.status(200).json({ message: `Request ${action}`, request });
  } catch (error) {
    console.error("Error in respondToRequest:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all friends (accepted)
export const getFriends = async (req, res) => {
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
    console.error("Error in getFriends:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get pending friend requests (received)
export const getPendingRequests = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const requests = await FriendRequest.find({
      receiver: currentUserId,
      status: "pending",
    }).populate("sender", "-password");

    res.status(200).json(requests);
  } catch (error) {
    console.error("Error in getPendingRequests:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get sent pending requests
export const getSentRequests = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const requests = await FriendRequest.find({
      sender: currentUserId,
      status: "pending",
    }).populate("receiver", "-password");

    res.status(200).json(requests);
  } catch (error) {
    console.error("Error in getSentRequests:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Remove a friend
export const removeFriend = async (req, res) => {
  try {
    const { friendId } = req.params;
    const currentUserId = req.user._id;

    await FriendRequest.findOneAndDelete({
      $or: [
        { sender: currentUserId, receiver: friendId, status: "accepted" },
        { sender: friendId, receiver: currentUserId, status: "accepted" },
      ],
    });

    res.status(200).json({ message: "Friend removed" });
  } catch (error) {
    console.error("Error in removeFriend:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
