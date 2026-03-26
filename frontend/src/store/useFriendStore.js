import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useFriendStore = create((set, get) => ({
  friends: [],
  pendingRequests: [],
  sentRequests: [],
  searchResults: [],
  isSearching: false,
  isLoadingFriends: false,
  isLoadingPending: false,

  searchUsers: async (query) => {
    if (!query.trim()) { set({ searchResults: [] }); return; }
    set({ isSearching: true });
    try {
      const res = await axiosInstance.get(`/friends/search?query=${encodeURIComponent(query)}`);
      set({ searchResults: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Search failed");
    } finally {
      set({ isSearching: false });
    }
  },

  sendFriendRequest: async (receiverId) => {
    try {
      await axiosInstance.post(`/friends/request/${receiverId}`);
      toast.success("Friend request sent!");
      set((state) => ({ searchResults: state.searchResults.filter((u) => u._id !== receiverId) }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send request");
    }
  },

  respondToRequest: async (requestId, action) => {
    try {
      await axiosInstance.put(`/friends/request/${requestId}`, { action });
      toast.success(action === "accepted" ? "Friend request accepted!" : "Request declined");
      set((state) => ({ pendingRequests: state.pendingRequests.filter((r) => r._id !== requestId) }));
      if (action === "accepted") get().getFriends();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to respond");
    }
  },

  getFriends: async () => {
    set({ isLoadingFriends: true });
    try {
      const res = await axiosInstance.get("/friends");
      set({ friends: res.data });
    } catch (error) {
      console.error("Error loading friends:", error);
    } finally {
      set({ isLoadingFriends: false });
    }
  },

  getPendingRequests: async () => {
    set({ isLoadingPending: true });
    try {
      const res = await axiosInstance.get("/friends/pending");
      set({ pendingRequests: res.data });
    } catch (error) {
      console.error("Error loading pending requests:", error);
    } finally {
      set({ isLoadingPending: false });
    }
  },

  getSentRequests: async () => {
    try {
      const res = await axiosInstance.get("/friends/sent");
      set({ sentRequests: res.data });
    } catch (error) {
      console.error("Error loading sent requests:", error);
    }
  },

  removeFriend: async (friendId) => {
    try {
      await axiosInstance.delete(`/friends/${friendId}`);
      set((state) => ({ friends: state.friends.filter((f) => f._id !== friendId) }));
      toast.success("Friend removed");
    } catch (error) {
      toast.error("Failed to remove friend");
    }
  },

  // Handle real-time friend request notification
  addIncomingRequest: (requestData) => {
    set((state) => ({
      pendingRequests: [...state.pendingRequests, requestData.request],
    }));
  },
}));
