"use client";

import Crown from "@/components/svgs/Crown";
import Info from "@/components/svgs/Info";
// import User from "@/components/svgs/User";
import Keyboard from "./svgs/Keyboard";
import Link from "next/link";

import { useEffect, useState } from "react";
import StarIcon from "./ui/star-icon";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import axios from "axios";
import { formatStarCount } from "@/lib/helpers/formatters";
const Navbar = () => {
  const [starCount, setStarCount] = useState<string>("...");

  useEffect(() => {
    try {
      const fetchStarCount = async () => {
        const res = (
          await axios.get("https://api.github.com/repos/Starz099/kestro", {
            headers: {
              Accept: "application/vnd.github+json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
              "X-GitHub-Api-Version": "2022-11-28",
            },
          })
        ).data;
        const count = Number(res.stargazers_count);
        setStarCount(formatStarCount(count));
      };

      fetchStarCount();
    } catch (error) {
      console.error("Failed to fetch star count:", error);
    }
  }, []);
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center">
          <div className="font-press-start-2p text-primary text-3xl">
            kestro
          </div>
        </Link>
        <div className="flex items-center gap-6">
          <button
            className="hover:text-primary text-muted-foreground cursor-pointer transition-colors"
            aria-label="Keyboard Shortcuts"
          >
            <Keyboard className="h-5 w-5" />
          </button>
          <Link href="/leaderboard" className="flex items-center">
            <button
              className="hover:text-primary text-muted-foreground cursor-pointer transition-colors"
              aria-label="Leaderboard"
            >
              <Crown className="h-5 w-5" />
            </button>
          </Link>
          <Link href="/about" className="flex items-center">
            <button
              className="hover:text-primary text-muted-foreground cursor-pointer transition-colors"
              aria-label="About"
            >
              <Info className="h-5 w-5" />
            </button>
          </Link>
        </div>
      </div>
      <div className="text-muted-foreground flex items-center gap-6">
        <Link
          href="https://github.com/Starz099/kestro"
          target="_blank"
          className="hover:text-primary flex gap-1 transition-colors"
          aria-label="Star on GitHub"
        >
          <StarIcon className="h-5 w-5" />
          {starCount}
        </Link>

        {/* auth */}
        <SignedOut>
          <SignInButton mode="modal">
            <div className="hover:text-primary cursor-pointer transition-colors">
              Sign In
            </div>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
        {/* <Link href="/auth">
          <button
            className="hover:text-primary text-muted-foreground cursor-pointer transition-colors"
            aria-label="User Profile"
          >
            <User className="h-5 w-5" />
          </button>
        </Link> */}
      </div>
    </div>
  );
};

export default Navbar;
