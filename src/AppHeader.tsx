import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "./contexts/useAuth";

interface AppHeaderProps {
  title?: string;
  detail?: string;
  onOpenMenu?: () => void;
  searchValue?: string;
  onSearchValueChange?: (value: string) => void;
  onSearchSubmit?: () => void;
}

function AppHeader({
  title = "Scribe",
  detail,
  onOpenMenu,
  searchValue,
  onSearchValueChange,
  onSearchSubmit,
}: AppHeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchCloseTimerRef = useRef<number | null>(null);
  const { isAuthenticated, user } = useAuth();

  const handleGoogleLogin = () => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
    window.location.href = `${apiUrl}/oauth2/authorization/google`;
  };

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
            <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-white/5 shadow-sm">
              <img
                src="/scroll_icon_main.png"
                alt=""
                className="h-6 w-6 object-contain"
              />
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
                placeholder="Paste a new YouTube link"
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
            variant="ghost"
            onClick={isAuthenticated ? undefined : handleGoogleLogin}
            className="h-9 rounded-full border border-white/10 bg-white/5 px-3 text-slate-200 hover:bg-white/10 hover:text-white"
          >
            <span className="mr-2 flex h-4 w-4 items-center justify-center">
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.2-.9 2.2-1.9 2.9l3.1 2.4c1.8-1.7 2.9-4.1 2.9-7 0-.7-.1-1.4-.2-2H12z" />
                <path fill="#34A853" d="M12 22c2.6 0 4.8-.9 6.4-2.5l-3.1-2.4c-.9.6-2 .9-3.3.9-2.5 0-4.6-1.7-5.4-3.9l-3.2 2.5C5 19.8 8.2 22 12 22z" />
                <path fill="#FBBC05" d="M6.6 14.1c-.2-.6-.3-1.3-.3-2.1s.1-1.4.3-2.1L3.4 7.4C2.8 8.7 2.5 10.3 2.5 12s.3 3.3.9 4.6l3.2-2.5z" />
                <path fill="#4285F4" d="M12 5.9c1.4 0 2.7.5 3.6 1.4l2.7-2.7C16.8 3.1 14.6 2 12 2 8.2 2 5 4.2 3.4 7.4l3.2 2.5c.8-2.3 2.9-4 5.4-4z" />
              </svg>
            </span>
            {isAuthenticated ? user?.name || user?.email || "Signed in" : "Sign in"}
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
