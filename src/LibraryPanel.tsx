import { useEffect, useState } from "react";
import { Link } from "react-router";
import { X } from "lucide-react";
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
            className="fixed top-0 right-0 z-50 flex h-full w-[85%] max-w-sm flex-col bg-background shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border/40 p-6">
              <h3 className="text-xl font-bold tracking-tight">Library</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-grow space-y-8 overflow-y-auto p-6">
              <section>
                <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Account
                </h4>
                <div className="rounded-xl border border-border/40 bg-muted/30 p-4">
                  {isAuthenticated ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                          {user?.name?.[0] || user?.email?.[0] || "?"}
                        </div>
                        <div className="overflow-hidden">
                          <p className="truncate font-semibold">{user?.name || "User"}</p>
                          <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                        </div>
                      </div>
                      <Button variant="outline" className="h-8 w-full text-xs" onClick={logout}>
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">Sign in to starting syncing notes.</p>
                      <Button className="h-9 w-full text-xs" onClick={handleGoogleLogin}>
                        Continue with Google
                      </Button>
                    </div>
                  )}
                </div>
              </section>

              <section>
                <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  {menuTitle}
                </h4>
                <div className="space-y-2">
                  {videoNotes.length === 0 ? (
                    <p className="px-2 text-sm italic text-muted-foreground">No videos saved yet.</p>
                  ) : (
                    videoNotes.map((video) => (
                      <Link
                        key={video.videoId}
                        to={`/video/${video.videoId}`}
                        onClick={() => onOpenChange(false)}
                        className="flex items-center justify-between rounded-lg border border-transparent p-3 transition-colors hover:border-border/40 hover:bg-accent/50"
                      >
                        <div className="flex items-center space-x-3 overflow-hidden">
                          <div className="h-2 w-2 shrink-0 rounded-full bg-primary/40" />
                          <div className="min-w-0">
                            <div className="truncate text-sm font-medium">{video.title}</div>
                            <div className="truncate text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                              {video.videoId}
                            </div>
                          </div>
                        </div>
                        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                          {video.noteCount}
                        </span>
                      </Link>
                    ))
                  )}
                </div>
              </section>
            </div>

            <div className="border-t border-border/40 bg-muted/10 p-6">
              <p className="text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Scribe v1.0
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export default LibraryPanel;
