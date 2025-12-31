"use client";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { TNavmain } from "@/const/attendenceNavigation";
import Link from "next/link";
import { usePathname } from "next/navigation";

type TNavmainProps = {
  adminItem: TNavmain[];
  userItem: TNavmain[];
  role: string;
};

export function NavMain({ adminItem, userItem, role }: TNavmainProps) {
  const navItem = role === "ADMIN" ? adminItem : userItem;
  const pathName = usePathname();
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {navItem.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title} className="px-0">
                <Link
                  href={item.url}
                  className={`flex items-center gap-4 w-full px-2 ${
                    pathName.startsWith(item.url) &&
                    "bg-white/10 py-1.5 rounded-md w-full"
                  }`}
                >
                  {item.icon && <item.icon size={18} />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
