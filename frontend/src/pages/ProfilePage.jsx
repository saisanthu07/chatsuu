import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, AtSign, FileText, Loader2, Check } from "lucide-react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ fullName: authUser?.fullName || "", bio: authUser?.bio || "" });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      setSelectedImg(reader.result);
      await updateProfile({ profilePic: reader.result });
    };
  };

  const handleSave = async () => {
    await updateProfile({ fullName: form.fullName, bio: form.bio });
    setEditMode(false);
  };

  return (
    <div className="min-h-screen bg-base-200 pt-20">
      <div className="max-w-lg mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Profile</h1>
          <p className="text-base-content/60 text-sm mt-1">Your public information</p>
        </div>

        {/* Avatar card */}
        <div className="bg-base-100 rounded-2xl border border-base-300 p-8 flex flex-col items-center gap-4">
          <div className="relative">
            <img
              src={selectedImg || authUser?.profilePic || "/avatar.png"}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover ring-4 ring-primary/20"
            />
            <label
              htmlFor="avatar-upload"
              className={`absolute bottom-0 right-0 bg-primary text-primary-content p-2 rounded-full cursor-pointer hover:scale-110 transition-transform shadow-lg ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}`}
            >
              {isUpdatingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
              <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUpdatingProfile} />
            </label>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg">{authUser?.fullName}</div>
            <div className="text-base-content/50 text-sm">@{authUser?.username}</div>
            {authUser?.bio && <div className="text-base-content/70 text-sm mt-1 max-w-xs">{authUser.bio}</div>}
          </div>
        </div>

        {/* Info card */}
        <div className="bg-base-100 rounded-2xl border border-base-300 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-base-200">
            <span className="font-semibold">Personal Info</span>
            {!editMode ? (
              <button onClick={() => setEditMode(true)} className="btn btn-sm btn-outline">Edit</button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setEditMode(false)} className="btn btn-sm btn-ghost">Cancel</button>
                <button onClick={handleSave} disabled={isUpdatingProfile} className="btn btn-sm btn-primary gap-1">
                  {isUpdatingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Save
                </button>
              </div>
            )}
          </div>

          <div className="divide-y divide-base-200">
            {[
              { icon: <User className="w-4 h-4" />, label: "Full Name", key: "fullName", value: authUser?.fullName, editable: true },
              { icon: <AtSign className="w-4 h-4" />, label: "Username", key: "username", value: `@${authUser?.username}`, editable: false },
              { icon: <Mail className="w-4 h-4" />, label: "Email", key: "email", value: authUser?.email, editable: false },
              { icon: <FileText className="w-4 h-4" />, label: "Bio", key: "bio", value: authUser?.bio || "No bio yet", editable: true },
            ].map((row) => (
              <div key={row.key} className="flex items-start gap-3 p-4">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                  {row.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-base-content/50 mb-1">{row.label}</div>
                  {editMode && row.editable ? (
                    row.key === "bio" ? (
                      <textarea
                        className="textarea textarea-bordered w-full text-sm resize-none"
                        rows={2}
                        maxLength={160}
                        value={form.bio}
                        onChange={(e) => setForm({ ...form, bio: e.target.value })}
                        placeholder="Tell people about yourself..."
                      />
                    ) : (
                      <input
                        className="input input-bordered input-sm w-full"
                        value={form[row.key] || ""}
                        onChange={(e) => setForm({ ...form, [row.key]: e.target.value })}
                      />
                    )
                  ) : (
                    <div className={`text-sm ${!authUser?.[row.key] && row.key === "bio" ? "text-base-content/40 italic" : ""}`}>{row.value}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Account details */}
        <div className="bg-base-100 rounded-2xl border border-base-300 overflow-hidden">
          <div className="p-4 border-b border-base-200">
            <span className="font-semibold">Account Details</span>
          </div>
          <div className="divide-y divide-base-200">
            <div className="flex items-center justify-between p-4 text-sm">
              <span className="text-base-content/60">Member since</span>
              <span className="font-medium">{authUser?.createdAt ? new Date(authUser.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "—"}</span>
            </div>
            <div className="flex items-center justify-between p-4 text-sm">
              <span className="text-base-content/60">Account status</span>
              <span className="badge badge-success badge-sm">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
