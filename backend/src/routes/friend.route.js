import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  searchUsers, sendFriendRequest, respondToRequest,
  getFriends, getPendingRequests, getSentRequests, removeFriend
} from "../controllers/friend.controller.js";

const router = express.Router();

router.get("/search", protectRoute, searchUsers);
router.get("/", protectRoute, getFriends);
router.get("/pending", protectRoute, getPendingRequests);
router.get("/sent", protectRoute, getSentRequests);
router.post("/request/:receiverId", protectRoute, sendFriendRequest);
router.put("/request/:requestId", protectRoute, respondToRequest);
router.delete("/:friendId", protectRoute, removeFriend);

export default router;
