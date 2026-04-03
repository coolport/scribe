import { Link } from "react-router-dom";
import {
  Home,
  Layers3,
  NotebookPen,
  Pause,
  Play,
  PlaySquare,
  Repeat,
  RotateCcw,
  RotateCw,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface WorkspaceSidebarProps {
  videoId: string;
  isLooping: boolean;
  isPlaying: boolean;
  playbackRate: number;
  playbackRates: number[];
  onToggleLoop: () => void;
  onRewind: () => void;
  onPlayPause: () => void;
  onForward: () => void;
  onSetPlaybackRate: (rate: number) => void;
}

const sidebarItems = [
  {
    icon: Home,
    label: "Home",
    to: "/",
  },
  {
    icon: NotebookPen,
    label: "Notes",
    current: true,
  },
  {
    icon: Layers3,
    label: "Workspace",
    current: true,
  },
];

function WorkspaceSidebar({
  videoId,
  isLooping,
  isPlaying,
  playbackRate,
  playbackRates,
  onToggleLoop,
  onRewind,
  onPlayPause,
  onForward,
  onSetPlaybackRate,
}: WorkspaceSidebarProps) {
  return (
    <aside className="hidden lg:flex lg:w-[64px] lg:flex-col lg:items-center lg:gap-3">
      <div className="flex w-full flex-col items-center gap-2 rounded-[24px] border border-white/10 bg-black/25 p-2 backdrop-blur-xl">
        {sidebarItems.map((item) => {
          const Icon = item.icon;

          if (item.to) {
            return (
              <Link
                key={item.label}
                to={item.to}
                className="group flex w-full flex-col items-center gap-1.5 rounded-xl px-1 py-2 text-slate-400 transition-colors hover:bg-white/8 hover:text-white"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-colors group-hover:border-white/20 group-hover:bg-white/10">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <span className="text-[8px] font-semibold uppercase tracking-[0.18em]">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <div
              key={item.label}
              className="group flex w-full flex-col items-center gap-1.5 rounded-xl px-1 py-2 text-white"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-white/12">
                <Icon className="h-3.5 w-3.5" />
              </div>
              <span className="text-[8px] font-semibold uppercase tracking-[0.18em]">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex w-full flex-col items-center gap-2 rounded-[24px] border border-white/10 bg-black/25 p-2 backdrop-blur-xl">
        <div className="flex w-full flex-col items-center gap-1.5 rounded-xl px-1 py-2 text-white">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-white/12">
            <Zap className="h-3.5 w-3.5" />
          </div>
          <span className="text-[8px] font-semibold uppercase tracking-[0.18em]">
            Speed
          </span>
        </div>

        <div className="flex w-full flex-col gap-1">
          {playbackRates.map((rate) => (
            <Button
              key={rate}
              size="sm"
              variant={playbackRate === rate ? "default" : "ghost"}
              onClick={() => onSetPlaybackRate(rate)}
              className={`h-8 w-full rounded-xl px-0 text-[10px] font-bold transition-all ${
                playbackRate === rate
                  ? "bg-white text-black"
                  : "border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              {rate}x
            </Button>
          ))}
        </div>
      </div>

      <div className="flex w-full flex-col items-center gap-2 rounded-[24px] border border-white/10 bg-black/25 p-2 backdrop-blur-xl">
        <div className="flex w-full flex-col items-center gap-1.5 rounded-xl px-1 py-2 text-white">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-white/12">
            <Repeat className="h-3.5 w-3.5" />
          </div>
          <span className="text-[8px] font-semibold uppercase tracking-[0.18em]">
            Loop
          </span>
        </div>

        <Button
          size="sm"
          variant={isLooping ? "default" : "ghost"}
          onClick={onToggleLoop}
          className={`h-8 w-full rounded-xl px-0 text-[10px] font-bold transition-all ${
            isLooping
              ? "bg-white text-black"
              : "border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
          }`}
        >
          {isLooping ? "On" : "Off"}
        </Button>
      </div>

      <div className="flex w-full flex-col items-center gap-2 rounded-[24px] border border-white/10 bg-black/25 p-2 backdrop-blur-xl">
        <Button
          variant="ghost"
          size="icon"
          onClick={onRewind}
          className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>

        <Button
          onClick={onPlayPause}
          className={`h-12 w-12 rounded-2xl shadow-xl transition-all duration-300 ${
            isPlaying ? "bg-white text-black hover:bg-white/90" : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onForward}
          className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
        >
          <RotateCw className="h-4 w-4" />
        </Button>
      </div>

      <a
        href={`https://www.youtube.com/watch?v=${videoId}`}
        target="_blank"
        rel="noreferrer"
        className="group flex w-full flex-col items-center gap-1.5 rounded-[24px] border border-white/10 bg-black/25 px-1 py-3 text-slate-400 backdrop-blur-xl transition-colors hover:border-white/20 hover:text-white"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-colors group-hover:border-white/20 group-hover:bg-white/10">
          <PlaySquare className="h-3.5 w-3.5" />
        </div>
        <span className="max-w-[44px] text-center text-[8px] font-semibold uppercase tracking-[0.18em]">
          Video
        </span>
      </a>
    </aside>
  );
}

export default WorkspaceSidebar;
