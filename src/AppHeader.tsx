import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Menu, PlaySquare, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppHeaderProps {
  eyebrow?: string;
  title?: string;
  detail?: string;
  onOpenMenu?: () => void;
  searchValue?: string;
  onSearchValueChange?: (value: string) => void;
  onSearchSubmit?: () => void;
}

function AppHeader({
  eyebrow = "Precision video notes",
  title = "Scribe",
  detail,
  onOpenMenu,
  searchValue,
  onSearchValueChange,
  onSearchSubmit,
}: AppHeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchCloseTimerRef = useRef<number | null>(null);

  const scheduleSearchClose = () => {
    if (searchCloseTimerRef.current) {
      window.clearTimeout(searchCloseTimerRef.current);
    }
    searchCloseTimerRef.current = window.setTimeout(() => {
      setIsSearchOpen(false);
    }, 120);
  };

  const cancelSearchClose = () => {
    if (searchCloseTimerRef.current) {
      window.clearTimeout(searchCloseTimerRef.current);
      searchCloseTimerRef.current = null;
    }
  };

  return (
    <header className="relative z-30 w-full">
      <div className="flex w-full items-center justify-between px-3 py-3 md:px-4 md:py-3.5">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="group flex h-9 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2 py-1 backdrop-blur-xl transition-colors hover:border-white/20 hover:bg-white/10"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-950 shadow-sm">
              <Sparkles className="h-3 w-3" />
            </div>
            <div className="min-w-0 text-sm font-semibold text-white">{title}</div>
          </Link>

          {onSearchSubmit && onSearchValueChange ? (
            <form
              onSubmit={(e: FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                onSearchSubmit();
              }}
              onFocus={cancelSearchClose}
              onBlur={scheduleSearchClose}
              className={`flex items-center overflow-hidden rounded-full border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 ${
                isSearchOpen ? "h-9 w-[320px] px-2 py-1" : "h-9 w-9 px-0 py-0"
              }`}
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                  cancelSearchClose();
                  setIsSearchOpen(true);
                }}
                className="h-9 w-9 shrink-0 rounded-full text-slate-200 hover:bg-white/10 hover:text-white"
              >
                <Search className="h-4 w-4" />
              </Button>
              <input
                value={searchValue}
                onChange={(e: ChangeEvent<HTMLInputElement>) => onSearchValueChange(e.target.value)}
                placeholder="Paste a YouTube link"
                className={`bg-transparent text-sm text-white outline-none placeholder:text-slate-500 transition-opacity ${
                  isSearchOpen ? "ml-1 w-full opacity-100" : "w-0 opacity-0"
                }`}
              />
            </form>
          ) : null}
        </div>

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
            <a href="https://youtube.com" target="_blank" rel="noreferrer">
              <PlaySquare className="mr-2 h-4 w-4" />
              YouTube
            </a>
          </Button>
          {onOpenMenu ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={onOpenMenu}
              className="h-9 w-9 rounded-full border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white"
            >
              <Menu className="h-4 w-4" />
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export default AppHeader;
