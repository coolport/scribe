import { useState, type ChangeEvent, type FormEvent, type RefObject, type KeyboardEvent } from "react";
import formatTime from "./utils/format-time";
import { Textarea } from "@/components/ui/textarea"
import { Card } from "./components/ui/card";

interface Note {
  id: number;
  content: string;
  timestamp: number;
}

interface ChatBoxProps {
  playerRef: RefObject<any>;
}

function ChatBox({ playerRef }: ChatBoxProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [userNoteString, setUserNoteString] = useState<string>('');

  const handleDelete = (id: Note['id']): void => {
    console.log(id);
    setNotes(
      notes.filter((note: Note) => note.id !== id)
    )
  }

  const handleSubmit = (): void => {
    if (userNoteString.trim()) {
      const currentTime = playerRef.current ? playerRef.current.getCurrentTime() : 0;
      setNotes(prev => [...prev, {
        id: Date.now(),
        content: userNoteString,
        timestamp: currentTime,
      }]);
      setUserNoteString('');
    } else {
      console.log("Empty string.");
    }
  }


  const seekToTime = (time: Note['timestamp']): void => {
    playerRef.current.seekTo(time, true);
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };


  const listMap = notes.map(note => (
    <li key={note.id} onClick={(): void => { seekToTime(note.timestamp); }}>
      <div>
        <span>[{formatTime(note.timestamp)}]</span> {note.content}
        <button
          onClick={(e): void => {
            e.stopPropagation();
            handleDelete(note.id);
          }}
        >Delete</button>
      </div>
    </li >
  ));


  return (
    <>
      <div >
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
        <Card></Card>
      </div>
    </>

  )
}

export default ChatBox;
