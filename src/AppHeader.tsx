import { Link } from "react-router-dom";
import { Home, PlaySquare, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppHeaderProps {
  eyebrow?: string;
  title?: string;
  detail?: string;
}

function AppHeader({ eyebrow = "Precision video notes", title = "Scribe", detail }: AppHeaderProps) {
  return (
    <header className="relative z-30 w-full">
      <div className="flex w-full items-center justify-between px-3 py-3 md:px-4 md:py-3.5">
        <Link
          to="/"
          className="group flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5 backdrop-blur-xl transition-colors hover:border-white/20 hover:bg-white/10"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-950 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400">
              {eyebrow}
            </div>
            <div className="text-[13px] font-semibold text-white">{title}</div>
          </div>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {detail ? (
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
              {detail}
            </div>
          ) : null}
          <Button
            asChild
            variant="ghost"
            className="h-9 rounded-full border border-white/10 bg-white/5 px-3 text-slate-200 hover:bg-white/10 hover:text-white"
          >
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              New Session
            </Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="h-9 rounded-full border border-white/10 bg-white/5 px-3 text-slate-200 hover:bg-white/10 hover:text-white"
          >
            <a href="https://youtube.com" target="_blank" rel="noreferrer">
              <PlaySquare className="mr-2 h-4 w-4" />
              YouTube
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
