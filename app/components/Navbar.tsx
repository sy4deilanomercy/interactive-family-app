"use client";

import React, { useState } from "react";
import { useFamily, ViewType } from "../context/FamilyContext";
import { Heart, Lock, Unlock, Users, Image as ImageIcon, BookOpen, Calendar, ShieldCheck, Menu, X } from "lucide-react";

export const Navbar: React.FC = () => {
  const { currentView, setCurrentView, isAdmin, setIsAdmin, setActiveProfileId } = useFamily();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { view: ViewType; label: string; icon: React.ReactNode }[] = [
    { view: "landing", label: "Home", icon: <Heart className="w-4 h-4" /> },
    { view: "tree", label: "Family Tree", icon: <Users className="w-4 h-4" /> },
    { view: "gallery", label: "Gallery", icon: <ImageIcon className="w-4 h-4" /> },
    { view: "blog", label: "Stories", icon: <BookOpen className="w-4 h-4" /> },
    { view: "calendar", label: "Birthdays", icon: <Calendar className="w-4 h-4" /> },
  ];

  const handleNav = (view: ViewType) => {
    setCurrentView(view);
    setActiveProfileId(null);
    setMobileMenuOpen(false);
  };

  const handleAdminToggle = () => {
    if (isAdmin) {
      setIsAdmin(false);
      if (currentView === "admin") handleNav("landing");
    } else {
      setIsAdmin(true);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#EEDCD2]/60 bg-[#FAF7F2]/90 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <button
          onClick={() => handleNav("landing")}
          className="flex items-center gap-2 text-left focus:outline-none group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C87A53] text-[#FEFAE0] transition-transform duration-300 group-hover:rotate-12">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <div>
            <span className="block font-serif text-lg font-bold tracking-tight text-[#3E3835]">
              Sterling Hearth
            </span>
            <span className="block text-xxs tracking-wider uppercase text-[#C87A53] font-medium -mt-1">
              Family Archive
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => handleNav(item.view)}
                className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-[#EEDCD2] text-[#5E4E46] shadow-sm"
                    : "text-[#7D7068] hover:text-[#3E3835] hover:bg-[#EEDCD2]/30"
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
          
          {isAdmin && (
            <button
              onClick={() => handleNav("admin")}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                currentView === "admin"
                  ? "bg-[#606C38] text-[#FEFAE0] shadow-sm"
                  : "text-[#606C38] hover:text-[#283618] hover:bg-[#606C38]/10"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Dashboard
            </button>
          )}
        </nav>

        {/* Right side: Admin Toggle + Hamburger */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Admin Toggle (always visible) */}
          <button
            onClick={handleAdminToggle}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-500 cursor-pointer ${
              isAdmin
                ? "bg-[#606C38] text-[#FEFAE0] shadow-xs"
                : "bg-white text-[#7D7068] border border-[#EEDCD2] hover:bg-[#EEDCD2]/20"
            }`}
            title={isAdmin ? "Exit Admin Mode" : "Enter Admin Mode"}
          >
            {isAdmin ? (
              <>
                <Unlock className="w-3.5 h-3.5 text-[#FEFAE0] animate-pulse" />
                <span className="hidden sm:inline">Admin Mode</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-[#7D7068]" />
                <span className="hidden sm:inline">Guest Mode</span>
              </>
            )}
          </button>

          {/* Hamburger Button (Mobile only) */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-full bg-white border border-[#EEDCD2] text-[#7D7068] hover:text-[#3E3835] hover:bg-[#FAF7F2] transition-all cursor-pointer"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 top-16 z-30 bg-[#3E3835]/30 backdrop-blur-xs animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu Panel */}
          <nav className="md:hidden absolute top-full left-0 right-0 z-40 mx-4 mt-2 rounded-2xl border border-[#EEDCD2] bg-white shadow-lg p-3 animate-fade-in overflow-hidden">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = currentView === item.view;
                return (
                  <button
                    key={item.view}
                    onClick={() => handleNav(item.view)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-[#EEDCD2] text-[#5E4E46]"
                        : "text-[#7D7068] hover:text-[#3E3835] hover:bg-[#FAF7F2]"
                    }`}
                  >
                    <span className={isActive ? "text-[#C87A53]" : "text-[#7D7068]"}>
                      {item.icon}
                    </span>
                    {item.label}
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#C87A53]" />
                    )}
                  </button>
                );
              })}

              {isAdmin && (
                <button
                  onClick={() => handleNav("admin")}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    currentView === "admin"
                      ? "bg-[#606C38]/10 text-[#606C38]"
                      : "text-[#606C38] hover:text-[#283618] hover:bg-[#606C38]/10"
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin Dashboard
                  {currentView === "admin" && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#606C38]" />
                  )}
                </button>
              )}
            </div>
          </nav>
        </>
      )}
    </header>
  );
};
