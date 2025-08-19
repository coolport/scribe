import { useState, type ChangeEvent } from "react";

function Todo() {
  const [userInput, setUserInput] = useState<string>('');
  const [list, setList] = useState<string[]>([]);
  const [show, setShow] = useState<boolean>(false);

  const handleSubmit = () => {
    setList(list => [...list, userInput]);
  }

  const showList = (): void => {
    setShow(!show);
    console.log(list);
    console.log(show);
  }

  return (
    <>
      <h3>Todo Stuff</h3>
      <div>
        <form
          onSubmit={(e): void => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <input
            title="yeah"
            onChange={(e: ChangeEvent<HTMLInputElement>): void => {
              const inputValue = e.target.value;
              setUserInput(inputValue);
              console.log(inputValue);
            }}
          />
          <button
            type="submit"
          // onClick={handleSubmit}
          >Submit</button>
        </form>
      </div >
      <div>
        <button
          onClick={showList}
        >Show Entries</button>
        <button>Delete Entries</button>
      </div>
    </>
  )
}
export default Todo;
