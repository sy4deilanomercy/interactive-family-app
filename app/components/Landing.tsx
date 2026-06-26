"use client";

import React from "react";
import { useFamily } from "../context/FamilyContext";
import { Heart, Calendar, ArrowRight, Sparkles, MessageSquareHeart } from "lucide-react";
import { formatDate } from "../lib/formatDate";

export const Landing: React.FC = () => {
  const { members, photos, stories, setCurrentView, setActiveProfileId, isAdmin } = useFamily();

  // Get next upcoming birthday
  const getNextBirthday = () => {
    if (members.length === 0) return null;
    const today = new Date();
    const currentYear = today.getFullYear();

    const birthdaysWithDaysLeft = members.map((m) => {
      const birthParts = m.birthDate.split("-");
      const birthMonth = parseInt(birthParts[1]);
      const birthDay = parseInt(birthParts[2]);
      let nextBday = new Date(currentYear, birthMonth - 1, birthDay);
      
      if (nextBday < today) {
        nextBday = new Date(currentYear + 1, birthMonth - 1, birthDay);
      }

      const diffTime = nextBday.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        member: m,
        daysLeft: diffDays,
        nextBdayDate: nextBday,
        age: nextBday.getFullYear() - parseInt(m.birthDate.split("-")[0])
      };
    });

    // Sort by soonest
    birthdaysWithDaysLeft.sort((a, b) => a.daysLeft - b.daysLeft);
    return birthdaysWithDaysLeft[0];
  };

  const nextBdayInfo = getNextBirthday();

  // Get 2 latest stories
  const latestStories = stories.slice(0, 2);

  // Get 4 random or latest photos
  const featuredPhotos = photos.slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12 fade-in pb-8 md:pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-radial from-[#FAF1EA] to-[#FAF7F2] p-6 sm:p-8 md:p-16 text-center border border-[#EEDCD2]/40">
        <div className="absolute inset-0 bg-[radial-gradient(#C87A53_1px,transparent_1px)] [background-size:16px_16px] opacity-15"></div>
        
        <div className="relative z-10 flex flex-col items-center gap-3 sm:gap-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EEDCD2]/60 px-3 py-1 text-[10px] sm:text-xs font-semibold text-[#5E4E46] uppercase tracking-wider">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Established since 1971
          </div>
          
          <h1 className="max-w-2xl font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#3E3835] leading-[1.1]">
            Gathering our history, <span className="text-[#C87A53] italic">one memory</span> at a time
          </h1>
          
          <p className="max-w-lg text-sm sm:text-base leading-relaxed text-[#7D7068] md:text-lg">
            Welcome to the digital living room of the Sterling Family. A minimalist, warm archive of our roots, our laughter, and our continuing story.
          </p>

          <div className="mt-2 sm:mt-4 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setCurrentView("tree")}
              className="flex h-11 sm:h-12 items-center justify-center gap-2 rounded-full bg-[#C87A53] px-5 sm:px-6 text-sm sm:text-base font-semibold text-white transition-all duration-300 hover:bg-[#A55D37] shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Explore Family Tree
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentView("blog")}
              className="flex h-11 sm:h-12 items-center justify-center rounded-full border border-[#EEDCD2] bg-white px-5 sm:px-6 text-sm sm:text-base font-semibold text-[#5E4E46] transition-all duration-300 hover:bg-[#FAF7F2]"
            >
              Read Family Stories
            </button>
          </div>
        </div>
      </section>

      {/* Quote / Motto */}
      <section className="my-8 sm:my-10 text-center px-2 sm:px-4">
          <p className="font-serif text-base sm:text-lg md:text-xl italic text-[#5E4E46] max-w-xl mx-auto">
            &ldquo;We gather not just to remember who we were, but to share, connect, and
            celebrate who we are becoming.&rdquo;
          </p>
        <div className="w-12 h-0.5 bg-[#C87A53]/30 mx-auto mt-4"></div>
      </section>

      {/* Grid: Birthday Countdown & Features */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Birthday Card */}
        {nextBdayInfo && (
          <div className="rounded-2xl border border-[#EEDCD2]/50 bg-white p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#C87A53]">
                  Upcoming Celebration
                </span>
                <Calendar className="w-5 h-5 text-[#C87A53]" />
              </div>
              <div className="mt-4 flex items-center gap-3">
                <button 
                  onClick={() => {
                    setActiveProfileId(nextBdayInfo.member.id);
                  }}
                  className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border-2 border-[#EEDCD2] hover:scale-105 transition-transform"
                >
                  <img
                    src={nextBdayInfo.member.avatar}
                    alt={nextBdayInfo.member.name}
                    className="h-full w-full object-cover"
                  />
                </button>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#3E3835]">
                    {nextBdayInfo.member.name}
                  </h3>
                  <p className="text-xs text-[#7D7068]">
                    Turning {nextBdayInfo.age} on {formatDate(nextBdayInfo.member.birthDate, "monthDay")}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm text-[#7D7068]">
                {nextBdayInfo.daysLeft === 0 ? (
                  <span className="font-semibold text-[#606C38] flex items-center gap-1">
                    🎉 It&rsquo;s today! Wish them a beautiful day!
                  </span>
                ) : nextBdayInfo.daysLeft === 1 ? (
                  <span className="font-medium text-[#C87A53]">
                    🎂 Only 1 day left! Prepare the cakes!
                  </span>
                ) : (
                  <span>Only <strong className="text-[#3E3835]">{nextBdayInfo.daysLeft} days</strong> left. Help us make it memorable!</span>
                )}
              </p>
            </div>

            <button
              onClick={() => setCurrentView("calendar")}
              className="mt-6 flex items-center justify-center gap-1 text-xs font-semibold text-[#C87A53] hover:text-[#A55D37] self-start"
            >
              See Calendar
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Total Members Statistics */}
        <div className="rounded-2xl border border-[#EEDCD2]/50 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#606C38]">
                Generations Joined
              </span>
              <Heart className="w-5 h-5 text-[#606C38]" />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg bg-[#FAF7F2] p-2">
                <span className="block text-xl font-bold text-[#3E3835]">3</span>
                <span className="text-xxs text-[#7D7068]">Generations</span>
              </div>
              <div className="rounded-lg bg-[#FAF7F2] p-2">
                <span className="block text-xl font-bold text-[#3E3835]">{members.length}</span>
                <span className="text-xxs text-[#7D7068]">Members</span>
              </div>
              <div className="rounded-lg bg-[#FAF7F2] p-2">
                <span className="block text-xl font-bold text-[#3E3835]">{stories.length}</span>
                <span className="text-xxs text-[#7D7068]">Stories</span>
              </div>
            </div>
            <p className="mt-4 text-sm text-[#7D7068]">
              Our tree spans from Arthur and Eleanor in the Vermont woodshop down to the creative spark of Lily in Seattle.
            </p>
          </div>

          <button
            onClick={() => setCurrentView("tree")}
            className="mt-6 flex items-center justify-center gap-1 text-xs font-semibold text-[#606C38] hover:text-[#283618] self-start"
          >
            Open Family Tree
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Admin Dashboard Info / Tips */}
        <div className="rounded-2xl border border-[#EEDCD2]/50 bg-[#FAF7F2]/60 p-6 shadow-xs flex flex-col justify-between border-dashed">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#7D7068]">
                Archive Administration
              </span>
              <MessageSquareHeart className="w-5 h-5 text-[#7D7068]" />
            </div>
            <h4 className="mt-4 text-sm font-semibold text-[#3E3835]">
              Keep our archives flowing!
            </h4>
            <p className="mt-2 text-sm leading-relaxed text-[#7D7068]">
              {isAdmin ? (
                <span className="text-[#606C38] font-medium">
                  ✓ Admin mode is active. You can add new photos, post family memories, edit or remove tree branches.
                </span>
              ) : (
                <span>
                  Toggle <strong>Admin Mode</strong> in the upper right header to write stories, add lovely pictures, or update family members.
                </span>
              )}
            </p>
          </div>

          {isAdmin ? (
            <button
              onClick={() => setCurrentView("admin")}
              className="mt-6 flex items-center justify-center gap-1 text-xs font-semibold text-[#606C38] hover:text-[#283618] self-start"
            >
              Go to Admin Dashboard
              <ArrowRight className="w-3 h-3" />
            </button>
          ) : (
            <div className="text-xxs text-[#7D7068] mt-6 italic">
              Public View (Read-Only)
            </div>
          )}
        </div>
      </div>

      {/* Featured Photos Section */}
      <section className="mt-12">
        <div className="flex items-center justify-between border-b border-[#EEDCD2]/40 pb-4 mb-6">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#3E3835]">Featured Memories</h2>
          <button
            onClick={() => setCurrentView("gallery")}
            className="flex items-center gap-1 text-sm font-semibold text-[#C87A53] hover:text-[#A55D37]"
          >
            See full gallery
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mosaic/Grid preview */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {featuredPhotos.map((photo, i) => (
            <div
              key={photo.id}
              className={`group relative overflow-hidden rounded-xl bg-stone-100 shadow-xxs cursor-pointer ${
                i === 0 ? "md:col-span-2 md:row-span-1" : "aspect-square"
              }`}
              onClick={() => setCurrentView("gallery")}
            >
              <img
                src={photo.url}
                alt={photo.title}
                className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${i === 0 ? "aspect-[4/3] md:aspect-auto" : "aspect-square"}`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <span className="text-white text-xs font-semibold line-clamp-1">{photo.title}</span>
                <span className="text-[#FEFAE0] text-xxs mt-0.5">{new Date(photo.date).getFullYear()}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Stories Section */}
      <section className="mt-12">
        <div className="flex items-center justify-between border-b border-[#EEDCD2]/40 pb-4 mb-6">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#3E3835]">Recent Stories & Recipes</h2>
          <button
            onClick={() => setCurrentView("blog")}
            className="flex items-center gap-1 text-sm font-semibold text-[#C87A53] hover:text-[#A55D37]"
          >
            Read all stories
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {latestStories.map((story) => (
            <article
              key={story.id}
              onClick={() => setCurrentView("blog")}
              className="group flex flex-col md:flex-row gap-4 rounded-2xl border border-[#EEDCD2]/40 bg-white p-4 shadow-xxs hover:shadow-xs transition-shadow duration-300 cursor-pointer"
            >
              {story.image && (
                <div className="h-40 w-full md:h-full md:w-36 flex-shrink-0 overflow-hidden rounded-xl bg-[#FAF7F2]">
                  <img
                    src={story.image}
                    alt={story.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
                  />
                </div>
              )}
              <div className="flex flex-col justify-between">
                <div>
                  <span className="text-xxs font-semibold uppercase tracking-wider text-[#C87A53]">
                    {story.category}
                  </span>
                  <h3 className="font-serif text-base font-bold text-[#3E3835] group-hover:text-[#C87A53] transition-colors mt-1">
                    {story.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#7D7068] line-clamp-3">
                    {story.content}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between text-xxs text-[#7D7068]">
                  <span>By {story.authorName}</span>
                  <span>{formatDate(story.date, "monthYear")}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
