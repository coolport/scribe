import { useState, type ChangeEvent, type FormEvent } from "react";

interface Note {
  id: number;
  content: string;
}

function MyChatBox() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [userNoteString, setUserNoteString] = useState<string>('');

  const testOut = (): void => {
    console.log(notes)
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
    <div>
      {note.content}
      <button>Delete</button>
    </div>
  </li>)

  return (
    <>
      <div>
        <ul>
          {listMap}
        </ul>
      </div>
      <div>
        MyNotes
        <form
          onSubmit={(e: FormEvent<HTMLFormElement>): void => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <textarea
            value={userNoteString}
            placeholder="Enter note"
            onChange={(e: ChangeEvent<HTMLTextAreaElement>): void => {
              const value = e.target.value;
              setUserNoteString(value);
              console.log(value);
            }}
          ></textarea>
          <button
            type="submit"
          >Submit</button>
        </form>
      </div>
      <div>
        <button
          onClick={testOut}


        >log notes[]</button>
      </div>
    </>

  )
}

export default MyChatBox;
