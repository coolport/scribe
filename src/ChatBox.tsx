import { getNoteService } from "./services/noteService";
import { type Note } from "./services/noteContract";
import { useParams, Link } from "react-router";
import { Menu, X, ChevronRight, Trash2, Edit3, Save, RotateCcw } from "lucide-react";
import YouTube from "react-youtube";
import { useAuth } from "./contexts/AuthContext";
import formatTime from "./utils/format-time";
import extractYouTubeDetails from "./utils/extract-id";
import {
  useState,
  useRef,
  useEffect,
  type RefObject,
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";

interface ChatBoxProps {
  playerRef: RefObject<YouTube>;
}

interface VideoNoteSummary {
  videoId: string;
  noteCount: number;
}

function ChatBox({ playerRef }: ChatBoxProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [userNoteString, setUserNoteString] = useState<string>("");
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [videoNotes, setVideoNotes] = useState<VideoNoteSummary[]>([]);
  const notesContainerRef = useRef<HTMLDivElement>(null);

  const params = useParams();
  const rawVidId = params.videoUrl || "";
  const vidId = extractYouTubeDetails(rawVidId) || rawVidId;
  const { isAuthenticated, user, logout, jwt } = useAuth();

  const noteService = getNoteService(isAuthenticated, jwt);

  useEffect(() => {
    const fetchNotes = async (): Promise<void> => {
      const list = await noteService.getNotes(vidId);
      setNotes(list);
    };
    fetchNotes();
  }, [vidId, noteService]);

  useEffect(() => {
    const fetchVideoNotes = async () => {
      const allNotes = await noteService.getAllNotes();
      const notesByVideo = allNotes.reduce(
        (acc, note) => {
          acc[note.videoId] = (acc[note.videoId] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      const summaries: VideoNoteSummary[] = Object.entries(notesByVideo).map(
        ([videoId, noteCount]) => ({
          videoId,
          noteCount,
        }),
      );
      setVideoNotes(summaries);
    };

    if (isMenuOpen) {
      fetchVideoNotes();
    }
  }, [isMenuOpen, noteService]);

  const handleSubmit = async (): Promise<void> => {
    if (userNoteString.trim()) {
      try {
        const currentTime = playerRef.current
          ? await playerRef.current.getCurrentTime()
          : 0;
        const newNote = await noteService.addNote({
          videoId: vidId,
          content: userNoteString,
          timestamp: Math.floor(currentTime),
        });
        setNotes((prev) => [...prev, newNote]);
        setUserNoteString("");

        setTimeout(() => {
          if (notesContainerRef.current) {
            notesContainerRef.current.scrollTo({
              top: notesContainerRef.current.scrollHeight,
              behavior: "smooth",
            });
          }
        }, 100);
      } catch (e) {
        console.error("Failed: ", e);
      }
    }
  };

  const handleDelete = async (id: Note["id"]): Promise<void> => {
    if (id === undefined) return;
    try {
      await noteService.deleteNote(id);
      setNotes(notes.filter((note: Note) => note.id !== id));
    } catch (e) {
      console.error("Failed to delete: ", e);
    }
  };

  const handleUpdateNote = async (id: number, content: string) => {
    try {
      const updatedNote = await noteService.updateNote(id, { content });
      setNotes(notes.map((note) => (note.id === id ? updatedNote : note)));
    } catch (error) {
      console.error("Failed to update note:", error);
    }
  };

  const handleEdit = (note: Note) => {
    setEditingNoteId(note.id!);
    setEditingContent(note.content);
  };

  const handleSave = (id: number) => {
    handleUpdateNote(id, editingContent);
    setEditingNoteId(null);
    setEditingContent("");
  };

  const seekToTime = (time: Note["timestamp"]): void => {
    if (playerRef.current) {
      playerRef.current.seekTo(time, true);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleGoogleLogin = (): void => {
    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    window.location.href = `${apiUrl}/oauth2/authorization/google`;
  };

  const menuTitle = isAuthenticated ? "My Collection" : "Local History";

  return (
    <div className="flex flex-col h-full bg-card rounded-xl overflow-hidden shadow-sm border border-border/40">
      <div className="flex justify-between items-center px-4 py-3 border-b border-border/40 bg-muted/30">
        <div className="flex flex-col">
          <h2 className="text-lg font-bold text-foreground tracking-tight">Notes</h2>
          <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
            {notes.length} observations
          </span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsMenuOpen(true)}
          className="hover:bg-accent/80 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Side Menu with Framer Motion */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-background z-50 shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-center p-6 border-b border-border/40">
                <h3 className="text-xl font-bold tracking-tight">Library</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="flex-grow overflow-y-auto p-6 space-y-8">
                <section>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Account</h4>
                  <div className="bg-muted/30 rounded-xl p-4 border border-border/40">
                    {isAuthenticated ? (
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {user?.name?.[0] || user?.email?.[0] || "?"}
                          </div>
                          <div className="overflow-hidden">
                            <p className="font-semibold truncate">{user?.name || "User"}</p>
                            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                          </div>
                        </div>
                        <Button variant="outline" className="w-full text-xs h-8" onClick={logout}>Sign Out</Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">Sync your notes across devices.</p>
                        <Button className="w-full text-xs h-9" onClick={handleGoogleLogin}>Continue with Google</Button>
                      </div>
                    )}
                  </div>
                </section>

                <section>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">{menuTitle}</h4>
                  <div className="space-y-2">
                    {videoNotes.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic px-2">No videos saved yet.</p>
                    ) : (
                      videoNotes.map((video) => (
                        <Link
                          key={video.videoId}
                          to={`/video/${video.videoId}`}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors border border-transparent hover:border-border/40"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 rounded-full bg-primary/40" />
                            <span className="text-sm font-medium">{video.videoId}</span>
                          </div>
                          <span className="text-[10px] font-bold bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                            {video.noteCount}
                          </span>
                        </Link>
                      ))
                    )}
                  </div>
                </section>
              </div>

              <div className="p-6 border-t border-border/40 bg-muted/10">
                <p className="text-[10px] text-center text-muted-foreground uppercase tracking-[0.2em]">Scribe v1.0</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div 
        ref={notesContainerRef} 
        className="flex-grow overflow-y-auto px-2 py-2 space-y-1 scroll-smooth scrollbar-thin scrollbar-thumb-border"
      >
        <AnimatePresence initial={false}>
          {notes.map((note) => {
            const isEditing = editingNoteId === note.id;
            return (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                layout
                className={`group relative rounded-lg border transition-all duration-200 ${
                  isEditing 
                    ? "border-primary/40 bg-primary/5 shadow-sm" 
                    : "border-transparent hover:border-border/60 hover:bg-accent/30"
                }`}
              >
                <div 
                  className="p-3 cursor-pointer"
                  onClick={(): void => {
                    if (!isEditing) seekToTime(note.timestamp);
                  }}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[11px] font-bold text-primary px-2 py-0.5 bg-primary/10 rounded-full tracking-tighter">
                      {formatTime(note.timestamp)}
                    </span>
                    <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      {isEditing ? (
                        <div className="flex space-x-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-green-600 hover:text-green-700 hover:bg-green-100"
                            onClick={(e) => { e.stopPropagation(); handleSave(note.id!); }}
                          >
                            <Save className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={(e) => { e.stopPropagation(); setEditingNoteId(null); }}
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex space-x-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            onClick={(e) => { e.stopPropagation(); handleEdit(note); }}
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            onClick={(e): void => { e.stopPropagation(); handleDelete(note.id); }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {isEditing ? (
                    <div className="mt-2" onClick={(e) => e.stopPropagation()}>
                      <Textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        className="min-h-[80px] text-sm bg-background border-primary/20 focus-visible:ring-1 focus-visible:ring-primary/30"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <p className="text-sm text-foreground/90 leading-relaxed font-sans mt-1">
                      {note.content}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {notes.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center opacity-20 py-20 grayscale">
            <Edit3 className="h-12 w-12 mb-4" />
            <p className="text-sm font-medium">Start documenting...</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border/40 bg-muted/10">
        <form
          onSubmit={(e: FormEvent<HTMLFormElement>): void => {
            e.preventDefault();
            handleSubmit();
          }}
          className="relative"
        >
          <Textarea
            value={userNoteString}
            placeholder="Capture a thought..."
            className="pr-12 min-h-[100px] resize-none border-border/60 focus:border-primary/50 transition-all duration-300 bg-background/50 backdrop-blur-sm"
            onChange={(e: ChangeEvent<HTMLTextAreaElement>): void => {
              setUserNoteString(e.target.value);
            }}
            onKeyDown={handleKeyDown}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!userNoteString.trim()}
            className={`absolute bottom-3 right-3 h-8 w-8 rounded-full transition-all duration-500 ${
              userNoteString.trim() ? "opacity-100 scale-100" : "opacity-0 scale-90"
            }`}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </form>
        <p className="mt-2 text-[10px] text-center text-muted-foreground">
          Press <kbd className="px-1 py-0.5 rounded bg-muted border border-border/60">Enter</kbd> to save
        </p>
      </div>
    </div>
  );
}

export default ChatBox;
