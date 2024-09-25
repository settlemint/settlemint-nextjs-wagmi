"use client"

import { AttestationsTableView } from "../../components/AttestationsTableView";
import { NavBar } from "../../components/NavBar";

export default function BrowsePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#1A1A1A] font-light">
      <NavBar />
      <main className="flex-grow container mx-auto my-12 px-4">
        <AttestationsTableView />
      </main>

      <footer className="bg-[#333333] text-white py-4 mt-auto">
        <div className="container mx-auto text-center text-sm">
          &copy; 2024 Coffee Batch Tracker. All rights reserved.
        </div>
      </footer>
    </div>
  );
}