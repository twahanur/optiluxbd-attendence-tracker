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

type TNavmainProps = {
  adminItem: TNavmain[];
  userItem: TNavmain[];
  role: string;
};

export function NavMain({ adminItem, userItem, role }: TNavmainProps) {
  const navItem = role === "ADMIN" ? adminItem : userItem;
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {navItem.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title}>
                <Link
                  href={item.url}
                  className="flex items-center gap-4 w-full"
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
