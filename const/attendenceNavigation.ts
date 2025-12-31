import {
  Home,
  LucideIcon,
  User,
  Users,
  BarChart3,
  Settings,
  Database,
  Activity,
  CircleGauge,
} from "lucide-react";

export type TNavmain = {
  title: string;
  url: string;
  icon?: LucideIcon;
  items?: TNavmain[];
};

// admin navigation
export const navMain: TNavmain[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: CircleGauge,
  },
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
    title: "Admin",
    url: "/admin",
    icon: Activity,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "Setup Wizard",
    url: "/setup",
    icon: Database,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: BarChart3,
  },
];

// user navigation
export const navMainUser: TNavmain[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: CircleGauge,
  },
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
];
