import {
  Home,
  LucideIcon,
  User,
  Users,
  BarChart3,
  Settings,
  Shield,
  Building2,
  Mail,
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
    icon: CircleGauge,
  },
  {
    title: "Admin Panel",
    url: "/admin",
    icon: Shield,
    items: [
      {
        title: "Dashboard",
        url: "/admin",
        icon: Activity,
      },
      {
        title: "Settings",
        url: "/admin/settings",
        icon: Settings,
      },
      {
        title: "Setup Wizard",
        url: "/admin/setup",
        icon: Database,
      },
      {
        title: "Company Settings",
        url: "/admin/settings?tab=company",
        icon: Building2,
      },
      {
        title: "Email Config",
        url: "/admin/settings?tab=email",
        icon: Mail,
      },
    ],
  },
  {
    title: "Reports",
    url: "/admin/reports",
    icon: BarChart3,
  },
];
