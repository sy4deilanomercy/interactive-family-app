"use client";

import { useState, useRef, useCallback } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Info, X, Heart, Search, Sprout } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { familyMembers, FamilyMemberWithTree } from '../data/familyData';

const NODE_W = 130;
const NODE_H = 160;

function getAge(birthDate: string, deathDate?: string) {
  const end = deathDate ? new Date(deathDate) : new Date();
  const birth = new Date(birthDate);
  let age = end.getFullYear() - birth.getFullYear();
  const m = end.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && end.getDate() < birth.getDate())) age--;
  return age;
}

interface MemberNodeProps {
  member: FamilyMemberWithTree;
  onClick: (m: FamilyMemberWithTree) => void;
  selected: boolean;
}

function MemberNode({ member, onClick, selected }: MemberNodeProps) {
  const isDead = !!member.deathDate;
  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onClick(member)}
      className="absolute cursor-pointer rounded-2xl overflow-hidden flex flex-col items-center border-2 transition-all"
      style={{
        left: (member.treeX ?? 0) - NODE_W / 2,
        top: (member.treeY ?? 0) - NODE_H / 2,
        width: NODE_W,
        height: NODE_H,
        background: selected ? '#8b4513' : isDead ? '#f0e8d8' : '#FAF7F2',
        borderColor: selected ? '#c8882a' : isDead ? 'rgba(139,69,19,0.25)' : '#EEDCD2',
        boxShadow: selected
          ? '0 8px 32px rgba(139,69,19,0.4)'
          : '0 3px 16px rgba(139,69,19,0.1)',
        opacity: isDead ? 0.8 : 1,
        zIndex: selected ? 10 : 1,
      }}
    >
      {isDead && (
        <div className="absolute top-1.5 right-1.5 text-xs px-1.5 py-0.5 rounded-full"
          style={{ background: 'rgba(139,69,19,0.12)', color: '#8d7b5a', fontSize: '9px' }}>
          Alm.
        </div>
      )}
      <div className="w-16 h-16 mt-4 rounded-full overflow-hidden border-2 flex-shrink-0"
        style={{ borderColor: selected ? 'rgba(255,255,255,0.5)' : '#D9C3B4' }}>
        <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
      </div>
      <div className="px-2 mt-2 text-center flex-1 flex flex-col items-center justify-start">
        <p
          className="leading-tight line-clamp-2"
          style={{
            fontSize: '11px',
            fontWeight: 600,
            color: selected ? '#fff' : '#3E3835',
            fontFamily: 'var(--font-geist-sans)',
            lineHeight: 1.3,
          }}
        >
          {member.nickname || member.name.split(' ').slice(0, 2).join(' ')}
        </p>
        <p className="mt-0.5" style={{ fontSize: '10px', color: selected ? 'rgba(255,255,255,0.7)' : '#8d7b5a' }}>
          {member.birthDate.slice(0, 4)}{member.deathDate ? ` – ${member.deathDate.slice(0, 4)}` : ''}
        </p>
        <p className="mt-0.5" style={{ fontSize: '9px', color: selected ? 'rgba(255,255,255,0.6)' : 'rgba(141,123,90,0.8)' }}>
          {member.role}
        </p>
      </div>
    </motion.div>
  );
}

function drawConnectors(members: FamilyMemberWithTree[]) {
  const lines: { d: string; key: string; dashed?: boolean }[] = [];

  // Couple connections (horizontal line with heart)
  const couples = new Set<string>();
  members.forEach(m => {
    if (m.spouses.length > 0) {
      const spouseId = m.spouses[0];
      if (!couples.has(`${spouseId}-${m.id}`)) {
        couples.add(`${m.id}-${spouseId}`);
        const spouse = members.find(s => s.id === spouseId);
        if (!spouse) return;
        const x1 = m.treeX ?? 0;
        const y1 = m.treeY ?? 0;
        const x2 = spouse.treeX ?? 0;
        const y2 = spouse.treeY ?? 0;
        lines.push({ d: `M ${x1} ${y1} L ${x2} ${y2}`, key: `couple-${m.id}` });
      }
    }
  });

  // Parent-child connections
  members.forEach(m => {
    if (!m.parents.length) return;
    const parents = m.parents.map(pid => members.find(p => p.id === pid)).filter(Boolean) as FamilyMemberWithTree[];
    if (!parents.length) return;

    // Calculate midpoint between parents (or single parent position)
    const parentX = parents.reduce((s, p) => s + (p.treeX ?? 0), 0) / parents.length;
    const parentY = parents.reduce((s, p) => s + (p.treeY ?? 0), 0) / parents.length;

    // Draw vertical line from parent midpoint to child
    const cx = m.treeX ?? 0;
    const cy = m.treeY ?? 0;
    const midY = (parentY + cy) / 2;

    lines.push({
      d: `M ${parentX} ${parentY + NODE_H / 2} C ${parentX} ${midY}, ${cx} ${midY}, ${cx} ${cy - NODE_H / 2}`,
      key: `child-${m.id}`,
    });
  });

  return lines;
}

function ProfileDrawer({ member, onClose }: { member: FamilyMemberWithTree; onClose: () => void }) {
  const age = getAge(member.birthDate, member.deathDate);
  const parents = member.parents.map(pid => familyMembers.find(m => m.id === pid)).filter(Boolean) as FamilyMemberWithTree[];
  const spouse = member.spouses.length > 0 ? familyMembers.find(m => m.id === member.spouses[0]) : null;
  const children = familyMembers.filter(m => m.parents.includes(member.id));

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute top-0 right-0 h-full w-72 overflow-y-auto border-l z-20 flex flex-col"
      style={{ background: '#FDFBF7', borderColor: '#EEDCD2' }}
    >
      <div className="relative h-36 overflow-hidden flex-shrink-0">
        <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(61,31,10,0.85), transparent)' }} />
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.3)', color: '#fff' }}
        >
          <X size={16} />
        </button>
        {member.deathDate && (
          <div className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full"
            style={{ background: 'rgba(0,0,0,0.4)', color: '#fff' }}>
            Almarhum/ah
          </div>
        )}
      </div>

      <div className="p-5 flex-1">
        <h3 style={{ fontFamily: 'var(--font-geist-sans)', color: '#3E3835', fontSize: '1.05rem', lineHeight: 1.3 }}>
          {member.name}
        </h3>
        {member.nickname && (
          <p className="text-sm italic mt-0.5" style={{ color: '#8d7b5a' }}>
            &ldquo;{member.nickname}&rdquo;
          </p>
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(139,69,19,0.1)', color: '#8b4513' }}>
            {member.role}
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(200,136,42,0.1)', color: '#c8882a' }}>
            Gen. {member.generation + 1}
          </span>
        </div>

        <div className="mt-4 space-y-1.5 text-sm" style={{ color: '#8d7b5a' }}>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold" style={{ color: '#8b4513', minWidth: 80 }}>Lahir</span>
            <span>{new Date(member.birthDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
          {member.deathDate && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold" style={{ color: '#8b4513', minWidth: 80 }}>Wafat</span>
              <span>{new Date(member.deathDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold" style={{ color: '#8b4513', minWidth: 80 }}>Usia</span>
            <span>{age} tahun{member.deathDate ? ' (saat wafat)' : ''}</span>
          </div>
          {member.occupation && (
            <div className="flex items-start gap-2">
              <span className="text-xs font-semibold" style={{ color: '#8b4513', minWidth: 80 }}>Profesi</span>
              <span>{member.occupation}</span>
            </div>
          )}
          {member.currentLocation && (
            <div className="flex items-start gap-2">
              <span className="text-xs font-semibold" style={{ color: '#8b4513', minWidth: 80 }}>Domisili</span>
              <span>{member.currentLocation}</span>
            </div>
          )}
        </div>

        <div className="mt-5 pt-4 border-t" style={{ borderColor: '#EEDCD2' }}>
          <p className="text-sm leading-relaxed" style={{ color: '#3E3835' }}>{member.bio}</p>
        </div>

        {(parents.length > 0 || spouse || children.length > 0) && (
          <div className="mt-5 pt-4 border-t space-y-3" style={{ borderColor: '#EEDCD2' }}>
            {parents.length > 0 && (
              <div>
                <p className="text-xs font-semibold mb-2" style={{ color: '#8b4513' }}>Orang Tua</p>
                <div className="flex gap-2">
                  {parents.map(p => (
                    <div key={p.id} className="flex items-center gap-1.5">
                      <img src={p.photo} alt={p.name} className="w-7 h-7 rounded-full object-cover" />
                      <span className="text-xs" style={{ color: '#8d7b5a' }}>{p.nickname || p.name.split(' ')[0]}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {spouse && (
              <div>
                <p className="text-xs font-semibold mb-2" style={{ color: '#8b4513' }}>
                  <Heart size={11} className="inline mr-1" style={{ color: '#c8882a' }} />
                  Pasangan
                </p>
                <div className="flex items-center gap-1.5">
                  <img src={spouse.photo} alt={spouse.name} className="w-7 h-7 rounded-full object-cover" />
                  <span className="text-xs" style={{ color: '#8d7b5a' }}>{spouse.nickname || spouse.name.split(' ')[0]}</span>
                </div>
              </div>
            )}
            {children.length > 0 && (
              <div>
                <p className="text-xs font-semibold mb-2" style={{ color: '#8b4513' }}>Anak</p>
                <div className="flex flex-wrap gap-2">
                  {children.map(c => (
                    <div key={c.id} className="flex items-center gap-1.5">
                      <img src={c.photo} alt={c.name} className="w-7 h-7 rounded-full object-cover" />
                      <span className="text-xs" style={{ color: '#8d7b5a' }}>{c.nickname || c.name.split(' ')[0]}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function FamilyTree() {
  const [zoom, setZoom] = useState(0.75);
  const [pan, setPan] = useState({ x: -80, y: -20 });
  const [selected, setSelected] = useState<FamilyMemberWithTree | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGeneration, setSelectedGeneration] = useState<number | "all">("all");
  const lastMouse = useRef({ x: 0, y: 0 });
  const lastTouch = useRef({ x: 0, y: 0 });
  const initialDistance = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const CANVAS_W = 1450;
  const CANVAS_H = 980;

  // Filter members based on search and generation
  const filteredMembers = familyMembers.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.role && m.role.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (m.occupation && m.occupation.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchGeneration = selectedGeneration === "all" || m.generation === selectedGeneration;
    
    return matchSearch && matchGeneration;
  });

  const lines = drawConnectors(filteredMembers);

  const getTouchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return null;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-node]')) return;
    setIsPanning(true);
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning) return;
    const dx = e.clientX - lastMouse.current.x;
    const dy = e.clientY - lastMouse.current.y;
    setPan(p => ({ x: p.x + dx / zoom, y: p.y + dy / zoom }));
    lastMouse.current = { x: e.clientX, y: e.clientY };
  }, [isPanning, zoom]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('[data-node]')) return;
    if (e.touches.length === 1) {
      setIsPanning(true);
      lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      initialDistance.current = null;
    } else if (e.touches.length === 2) {
      setIsPanning(false);
      initialDistance.current = getTouchDistance(e.touches);
    }
  };

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1 && isPanning) {
      // Single finger drag for panning
      const dx = e.touches[0].clientX - lastTouch.current.x;
      const dy = e.touches[0].clientY - lastTouch.current.y;
      setPan(p => ({ x: p.x + dx / zoom, y: p.y + dy / zoom }));
      lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.touches.length === 2 && initialDistance.current) {
      // Two finger pinch for zoom
      const currentDistance = getTouchDistance(e.touches);
      if (currentDistance) {
        const scale = currentDistance / initialDistance.current;
        setZoom(z => Math.max(0.35, Math.min(1.5, z * scale)));
        initialDistance.current = currentDistance;
      }
    }
  }, [isPanning, zoom]);

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length === 0) {
      setIsPanning(false);
      initialDistance.current = null;
    } else if (e.touches.length === 1) {
      // User lifted one finger, reset pinch and start panning
      lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      setIsPanning(true);
      initialDistance.current = null;
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(z => Math.max(0.35, Math.min(1.5, z - e.deltaY * 0.001)));
  };

  const resetView = () => { setZoom(0.75); setPan({ x: -80, y: -20 }); };

  const generations = Array.from(new Set(familyMembers.map(m => m.generation))).sort();

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 64px)', background: '#FDFBF7' }}>
      {/* Toolbar */}
      <div className="flex flex-col gap-4 px-6 py-4 border-b flex-shrink-0"
        style={{ background: '#FAF7F2', borderColor: '#EEDCD2' }}>
        
        {/* Page Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider mb-2"
              style={{ background: 'rgba(96,108,56,0.1)', color: '#606C38' }}>
              <Sprout className="w-3.5 h-3.5" /> Akar Generasi
            </div>
            <h1 style={{ fontFamily: 'var(--font-geist-sans)', color: '#3E3835', fontSize: '1.5rem', fontWeight: 700 }}>
              Pohon Keluarga Santoso
            </h1>
            <p className="text-sm mt-1" style={{ color: '#7D7068' }}>
              Catatan interaktif warisan keluarga kami. Klik anggota untuk melihat profil lengkap, cerita pribadi, hobi, dan koneksi keluarga.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setZoom(z => Math.min(1.5, z + 0.1))}
              className="w-9 h-9 rounded-lg border flex items-center justify-center transition-all hover:bg-amber-50"
              style={{ borderColor: '#EEDCD2', color: '#8b4513' }}>
              <ZoomIn size={16} />
            </button>
            <span className="text-xs font-medium w-10 text-center" style={{ color: '#8d7b5a' }}>
              {Math.round(zoom * 100)}%
            </span>
            <button onClick={() => setZoom(z => Math.max(0.35, z - 0.1))}
              className="w-9 h-9 rounded-lg border flex items-center justify-center transition-all hover:bg-amber-50"
              style={{ borderColor: '#EEDCD2', color: '#8b4513' }}>
              <ZoomOut size={16} />
            </button>
            <button onClick={resetView}
              className="w-9 h-9 rounded-lg border flex items-center justify-center transition-all hover:bg-amber-50"
              style={{ borderColor: '#EEDCD2', color: '#8b4513' }}>
              <Maximize2 size={16} />
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7D7068]" />
            <input
              type="text"
              placeholder="Cari nama, profesi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border focus:ring-1 focus:outline-none placeholder:text-[#7D7068]/60 transition-all"
              style={{ 
                borderColor: '#EEDCD2', 
                background: '#fff',
                color: '#3E3835'
              }}
              onFocus={(e) => e.target.style.borderColor = '#C87A53'}
              onBlur={(e) => e.target.style.borderColor = '#EEDCD2'}
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedGeneration("all")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all shrink-0 ${
                selectedGeneration === "all"
                  ? "text-white shadow-xs"
                  : "hover:bg-[#EEDCD2]/40"
              }`}
              style={{ 
                background: selectedGeneration === "all" ? '#C87A53' : '#FAF7F2',
                color: selectedGeneration === "all" ? '#fff' : '#7D7068'
              }}
            >
              Semua Generasi
            </button>
            <button
              onClick={() => setSelectedGeneration(0)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all shrink-0 ${
                selectedGeneration === 0
                  ? "text-white shadow-xs"
                  : "hover:bg-[#EEDCD2]/40"
              }`}
              style={{ 
                background: selectedGeneration === 0 ? '#C87A53' : '#FAF7F2',
                color: selectedGeneration === 0 ? '#fff' : '#7D7068'
              }}
            >
              Gen 1 (Kakek/Nenek)
            </button>
            <button
              onClick={() => setSelectedGeneration(1)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all shrink-0 ${
                selectedGeneration === 1
                  ? "text-white shadow-xs"
                  : "hover:bg-[#EEDCD2]/40"
              }`}
              style={{ 
                background: selectedGeneration === 1 ? '#C87A53' : '#FAF7F2',
                color: selectedGeneration === 1 ? '#fff' : '#7D7068'
              }}
            >
              Gen 2 (Orang Tua)
            </button>
            <button
              onClick={() => setSelectedGeneration(2)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all shrink-0 ${
                selectedGeneration === 2
                  ? "text-white shadow-xs"
                  : "hover:bg-[#EEDCD2]/40"
              }`}
              style={{ 
                background: selectedGeneration === 2 ? '#C87A53' : '#FAF7F2',
                color: selectedGeneration === 2 ? '#fff' : '#7D7068'
              }}
            >
              Gen 3 (Anak-anak)
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs" style={{ color: '#8d7b5a' }}>
          <span>{filteredMembers.length} anggota ditampilkan</span>
          <span>·</span>
          <span>{generations.length} generasi</span>
        </div>
      </div>

      {/* Canvas container */}
      <div className="flex-1 overflow-hidden relative">
        <div
          ref={containerRef}
          className="w-full h-full touch-none"
          style={{ cursor: isPanning ? 'grabbing' : 'grab', userSelect: 'none' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={() => setIsPanning(false)}
          onMouseLeave={() => setIsPanning(false)}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            style={{
              transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
              transformOrigin: '0 0',
              width: CANVAS_W,
              height: CANVAS_H,
              position: 'relative',
            }}
          >
            {/* SVG Connectors */}
            <svg
              width={CANVAS_W}
              height={CANVAS_H}
              style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
            >
              {lines.map(line => (
                <path
                  key={line.key}
                  d={line.d}
                  fill="none"
                  stroke={line.key.startsWith('couple') ? '#c8882a' : '#D9C3B4'}
                  strokeWidth={line.key.startsWith('couple') ? 2.5 : 2}
                  opacity={0.7}
                />
              ))}
              {/* Hearts on couple lines */}
              {filteredMembers.filter(m => m.spouses.length > 0 && m.id < (m.spouses[0] || '')).map(m => {
                const spouse = familyMembers.find(s => s.id === m.spouses[0]);
                if (!spouse) return null;
                const cx = ((m.treeX ?? 0) + (spouse.treeX ?? 0)) / 2;
                const cy = ((m.treeY ?? 0) + (spouse.treeY ?? 0)) / 2;
                return (
                  <text key={`heart-${m.id}`} x={cx} y={cy + 5} textAnchor="middle" fontSize="14" fill="#c8882a">
                    ♥
                  </text>
                );
              })}
              {/* Generation labels */}
              {generations.map(g => {
                const genMembers = filteredMembers.filter(m => m.generation === g);
                const minY = Math.min(...genMembers.map(m => m.treeY ?? 0));
                return (
                  <text
                    key={`gen-${g}`}
                    x={30}
                    y={minY}
                    fontSize="11"
                    fill="#D9C3B4"
                    fontFamily="var(--font-geist-sans)"
                    fontStyle="italic"
                  >
                  </text>
                );
              })}
            </svg>

            {/* Member nodes */}
            {filteredMembers.map(member => (
              <div key={member.id} data-node="true">
                <MemberNode
                  member={member}
                  onClick={setSelected}
                  selected={selected?.id === member.id}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Profile Drawer */}
        <AnimatePresence>
          {selected && (
            <ProfileDrawer member={selected} onClose={() => setSelected(null)} />
          )}
        </AnimatePresence>

        {/* Help hint */}
        {!selected && (
          <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
            style={{ background: 'rgba(61,31,10,0.08)', color: '#8d7b5a' }}>
            <Info size={12} />
            <span className="hidden sm:inline">
              Seret untuk menggeser · Scroll untuk zoom · Klik anggota untuk detail
            </span>
            <span className="sm:hidden">
              Seret untuk menggeser · Cubit untuk zoom · Klik untuk detail
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
