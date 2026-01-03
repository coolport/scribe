import { getNoteService } from "./services/noteService";
import { type Note } from "./services/noteContract";
import { useParams } from "react-router";
import { Menu, ArrowRight } from "lucide-react";
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
  const { isAuthenticated, user, logout, jwt } = useAuth(); // Use the auth hook

  // Get the appropriate note service based on authentication status
  const noteService = getNoteService(isAuthenticated, jwt);

  useEffect(() => {
    const getta = async (): Promise<void> => {
      const lilist = await noteService.getNotes(vidId);
      setNotes(lilist);
    };
    getta();
  }, [vidId, noteService]); // Add noteService to dependencies

  useEffect(() => {
    const fetchVideoNotes = async () => {
      const allNotes = await noteService.getAllNotes();
      console.log("All notes for side menu:", allNotes);
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
  }, [isMenuOpen, noteService]); // Add noteService to dependencies

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

        // Use setTimeout to scroll after the new note has been rendered
        setTimeout(() => {
          if (notesContainerRef.current) {
            notesContainerRef.current.scrollTop =
              notesContainerRef.current.scrollHeight;
          }
        }, 0);
      } catch (e) {
        console.error("Failed: ", e);
      }
    } else {
      console.log("Empty String");
    }
  };

  const handleDelete = async (id: Note["id"]): Promise<void> => {
    if (id === undefined) {
      console.error("Can't delete note.");
      return;
    }
    try {
      await noteService.deleteNote(id!);
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
    playerRef.current.seekTo(time, true);
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

  const listMap = notes.map((note) => {
    const isEditing = editingNoteId === note.id;
    return (
      <li
        key={note.id}
        className="border-b border-border p-4 transition-colors hover:bg-accent/50 cursor-pointer"
        onClick={(): void => {
          if (!isEditing) seekToTime(note.timestamp);
        }}
      >
        <div className="flex justify-between items-center mb-2">
          <div className="font-semibold text-primary text-sm">
            [{formatTime(note.timestamp)}]
          </div>
          <div className="flex space-x-1 flex-shrink-0">
            {isEditing ? (
              <>
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSave(note.id!);
                  }}
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingNoteId(null);
                  }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(note);
                  }}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 color"
                  onClick={(e): void => {
                    e.stopPropagation();
                    handleDelete(note.id);
                  }}
                >
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
        {isEditing ? (
          <Textarea
            value={editingContent}
            onChange={(e) => setEditingContent(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            autoFocus
          />
        ) : (
          <p className="text-foreground whitespace-pre-wrap">{note.content}</p>
        )}
      </li>
    );
  });

  const menuTitle = isAuthenticated ? "My Saved Videos" : "Local Videos";

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Notes</h2>
        <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(true)}>
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Side Menu */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div
          className={`fixed top-0 right-0 h-full w-[85%] max-w-md bg-background z-50 p-4 transform transition-transform duration-300 ease-in-out ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Menu</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(false)}
            >
              <ArrowRight className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex flex-col space-y-2">
            {isAuthenticated ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Logged in as: {user?.name || user?.email}
                </p>
                <Button onClick={logout}>Logout</Button>
              </>
            ) : (
              <>
                <Button onClick={handleGoogleLogin}>Login with Google</Button>
              </>
            )}
          </div>
          <div className="mt-8">
            <h4 className="font-semibold mb-2">{menuTitle}</h4>
            <ul>
              {videoNotes.map((video) => (
                <li
                  key={video.videoId}
                  className="border-b border-border p-2 text-sm"
                >
                  <a
                    href={`/video/${video.videoId}`}
                    className="flex justify-between items-center"
                  >
                    <span>{video.videoId}</span>
                    <span className="text-muted-foreground">
                      {video.noteCount} notes
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div ref={notesContainerRef} className="flex-grow mt-4 overflow-y-auto">
        <ul>{listMap}</ul>
      </div>
      <div className="mt-4">
        <form
          onSubmit={(e: FormEvent<HTMLFormElement>): void => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <Textarea
            value={userNoteString}
            placeholder="Enter new note..."
            onChange={(e: ChangeEvent<HTMLTextAreaElement>): void => {
              setUserNoteString(e.target.value);
            }}
            onKeyDown={handleKeyDown}
          />
        </form>
      </div>
    </div>
  );
}

export default ChatBox;
