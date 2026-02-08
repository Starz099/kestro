"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function AuthButtons() {
  return (
    <>
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
    </>
  );
}
