"use client";

import * as React from "react";
import AppIcon from "@/components/AppIcon";
import { Button } from "@/components/ui/button";

const NavUnauthenticated = () => {
  return (
    <div className="flit justify-between">
      <AppIcon />
      <div className="flit gap-4">
        <Button variant={"outline"}>Masuk</Button>
        <Button>Daftar Sekarang</Button>
      </div>
    </div>
  );
};

export default NavUnauthenticated;
