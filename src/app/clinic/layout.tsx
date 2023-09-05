import AuthLoading from "@/components/auth/AuthLoading";
import SidebarClinic from "@/components/layout/SidebarClinic";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthLoading>
      <div className="min-h-screen w-screen flex">
        <SidebarClinic />
        <div className="flex-1">
          <div className="p-5 h-16 border-b flex items-center justify-between">
            <div className="text-xl font-bold mrt text-blue-900">
              🗒️ Atur Antrian Pasien
            </div>
            <Button size={"icon"} variant={"outline"}>
              <Bell width={20} />
            </Button>
          </div>
          <div className="p-8">{children}</div>
        </div>
      </div>
    </AuthLoading>
  );
};

export default Layout;
