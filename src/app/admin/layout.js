"use client";
import React, { useState } from "react";
import Sidebar from "./Sidebar"; 

export default function AdminLayout({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex h-screen w-full bg-[#1a0033] overflow-hidden">
      <Sidebar isOpen={isOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-12 bg-[#1a0033] flex items-center px-4 border-b border-white/10 shadow-md">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2 hover:bg-white/10 rounded-lg">
            <span className="text-xl">☰</span>
          </button>
          <div className="ml-auto bg-[#1e2225] px-3 py-1 rounded-full text-yellow-500 font-bold text-xs">
            💰 256.375.664
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-white text-black">
          {children}
        </main>
      </div>
    </div>
  );
}