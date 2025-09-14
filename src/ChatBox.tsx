import { useEffect, useState, type ChangeEvent, type FormEvent, type RefObject, type KeyboardEvent } from "react";
import formatTime from "./utils/format-time";
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "./components/ui/card";
import noteService from "./services/noteService";
import { type Note } from "./services/noteContract";
import { useParams } from "react-router";

interface ChatBoxProps {
  playerRef: RefObject<any>;
}

function ChatBox({ playerRef }: ChatBoxProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [userNoteString, setUserNoteString] = useState<string>('');
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState<string>('');

  const params = useParams();
  const vidId = params.videoUrl || '';

  useEffect(() => {
    const getta = async (): Promise<void> => {
      const lilist = await noteService.getNotes(vidId)
      setNotes(lilist);
    }
    getta();
  }, [vidId])

  const handleSubmit = async (): Promise<void> => {
    if (userNoteString.trim()) {
      try {

        const currentTime = playerRef.current ? playerRef.current.getCurrentTime() : 0;
        const newNote = await noteService.addNote({
          videoId: vidId,
          content: userNoteString,
          timestamp: currentTime,
        });
        setNotes(prev => [...prev, newNote]);
        setUserNoteString('');
      } catch (e) {
        console.error("Failed: ", e);
      }
    } else {
      console.log("Empty String");
    }
  }

  const handleDelete = async (id: Note['id']): Promise<void> => {
    if (id === undefined) {
      console.error("Can't delete note.");
      return;
    }
    try {
      console.log("Deleted note with ID: ", id);
      await noteService.deleteNote(id!);
      setNotes(notes.filter((note: Note) => note.id !== id))
    } catch (e) {
      console.error("Failed to delete: ", e)
    }
  }

  const handleUpdateNote = async (id: number, content: string) => {
    try {
      const updatedNote = await noteService.updateNote(id, { content });
      setNotes(notes.map(note => note.id === id ? updatedNote : note));
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
    setEditingContent('');
  };

  const seekToTime = (time: Note['timestamp']): void => {
    playerRef.current.seekTo(time, true);
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };


  const listMap = notes.map(note => {
    const isEditing = editingNoteId === note.id;
    return (
      <li key={note.id} onClick={(): void => { if (!isEditing) seekToTime(note.timestamp); }}>
        <Card>
          <CardHeader>
            <span>[{formatTime(note.timestamp)}]</span>
            <CardAction>
              {isEditing ? (
                <div>
                  <button onClick={(e) => {
                    e.stopPropagation();
                    handleSave(note.id!);
                  }}>Save</button>
                  <button onClick={(e) => {
                    e.stopPropagation();
                    setEditingNoteId(null);
                  }}>Cancel</button>
                </div>
              ) : (
                <div>
                  <button onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(note);
                  }}>Edit</button>
                  <button
                    onClick={(e): void => {
                      e.stopPropagation();
                      handleDelete(note.id);
                    }}
                  >Delete</button>
                </div>
              )}
            </CardAction>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
                onClick={(e) => e.stopPropagation()} // Prevent card's seekToTime
              />
            ) : (
              note.content
            )}
          </CardContent>
        </Card>
      </li >
    )
  });


  return (
    <>
      <div>
        Notes
        <form
          onSubmit={(e: FormEvent<HTMLFormElement>): void => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <Textarea
            className="align-middle"
            value={userNoteString}
            placeholder="Enter new note"
            onChange={(e: ChangeEvent<HTMLTextAreaElement>): void => {
              const value = e.target.value;
              setUserNoteString(value);
            }}
            onKeyDown={handleKeyDown}
          ></Textarea>
        </form>
      </div>
      <div >
        <ul>
          {listMap}
        </ul>
      </div>
    </>
  )
}

export default ChatBox;
