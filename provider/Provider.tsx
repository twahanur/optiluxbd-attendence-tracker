import { ReactNode } from "react";
import UserProvider from "./AuthContext";

const Provider = ({ children }: { children: ReactNode }) => {
  return <UserProvider>{children}</UserProvider>;
};

export default Provider;
