"use client";

import * as React from "react";
import AppIcon from "@/components/AppIcon";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const NavUnauthenticated = () => {
  const {push} = useRouter()
  return (
    <div className="flit justify-between">
      <AppIcon />
      <div className="flit gap-4">
        <Button onClick={() => push("/login")} variant={"outline"}>Masuk</Button>
        <Button>Daftar Sekarang</Button>
      </div>
    </div>
  );
};

export default NavUnauthenticated;
