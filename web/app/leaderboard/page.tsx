import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import LeaderboardContent from "./leaderboard-content";

// Mock data - replace with actual API/database call
const mockLeaderboardData = [
  {
    rank: 1,
    name: "teddy1",
    wpm: 251.37,
    accuracy: 98.13,
    raw: 256.98,
    consistency: 88.2,
    date: "29 Dec 2025",
  },
  {
    rank: 2,
    name: "CJasonP",
    wpm: 251.18,
    accuracy: 98.17,
    raw: 262.38,
    consistency: 92.56,
    date: "25 Aug 2024",
  },
  {
    rank: 3,
    name: "nofap",
    wpm: 250.38,
    accuracy: 99.06,
    raw: 254.38,
    consistency: 90.53,
    date: "01 Oct 2025",
  },
  {
    rank: 4,
    name: "colamck",
    wpm: 250.37,
    accuracy: 100.0,
    raw: 250.37,
    consistency: 91.63,
    date: "24 Apr 2025",
  },
  {
    rank: 5,
    name: "henryyy",
    wpm: 250.35,
    accuracy: 99.06,
    raw: 255.95,
    consistency: 95.26,
    date: "22 Feb 2025",
  },
  {
    rank: 6,
    name: "escapism",
    wpm: 250.07,
    accuracy: 100.0,
    raw: 250.07,
    consistency: 93.03,
    date: "07 Aug 2022",
  },
  {
    rank: 7,
    name: "lcj",
    wpm: 249.57,
    accuracy: 98.75,
    raw: 255.17,
    consistency: 93.25,
    date: "27 Aug 2025",
  },
  {
    rank: 8,
    name: "MTH_Influensane",
    wpm: 249.52,
    accuracy: 99.06,
    raw: 255.12,
    consistency: 92.04,
    date: "26 Aug 2025",
  },
  {
    rank: 9,
    name: "FamBoy32",
    wpm: 247.99,
    accuracy: 98.46,
    raw: 259.19,
    consistency: 89.47,
    date: "25 May 2025",
  },
  {
    rank: 10,
    name: "speedmaster",
    wpm: 245.82,
    accuracy: 97.23,
    raw: 251.45,
    consistency: 87.15,
    date: "12 Jan 2025",
  },
];

// Server Component - data fetching happens here
export default function Page() {
  // In production, replace with actual database query:
  // const leaderboardData = await prisma.scores.findMany({ ... });
  const leaderboardData = mockLeaderboardData;
  const totalPages = 10; // Calculate from total count

  return (
    <div className="flex h-full w-5/6 flex-col items-center justify-between overflow-hidden">
      <div className="flex w-full flex-1 flex-col overflow-hidden">
        <Navbar />
        <LeaderboardContent
          initialData={leaderboardData}
          totalPages={totalPages}
        />
      </div>
      <Footer />
    </div>
  );
}
