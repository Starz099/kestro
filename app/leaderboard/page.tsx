"use client";

import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import LeaderboardContent from "./leaderboard-content";

export default function Page() {
  return (
    <div className="flex h-full w-5/6 flex-col items-center justify-between overflow-hidden">
      <div className="flex w-full flex-1 flex-col overflow-hidden">
        <Navbar />
        <LeaderboardContent initialData={[]} />
      </div>
      <Footer />
    </div>
  );
}
