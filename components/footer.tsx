import Link from "next/link";
import Github from "@/components/svgs/Github";
import Mail from "@/components/svgs/Mail";

const Footer = () => {
  return (
    <div className="text-muted-foreground flex h-8 w-full items-center justify-between border-t px-4 text-xs">
      <div className="flex items-center gap-4">
        <Link
          href="https://github.com/Starz099/kestro"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary flex items-center gap-1.5 transition-colors"
          aria-label="GitHub"
        >
          <Github className="h-4 w-4" />
          <span>Github</span>
        </Link>
        <Link
          href="https://starzz.dev/contact"
          target="_blank"
          className="hover:text-primary flex items-center gap-1.5 transition-colors"
          aria-label="Contact"
        >
          <Mail className="h-4 w-4" />
          <span>Contact</span>
        </Link>
      </div>
      <div className="text-xs">
        <Link
          href="https://starzz.dev/"
          target="_blank"
          className="hover:text-primary flex items-center gap-1.5 transition-colors"
          aria-label="Contact"
        >
          made with ❤ by starz
        </Link>
      </div>
    </div>
  );
};

export default Footer;
