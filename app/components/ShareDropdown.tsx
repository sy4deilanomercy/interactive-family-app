"use client";

import React, { useState, useRef, useEffect } from "react";
import { Share2, Link2, Mail, MessageCircle } from "lucide-react";

interface ShareDropdownProps {
  url: string;
  title: string;
  description?: string;
}

export const ShareDropdown: React.FC<ShareDropdownProps> = ({ url, title, description }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDesc = description ? encodeURIComponent(description) : "";

  const shareItems = [
    {
      label: "WhatsApp",
      icon: <MessageCircle className="w-4 h-4" />,
      href: `https://wa.me/?text=${encodedTitle}%0A${encodedDesc ? encodedDesc + "%0A" : ""}${encodedUrl}`,
      color: "hover:bg-green-50 hover:text-green-600",
    },
    {
      label: "Facebook",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedTitle}`,
      color: "hover:bg-blue-50 hover:text-blue-600",
    },
    {
      label: "X (Twitter)",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4l11.733 16h4.267l-11.733 -16zM4 20l6.768 -6.768M17.232 4.768l-3.696 3.696" />
        </svg>
      ),
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: "hover:bg-zinc-50 hover:text-zinc-800",
    },
    {
      label: "Email",
      icon: <Mail className="w-4 h-4" />,
      href: `mailto:?subject=${encodedTitle}&body=${encodedDesc ? encodedDesc + "%0A%0A" : ""}${encodedUrl}`,
      color: "hover:bg-amber-50 hover:text-amber-600",
    },
  ];

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description || title,
          url,
        });
      } catch {
        // User cancelled or error, do nothing
      }
    } else {
      setOpen((prev) => !prev);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setOpen(false);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setOpen(false);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleNativeShare}
        className="flex items-center justify-center gap-1.5 py-2 px-4 bg-[#FAF7F2] text-[#7D7068] border border-[#EEDCD2] hover:bg-[#EEDCD2]/30 rounded-lg transition-all cursor-pointer text-xs font-bold"
        title="Share"
      >
        <Share2 className="w-4 h-4" />
        Share
      </button>

      {open && (
        <div className="absolute bottom-full right-0 mb-2 z-30 w-52 rounded-xl border border-[#EEDCD2] bg-white shadow-lg p-2 animate-fade-in">
          <div className="flex flex-col gap-0.5">
            {shareItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-[#7D7068] transition-colors ${item.color}`}
              >
                {item.icon}
                {item.label}
              </a>
            ))}
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-[#7D7068] hover:bg-stone-50 hover:text-stone-700 transition-colors cursor-pointer"
            >
              <Link2 className="w-4 h-4" />
              Copy Link
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
