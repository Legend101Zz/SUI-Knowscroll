import { Thread } from "@/types";

export const threads: Thread[] = [
  {
    id: "thread1",
    title: "Black Holes",
    createdAt: "2025-04-10T14:35:00Z",
    creatorId: "user1",
    participantIds: ["user1", "user2", "user3"],
    seriesId: "series1",
    reelIds: ["reel1", "reel2", "reel3"],
    messages: [
      {
        id: "msg1",
        userId: "user1",
        content: "That part about event horizons was mind-blowing!",
        timestamp: "2025-04-10T14:35:00Z",
        reelId: "reel2",
        timeInReel: "01:45",
      },
      {
        id: "msg2",
        userId: "user3",
        content: "Check this part!",
        timestamp: "2025-04-10T15:10:00Z",
        reelId: "reel1",
        timeInReel: "00:52",
      },
    ],
  },
];
