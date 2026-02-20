"use client";

import { useEffect } from "react";
import posthog from "../lib/posthog";

export default function Tracker() {
  useEffect(() => {
    posthog.capture("landing_page_viewed");
  }, []);

  return null;
}
