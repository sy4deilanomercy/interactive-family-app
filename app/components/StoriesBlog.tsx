"use client";

import React, { useState, useRef } from "react";
import { useFamily, FamilyStory } from "../context/FamilyContext";
import { BookOpen, Search, Plus, X, Calendar, User, Trash2, ArrowLeft, Heart } from "lucide-react";
import { formatDate } from "../lib/formatDate";
import { ShareDropdown } from "./ShareDropdown";

export const StoriesBlog: React.FC = () => {
  const { stories, addStory, deleteStory, convertToWebP, isAdmin, members, likedStories, toggleStoryLike } = useFamily();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeStory, setActiveStory] = useState<FamilyStory | null>(null);

  // Form write story states
  const [showWriteForm, setShowWriteForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<FamilyStory["category"]>("Memory");
  const [authorId, setAuthorId] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories: FamilyStory["category"][] = ["Memory", "Recipe", "Milestone", "Travel", "Tradition"];

  // Filter stories
  const filteredStories = stories.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle uploader image conversion
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsConverting(true);
    setErrorMsg("");
    try {
      const webpDataUrl = await convertToWebP(file);
      setPreviewImage(webpDataUrl);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to convert image. Please upload a valid image file.");
    } finally {
      setIsConverting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !authorId || !category) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    const selectedAuthor = members.find((m) => m.id === authorId);
    if (!selectedAuthor) return;

    addStory({
      title,
      content,
      category,
      authorId,
      authorName: selectedAuthor.name,
      date: new Date().toISOString().split("T")[0],
      image: previewImage || undefined,
      likes: 0,
    });

    // Reset Form
    setTitle("");
    setContent("");
    setCategory("Memory");
    setAuthorId("");
    setPreviewImage(null);
    setShowWriteForm(false);
    setErrorMsg("");
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this story?")) {
      deleteStory(id);
      if (activeStory?.id === id) setActiveStory(null);
    }
  };

  // Render Category Label Stylings
  const getCategoryBadgeColor = (cat: FamilyStory["category"]) => {
    switch (cat) {
      case "Memory": return "bg-blue-50 text-blue-600 border-blue-100";
      case "Recipe": return "bg-amber-50 text-amber-600 border-amber-100";
      case "Milestone": return "bg-purple-50 text-purple-600 border-purple-100";
      case "Travel": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "Tradition": return "bg-rose-50 text-rose-600 border-rose-100";
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 md:py-12 fade-in pb-8 md:pb-12">
      {/* 1. ARTICLE DETAIL VIEW (IF OPEN) */}
      {activeStory ? (
        <article className="bg-white rounded-3xl border border-[#EEDCD2]/60 p-6 sm:p-10 shadow-xs animate-fade-in">
          {/* Back button */}
          <button
            onClick={() => setActiveStory(null)}
            className="flex items-center gap-1.5 text-xs font-bold text-[#7D7068] hover:text-[#3E3835] mb-6 focus:outline-none cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Stories
          </button>

          {/* Category & Title */}
          <div className="flex items-center gap-2">
            <span className={`px-3 py-0.5 text-xxs font-bold uppercase tracking-wider rounded-full border ${getCategoryBadgeColor(activeStory.category)}`}>
              {activeStory.category}
            </span>
            <span className="text-xs text-[#7D7068]">Posted on {formatDate(activeStory.date, "monthDayYear")}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#3E3835] mt-3 leading-tight">
            {activeStory.title}
          </h1>

          {/* Author Details */}
          <div className="mt-4 flex items-center justify-between pb-6 border-b border-[#EEDCD2]/40">
            <div className="flex items-center gap-3 text-xs">
              <span className="font-semibold text-[#3E3835]">Written by {activeStory.authorName}</span>
              <button
                onClick={() => toggleStoryLike(activeStory.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                  likedStories.includes(activeStory.id)
                    ? "text-rose-600 bg-rose-50 border border-rose-100"
                    : "text-[#7D7068] hover:text-rose-500 hover:bg-rose-50 border border-transparent"
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${likedStories.includes(activeStory.id) ? "fill-current" : ""}`} />
                {activeStory.likes}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <ShareDropdown
                url={typeof window !== "undefined" ? window.location.href : ""}
                title={activeStory.title}
                description={activeStory.content.slice(0, 120)}
              />
              {isAdmin && (
                <button
                  onClick={(e) => {
                    handleDelete(activeStory.id, e);
                    setActiveStory(null);
                  }}
                  className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              )}
            </div>
          </div>

          {/* Story Image */}
          {activeStory.image && (
            <div className="my-8 overflow-hidden rounded-2xl bg-stone-100 max-h-[450px]">
              <img
                src={activeStory.image}
                alt={activeStory.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Story Body Paragraphs */}
          <div className="mt-6 text-base leading-8 text-[#5E4E46] whitespace-pre-wrap font-light tracking-wide max-w-2xl mx-auto">
            {activeStory.content}
          </div>
        </article>
      ) : (
        /* 2. LIST VIEW */
        <>
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#EEDCD2]/40 pb-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#606C38] bg-[#606C38]/10 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                <BookOpen className="w-3.5 h-3.5" /> Family Lore
              </div>
              <h1 className="font-serif text-3xl font-bold text-[#3E3835]">
                Family Stories & Recipes
              </h1>
              <p className="text-sm text-[#7D7068] mt-1">
                A warm journal of our funny anecdotes, recipe instructions, mountain trips, and heritage memories.
              </p>
            </div>

            {isAdmin && (
              <button
                onClick={() => {
                  setShowWriteForm(!showWriteForm);
                  setErrorMsg("");
                }}
                className="flex items-center gap-1.5 self-start md:self-center px-4 py-2 bg-[#606C38] hover:bg-[#283618] text-white text-sm font-semibold rounded-full shadow-xs hover:shadow-md transition-all cursor-pointer"
              >
                {showWriteForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {showWriteForm ? "Close Editor" : "Write a Story"}
              </button>
            )}
          </div>

          {/* Write Story Form */}
          {showWriteForm && (
            <div className="mb-8 rounded-2xl border border-[#EEDCD2] bg-white p-6 shadow-xs animate-fade-in">
              <h3 className="font-serif text-lg font-bold text-[#3E3835] mb-4">Write a New Memory</h3>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#7D7068] mb-1">
                      Story Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. The Thanksgiving Kitchen Incident"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-[#EEDCD2] focus:border-[#C87A53] focus:outline-none bg-white text-[#3E3835]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#7D7068] mb-1">
                        Category *
                      </label>
                      <select
                        required
                        value={category}
                        onChange={(e) => setCategory(e.target.value as FamilyStory["category"])}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-[#EEDCD2] focus:border-[#C87A53] focus:outline-none bg-white text-[#3E3835]"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#7D7068] mb-1">
                        Author Name *
                      </label>
                      <select
                        required
                        value={authorId}
                        onChange={(e) => setAuthorId(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-[#EEDCD2] focus:border-[#C87A53] focus:outline-none bg-white text-[#3E3835]"
                      >
                        <option value="">Select Author...</option>
                        {members.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#7D7068] mb-1">
                    Story Content *
                  </label>
                  <textarea
                    required
                    placeholder="Once upon a time..."
                    rows={6}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#EEDCD2] focus:border-[#C87A53] focus:outline-none bg-white text-[#3E3835] leading-relaxed"
                  />
                </div>

                {/* Optional Story Illustration */}
                <div className="border border-dashed border-[#EEDCD2] rounded-xl bg-[#FAF7F2] p-4 flex flex-col md:flex-row items-center gap-4">
                  {previewImage ? (
                    <div className="relative w-32 h-20 overflow-hidden rounded-lg shadow-xxs">
                      <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setPreviewImage(null)}
                        className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-black/80 text-white rounded-full"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center md:text-left">
                      <button
                        type="button"
                        disabled={isConverting}
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-white border border-[#EEDCD2] hover:bg-[#EEDCD2]/20 text-[#5E4E46] text-xs font-semibold rounded-lg shadow-xxs cursor-pointer"
                      >
                        {isConverting ? "Optimizing..." : "Add Illustration Photo"}
                      </button>
                      <span className="text-xxs text-[#7D7068] block mt-1 md:inline md:ml-3">
                        Optional photo. Will automatically convert to light, speedy .webp
                      </span>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  )}
                </div>

                {errorMsg && <p className="text-xs text-red-500 font-semibold">{errorMsg}</p>}

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#606C38] hover:bg-[#283618] text-white font-semibold rounded-lg shadow-xxs cursor-pointer text-sm"
                >
                  Publish to Ledger
                </button>
              </form>
            </div>
          )}

          {/* Search and Categories bar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7D7068]" />
              <input
                type="text"
                placeholder="Search keywords, authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-[#EEDCD2] focus:border-[#C87A53] focus:ring-1 focus:ring-[#C87A53] bg-white text-[#3E3835] focus:outline-none placeholder:text-[#7D7068]/60 transition-all"
              />
            </div>

            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full transition-all shrink-0 ${
                  selectedCategory === "all"
                    ? "bg-[#C87A53] text-white"
                    : "bg-white border border-[#EEDCD2] text-[#7D7068] hover:bg-[#FAF7F2]"
                }`}
              >
                All Stories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full transition-all shrink-0 ${
                    selectedCategory === cat
                      ? "bg-[#C87A53] text-white"
                      : "bg-white border border-[#EEDCD2] text-[#7D7068] hover:bg-[#FAF7F2]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Stories List (Elegant card feed) */}
          <div className="flex flex-col gap-6">
            {filteredStories.map((story) => (
              <article
                key={story.id}
                onClick={() => setActiveStory(story)}
                className="group relative flex flex-col md:flex-row gap-6 p-5 rounded-2xl bg-white border border-[#EEDCD2]/60 hover:border-[#C87A53]/50 shadow-xxs hover:shadow-sm transition-all duration-300 cursor-pointer"
              >
                {/* Story Image */}
                {story.image && (
                  <div className="h-44 w-full md:h-full md:w-48 overflow-hidden rounded-xl bg-[#FAF7F2] flex-shrink-0">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                    />
                  </div>
                )}

                {/* Story Details Preview */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 text-xxs font-bold uppercase tracking-wider rounded-full border ${getCategoryBadgeColor(story.category)}`}>
                        {story.category}
                      </span>
                      <span className="text-xxs text-[#7D7068] flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#C87A53]/70" />
                        {formatDate(story.date, "monthYear")}
                      </span>
                    </div>

                    <h2 className="font-serif text-lg font-bold text-[#3E3835] mt-2 group-hover:text-[#C87A53] transition-colors leading-snug">
                      {story.title}
                    </h2>

                    <p className="mt-2 text-xs leading-relaxed text-[#7D7068] line-clamp-3">
                      {story.content}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xxs text-[#7D7068] border-t border-[#EEDCD2]/30 pt-3">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 font-medium text-[#5E4E46]">
                        <User className="w-3.5 h-3.5 text-[#C87A53]/70" /> By {story.authorName}
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleStoryLike(story.id); }}
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                          likedStories.includes(story.id)
                            ? "text-rose-600 bg-rose-50 border border-rose-100"
                            : "text-[#7D7068] hover:text-rose-500 hover:bg-rose-50 border border-transparent"
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${likedStories.includes(story.id) ? "fill-current" : ""}`} />
                        {story.likes}
                      </button>
                    </div>

                    {isAdmin && (
                      <button
                        onClick={(e) => handleDelete(story.id, e)}
                        className="p-1.5 text-[#7D7068] hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                        title="Delete story"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}

            {filteredStories.length === 0 && (
              <div className="py-16 text-center text-[#7D7068]">
                No family stories match the selected criteria.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
