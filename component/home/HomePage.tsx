"use client";

import { useUser } from "@/provider/AuthContext";
import UserHomePage from "./userHomePage/UserHomePage";
import AdminHomePage from "./adminHomePage/AdminHomePage";

const HomePage = () => {
  const { user } = useUser();
  return (
    <section>
      {user?.role === "EMPLOYEE" && <UserHomePage />}
      {user?.role === "ADMIN" && <AdminHomePage />}
    </section>
  );
};

export default HomePage;
