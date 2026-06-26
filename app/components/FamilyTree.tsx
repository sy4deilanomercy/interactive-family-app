"use client";

import React, { useState } from "react";
import { useFamily, FamilyMember } from "../context/FamilyContext";
import { Heart, Search, Eye, ChevronDown, ChevronUp, User, Sprout } from "lucide-react";

export const FamilyTree: React.FC = () => {
  const { members, setActiveProfileId } = useFamily();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGeneration, setSelectedGeneration] = useState<number | "all">("all");
  
  // Collapse state for generations
  const [collapsedGen, setCollapsedGen] = useState<Record<number, boolean>>({
    0: false,
    1: false,
    2: false,
  });

  const toggleGen = (gen: number) => {
    setCollapsedGen((prev) => ({ ...prev, [gen]: !prev[gen] }));
  };

  // Group members by generation
  const gen0 = members.filter((m) => m.generation === 0);
  const gen1 = members.filter((m) => m.generation === 1);
  const gen2 = members.filter((m) => m.generation === 2);

  // Filter function
  const filterMembers = (list: FamilyMember[]) => {
    return list.filter((m) => {
      const matchSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (m.relationship && m.relationship.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (m.occupation && m.occupation.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchSearch;
    });
  };

  const filteredGen0 = filterMembers(gen0);
  const filteredGen1 = filterMembers(gen1);
  const filteredGen2 = filterMembers(gen2);

  // Render a family node card
  const MemberNode = ({ member }: { member: FamilyMember }) => {
    return (
      <div 
        onClick={() => setActiveProfileId(member.id)}
        className="group relative flex flex-col items-center bg-white rounded-2xl border border-[#EEDCD2] p-4 text-center cursor-pointer shadow-xxs hover:shadow-md hover:border-[#C87A53] transition-all duration-300 w-44 sm:w-48 transform hover:-translate-y-1"
      >
        {/* Connector node circle */}
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#FAF7F2] border-2 border-[#EEDCD2] rounded-full group-hover:border-[#C87A53] transition-colors"></div>

        {/* Avatar with ring */}
        <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-[#EEDCD2]/80 group-hover:border-[#C87A53] transition-colors">
          {member.avatar ? (
            <img
              src={member.avatar}
              alt={member.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#FAF7F2] text-[#7D7068]">
              <User className="w-8 h-8" />
            </div>
          )}
        </div>

        {/* Name and Relationship */}
        <div className="mt-3">
          <h4 className="font-serif text-sm font-bold text-[#3E3835] group-hover:text-[#C87A53] transition-colors leading-snug line-clamp-1">
            {member.name}
          </h4>
          <span className="inline-block mt-1 px-2.5 py-0.5 text-xxs font-semibold uppercase tracking-wider rounded-full bg-[#FAF7F2] text-[#7D7068] group-hover:bg-[#EEDCD2]/40 transition-colors">
            {member.relationship}
          </span>
        </div>

        {/* Quick details */}
        {member.occupation && (
          <p className="mt-1 text-xxs text-[#7D7068] italic line-clamp-1">
            {member.occupation}
          </p>
        )}

        {/* Action hint overlay */}
        <div className="mt-3 flex items-center justify-center gap-1 text-[#C87A53] text-xxs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Eye className="w-3 h-3" /> View Profile
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12 fade-in pb-8 md:pb-12">
      {/* Page Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[#606C38] bg-[#606C38]/10 px-3 py-1 rounded-full uppercase tracking-wider">
          <Sprout className="w-3.5 h-3.5" /> Generational Roots
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#3E3835] sm:text-4xl mt-2">
          The Sterling Family Tree
        </h1>
        <p className="text-sm text-[#7D7068] mt-2">
          An interactive record of our legacy. Click on any member card to view their full profile, personal stories, hobbies, and immediate connections.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-10 bg-white border border-[#EEDCD2]/60 p-4 rounded-2xl shadow-xxs">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7D7068]" />
          <input
            type="text"
            placeholder="Search by name, occupation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-[#EEDCD2] focus:border-[#C87A53] focus:ring-1 focus:ring-[#C87A53] bg-white text-[#3E3835] focus:outline-none placeholder:text-[#7D7068]/60 transition-all"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedGeneration("all")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all shrink-0 ${
              selectedGeneration === "all"
                ? "bg-[#C87A53] text-white shadow-xs"
                : "bg-[#FAF7F2] text-[#7D7068] hover:bg-[#EEDCD2]/40"
            }`}
          >
            All Generations
          </button>
          <button
            onClick={() => setSelectedGeneration(0)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all shrink-0 ${
              selectedGeneration === 0
                ? "bg-[#C87A53] text-white shadow-xs"
                : "bg-[#FAF7F2] text-[#7D7068] hover:bg-[#EEDCD2]/40"
            }`}
          >
            1st Gen (Grandparents)
          </button>
          <button
            onClick={() => setSelectedGeneration(1)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all shrink-0 ${
              selectedGeneration === 1
                ? "bg-[#C87A53] text-white shadow-xs"
                : "bg-[#FAF7F2] text-[#7D7068] hover:bg-[#EEDCD2]/40"
            }`}
          >
            2nd Gen (Parents/Aunts)
          </button>
          <button
            onClick={() => setSelectedGeneration(2)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all shrink-0 ${
              selectedGeneration === 2
                ? "bg-[#C87A53] text-white shadow-xs"
                : "bg-[#FAF7F2] text-[#7D7068] hover:bg-[#EEDCD2]/40"
            }`}
          >
            3rd Gen (Children)
          </button>
        </div>
      </div>

      {/* Tree Visualization */}
      <div className="flex flex-col gap-12 relative">
        {/* Decorative background center-line for connecting generations vertically */}
        <div className="hidden md:block absolute left-1/2 top-10 bottom-10 w-0.5 bg-[#EEDCD2] -translate-x-1/2 z-0"></div>

        {/* --- GENERATION 0 (GRANDPARENTS) --- */}
        {(selectedGeneration === "all" || selectedGeneration === 0) && (
          <div className="relative z-10 flex flex-col items-center">
            {/* Header / Collapse control */}
            <div className="flex items-center gap-2 mb-6">
              <span className="h-px w-8 bg-[#EEDCD2]"></span>
              <button
                onClick={() => toggleGen(0)}
                className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-[#FAF7F2] border border-[#EEDCD2] text-xs font-bold text-[#5E4E46]"
              >
                1st Generation: Grandparents ({filteredGen0.length})
                {collapsedGen[0] ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>
              <span className="h-px w-8 bg-[#EEDCD2]"></span>
            </div>

            {!collapsedGen[0] && (
              <div className="flex flex-wrap justify-center gap-8 relative">
                {/* Spouse Connector line between grandparents if 2 cards exist */}
                {filteredGen0.length >= 2 && searchQuery === "" && (
                  <div className="hidden md:block absolute top-[50px] left-[170px] right-[170px] h-0.5 bg-gradient-to-r from-[#C87A53]/20 via-[#C87A53] to-[#C87A53]/20 z-0">
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 py-0.5 rounded-full border border-[#EEDCD2]">
                      <Heart className="w-3 h-3 text-[#C87A53] fill-current" />
                    </div>
                  </div>
                )}

                {filteredGen0.map((m) => (
                  <MemberNode key={m.id} member={m} />
                ))}

                {filteredGen0.length === 0 && (
                  <p className="text-xs text-[#7D7068] italic">No grandparents found in this search.</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* --- GENERATION 1 (PARENTS/UNCLES) --- */}
        {(selectedGeneration === "all" || selectedGeneration === 1) && (
          <div className="relative z-10 flex flex-col items-center">
            {/* Header / Collapse control */}
            <div className="flex items-center gap-2 mb-6">
              <span className="h-px w-8 bg-[#EEDCD2]"></span>
              <button
                onClick={() => toggleGen(1)}
                className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-[#FAF7F2] border border-[#EEDCD2] text-xs font-bold text-[#5E4E46]"
              >
                2nd Generation: Parents & Aunts ({filteredGen1.length})
                {collapsedGen[1] ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>
              <span className="h-px w-8 bg-[#EEDCD2]"></span>
            </div>

            {!collapsedGen[1] && (
              <div className="flex flex-wrap justify-center gap-8 relative max-w-4xl mx-auto">
                {/* Spouse line between parents */}
                {filteredGen1.filter(m => m.relationship === "Father" || m.relationship === "Mother").length >= 2 && searchQuery === "" && (
                  <div className="hidden md:block absolute top-[50px] left-[170px] right-[400px] h-0.5 bg-gradient-to-r from-[#C87A53]/20 via-[#C87A53] to-[#C87A53]/20 z-0">
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 py-0.5 rounded-full border border-[#EEDCD2]">
                      <Heart className="w-3 h-3 text-[#C87A53] fill-current" />
                    </div>
                  </div>
                )}

                {filteredGen1.map((m) => (
                  <MemberNode key={m.id} member={m} />
                ))}

                {filteredGen1.length === 0 && (
                  <p className="text-xs text-[#7D7068] italic">No members found in this search.</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* --- GENERATION 2 (CHILDREN) --- */}
        {(selectedGeneration === "all" || selectedGeneration === 2) && (
          <div className="relative z-10 flex flex-col items-center">
            {/* Header / Collapse control */}
            <div className="flex items-center gap-2 mb-6">
              <span className="h-px w-8 bg-[#EEDCD2]"></span>
              <button
                onClick={() => toggleGen(2)}
                className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-[#FAF7F2] border border-[#EEDCD2] text-xs font-bold text-[#5E4E46]"
              >
                3rd Generation: Children ({filteredGen2.length})
                {collapsedGen[2] ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>
              <span className="h-px w-8 bg-[#EEDCD2]"></span>
            </div>

            {!collapsedGen[2] && (
              <div className="flex flex-wrap justify-center gap-8 relative">
                {filteredGen2.map((m) => (
                  <MemberNode key={m.id} member={m} />
                ))}

                {filteredGen2.length === 0 && (
                  <p className="text-xs text-[#7D7068] italic">No children found in this search.</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
