import AuthLoading from "@/components/auth/AuthLoading";
import HeaderClinic from "@/components/layout/HeaderClinic";
import SidebarClinic from "@/components/layout/SidebarClinic";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthLoading>
      <div className="min-h-screen w-screen flex">
        <SidebarClinic />
        <div className="flex-1">
          <HeaderClinic />
          <div className="px-8 py-4">{children}</div>
        </div>
      </div>
    </AuthLoading>
  );
};

export default Layout;
