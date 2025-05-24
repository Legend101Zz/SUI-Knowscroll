import { Series } from "@/types";

export const series: Series[] = [
  {
    id: "series1",
    title: "Black Holes",
    description:
      "A comprehensive exploration of black holes and their properties",
    thumbnailUrl: "/images/black-holes-thumb.jpg",
    episodeCount: 5,
    userId: "user1",
    tags: ["physics", "space", "astronomy", "education"],
    field: "Physics",
    reelIds: ["reel1", "reel2", "reel3"],
  },
  {
    id: "series2",
    title: "The History of Civilization",
    description: "From ancient times to the modern era",
    thumbnailUrl: "/images/ancient-rome-thumb.jpg",
    episodeCount: 12,
    userId: "user2",
    tags: ["history", "civilization", "education"],
    field: "History",
    reelIds: [],
  },
];
