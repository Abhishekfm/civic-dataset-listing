import React from "react";
import { Button } from "../ui/button";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-blue-900 text-white shadow">
      <div className="flex items-center gap-2">
        <span className="font-bold text-xl">CivicDataSpace</span>
      </div>
      <nav className="hidden md:flex gap-6">
        <a href="#" className="hover:underline">
          All Data
        </a>
        <a href="#" className="hover:underline">
          Sectors
        </a>
        <a href="#" className="hover:underline">
          Use Cases
        </a>
        <a href="#" className="hover:underline">
          Publishers
        </a>
        <a href="#" className="hover:underline">
          About Us
        </a>
      </nav>
      <Button className="bg-green-300 hover:bg-green-500 text-black font-medium">
        Login / Sign Up
      </Button>
    </header>
  );
}
