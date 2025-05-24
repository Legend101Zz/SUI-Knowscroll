import { Thread } from "@/types";
import { mockReels } from "./reels";

export const mockThreads: Thread[] = [
  {
    id: "1",
    title: "Physics Fundamentals",
    description: "Master the basics of physics through engaging content",
    episodes: [mockReels[0]],
    totalEpisodes: 12,
    category: "Science",
    thumbnail: "/images/quantum-physics-thumb.jpg",
    creator: {
      name: "Dr. Physics",
      avatar: "/images/avatar-alex.jpg",
    },
  },
  {
    id: "2",
    title: "World History Series",
    description: "Explore civilizations throughout human history",
    episodes: [mockReels[1]],
    totalEpisodes: 15,
    category: "History",
    thumbnail: "/images/ancient-rome-thumb.jpg",
    creator: {
      name: "History Prof",
      avatar: "/images/avatar-taylor.jpg",
    },
  },
];
