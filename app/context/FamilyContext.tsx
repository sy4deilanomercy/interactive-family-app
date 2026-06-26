"use client";

import   React, { createContext, useContext, useState } from "react";

export interface FamilyMember {
  id: string;
  name: string;
  birthDate: string; // YYYY-MM-DD
  birthPlace?: string;
  currentLocation?: string;
  bio?: string;
  avatar?: string;
  relationship: string; // e.g. Grandfather, Grandmother, Father, Mother, Daughter, Son, Sister, Brother, Spouse
  generation: number; // 0: Grandparents, 1: Parents/Uncles/Aunts, 2: Kids
  parents: string[]; // parent IDs
  spouses: string[]; // spouse IDs
  children: string[]; // children IDs
  hobbies?: string[];
  occupation?: string;
}

export interface GalleryPhoto {
  id: string;
  url: string; // .webp base64 or Unsplash URL
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  uploadedBy: string;
  likes: number;
}

export interface FamilyStory {
  id: string;
  title: string;
  content: string;
  date: string; // YYYY-MM-DD
  authorId: string;
  authorName: string;
  image?: string; // .webp base64 or Unsplash URL
  category: "Memory" | "Recipe" | "Milestone" | "Travel" | "Tradition";
  likes: number;
}

export type ViewType = "landing" | "tree" | "gallery" | "blog" | "calendar" | "admin";

interface FamilyContextType {
  members: FamilyMember[];
  photos: GalleryPhoto[];
  stories: FamilyStory[];
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  activeProfileId: string | null;
  setActiveProfileId: (id: string | null) => void;
  
  // Member Operations
  addMember: (member: Omit<FamilyMember, "id">) => void;
  updateMember: (id: string, member: Partial<FamilyMember>) => void;
  deleteMember: (id: string) => void;
  
  // Photo Operations
  addPhoto: (photo: Omit<GalleryPhoto, "id">) => void;
  deletePhoto: (id: string) => void;
  
  // Story Operations
  addStory: (story: Omit<FamilyStory, "id">) => void;
  deleteStory: (id: string) => void;
  
  // Like Operations
  likedPhotos: string[];
  likedStories: string[];
  togglePhotoLike: (id: string) => void;
  toggleStoryLike: (id: string) => void;
  
  // Image converter utility (client-side webp)
  convertToWebP: (file: File) => Promise<string>;
}

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

// Initial Mock Data
const initialMembers: FamilyMember[] = [
  {
    id: "g1",
    name: "Arthur Sterling",
    birthDate: "1945-05-12",
    birthPlace: "Edinburgh, Scotland",
    currentLocation: "Vermont, USA",
    bio: "The family anchor, former woodworker, and master of dad jokes. Arthur loves spending his mornings in his woodshop, making hand-carved toys for his grandchildren, and sipping on black tea. He always says the secret to a happy life is a warm hearth and a full pantry.",
    avatar: "https://images.unsplash.com/photo-1472417583565-62e7bdeda490?auto=format&fit=crop&q=80&w=400",
    relationship: "Grandfather",
    generation: 0,
    parents: [],
    spouses: ["g2"],
    children: ["p1", "p3"],
    hobbies: ["Woodworking", "Gardening", "Storytelling", "Black Tea"],
    occupation: "Retired Woodworker"
  },
  {
    id: "g2",
    name: "Eleanor Sterling",
    birthDate: "1948-11-23",
    birthPlace: "Boston, MA",
    currentLocation: "Vermont, USA",
    bio: "The heart of our home. Eleanor is a retired botanist whose garden is a canvas of colors. She has a magical ability to bake the most comforting apple pies and remember every single family milestone. Her warmth can heat up the coldest winters.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
    relationship: "Grandmother",
    generation: 0,
    parents: [],
    spouses: ["g1"],
    children: ["p1", "p3"],
    hobbies: ["Botany", "Baking Pies", "Classical Music", "Watercolor Painting"],
    occupation: "Retired Botanist"
  },
  {
    id: "p1",
    name: "Thomas Sterling",
    birthDate: "1974-08-15",
    birthPlace: "Boston, MA",
    currentLocation: "Seattle, WA",
    bio: "Arthur and Eleanor's eldest son. Thomas inherited his father's love for working with his hands but chose software engineering. He loves camping, brewing his own cider, and playing acoustic guitar by the campfire. He's the resident tech-supporter and barbecuer.",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400",
    relationship: "Father",
    generation: 1,
    parents: ["g1", "g2"],
    spouses: ["p2"],
    children: ["c1", "c2"],
    hobbies: ["Camping", "Acoustic Guitar", "Cider Brewing", "Hiking"],
    occupation: "Software Architect"
  },
  {
    id: "p2",
    name: "Sarah Sterling",
    birthDate: "1976-03-04",
    birthPlace: "Portland, OR",
    currentLocation: "Seattle, WA",
    bio: "Thomas's spouse and an incredible landscape architect. Sarah is energetic, organized, and holds a deep appreciation for nature. She's the planner of our yearly camping trips and knows how to turn any backyard into a lush wonderland. She is also a passionate bookworm.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    relationship: "Mother",
    generation: 1,
    parents: [],
    spouses: ["p1"],
    children: ["c1", "c2"],
    hobbies: ["Photography", "Landscape Design", "Historical Fiction", "Yoga"],
    occupation: "Landscape Architect"
  },
  {
    id: "p3",
    name: "Evelyn Sterling",
    birthDate: "1978-12-09",
    birthPlace: "Boston, MA",
    currentLocation: "San Francisco, CA",
    bio: "Thomas's younger sister. Evelyn is an adventurous soul, currently working as a documentary photographer. She has traveled to over 40 countries, capturing stories from around the globe, but always makes it home for the holidays with her trusty vintage camera and bags of exotic spices.",
    avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=400",
    relationship: "Aunt",
    generation: 1,
    parents: ["g1", "g2"],
    spouses: [],
    children: [],
    hobbies: ["Travel", "Documentary Photography", "Scuba Diving", "Cooking"],
    occupation: "Documentary Photographer"
  },
  {
    id: "c1",
    name: "Leo Sterling",
    birthDate: "2005-09-30",
    birthPlace: "Seattle, WA",
    currentLocation: "Seattle, WA",
    bio: "Thomas and Sarah's son. Leo is a college freshman majoring in environmental science. He shares a strong bond with his grandfather Arthur and loves restorative ecology. In his free time, he plays soccer and writes music.",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400",
    relationship: "Son",
    generation: 2,
    parents: ["p1", "p2"],
    spouses: [],
    children: [],
    hobbies: ["Soccer", "Songwriting", "Hiking", "Stargazing"],
    occupation: "Environmental Student"
  },
  {
    id: "c2",
    name: "Lily Sterling",
    birthDate: "2009-06-14",
    birthPlace: "Seattle, WA",
    currentLocation: "Seattle, WA",
    bio: "The youngest of the family. Lily is a high school student, a talented illustrator, and an animal lover. She spends hours sketching the birds in her grandmother's garden or volunteering at the local animal shelter. She has a witty sense of humor.",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400",
    relationship: "Daughter",
    generation: 2,
    parents: ["p1", "p2"],
    spouses: [],
    children: [],
    hobbies: ["Illustration", "Volunteering", "Skateboarding", "Baking"],
    occupation: "High School Student"
  }
];

const initialPhotos: GalleryPhoto[] = [
  {
    id: "ph1",
    url: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=800",
    title: "Summer Camping Trip at Lake Wenatchee",
    description: "Sitting around the campfire, listening to Dad play the guitar under a blanket of stars. July 2024.",
    date: "2024-07-18",
    uploadedBy: "Sarah Sterling",
    likes: 12
  },
  {
    id: "ph2",
    url: "https://images.unsplash.com/photo-1543258103-a62bdc069871?auto=format&fit=crop&q=80&w=800",
    title: "Arthur and Eleanor's Golden Anniversary",
    description: "Celebrating 50 years of laughter, love, and beautiful woodworking. Surrounded by the whole family.",
    date: "2023-10-12",
    uploadedBy: "Evelyn Sterling",
    likes: 47
  },
  {
    id: "ph3",
    url: "https://images.unsplash.com/photo-1464306208223-e0b4495a5553?auto=format&fit=crop&q=80&w=800",
    title: "Grandma Eleanor's Autumn Apple Harvest",
    description: "Picking sweet Honeycrisp apples in the Vermont orchard. Prepping for the legendary pie marathon!",
    date: "2024-10-05",
    uploadedBy: "Thomas Sterling",
    likes: 23
  },
  {
    id: "ph4",
    url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&q=80&w=800",
    title: "Lily's Art Studio Corner",
    description: "A snapshot of Lily's beautiful sketchbooks and watercolor studies of Vermont flora.",
    date: "2025-02-14",
    uploadedBy: "Sarah Sterling",
    likes: 31
  },
  {
    id: "ph5",
    url: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&q=80&w=800",
    title: "Morning Hike up Mount Rainier",
    description: "Leo and Thomas conquer the skyline trail. Crisp morning air and gorgeous glacier views.",
    date: "2024-08-02",
    uploadedBy: "Leo Sterling",
    likes: 18
  },
  {
    id: "ph6",
    url: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=800",
    title: "Cozy Winter Cabin Nights",
    description: "Board games, hot cocoa, and a roaring fire during the great snowstorm of December.",
    date: "2024-12-28",
    uploadedBy: "Arthur Sterling",
    likes: 36
  }
];

const initialStories: FamilyStory[] = [
  {
    id: "st1",
    title: "The Legend of the Smoked Apple Pie",
    content: `It was the autumn of 1998 when Grandma Eleanor decided to try baking her famous double-crust apple pie on the outdoor charcoal smoker instead of the conventional kitchen oven. Arthur had been boasting about his smoked turkey, and Eleanor jokingly said, 'If a bird can taste good with wood smoke, why not a Honeycrisp apple?'

Thomas and Evelyn, then young adults, watched with extreme skepticism as the pie was placed directly onto the hickory-scented grill grates. For 45 minutes, the backyard smelled like a bizarre blend of Thanksgiving dinner and a bakery. 

The result? Absolute magic. The subtle, sweet hickory smoke infused into the buttery lard crust, giving it a rich, savory-sweet depth that nobody expected. To this day, we still recreate the 'Smoked Pie' once every October, accompanied by Arthur's terrible jokes about smoking desserts.`,
    date: "2024-10-15",
    authorId: "g2",
    authorName: "Eleanor Sterling",
    image: "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&q=80&w=800",
    category: "Recipe",
    likes: 29
  },
  {
    id: "st2",
    title: "A Cabin in the Woods: How Arthur Found His True Calling",
    content: `In the spring of 1971, fresh out of the service and searching for direction, Arthur bought a rundown, one-room logger's cabin in northern Vermont. He had no formal training in woodworking—just a rusty handsaw, a couple of chisels, and a pile of pine boards.

He spent four months restoring that cabin by hand. He tells us that the first time he successfully planed a rough piece of cherry wood and felt its silky-smooth grain beneath his calloused palms, he knew what he wanted to do for the rest of his life. He felt an instant connection to the forest and the raw materials. 

He met Eleanor that very summer when she wandered near his woodshop looking for rare fern specimens. 'I heard the sound of rhythmic sanding from a mile away,' she recalls. That little woodshop eventually built the dining table we gather around every Thanksgiving. It taught us that the finest things in life require patience, attention, and a bit of sweat.`,
    date: "2023-06-20",
    authorId: "g1",
    authorName: "Arthur Sterling",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=800",
    category: "Memory",
    likes: 42
  },
  {
    id: "st3",
    title: "Crossing the Alps with a Vintage Leica",
    content: `When Aunt Evelyn announced she was going to hike across the Swiss Alps with nothing but a 35-pound backpack and a fully manual 1968 Leica M3 camera, we all thought she was crazy. 'No phone photos?' Sarah asked. 'Nope, just film and patience,' Evelyn replied with her characteristic grin.

For three weeks, we received no news. Then, a handwritten postcard arrived covered in mountain postmarks. When she finally came back, she had twelve rolls of black-and-white film. 

One image in particular—of an elderly shepherd sharing a piece of bread with his dog in a misty valley—won an international award. But to Evelyn, the best memory was drinking warm goat's milk in a remote stone hut, talking about life with a farmer who didn't speak English but understood the language of a warm hearth. It taught us all to slow down, look closer, and appreciate the fleeting frames of our lives.`,
    date: "2024-04-12",
    authorId: "p3",
    authorName: "Evelyn Sterling",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
    category: "Travel",
    likes: 34
  }
];

const loadFromStorage = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const saved = localStorage.getItem(key);
    if (saved) return JSON.parse(saved) as T;
  } catch { /* ignore */ }
  return fallback;
};

export const FamilyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [members, setMembers] = useState<FamilyMember[]>(() =>
    loadFromStorage("sterling_members", initialMembers)
  );
  const [photos, setPhotos] = useState<GalleryPhoto[]>(() =>
    loadFromStorage("sterling_photos", initialPhotos)
  );
  const [stories, setStories] = useState<FamilyStory[]>(() =>
    loadFromStorage("sterling_stories", initialStories)
  );
  const [isAdmin, setIsAdmin] = useState<boolean>(() =>
    loadFromStorage("sterling_admin", false)
  );
  const [currentView, setCurrentView] = useState<ViewType>("landing");
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);

  // Liked IDs (per-device, stored separately from the data)
  const [likedPhotos, setLikedPhotos] = useState<string[]>(() =>
    loadFromStorage("sterling_liked_photos", [])
  );
  const [likedStories, setLikedStories] = useState<string[]>(() =>
    loadFromStorage("sterling_liked_stories", [])
  );

  // Save to LocalStorage helper
  const saveToStorage = <T,>(key: string, data: T) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, JSON.stringify(data));
  };

  const handleSetIsAdmin = (adminVal: boolean) => {
    setIsAdmin(adminVal);
    saveToStorage("sterling_admin", adminVal);
  };

  // Member Operations
  const addMember = (newMember: Omit<FamilyMember, "id">) => {
    const id = "m_" + Date.now().toString();
    const created: FamilyMember = { ...newMember, id };
    const updated = [...members, created];
    
    // Also automatically build bidirectional family relationships if grandparents/parents are set
    setMembers(updated);
    saveToStorage("sterling_members", updated);
  };

  const updateMember = (id: string, updatedFields: Partial<FamilyMember>) => {
    const updated = members.map((m) => (m.id === id ? { ...m, ...updatedFields } : m));
    setMembers(updated);
    saveToStorage("sterling_members", updated);
  };

  const deleteMember = (id: string) => {
    const updated = members.filter((m) => m.id !== id);
    setMembers(updated);
    saveToStorage("sterling_members", updated);
    if (activeProfileId === id) setActiveProfileId(null);
  };

  // Photo Operations
  const addPhoto = (newPhoto: Omit<GalleryPhoto, "id">) => {
    const id = "ph_" + Date.now().toString();
    const created: GalleryPhoto = { ...newPhoto, id };
    const updated = [created, ...photos]; // newest first
    setPhotos(updated);
    saveToStorage("sterling_photos", updated);
  };

  const deletePhoto = (id: string) => {
    const updated = photos.filter((p) => p.id !== id);
    setPhotos(updated);
    saveToStorage("sterling_photos", updated);
  };

  // Story Operations
  const addStory = (newStory: Omit<FamilyStory, "id">) => {
    const id = "st_" + Date.now().toString();
    const created: FamilyStory = { ...newStory, id };
    const updated = [created, ...stories]; // newest first
    setStories(updated);
    saveToStorage("sterling_stories", updated);
  };

  const deleteStory = (id: string) => {
    const updated = stories.filter((s) => s.id !== id);
    setStories(updated);
    saveToStorage("sterling_stories", updated);
  };

  // Like Operations
  const togglePhotoLike = (id: string) => {
    const alreadyLiked = likedPhotos.includes(id);
    let updatedLiked: string[];
    if (alreadyLiked) {
      updatedLiked = likedPhotos.filter((lid) => lid !== id);
    } else {
      updatedLiked = [...likedPhotos, id];
    }
    setLikedPhotos(updatedLiked);
    saveToStorage("sterling_liked_photos", updatedLiked);

    const updatedPhotos = photos.map((p) =>
      p.id === id
        ? { ...p, likes: alreadyLiked ? Math.max(0, p.likes - 1) : p.likes + 1 }
        : p
    );
    setPhotos(updatedPhotos);
    saveToStorage("sterling_photos", updatedPhotos);
  };

  const toggleStoryLike = (id: string) => {
    const alreadyLiked = likedStories.includes(id);
    let updatedLiked: string[];
    if (alreadyLiked) {
      updatedLiked = likedStories.filter((lid) => lid !== id);
    } else {
      updatedLiked = [...likedStories, id];
    }
    setLikedStories(updatedLiked);
    saveToStorage("sterling_liked_stories", updatedLiked);

    const updatedStories = stories.map((s) =>
      s.id === id
        ? { ...s, likes: alreadyLiked ? Math.max(0, s.likes - 1) : s.likes + 1 }
        : s
    );
    setStories(updatedStories);
    saveToStorage("sterling_stories", updatedStories);
  };

  // Canvas-based Client Side WebP converter
  const convertToWebP = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Failed to get 2D context"));
            return;
          }

          // Maintain aspect ratio, clamp max size to 1200px for storage efficiency
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to webp with 0.8 quality
          const webpDataUrl = canvas.toDataURL("image/webp", 0.8);
          resolve(webpDataUrl);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  return (
    <FamilyContext.Provider
      value={{
        members,
        photos,
        stories,
        isAdmin,
        setIsAdmin: handleSetIsAdmin,
        currentView,
        setCurrentView,
        activeProfileId,
        setActiveProfileId,
        addMember,
        updateMember,
        deleteMember,
        addPhoto,
        deletePhoto,
        addStory,
        deleteStory,
        likedPhotos,
        likedStories,
        togglePhotoLike,
        toggleStoryLike,
        convertToWebP,
      }}
    >
      {children}
    </FamilyContext.Provider>
  );
};

export const useFamily = () => {
  const context = useContext(FamilyContext);
  if (context === undefined) {
    throw new Error("useFamily must be used within a FamilyProvider");
  }
  return context;
};
