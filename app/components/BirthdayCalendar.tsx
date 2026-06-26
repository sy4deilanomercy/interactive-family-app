"use client";

import React, { useState, useMemo } from "react";
import { useFamily, FamilyMember } from "../context/FamilyContext";
import { CalendarDays, ChevronLeft, ChevronRight, Heart, Gift, Sparkles, PartyPopper } from "lucide-react";
import { formatDate } from "../lib/formatDate";

export const BirthdayCalendar: React.FC = () => {
  const { members, setActiveProfileId } = useFamily();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0=Sun

  const navigateMonth = (direction: -1 | 1) => {
    let newMonth = currentMonth + direction;
    let newYear = currentYear;
    if (newMonth < 0) { newMonth = 11; newYear--; }
    if (newMonth > 11) { newMonth = 0; newYear++; }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const goToToday = () => {
    const now = new Date();
    setCurrentMonth(now.getMonth());
    setCurrentYear(now.getFullYear());
  };

  // Compute birthdays for current month
  const birthdaysThisMonth = useMemo(() => {
    return members.filter((m) => {
      const birthMonth = parseInt(m.birthDate.split("-")[1]) - 1;
      return birthMonth === currentMonth;
    }).sort((a, b) => parseInt(a.birthDate.split("-")[2]) - parseInt(b.birthDate.split("-")[2]));
  }, [members, currentMonth]);

  // Compute upcoming birthdays globally (next 5)
  const upcomingBirthdays = useMemo(() => {
    const now = new Date();
    const all = members.map((m) => {
      const [year, month, day] = m.birthDate.split("-");
      const birthMonth = parseInt(month) - 1;
      const birthDay = parseInt(day);

      let nextBday = new Date(currentYear, birthMonth, birthDay);
      if (nextBday < new Date(currentYear, currentMonth, 1)) {
        nextBday = new Date(currentYear + 1, birthMonth, birthDay);
      }

      const diffTime = nextBday.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const age = nextBday.getFullYear() - parseInt(year);
      return { member: m, nextBday, diffDays, age, month: birthMonth, day: birthDay };
    });

    all.sort((a, b) => a.diffDays - b.diffDays);
    return all.filter((b) => b.diffDays >= 0).slice(0, 7);
  }, [members, currentMonth, currentYear]);

  // Build calendar day grid
  const calendarDays = useMemo(() => {
    const now = new Date();
    const days: { day: number; isToday: boolean; birthdays: FamilyMember[] }[] = [];

    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = d === now.getDate() && currentMonth === now.getMonth() && currentYear === now.getFullYear();
      const birthdaysOnDay = birthdaysThisMonth.filter((m) => parseInt(m.birthDate.split("-")[2]) === d);
      days.push({ day: d, isToday, birthdays: birthdaysOnDay });
    }

    return days;
  }, [daysInMonth, currentMonth, currentYear, birthdaysThisMonth]);

  // Pad leading empty cells
  const leadingEmptyCells = Array.from({ length: firstDayOfWeek }, (_, i) => i);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12 fade-in pb-8 md:pb-12">
      {/* Page Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[#C87A53] bg-[#C87A53]/10 px-3 py-1 rounded-full uppercase tracking-wider mb-2">
          <PartyPopper className="w-3.5 h-3.5" /> Celebrate Together
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#3E3835] sm:text-4xl">
          Family Birthday Calendar
        </h1>
        <p className="text-sm text-[#7D7068] mt-2">
          Every cake, candle, and warm wish — gathered around the family hearth.
        </p>
      </div>

      {/* Upcoming Birthdays Bar */}
      <div className="mb-8 bg-white border border-[#EEDCD2]/50 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <Gift className="w-5 h-5 text-[#C87A53]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#C87A53]">Upcoming Birthdays</h3>
        </div>
        <div className="flex flex-wrap gap-4">
          {upcomingBirthdays.slice(0, 5).map((b) => (
            <button
              key={b.member.id}
              onClick={() => setActiveProfileId(b.member.id)}
              className="flex items-center gap-3 px-3.5 py-2 bg-[#FAF7F2] border border-[#EEDCD2]/60 hover:border-[#C87A53] rounded-xl transition-all text-left"
            >
              <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-white shadow-xxs">
                <img src={b.member.avatar} alt={b.member.name} className="h-full w-full object-cover" />
              </div>
              <div>
                <span className="block text-sm font-semibold text-[#3E3835] leading-snug">{b.member.name}</span>
                <span className="text-xxs text-[#7D7068]">
                  {b.diffDays === 0 ? "🎉 Today!" : b.diffDays === 1 ? "Tomorrow!" : `${b.diffDays} days`} • Turning {b.age}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Navigation and Grid */}
      <div className="bg-white border border-[#EEDCD2]/50 rounded-3xl shadow-xs overflow-hidden">
        {/* Month Navigation */}
        <div className="flex items-center justify-between px-3 sm:px-6 py-4 sm:py-5 border-b border-[#EEDCD2]/30">
          <button
            onClick={() => navigateMonth(-1)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-sm rounded-full text-[#7D7068] hover:text-[#3E3835] hover:bg-[#FAF7F2] transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline text-xs font-semibold">{monthNames[(currentMonth + 11) % 12]}</span>
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            <h2 className="font-serif text-lg sm:text-xl md:text-2xl font-bold text-[#3E3835]">
              {monthNames[currentMonth]} <span className="text-[#C87A53]">{currentYear}</span>
            </h2>
            <span className="text-[10px] bg-[#EEDCD2]/40 text-[#7D7068] rounded-full px-2 py-0.5 font-semibold">
              {birthdaysThisMonth.length} birthdays
            </span>
          </div>

          <button
            onClick={() => navigateMonth(1)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full text-[#7D7068] hover:text-[#3E3835] hover:bg-[#FAF7F2] transition-all cursor-pointer"
          >
            <span className="hidden sm:inline text-xs font-semibold">{monthNames[(currentMonth + 1) % 12]}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Day Names Header */}
        <div className="grid grid-cols-7 px-2 sm:px-4 pt-3 sm:pt-4 pb-1 sm:pb-2 gap-0.5 sm:gap-1 bg-[#FAF7F2]/50">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="text-center text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#7D7068] py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 px-2 sm:px-4 pb-3 sm:pb-4 gap-0.5 sm:gap-1">
          {/* Leading empty cells */}
          {leadingEmptyCells.map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[80px] rounded-lg bg-transparent" />
          ))}

          {/* Day Cells */}
          {calendarDays.map((dayData) => {
            const hasBirthday = dayData.birthdays.length > 0;
            return (
              <div
                key={dayData.day}
                className={`relative min-h-[60px] sm:min-h-[80px] rounded-lg sm:rounded-xl p-1.5 sm:p-2 border transition-all ${
                  dayData.isToday
                    ? "border-[#C87A53]/60 bg-[#FEFAE0]"
                    : hasBirthday
                    ? "border-[#EEDCD2] bg-[#FAF7F2]/40"
                    : "border-transparent bg-white/40"
                }`}
              >
                {/* Day Number */}
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center justify-center text-[10px] sm:text-xs font-bold w-5 h-5 sm:w-7 sm:h-7 rounded-full ${
                      dayData.isToday
                        ? "bg-[#C87A53] text-white shadow-xs"
                        : hasBirthday
                        ? "text-[#5E4E46]"
                        : "text-[#7D7068]"
                    }`}
                  >
                    {dayData.day}
                  </span>
                  {hasBirthday && (
                    <Heart className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#C87A53] fill-current animate-pulse" />
                  )}
                </div>

                {/* Birthday Avatars */}
                {dayData.birthdays.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setActiveProfileId(m.id)}
                    className="mt-1 flex items-center gap-1 p-0.5 sm:p-1 rounded-md hover:bg-[#EEDCD2]/40 transition-colors w-full text-left cursor-pointer"
                    title={`${m.name} - ${m.relationship}`}
                  >
                    <div className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 overflow-hidden rounded-full border border-white">
                      <img src={m.avatar} alt={m.name} className="h-full w-full object-cover" />
                    </div>
                    <span className="truncate text-[9px] sm:text-xxs font-semibold text-[#3E3835]">{m.name}</span>
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's Quick Jump */}
      <div className="mt-6 flex items-center justify-center">
        <button
          onClick={goToToday}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#C87A53] hover:text-[#A55D37] bg-white border border-[#EEDCD2] rounded-full hover:bg-[#FAF7F2] transition-all cursor-pointer"
        >
          <CalendarDays className="w-4 h-4" />
          Jump to Today
        </button>
      </div>

      {/* All birthdays legend */}
      <div className="mt-10 border-t border-[#EEDCD2]/40 pt-8">
        <h3 className="font-serif text-lg font-bold text-[#3E3835] mb-4">All Family Birthdays at a Glance</h3>
        <div className="flex flex-col gap-3">
          {members
            .slice()
            .sort((a, b) => {
              const [aM, aD] = [parseInt(a.birthDate.split("-")[1]), parseInt(a.birthDate.split("-")[2])];
              const [bM, bD] = [parseInt(b.birthDate.split("-")[1]), parseInt(b.birthDate.split("-")[2])];
              return aM !== bM ? aM - bM : aD - bD;
            })
            .map((m) => {
              const age = currentYear - parseInt(m.birthDate.split("-")[0]);
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveProfileId(m.id)}
                  className="flex items-center gap-2 sm:gap-4 px-3 sm:px-4 py-3 bg-white border border-[#EEDCD2]/40 rounded-xl hover:border-[#C87A53]/40 transition-all text-left cursor-pointer"
                >
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#EEDCD2]/40 text-xxs font-bold text-[#5E4E46]">
                    {formatDate(m.birthDate, "shortMonth")}
                  </div>
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full border border-[#EEDCD2]">
                      <img src={m.avatar} alt={m.name} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <span className="block text-sm font-semibold text-[#3E3835]">{m.name}</span>
                      <span className="text-xxs text-[#7D7068]">
                        {formatDate(m.birthDate, "monthDay")} • Turning {age + 1}
                      </span>
                    </div>
                  </div>
                  <Sparkles className="w-4 h-4 text-[#C87A53]/60 flex-shrink-0" />
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
};
