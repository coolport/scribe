import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
  type RefObject,
  type KeyboardEvent,
  useRef,
} from "react";
import formatTime from "./utils/format-time";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "./components/ui/card";
import noteService from "./services/noteService";
import { type Note } from "./services/noteContract";
import { useParams } from "react-router";

interface ChatBoxProps {
  playerRef: RefObject<any>;
}

function ChatBox({ playerRef }: ChatBoxProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [userNoteString, setUserNoteString] = useState<string>("");
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState<string>("");
  const notesContainerRef = useRef<HTMLDivElement>(null);

  const params = useParams();
  const vidId = params.videoUrl || "";

  useEffect(() => {
    if (notesContainerRef.current) {
      notesContainerRef.current.scrollTop =
        notesContainerRef.current.scrollHeight;
    }
  }, [notes]);

  useEffect(() => {
    const getta = async (): Promise<void> => {
      const lilist = await noteService.getNotes(vidId);
      setNotes(lilist);
    };
    getta();
  }, [vidId]);

  const handleSubmit = async (): Promise<void> => {
    if (userNoteString.trim()) {
      try {
        const currentTime = playerRef.current
          ? playerRef.current.getCurrentTime()
          : 0;
        const newNote = await noteService.addNote({
          videoId: vidId,
          content: userNoteString,
          timestamp: currentTime,
        });
        setNotes((prev) => [...prev, newNote]);
        setUserNoteString("");
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
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
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
          <p className="text-foreground whitespace-pre-wrap">
            {note.content}
          </p>
        )}
      </li>
    );
  });

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-bold text-foreground">Notes</h2>
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
