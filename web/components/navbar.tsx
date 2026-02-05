import Crown from "@/components/svgs/Crown";
import Info from "@/components/svgs/Info";
import User from "@/components/svgs/User";
import Keyboard from "./svgs/Keyboard";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="font-press-start-2p text-primary text-3xl">kestro</div>
        <div className="flex items-center gap-3">
          <button
            className="hover:text-primary text-muted-foreground transition-colors"
            aria-label="Keyboard Shortcuts"
          >
            <Keyboard className="h-5 w-5" />
          </button>
          <button
            className="hover:text-primary text-muted-foreground transition-colors"
            aria-label="Leaderboard"
          >
            <Crown className="h-5 w-5" />
          </button>
          <button
            className="hover:text-primary text-muted-foreground transition-colors"
            aria-label="About"
          >
            <Info className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/auth">
          <button
            className="hover:text-primary text-muted-foreground transition-colors"
            aria-label="User Profile"
          >
            <User className="h-5 w-5" />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
