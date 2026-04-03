import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { getNoteService } from "./services/noteService";
import { type Note } from "./services/noteContract";
import { youtubeService } from "./services/youtubeService";
import { useAuth } from "./contexts/useAuth";

interface LibraryPanelProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

interface VideoNoteSummary {
  videoId: string;
  noteCount: number;
  title: string;
}

function LibraryPanel({ isOpen, onOpenChange }: LibraryPanelProps) {
  const [videoNotes, setVideoNotes] = useState<VideoNoteSummary[]>([]);
  const [pendingDelete, setPendingDelete] = useState<VideoNoteSummary | null>(null);
  const { isAuthenticated, user, logout, jwt } = useAuth();
  const noteService = getNoteService(isAuthenticated, jwt);

  useEffect(() => {
    const fetchVideoNotes = async () => {
      const allNotes = await noteService.getAllNotes();
      const notesByVideo = allNotes.reduce(
        (acc, note: Note) => {
          acc[note.videoId] = (acc[note.videoId] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      const summaries: VideoNoteSummary[] = await Promise.all(
        Object.entries(notesByVideo).map(async ([videoId, noteCount]) => {
          let title = videoId;

          if (import.meta.env.VITE_YOUTUBE_API_KEY) {
            try {
              const details = await youtubeService.getVideoDetails(videoId);
              if (
                details.title &&
                details.title !== "API Key Missing" &&
                details.title !== "Error Loading Video Details"
              ) {
                title = details.title;
              }
            } catch {
              title = videoId;
            }
          }

          return {
            videoId,
            noteCount,
            title,
          };
        }),
      );

      setVideoNotes(summaries);
    };

    if (isOpen) {
      fetchVideoNotes();
    }
  }, [isOpen, noteService]);

  const handleGoogleLogin = (): void => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
    window.location.href = `${apiUrl}/oauth2/authorization/google`;
  };

  const handleDeleteVideoHistory = async (videoId: string) => {
    const allNotes = await noteService.getAllNotes();
    const notesForVideo = allNotes.filter((note) => note.videoId === videoId);

    await Promise.all(
      notesForVideo
        .filter((note) => note.id !== undefined)
        .map((note) => noteService.deleteNote(note.id!)),
    );

    setVideoNotes((current) => current.filter((video) => video.videoId !== videoId));
    setPendingDelete(null);
  };

  const menuTitle = isAuthenticated ? "My Collection" : "Local History";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-50 flex h-full w-[85%] max-w-sm flex-col border-l border-white/10 bg-slate-950/95 shadow-2xl backdrop-blur-2xl"
          >
            <div className="border-b border-white/10 bg-white/[0.03] p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold tracking-tight text-white">Library</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onOpenChange(false)}
                  className="rounded-full border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="flex-grow space-y-8 overflow-y-auto p-6">
              <section>
                <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
                  Account
                </h4>
                <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                  {isAuthenticated ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 font-bold text-white">
                          {user?.name?.[0] || user?.email?.[0] || "?"}
                        </div>
                        <div className="overflow-hidden">
                          <p className="truncate font-semibold text-white">{user?.name || "User"}</p>
                          <p className="truncate text-xs text-slate-400">{user?.email}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        className="h-9 w-full rounded-full border border-white/10 bg-white/5 text-xs text-slate-200 hover:bg-white/10 hover:text-white"
                        onClick={logout}
                      >
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-slate-400">Sign in to start syncing notes across sessions and devices.</p>
                      <Button className="h-9 w-full rounded-full text-xs" onClick={handleGoogleLogin}>
                        Continue with Google
                      </Button>
                    </div>
                  )}
                </div>
              </section>

              <section>
                <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
                  {menuTitle}
                </h4>
                <div className="space-y-2">
                  {videoNotes.length === 0 ? (
                    <div className="rounded-[22px] border border-dashed border-white/10 bg-white/[0.03] px-4 py-6 text-center">
                      <p className="text-sm italic text-slate-400">No videos saved yet.</p>
                    </div>
                  ) : (
                    videoNotes.map((video) => (
                      <div
                        key={video.videoId}
                        className="flex items-center gap-2 rounded-[22px] border border-white/8 bg-white/[0.03] p-2 transition-colors hover:border-white/15 hover:bg-white/[0.06]"
                      >
                        <Link
                          to={`/video/${video.videoId}`}
                          onClick={() => onOpenChange(false)}
                          className="flex min-w-0 flex-1 items-center justify-between rounded-[16px] p-2"
                        >
                          <div className="flex items-center space-x-3 overflow-hidden">
                            <div className="h-2 w-2 shrink-0 rounded-full bg-white/40" />
                            <div className="min-w-0">
                              <div className="truncate text-sm font-medium text-white">{video.title}</div>
                              <div className="truncate text-[10px] uppercase tracking-[0.18em] text-slate-500">
                                {video.videoId}
                              </div>
                            </div>
                          </div>
                          <span className="ml-2 shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-bold text-slate-300">
                            {video.noteCount}
                          </span>
                        </Link>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setPendingDelete(video)}
                          className="h-8 w-8 shrink-0 rounded-full border border-transparent text-slate-500 hover:border-destructive/20 hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>

            <div className="border-t border-white/10 bg-white/[0.03] p-6">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-slate-500">
                <span>Scribe</span>
                <span>Library View</span>
              </div>
            </div>

            <AnimatePresence>
              {pendingDelete ? (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/45 backdrop-blur-sm"
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className="absolute inset-x-4 bottom-4 rounded-[24px] border border-white/10 bg-slate-950/95 p-5 shadow-2xl"
                  >
                    <div className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                      Confirm deletion
                    </div>
                    <h4 className="mt-2 text-base font-semibold text-white">
                      Delete this history entry?
                    </h4>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                      This will remove all saved notes for{" "}
                      <span className="text-slate-200">{pendingDelete.title}</span>.
                    </p>
                    <div className="mt-4 flex items-center justify-end gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setPendingDelete(null)}
                        className="rounded-full border border-white/10 bg-white/5 px-4 text-slate-200 hover:bg-white/10 hover:text-white"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={() => void handleDeleteVideoHistory(pendingDelete.videoId)}
                        className="rounded-full bg-destructive px-4 text-white hover:bg-destructive/90"
                      >
                        Delete
                      </Button>
                    </div>
                  </motion.div>
                </>
              ) : null}
            </AnimatePresence>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export default LibraryPanel;
