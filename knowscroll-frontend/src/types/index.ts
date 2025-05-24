export interface Reel {
  id: string;
  title: string;
  description: string;
  category: string;
  videoUrl: string;
  thumbnail: string;
  duration: number;
  creator: {
    name: string;
    avatar: string;
  };
  likes: number;
  views: number;
  channelId?: string;
}

export interface Channel {
  id: string;
  name: string;
  description: string;
  category: string;
  creator: string;
  totalShares: number;
  createdAt: number;
  active: boolean;
  imageUrl?: string;
}

export interface ChannelShare {
  id: string;
  channelId: string;
  amount: number;
  owner: string;
}

export interface Thread {
  id: string;
  title: string;
  description: string;
  episodes: Reel[];
  totalEpisodes: number;
  category: string;
  thumbnail: string;
  creator: {
    name: string;
    avatar: string;
  };
}
