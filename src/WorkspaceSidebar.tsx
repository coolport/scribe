import { Link } from "react-router-dom";
import { Home, Layers3, NotebookPen, PlaySquare } from "lucide-react";

interface WorkspaceSidebarProps {
  videoId: string;
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

function WorkspaceSidebar({ videoId }: WorkspaceSidebarProps) {
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
