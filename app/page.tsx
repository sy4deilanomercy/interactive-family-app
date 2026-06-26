"use client";

import React from "react";
import { useFamily } from "./context/FamilyContext";
import { Navbar } from "./components/Navbar";
import { Landing } from "./components/Landing";
import { FamilyTree } from "./components/FamilyTree";
import { MemberProfileModal } from "./components/MemberProfileModal";
import { PhotoGallery } from "./components/PhotoGallery";
import { StoriesBlog } from "./components/StoriesBlog";
import { BirthdayCalendar } from "./components/BirthdayCalendar";
import { AdminDashboard } from "./components/AdminDashboard";
import { Footer } from "./components/Footer";

export default function Home() {
  const { currentView } = useFamily();

  const renderView = () => {
    switch (currentView) {
      case "landing":
        return <Landing />;
      case "tree":
        return <FamilyTree />;
      case "gallery":
        return <PhotoGallery />;
      case "blog":
        return <StoriesBlog />;
      case "calendar":
        return <BirthdayCalendar />;
      case "admin":
        return <AdminDashboard />;
      default:
        return <Landing />;
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1">{renderView()}</main>
      <Footer />
      <MemberProfileModal />
    </>
  );
}
