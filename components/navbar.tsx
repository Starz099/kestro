import Crown from "@/components/svgs/Crown";
import Info from "@/components/svgs/Info";
import Keyboard from "./svgs/Keyboard";
import Link from "next/link";
import StarCount from "./star-count";
import AuthButtons from "./auth-buttons";

type NavbarProps = {
  onKeyboardClick?: () => void;
};

export default function Navbar({ onKeyboardClick }: NavbarProps) {
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
            onClick={onKeyboardClick}
            type="button"
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
        <StarCount />
        <AuthButtons />
      </div>
    </div>
  );
}
