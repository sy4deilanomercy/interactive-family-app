"use client";

import React, { useEffect, useRef } from "react";
import { useFamily } from "../context/FamilyContext";
import { X, Calendar, MapPin, Briefcase, Heart, BookOpen, Compass, ChevronRight, User } from "lucide-react";
import { formatDate } from "../lib/formatDate";

export const MemberProfileModal: React.FC = () => {
  const { activeProfileId, setActiveProfileId, members, stories, setCurrentView } = useFamily();
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveProfileId(null);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [setActiveProfileId]);

  if (!activeProfileId) return null;

  const member = members.find((m) => m.id === activeProfileId);
  if (!member) return null;

  // Calculate Age
  const calculateAge = (bday: string) => {
    const birth = new Date(bday);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const age = calculateAge(member.birthDate);

  // Get Related Members
  const spouseList = members.filter((m) => member.spouses.includes(m.id));
  const parentList = members.filter((m) => member.parents.includes(m.id));
  const childrenList = members.filter((m) => member.children.includes(m.id));
  
  // Try to find siblings (children of same parents)
  const siblingList = members.filter((m) => {
    if (m.id === member.id) return false;
    return m.parents.some((pId) => member.parents.includes(pId));
  });

  // Get stories written by this member
  const authorStories = stories.filter((s) => s.authorId === member.id);

  // Quick navigation to another relative
  const navigateToRelative = (relId: string) => {
    setActiveProfileId(relId);
    // Smooth scroll modal back to top
    if (modalRef.current) {
      modalRef.current.scrollTop = 0;
    }
  };

  // Quick navigation to reading a story
  const handleReadStory = () => {
    setActiveProfileId(null);
    setCurrentView("blog");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-xs p-0 sm:p-4 animate-fade-in transition-all">
      {/* Backdrop Close */}
      <div 
        className="absolute inset-0 cursor-default" 
        onClick={() => setActiveProfileId(null)}
      ></div>

      {/* Profile Sidebar Drawer */}
      <div 
        ref={modalRef}
        className="relative z-10 flex h-full w-full max-w-lg flex-col bg-[#FAF7F2] text-[#3E3835] shadow-2xl sm:h-[calc(100vh-2rem)] sm:rounded-2xl overflow-y-auto border border-[#EEDCD2] transition-transform duration-300 transform translate-x-0"
      >
        {/* Sticky Close Button Header */}
        <div className="sticky top-0 z-20 flex justify-end p-4 bg-gradient-to-b from-[#FAF7F2] via-[#FAF7F2]/90 to-transparent">
          <button
            onClick={() => setActiveProfileId(null)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-[#EEDCD2] hover:bg-[#FAF7F2] shadow-xxs text-[#7D7068] hover:text-[#3E3835] focus:outline-none transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="px-6 pb-12 pt-1 flex-1">
          {/* Avatar and Main Header */}
          <div className="flex flex-col items-center text-center">
            <div className="relative h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow-md">
              {member.avatar ? (
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-stone-100 text-[#7D7068]">
                  <User className="w-14 h-14" />
                </div>
              )}
            </div>

            <h2 className="mt-4 font-serif text-2xl font-bold tracking-tight text-[#3E3835]">
              {member.name}
            </h2>
            
            <div className="mt-1.5 flex items-center gap-2">
              <span className="inline-block px-3 py-0.5 text-xs font-bold uppercase tracking-wider rounded-full bg-[#EEDCD2] text-[#5E4E46]">
                {member.relationship}
              </span>
              <span className="text-xs text-[#7D7068]">• Generation {member.generation + 1}</span>
            </div>
          </div>

          {/* Quick Life Details Grid */}
          <div className="mt-8 grid grid-cols-2 gap-4 rounded-xl border border-[#EEDCD2]/60 bg-white p-4 text-xs text-[#7D7068]">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#C87A53]" />
              <div>
                <span className="block text-xxs font-semibold uppercase tracking-wider text-[#A55D37]">Birthday</span>
                <span className="text-[#3E3835] font-medium">
                  {formatDate(member.birthDate, "monthDayYear")} ({age} years)
                </span>
              </div>
            </div>

            {member.occupation && (
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#C87A53]" />
                <div>
                  <span className="block text-xxs font-semibold uppercase tracking-wider text-[#A55D37]">Occupation</span>
                  <span className="text-[#3E3835] font-medium">{member.occupation}</span>
                </div>
              </div>
            )}

            {member.birthPlace && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C87A53]" />
                <div>
                  <span className="block text-xxs font-semibold uppercase tracking-wider text-[#A55D37]">Born In</span>
                  <span className="text-[#3E3835] font-medium">{member.birthPlace}</span>
                </div>
              </div>
            )}

            {member.currentLocation && (
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#C87A53]" />
                <div>
                  <span className="block text-xxs font-semibold uppercase tracking-wider text-[#A55D37]">Current Location</span>
                  <span className="text-[#3E3835] font-medium">{member.currentLocation}</span>
                </div>
              </div>
            )}
          </div>

          {/* Bio Description */}
          {member.bio && (
            <div className="mt-8 border-t border-[#EEDCD2]/40 pt-6">
              <h3 className="font-serif text-sm font-bold text-[#3E3835] uppercase tracking-wider">About</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#7D7068] font-light italic bg-white/50 border-l-2 border-[#C87A53] p-3 rounded-r-xl">
                &ldquo;{member.bio}&rdquo;
              </p>
            </div>
          )}

          {/* Hobbies Section */}
          {member.hobbies && member.hobbies.length > 0 && (
            <div className="mt-8 border-t border-[#EEDCD2]/40 pt-6">
              <h3 className="font-serif text-sm font-bold text-[#3E3835] uppercase tracking-wider">Interests & Hobbies</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {member.hobbies.map((hobby) => (
                  <span
                    key={hobby}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#EEDCD2] bg-white px-2.5 py-1 text-xs text-[#7D7068]"
                  >
                    <Heart className="w-3.5 h-3.5 text-[#C87A53] fill-current" />
                    {hobby}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Connected Relatives Section */}
          <div className="mt-8 border-t border-[#EEDCD2]/40 pt-6">
            <h3 className="font-serif text-sm font-bold text-[#3E3835] uppercase tracking-wider">Immediate Family</h3>
            <div className="mt-3 flex flex-col gap-2">
              {/* Parents */}
              {parentList.length > 0 && (
                <div className="flex flex-col gap-1.5 p-2 rounded-xl bg-white/40 border border-[#EEDCD2]/40">
                  <span className="text-xxs font-bold text-[#7D7068] uppercase tracking-wider">Parents</span>
                  <div className="flex flex-wrap gap-2">
                    {parentList.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => navigateToRelative(p.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#EEDCD2] hover:border-[#C87A53] rounded-full text-xs text-[#5E4E46] transition-colors"
                      >
                        <User className="w-3 h-3" />
                        {p.name} ({p.relationship})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Spouses */}
              {spouseList.length > 0 && (
                <div className="flex flex-col gap-1.5 p-2 rounded-xl bg-white/40 border border-[#EEDCD2]/40">
                  <span className="text-xxs font-bold text-[#7D7068] uppercase tracking-wider">Partner / Spouse</span>
                  <div className="flex flex-wrap gap-2">
                    {spouseList.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => navigateToRelative(s.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#EEDCD2] hover:border-[#C87A53] rounded-full text-xs text-[#5E4E46] transition-colors"
                      >
                        <Heart className="w-3 h-3 text-[#C87A53] fill-current" />
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Children */}
              {childrenList.length > 0 && (
                <div className="flex flex-col gap-1.5 p-2 rounded-xl bg-white/40 border border-[#EEDCD2]/40">
                  <span className="text-xxs font-bold text-[#7D7068] uppercase tracking-wider">Children</span>
                  <div className="flex flex-wrap gap-2">
                    {childrenList.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => navigateToRelative(c.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#EEDCD2] hover:border-[#C87A53] rounded-full text-xs text-[#5E4E46] transition-colors"
                      >
                        <User className="w-3 h-3 text-stone-500" />
                        {c.name} ({c.relationship})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Siblings */}
              {siblingList.length > 0 && (
                <div className="flex flex-col gap-1.5 p-2 rounded-xl bg-white/40 border border-[#EEDCD2]/40">
                  <span className="text-xxs font-bold text-[#7D7068] uppercase tracking-wider">Siblings</span>
                  <div className="flex flex-wrap gap-2">
                    {siblingList.map((sib) => (
                      <button
                        key={sib.id}
                        onClick={() => navigateToRelative(sib.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#EEDCD2] hover:border-[#C87A53] rounded-full text-xs text-[#5E4E46] transition-colors"
                      >
                        <User className="w-3 h-3 text-stone-400" />
                        {sib.name} ({sib.relationship})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {parentList.length === 0 && spouseList.length === 0 && childrenList.length === 0 && siblingList.length === 0 && (
                <span className="text-xs text-[#7D7068] italic">No immediate relatives registered in this digital archive.</span>
              )}
            </div>
          </div>

          {/* Stories Authored Section */}
          {authorStories.length > 0 && (
            <div className="mt-8 border-t border-[#EEDCD2]/40 pt-6">
              <h3 className="font-serif text-sm font-bold text-[#3E3835] uppercase tracking-wider">Stories Authored ({authorStories.length})</h3>
              <div className="mt-3 flex flex-col gap-2">
                {authorStories.map((story) => (
                  <button
                    key={story.id}
                    onClick={handleReadStory}
                    className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#EEDCD2]/50 hover:border-[#C87A53] text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FAF7F2] text-[#C87A53]">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-[#3E3835] group-hover:text-[#C87A53] transition-colors">{story.title}</span>
                        <span className="block text-xxs text-[#7D7068]">Posted in {story.category}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#7D7068] group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
