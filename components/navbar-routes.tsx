"use client";

import { UserButton } from "@clerk/clerk-react";

function NavbarRoutes() {
  return (
    <div className="flex gap-x-2 ml-auto ">
      <UserButton />
    </div>
  );
}

export default NavbarRoutes;
