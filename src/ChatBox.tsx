import { useState, type ChangeEvent, type FormEvent, type RefObject, type KeyboardEvent } from "react";
import styles from './styles/ChatBox.module.css';
import formatTime from "./utils/format-time";

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

  const handleCardButton = (timestamp: Note['timestamp']): void => {
    console.log(timestamp)
  }

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
    <button className={styles.cardNote} onClick={(): void => {
      // handleCardButton(note.timestamp);
      seekToTime(note.timestamp);
    }}>
      <li key={note.id}>
        <div>
          <span>[{formatTime(note.timestamp)}]</span> {note.content}
          <button
            onClick={(): void => {
              handleDelete(note.id)
            }}
          >Delete</button>
        </div>
      </li>
    </button >
  ));


  return (
    <>
      <div className={styles.chatBoxContainer}>
        Notes
        <form
          onSubmit={(e: FormEvent<HTMLFormElement>): void => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <textarea
            className={styles.textarea}
            value={userNoteString}
            placeholder="Enter new note"
            onChange={(e: ChangeEvent<HTMLTextAreaElement>): void => {
              const value = e.target.value;
              setUserNoteString(value);
            }}
            onKeyDown={handleKeyDown}
          ></textarea>
          {/* <button */}
          {/*   className={styles.button} */}
          {/*   type="submit" */}
          {/* >Submit</button> */}
        </form>
      </div>
      <div className={styles.cardsContainer}>
        <ul className={styles.notesListContainer}>
          {listMap}
        </ul>
      </div>
    </>

  )
}

export default ChatBox;
