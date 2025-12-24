/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useUser } from "@/provider/AuthContext";
import { logout } from "@/service/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SidebarMenuButton } from "./sidebar";
import { LogOut } from "lucide-react";

const LogoutButton = () => {
  const router = useRouter();
  const { setUser, setIsLoading } = useUser();

  const handleLogOut = async () => {
    const toastId = toast.loading("Logging out...", { duration: 3000 });
    try {
      const res = await logout();
      if (res.success) {
        setIsLoading(true);
        setUser(null);
        router.push("/login");
        toast.success(res.message, { id: toastId, duration: 3000 });
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("An error occurred during logout.", {
        id: toastId,
        duration: 3000,
      });
    }
  };

  return (
    <SidebarMenuButton tooltip="logout" onClick={handleLogOut}>
      <p className="flex items-center gap-2">
        <LogOut size={16} /> Logout
      </p>
    </SidebarMenuButton>
  );
};

export default LogoutButton;
