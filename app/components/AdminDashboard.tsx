"use client";

import React, { useState } from "react";
import { useFamily, FamilyMember } from "../context/FamilyContext";
import { formatDate } from "../lib/formatDate";
import { 
  Users, Image as ImageIcon, BookOpen, X, Trash2,
  UserPlus, Edit3, ShieldCheck
} from "lucide-react";

export const AdminDashboard: React.FC = () => {
  const { members, photos, stories, addMember, deleteMember, updateMember, deletePhoto, deleteStory, setActiveProfileId } = useFamily();
  const [activeTab, setActiveTab] = useState<"overview" | "members" | "gallery" | "stories">("overview");

  // Add/Edit member form
  const [showAddMember, setShowAddMember] = useState(false);
  const [editMemberId, setEditMemberId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [relationship, setRelationship] = useState("");
  const [generation, setGeneration] = useState<number>(1);
  const [occupation, setOccupation] = useState("");
  const [hobbiesStr, setHobbiesStr] = useState("");
  const [parentsStr, setParentsStr] = useState("");
  const [spousesStr, setSpousesStr] = useState("");
  const [formError, setFormError] = useState("");

  const resetForm = () => {
    setName(""); setBirthDate(""); setBirthPlace(""); setCurrentLocation("");
    setBio(""); setAvatar(""); setRelationship(""); setGeneration(1);
    setOccupation(""); setHobbiesStr(""); setParentsStr(""); setSpousesStr("");
    setFormError(""); setEditMemberId(null);
  };

  const openEditMember = (m: FamilyMember) => {
    setName(m.name); setBirthDate(m.birthDate);
    setBirthPlace(m.birthPlace || ""); setCurrentLocation(m.currentLocation || "");
    setBio(m.bio || ""); setAvatar(m.avatar || "");
    setRelationship(m.relationship); setGeneration(m.generation);
    setOccupation(m.occupation || "");
    setHobbiesStr(m.hobbies?.join(", ") || "");
    setParentsStr(m.parents.join(", "));
    setSpousesStr(m.spouses.join(", "));
    setEditMemberId(m.id);
    setShowAddMember(true);
  };

  const handleMemberFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !birthDate || !relationship) {
      setFormError("Name, Birth Date, and Relationship are required.");
      return;
    }

    const hobbies = hobbiesStr.split(",").map((h) => h.trim()).filter(Boolean);
    const parentIds = parentsStr.split(",").map((p) => p.trim()).filter(Boolean);
    const spouseIds = spousesStr.split(",").map((s) => s.trim()).filter(Boolean);

    // In a full app, the avatar would use the webp converter from a file upload.
    // For now, use the default sample placeholder or a custom URL.
    const avatarUrl = avatar || `https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=400`;

    if (editMemberId) {
      updateMember(editMemberId, {
        name, birthDate,
        birthPlace: birthPlace || undefined,
        currentLocation: currentLocation || undefined,
        bio: bio || undefined,
        avatar: avatarUrl,
        relationship, generation,
        occupation: occupation || undefined,
        hobbies: hobbies.length > 0 ? hobbies : undefined,
        parents: parentIds,
        spouses: spouseIds,
      });
    } else {
      addMember({
        name, birthDate,
        birthPlace: birthPlace || undefined,
        currentLocation: currentLocation || undefined,
        bio: bio || undefined,
        avatar: avatarUrl,
        relationship, generation,
        occupation: occupation || undefined,
        hobbies: hobbies.length > 0 ? hobbies : undefined,
        parents: parentIds,
        spouses: spouseIds,
        children: [],
      });
    }

    resetForm();
    setShowAddMember(false);
  };

  // Stats
  const totalMembers = members.length;
  const totalPhotos = photos.length;
  const totalStories = stories.length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12 fade-in pb-8 md:pb-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#EEDCD2]/40 pb-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#606C38] bg-[#606C38]/10 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Admin Mode
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#3E3835]">Administration Dashboard</h1>
          <p className="text-sm text-[#7D7068] mt-1">Manage the family tree, photos, and story archives.</p>
        </div>

        <button
          onClick={() => setShowAddMember(!showAddMember)}
          className="flex items-center gap-1.5 self-start md:self-center px-4 py-2 bg-[#606C38] hover:bg-[#283618] text-white text-sm font-semibold rounded-full shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          {showAddMember ? <X className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
          {showAddMember ? "Close Form" : "Add Family Member"}
        </button>
      </div>

      {/* Add Member Form */}
      {showAddMember && (
        <div className="mb-8 rounded-2xl border border-[#EEDCD2] bg-white p-6 shadow-xs animate-fade-in">
          <h3 className="font-serif text-lg font-bold text-[#3E3835] mb-4">
            {editMemberId ? "Edit Family Member" : "Add New Family Member"}
          </h3>
          <form onSubmit={handleMemberFormSubmit} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#7D7068] mb-1">Name *</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-[#EEDCD2] focus:border-[#C87A53] focus:outline-none bg-white text-[#3E3835]" placeholder="Full name" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#7D7068] mb-1">Birth Date *</label>
              <input type="date" required value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-[#EEDCD2] focus:border-[#C87A53] focus:outline-none bg-white text-[#3E3835]" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#7D7068] mb-1">Relationship *</label>
              <select required value={relationship} onChange={(e) => setRelationship(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-[#EEDCD2] focus:border-[#C87A53] focus:outline-none bg-white text-[#3E3835]">
                <option value="">Select...</option>
                <option value="Grandfather">Grandfather</option>
                <option value="Grandmother">Grandmother</option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Son">Son</option>
                <option value="Daughter">Daughter</option>
                <option value="Brother">Brother</option>
                <option value="Sister">Sister</option>
                <option value="Uncle">Uncle</option>
                <option value="Aunt">Aunt</option>
                <option value="Cousin">Cousin</option>
                <option value="Spouse">Spouse / Partner</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#7D7068] mb-1">Generation *</label>
              <select required value={generation} onChange={(e) => setGeneration(parseInt(e.target.value))} className="w-full px-3 py-2 text-sm rounded-lg border border-[#EEDCD2] focus:border-[#C87A53] focus:outline-none bg-white text-[#3E3835]">
                <option value={0}>0 - Grandparent</option>
                <option value={1}>1 - Parent / Aunt / Uncle</option>
                <option value={2}>2 - Child / Grandchild</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#7D7068] mb-1">Birth Place</label>
              <input type="text" value={birthPlace} onChange={(e) => setBirthPlace(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-[#EEDCD2] focus:border-[#C87A53] focus:outline-none bg-white text-[#3E3835]" placeholder="City, Country" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#7D7068] mb-1">Current Location</label>
              <input type="text" value={currentLocation} onChange={(e) => setCurrentLocation(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-[#EEDCD2] focus:border-[#C87A53] focus:outline-none bg-white text-[#3E3835]" placeholder="City, State" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#7D7068] mb-1">Occupation</label>
              <input type="text" value={occupation} onChange={(e) => setOccupation(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-[#EEDCD2] focus:border-[#C87A53] focus:outline-none bg-white text-[#3E3835]" placeholder="e.g. Teacher, Engineer" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#7D7068] mb-1">Avatar URL</label>
              <input type="text" value={avatar} onChange={(e) => setAvatar(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-[#EEDCD2] focus:border-[#C87A53] focus:outline-none bg-white text-[#3E3835]" placeholder="https://..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#7D7068] mb-1">Bio</label>
              <textarea rows={2} value={bio} onChange={(e) => setBio(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-[#EEDCD2] focus:border-[#C87A53] focus:outline-none bg-white text-[#3E3835]" placeholder="A short warm description of this person..." />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#7D7068] mb-1">Hobbies (comma separated)</label>
              <input type="text" value={hobbiesStr} onChange={(e) => setHobbiesStr(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-[#EEDCD2] focus:border-[#C87A53] focus:outline-none bg-white text-[#3E3835]" placeholder="Woodworking, Baking, Hiking" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#7D7068] mb-1">Parent IDs (comma separated)</label>
              <input type="text" value={parentsStr} onChange={(e) => setParentsStr(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-[#EEDCD2] focus:border-[#C87A53] focus:outline-none bg-white text-[#3E3835]" placeholder="g1, g2" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#7D7068] mb-1">Spouse IDs (comma separated)</label>
              <input type="text" value={spousesStr} onChange={(e) => setSpousesStr(e.target.value)} className="w-full px-3 py-2 text-sm rounded-lg border border-[#EEDCD2] focus:border-[#C87A53] focus:outline-none bg-white text-[#3E3835]" placeholder="p2" />
            </div>
            <div className="md:col-span-2 flex items-center gap-3">
              {formError && <p className="text-xs text-red-500 font-semibold">{formError}</p>}
              <button type="submit" className="px-6 py-2 bg-[#606C38] hover:bg-[#283618] text-white font-semibold rounded-lg text-sm transition-all cursor-pointer">
                {editMemberId ? "Update Member" : "Add Member"}
              </button>
              <button type="button" onClick={() => { resetForm(); setShowAddMember(false); }} className="px-4 py-2 text-xs text-[#7D7068] hover:text-[#3E3835] cursor-pointer">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab Bar */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
        {(["overview", "members", "gallery", "stories"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-all shrink-0 ${
              activeTab === tab
                ? "bg-[#606C38] text-white shadow-xs"
                : "bg-white border border-[#EEDCD2] text-[#7D7068] hover:bg-[#FAF7F2]"
            }`}
          >
            {tab === "overview" ? "📊 Overview" : tab === "members" ? `👥 Members` : tab === "gallery" ? `📸 Gallery` : `📝 Stories`}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="rounded-2xl bg-white border border-[#EEDCD2]/50 p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <Users className="w-8 h-8 text-[#606C38]" />
              <span className="text-3xl font-bold text-[#3E3835]">{totalMembers}</span>
            </div>
            <p className="mt-2 text-sm font-medium text-[#7D7068]">Total Family Members</p>
            <p className="text-xs text-[#7D7068] mt-1">
              Gen 0: {members.filter(m => m.generation === 0).length} • 
              Gen 1: {members.filter(m => m.generation === 1).length} • 
              Gen 2: {members.filter(m => m.generation === 2).length}
            </p>
          </div>
          <div className="rounded-2xl bg-white border border-[#EEDCD2]/50 p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <ImageIcon className="w-8 h-8 text-[#C87A53]" />
              <span className="text-3xl font-bold text-[#3E3835]">{totalPhotos}</span>
            </div>
            <p className="mt-2 text-sm font-medium text-[#7D7068]">Gallery Memories</p>
            <div className="mt-3 flex -space-x-2">
              {photos.slice(0, 5).map((ph) => (
                <div key={ph.id} className="h-8 w-8 rounded-full border-2 border-white overflow-hidden">
                  <img src={ph.url} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl bg-white border border-[#EEDCD2]/50 p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <BookOpen className="w-8 h-8 text-[#C87A53]" />
              <span className="text-3xl font-bold text-[#3E3835]">{totalStories}</span>
            </div>
            <p className="mt-2 text-sm font-medium text-[#7D7068]">Stories & Recipes</p>
            <p className="text-xs text-[#7D7068] mt-1">
              {stories.filter(s => s.category === "Memory").length} Memories • {stories.filter(s => s.category === "Recipe").length} Recipes • {stories.filter(s => s.category === "Travel").length} Travels
            </p>
          </div>
        </div>
      )}

      {activeTab === "members" && (
        <div className="flex flex-col gap-3">
          {members.map((m) => (
            <div key={m.id} className="flex items-center justify-between p-4 bg-white border border-[#EEDCD2]/50 rounded-xl hover:border-[#C87A53]/30 transition-all">
              <button
                onClick={() => setActiveProfileId(m.id)}
                className="flex items-center gap-3 flex-1 min-w-0 text-left cursor-pointer"
              >
                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border-2 border-[#EEDCD2]">
                  <img src={m.avatar} alt={m.name} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0">
                  <span className="block text-sm font-semibold text-[#3E3835] truncate">{m.name}</span>
                  <span className="text-xxs text-[#7D7068]">{m.relationship} • Gen {m.generation} • ID: {m.id}</span>
                </div>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditMember(m)}
                  className="p-2 text-[#7D7068] hover:text-[#606C38] hover:bg-[#FAF7F2] rounded-lg transition-all cursor-pointer"
                  title="Edit member"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { if (confirm(`Remove ${m.name} from the tree?`)) deleteMember(m.id); }}
                  className="p-2 text-[#7D7068] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                  title="Delete member"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "gallery" && (
        <div className="flex flex-col gap-3">
          {photos.map((ph) => (
            <div key={ph.id} className="flex items-center gap-4 p-3 pr-4 bg-white border border-[#EEDCD2]/50 rounded-xl hover:border-[#C87A53]/30 transition-all">
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-[#FAF7F2]">
                <img src={ph.url} alt={ph.title} className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-sm font-semibold text-[#3E3835] truncate">{ph.title}</span>
                <span className="text-xxs text-[#7D7068]">by {ph.uploadedBy} • {formatDate(ph.date, "shortDate")}</span>
              </div>
              <button
                onClick={() => { if (confirm(`Remove "${ph.title}" from gallery?`)) deletePhoto(ph.id); }}
                className="p-2 text-[#7D7068] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {photos.length === 0 && <p className="text-xs text-[#7D7068] italic text-center py-8">No photos yet. Add from the Gallery tab!</p>}
        </div>
      )}

      {activeTab === "stories" && (
        <div className="flex flex-col gap-3">
          {stories.map((st) => (
            <div key={st.id} className="flex items-center gap-4 p-3 pr-4 bg-white border border-[#EEDCD2]/50 rounded-xl hover:border-[#C87A53]/30 transition-all">
              {st.image ? (
                <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-[#FAF7F2]">
                  <img src={st.image} alt={st.title} className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="h-14 w-14 flex-shrink-0 rounded-xl bg-[#FAF7F2] flex items-center justify-center text-[#7D7068]">
                  <BookOpen className="w-5 h-5" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <span className="block text-sm font-semibold text-[#3E3835] truncate">{st.title}</span>
                <span className="text-xxs text-[#7D7068]">
                  {st.category} • by {st.authorName} • {formatDate(st.date, "shortDate")}
                </span>
              </div>
              <button
                onClick={() => { if (confirm(`Delete "${st.title}"? This cannot be undone.`)) deleteStory(st.id); }}
                className="p-2 text-[#7D7068] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {stories.length === 0 && <p className="text-xs text-[#7D7068] italic text-center py-8">No stories written yet. Write from the Stories tab!</p>}
        </div>
      )}
    </div>
  );
};
