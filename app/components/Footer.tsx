"use client";

import React from "react";
import { Heart } from "lucide-react";
import { useFamily } from "../context/FamilyContext";

export const Footer: React.FC = () => {
  const { members } = useFamily();

  return (
    <footer className="w-full border-t border-[#EEDCD2]/40 bg-[#FAF7F2]/80 mt-16 pb-24 md:pb-6">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <div className="flex flex-col items-center justify-center gap-4 text-xs text-[#7D7068]">
          <div className="flex items-center gap-4">
            <span>Built with love for {members.length} family members</span>
            <span className="hidden sm:inline">•</span>
            <span>© 2026 Sterling Family</span>
          </div>
        </div>
      </div>
    </footer>
  );
};