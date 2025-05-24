import { User } from "@/types";

export const users: User[] = [
  {
    id: "user1",
    name: "Alex Johnson",
    username: "alex_science",
    avatar: "/images/avatar-alex.jpg",
    isOnline: true,
  },
  {
    id: "user2",
    name: "Jamie Smith",
    username: "jamie_history",
    avatar: "/images/avatar-jamie.jpg",
    lastActive: "2h ago",
  },
  {
    id: "user3",
    name: "Taylor Wong",
    username: "taylor_physics",
    avatar: "/images/avatar-taylor.jpg",
    lastActive: "5m ago",
  },
  {
    id: "user4",
    name: "Jordan Lee",
    username: "jordan_math",
    avatar: "/images/avatar-alex.jpg",
    lastActive: "1d ago",
  },
];
