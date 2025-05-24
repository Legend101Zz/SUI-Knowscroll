import { Reel } from "@/types";

export const mockReels: Reel[] = [
  {
    id: "1",
    title: "Introduction to Quantum Physics",
    description: "Explore the fascinating world of quantum mechanics",
    category: "Science",
    videoUrl: "/videos/quantum-physics.mp4",
    thumbnail: "/images/quantum-physics-thumb.jpg",
    duration: 180,
    creator: {
      name: "Dr. Physics",
      avatar: "/images/avatar-alex.jpg",
    },
    likes: 1250,
    views: 15420,
  },
  {
    id: "2",
    title: "Ancient Rome: Rise of an Empire",
    description: "Journey through the history of Rome",
    category: "History",
    videoUrl: "/videos/ancient-rome.mp4",
    thumbnail: "/images/ancient-rome-thumb.jpg",
    duration: 240,
    creator: {
      name: "History Prof",
      avatar: "/images/avatar-taylor.jpg",
    },
    likes: 890,
    views: 12100,
  },
  {
    id: "3",
    title: "The AI Revolution",
    description: "Understanding artificial intelligence and its impact",
    category: "Technology",
    videoUrl: "/videos/ai-revolution.mp4",
    thumbnail: "/images/ai-revolution-thumb.jpg",
    duration: 200,
    creator: {
      name: "Tech Guru",
      avatar: "/images/avatar-jamie.jpg",
    },
    likes: 2150,
    views: 28900,
  },
];
