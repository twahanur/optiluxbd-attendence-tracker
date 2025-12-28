import { Home, LucideIcon, User, Users } from "lucide-react";

export type TNavmain = {
  title: string;
  url: string;
  icon?: LucideIcon;
};

export const navMain: TNavmain[] = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
  {
    title: "All User",
    url: "/users",
    icon: Users,
  },
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Users,
  },
];
