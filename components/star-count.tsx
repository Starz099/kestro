"use client";

import { formatStarCount } from "@/lib/helpers/formatters";
import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";
import StarIcon from "./ui/star-icon";

export default function StarCount() {
  const [starCount, setStarCount] = useState<string>("...");

  useEffect(() => {
    const fetchStarCount = async () => {
      try {
        const res = await axios.get(
          "https://api.github.com/repos/Starz099/kestro",
          {
            headers: {
              Accept: "application/vnd.github+json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
              "X-GitHub-Api-Version": "2022-11-28",
            },
          },
        );
        setStarCount(formatStarCount(Number(res.data.stargazers_count)));
      } catch (error) {
        console.error("Failed to fetch star count:", error);
      }
    };

    fetchStarCount();
  }, []);

  return (
    <Link
      href="https://github.com/Starz099/kestro"
      target="_blank"
      className="hover:text-primary flex gap-1 transition-colors"
      aria-label="Star on GitHub"
    >
      <StarIcon className="h-5 w-5" />
      {starCount}
    </Link>
  );
}
