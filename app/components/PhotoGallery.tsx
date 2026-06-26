"use client";

import React, { useState, useRef } from "react";
import { useFamily, GalleryPhoto } from "../context/FamilyContext";
import { Plus, X, Upload, Calendar, User, Search, Trash2, Camera, Eye, Heart } from "lucide-react";
import { formatDate } from "../lib/formatDate";
import { ShareDropdown } from "./ShareDropdown";

export const PhotoGallery: React.FC = () => {
  const { photos, addPhoto, deletePhoto, convertToWebP, isAdmin, members, likedPhotos, togglePhotoLike } = useFamily();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  
  // Upload states
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [uploadedBy, setUploadedBy] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter photos
  const filteredPhotos = photos.filter((p) => {
    const query = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(query) ||
      (p.description && p.description.toLowerCase().includes(query)) ||
      p.uploadedBy.toLowerCase().includes(query)
    );
  });

  // Handle client-side WebP conversion and preview
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMsg("");
    try {
      // Run canvas based WebP converter from context!
      const webpBase64 = await convertToWebP(file);
      setPreviewUrl(webpBase64);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to convert image. Please upload a valid image file.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewUrl || !title || !uploadedBy) {
      setErrorMsg("Please fill in all required fields and upload an image.");
      return;
    }

    addPhoto({
      url: previewUrl,
      title,
      description: description || undefined,
      date,
      uploadedBy,
      likes: 0
    });

    // Reset Form
    setTitle("");
    setDescription("");
    setDate(new Date().toISOString().split("T")[0]);
    setUploadedBy("");
    setPreviewUrl(null);
    setShowUploadForm(false);
    setErrorMsg("");
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this memory?")) {
      deletePhoto(id);
      if (selectedPhoto?.id === id) setSelectedPhoto(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12 fade-in pb-8 md:pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-[#EEDCD2]/40 pb-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C87A53] bg-[#C87A53]/10 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            <Camera className="w-3.5 h-3.5" /> Visual Moments
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#3E3835]">
            The Sterling Photo Mosaic
          </h1>
          <p className="text-sm text-[#7D7068] mt-1">
            A beautiful, organic masonry collection of our favorite family trips, dinners, and milestones.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => {
              setShowUploadForm(!showUploadForm);
              setErrorMsg("");
            }}
            className="flex items-center gap-1.5 self-start md:self-center px-4 py-2 bg-[#C87A53] hover:bg-[#A55D37] text-white text-sm font-semibold rounded-full shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            {showUploadForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showUploadForm ? "Close Uploader" : "Add Memory"}
          </button>
        )}
      </div>

      {/* Upload Form Modal/Section */}
      {showUploadForm && (
        <div className="mb-8 rounded-2xl border-2 border-dashed border-[#EEDCD2] bg-white p-6 shadow-xs animate-fade-in">
          <h3 className="font-serif text-lg font-bold text-[#3E3835] mb-4">Upload and Convert to WebP</h3>
          <form onSubmit={handleFormSubmit} className="grid md:grid-cols-2 gap-6">
            
            {/* Image Upload Area */}
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#EEDCD2] rounded-xl bg-[#FAF7F2] p-4 text-center min-h-[220px]">
              {previewUrl ? (
                <div className="relative w-full h-48 overflow-hidden rounded-lg shadow-xxs">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setPreviewUrl(null)}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <span className="absolute bottom-2 left-2 bg-[#606C38] text-[#FEFAE0] text-xxs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                    ✓ Converted to .webp
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#C87A53] mb-3 shadow-xxs">
                    <Upload className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-semibold text-[#3E3835]">
                    {isUploading ? "Converting image to .webp..." : "Drag and drop or browse"}
                  </p>
                  <p className="text-xxs text-[#7D7068] mt-1">
                    PNG, JPG, or HEIC up to 10MB. We automatically convert and optimize to WebP format.
                  </p>
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-4 px-3.5 py-1.5 bg-white border border-[#EEDCD2] hover:bg-[#EEDCD2]/20 text-[#5E4E46] text-xs font-semibold rounded-lg shadow-xxs cursor-pointer"
                  >
                    {isUploading ? "Optimizing..." : "Select File"}
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              )}
            </div>

            {/* Photo Details Inputs */}
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7D7068] mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Summer Campfire Nights"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#EEDCD2] focus:border-[#C87A53] focus:ring-1 focus:ring-[#C87A53] focus:outline-none bg-white text-[#3E3835] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#7D7068] mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Add a heartwarming story or caption..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#EEDCD2] focus:border-[#C87A53] focus:ring-1 focus:ring-[#C87A53] focus:outline-none bg-white text-[#3E3835] transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#7D7068] mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#EEDCD2] focus:border-[#C87A53] focus:outline-none bg-white text-[#3E3835]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#7D7068] mb-1">
                    Uploaded By *
                  </label>
                  <select
                    required
                    value={uploadedBy}
                    onChange={(e) => setUploadedBy(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-[#EEDCD2] focus:border-[#C87A53] focus:outline-none bg-white text-[#3E3835]"
                  >
                    <option value="">Select Author...</option>
                    {members.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {errorMsg && <p className="text-xs text-red-500 font-semibold">{errorMsg}</p>}

              <button
                type="submit"
                className="mt-2 w-full py-2.5 bg-[#606C38] hover:bg-[#283618] text-white font-semibold rounded-lg shadow-xxs transition-all cursor-pointer text-sm"
              >
                Add Memory to Archive
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="relative max-w-sm mb-8">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7D7068]" />
        <input
          type="text"
          placeholder="Search memories, locations, uploader..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-[#EEDCD2] focus:border-[#C87A53] focus:ring-1 focus:ring-[#C87A53] bg-white text-[#3E3835] focus:outline-none placeholder:text-[#7D7068]/60 transition-all"
        />
      </div>

      {/* Photo Mosaic Layout (Pure columns-based CSS masonry grid) */}
      <div className="columns-1 sm:columns-2 md:columns-3 gap-4 [column-fill:_balance] w-full">
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => setSelectedPhoto(photo)}
            className="group relative mb-4 break-inside-avoid overflow-hidden rounded-2xl bg-white border border-[#EEDCD2]/60 shadow-xxs hover:shadow-md hover:border-[#C87A53] transition-all duration-300 cursor-pointer"
          >
            {/* Image */}
            <img
              src={photo.url}
              alt={photo.title}
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-102"
            />

            {/* Detail Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
              <h3 className="text-white font-serif font-bold text-sm leading-snug">
                {photo.title}
              </h3>
              {photo.description && (
                <p className="text-xxs text-white/80 line-clamp-2 mt-1 italic font-light">
                  {photo.description}
                </p>
              )}
              
              <div className="mt-3 flex items-center justify-between text-xxs text-[#FEFAE0]/90">
                <span className="flex items-center gap-1 min-w-0">
                  <User className="w-3 h-3 flex-shrink-0" /> <span className="truncate">{photo.uploadedBy}</span>
                </span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="flex items-center gap-1">
                    <Heart className={`w-3 h-3 ${likedPhotos.includes(photo.id) ? "fill-rose-400 text-rose-400" : ""}`} /> {photo.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {new Date(photo.date).getFullYear()}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Hover Actions */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
              <button
                onClick={(e) => { e.stopPropagation(); togglePhotoLike(photo.id); }}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  likedPhotos.includes(photo.id)
                    ? "bg-rose-500 text-white shadow-sm"
                    : "bg-black/60 text-white/90 hover:bg-rose-500 hover:text-white"
                }`}
                title={likedPhotos.includes(photo.id) ? "Unlike" : "Like"}
              >
                <Heart className={`w-3.5 h-3.5 ${likedPhotos.includes(photo.id) ? "fill-current" : ""}`} />
              </button>
              {isAdmin && (
                <button
                  onClick={(e) => handleDelete(photo.id, e)}
                  className="p-1.5 bg-black/60 hover:bg-red-600 hover:text-white text-white/90 rounded-full transition-colors cursor-pointer"
                  title="Delete memory"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
              <div className="p-1.5 bg-black/60 text-white/90 rounded-full">
                <Eye className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}

        {filteredPhotos.length === 0 && (
          <div className="col-span-full py-16 text-center text-[#7D7068]">
            No moments found matching your search.
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#3E3835]/10 backdrop-blur-xs p-4 animate-fade-in">
          <div 
            className="absolute inset-0 cursor-default"
            onClick={() => setSelectedPhoto(null)}
          ></div>
          
          <div className="relative z-10 max-w-4xl w-full flex flex-col md:flex-row bg-[#FAF7F2] text-[#3E3835] rounded-2xl overflow-hidden shadow-2xl">
            {/* Close */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-[#3E3835]/40 hover:bg-[#3E3835]/60 text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Big Image Panel */}
            <div className="w-full md:w-2/3 max-h-[80vh] flex items-center justify-center bg-[#EEDCD2]">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="max-w-full max-h-[80vh] object-contain"
              />
            </div>

            {/* Side info panel */}
            <div className="w-full md:w-1/3 p-6 flex flex-col justify-between bg-white border-l border-[#EEDCD2]/40">
              <div>
                <span className="text-xxs font-semibold uppercase tracking-wider text-[#C87A53] block mb-1">
                  Family Archive Record
                </span>
                <h3 className="font-serif text-xl font-bold text-[#3E3835] leading-snug">
                  {selectedPhoto.title}
                </h3>
                
                {selectedPhoto.description && (
                  <p className="mt-4 text-xs leading-relaxed text-[#7D7068] italic font-light border-l-2 border-[#EEDCD2] pl-3">
                    &ldquo;{selectedPhoto.description}&rdquo;
                  </p>
                )}
              </div>

              <div className="mt-8 border-t border-[#EEDCD2]/40 pt-4 flex flex-col gap-2 text-xxs text-[#7D7068]">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#C87A53]" />
                  <span>Captured/Uploaded by <strong className="text-[#3E3835]">{selectedPhoto.uploadedBy}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#C87A53]" />
                  <span>Date: <strong className="text-[#3E3835]">{formatDate(selectedPhoto.date, "monthDayYear")}</strong></span>
                </div>

                <ShareDropdown
                  url={typeof window !== "undefined" ? window.location.href : ""}
                  title={selectedPhoto.title}
                  description={selectedPhoto.description}
                />

                <button
                  onClick={() => togglePhotoLike(selectedPhoto.id)}
                  className={`mt-4 flex items-center justify-center gap-1.5 py-2 px-4 font-bold rounded-lg transition-all cursor-pointer text-xs ${
                    likedPhotos.includes(selectedPhoto.id)
                      ? "bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100"
                      : "bg-[#FAF7F2] text-[#7D7068] border border-[#EEDCD2] hover:bg-[#EEDCD2]/30"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${likedPhotos.includes(selectedPhoto.id) ? "fill-current" : ""}`} />
                  {likedPhotos.includes(selectedPhoto.id) ? "Liked" : "Like"} · {selectedPhoto.likes}
                </button>

                {isAdmin && (
                  <button
                    onClick={(e) => handleDelete(selectedPhoto.id, e)}
                    className="mt-6 flex items-center justify-center gap-1.5 py-2 px-4 bg-red-50 text-red-600 hover:bg-red-100 font-bold border border-red-200 rounded-lg transition-colors cursor-pointer text-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete this Memory
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
