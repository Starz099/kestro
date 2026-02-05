"use client";
import ArrowNarrowLeft from "@/components/svgs/arrow-narrow-left";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRef, useState } from "react";

const Page = () => {
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const username = useRef(null);
  const password = useRef(null);

  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <div className="mb-4 flex flex-col justify-center gap-4">
        <div className="flex gap-2">
          <Link
            href="/"
            className="text-muted-foreground flex items-center gap-2 text-sm"
          >
            <ArrowNarrowLeft className="" />
          </Link>
          {mode === "signIn" ? <>Sign in</> : <>Sign up</>}
        </div>

        <Input
          placeholder="Username"
          ref={username}
          className="text-white"
        ></Input>
        <Input
          placeholder="Password"
          type="password"
          ref={password}
          className="text-white"
        ></Input>
        <Button
          className="cursor-pointer"
          variant="outline"
          onClick={() => {
            //@ts-expect-error - type
            console.log("username: ", username?.current?.value);
            //@ts-expect-error - type
            console.log("password: ", password?.current?.value);
          }}
        >
          Submit
        </Button>
        {mode === "signIn" ? (
          <div className="text-xs">
            Don&apos;t have an account?{" "}
            <Button
              variant="link"
              className="cursor-pointer p-0"
              onClick={() => setMode("signUp")}
            >
              Sign up
            </Button>
          </div>
        ) : (
          <div className="text-xs">
            Already have an account?{" "}
            <span>
              <Button
                variant="link"
                className="cursor-pointer p-0"
                onClick={() => setMode("signIn")}
              >
                Sign in
              </Button>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
