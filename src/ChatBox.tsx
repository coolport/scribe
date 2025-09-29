import { useEffect, useState, type ChangeEvent, type FormEvent, type RefObject, type KeyboardEvent } from "react";
import formatTime from "./utils/format-time";
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
      <li key={note.id} className="mb-4" onClick={(): void => { if (!isEditing) seekToTime(note.timestamp); }}>
        <Card className="cursor-pointer hover:bg-gray-50">
          <CardHeader className="flex flex-row justify-between items-center p-4">
            <span className="font-semibold text-blue-700">[{formatTime(note.timestamp)}]</span>
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <button onClick={(e) => { e.stopPropagation(); handleSave(note.id!); }} className="px-3 py-1 text-sm text-white bg-blue-700 rounded-md hover:bg-blue-600">Save</button>
                  <button onClick={(e) => { e.stopPropagation(); setEditingNoteId(null); }} className="px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                </>
              ) : (
                <>
                  <button onClick={(e) => { e.stopPropagation(); handleEdit(note); }} className="px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">Edit</button>
                  <button onClick={(e): void => { e.stopPropagation(); handleDelete(note.id); }} className="px-3 py-1 text-sm text-white bg-red-700 rounded-sm hover:bg-red-600">Delete</button>
                </>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4">
            {isEditing ? (
              <Textarea
                value={editingContent}
                onChange={(e) => setEditingContent(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                className="w-full p-2 border rounded-md"
              />
            ) : (
              <p className="text-gray-800">{note.content}</p>
            )}
          </CardContent>
        </Card>
      </li>
    )
  });

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-bold text-gray-800">Notes</h2>
      <div className="flex-grow mt-4 overflow-y-auto">
        <ul className="pr-4">
          {listMap}
        </ul>
      </div>
      <div className="mt-4">
        <form
          onSubmit={(e: FormEvent<HTMLFormElement>): void => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <Textarea
            className="w-full p-2 border rounded-md"
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
  )
}

export default ChatBox;
