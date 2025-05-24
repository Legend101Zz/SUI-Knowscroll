export type ReelType = "standard" | "hyper" | "ai-generated";

export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  isOnline?: boolean;
  lastActive?: string;
  bio?: string;
  followers?: number;
  following?: number;
}

export interface Reel {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number; // in seconds
  views: number;
  likes: number;
  createdAt: string;
  userId: string;
  tags: string[];
  type: ReelType;
  seriesId?: string;
  episodeNumber?: number;
  alternateVersions?: string[]; // For HyperReels, IDs of alternate versions
  whatIfScenarios?: WhatIfScenario[]; // For AI-generated "What If" scenarios
  relatedReelIds?: string[]; // IDs of related reels (suggested navigation)
  interactions?: ReelInteractions; // User interaction stats
}

export interface ReelInteractions {
  comments: number;
  shares: number;
  saves: number;
  completionRate?: number; // percentage of viewers who watched the entire reel
}

export interface WhatIfScenario {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  targetReelId?: string; // ID of a reel that this what-if scenario leads to
}

export interface Series {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  episodeCount: number;
  userId: string;
  tags: string[];
  field: string; // e.g., "Physics", "History", etc.
  reelIds: string[]; // IDs of reels in this series
  featured?: boolean;
  completion?: number; // Percentage completed by current user
}

export interface Thread {
  id: string;
  title: string;
  createdAt: string;
  creatorId: string;
  participantIds: string[];
  seriesId?: string;
  reelIds: string[];
  messages: ThreadMessage[];
  lastActivity?: string;
  unreadCount?: number;
}

export interface ThreadMessage {
  id: string;
  userId: string;
  content: string;
  timestamp: string;
  reelId?: string; // If the message references a specific reel
  timeInReel?: string; // Timestamp in the reel (e.g., "01:45")
  attachments?: MessageAttachment[];
  reactions?: MessageReaction[];
}

export interface MessageAttachment {
  id: string;
  type: "image" | "link" | "reel-reference";
  url?: string;
  previewUrl?: string;
  title?: string;
  reelId?: string;
}

export interface MessageReaction {
  userId: string;
  emoji: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  thumbnailUrl?: string;
  color: string;
  reelCount: number;
  tags: string[];
  featured?: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: "like" | "comment" | "follow" | "mention" | "thread" | "system";
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  sourceId?: string; // ID of the reel, thread, comment, etc.
  sourceUserId?: string; // ID of the user who triggered the notification
}
