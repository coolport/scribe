import { useState, type ChangeEvent, type FormEvent } from "react";
import styles from './styles/ChatBox.module.css';

interface Note {
  id: number;
  content: string;
}

function MyChatBox() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [userNoteString, setUserNoteString] = useState<string>('');

  const handleDelete = (id: Note['id']): void => {
    console.log(id);
    setNotes(
      notes.filter((note: Note) => note.id !== id)
    )
  }

  const handleSubmit = (): void => {
    // if (userNoteString.trim() === '') return;
    if (userNoteString) {
      setNotes(prev => [...prev, { //type inferred from state decl
        id: Date.now(),
        content: userNoteString,
      }])
      // If not implicitly returning (have return type :Note[]): 
      // setNotes((prev: Note[]): Note[] => {
      //   return [...prev, {
      //     id: Date.now(),
      //     content: userNoteString,
      //   }];
      // })
      setUserNoteString('');
    } else {
      console.log("Empty string.");
    }
  }

  const listMap = notes.map(note => <li>
    <div
      key={note.id}
    >
      {note.content}
      <button
        onClick={(): void => {
          handleDelete(note.id)
        }}
      >Delete</button>

    </div>
  </li>)

  return (
    <>
      <div>
        Enter new note
        <form
          onSubmit={(e: FormEvent<HTMLFormElement>): void => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <textarea
            className={styles.textarea}
            value={userNoteString}
            placeholder="Enter note"
            onChange={(e: ChangeEvent<HTMLTextAreaElement>): void => {
              const value = e.target.value;
              setUserNoteString(value);
              console.log(value);
            }}
          ></textarea>
          <button
            className={styles.button}
            type="submit"
          >Submit</button>
        </form>
      </div>
      <div className={styles.cardsContainer}>
        <ul>
          {listMap}
        </ul>
      </div>
    </>

  )
}

export default MyChatBox;
