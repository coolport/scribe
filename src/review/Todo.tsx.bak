import { useEffect, useState, type ChangeEvent } from "react";

function Todo() {
  const [userInput, setUserInput] = useState<string>('');
  const [list, setList] = useState<string[]>([]);
  const [show, setShow] = useState<boolean>(true);

  const [selectedCheckbox, setSelectedCheckbox] = useState<string[]>([]);
  const [isChecked, setIsChecked] = useState<boolean>(false);


  useEffect(() => {
    console.log("Updated selectedCheckbox:", selectedCheckbox);
  }, [selectedCheckbox]);

  // const listItems = list.map( listItem => <li>{listItem}</li>);
  const listItems = list.map((listItem, index) => {
    const entryId = `checkbox-${listItem}`;
    return <div
      //KEY THEORY: if using a fragment, put it there, basta TOP TOP level talaga. use React.fragment for props/attribs? u cant
      //index bad practice, use an id or wht. in this case lit using the listItem name is better than using the index
      key={listItem}
    >
      <input
        type="checkbox"
        value={listItem}
        // all entries have the same id, lots of problems. put this elsewhere..
        // need dynamic, see const entryId above
        // id="inputDiv"
        id="entryId"
        checked={selectedCheckbox.includes(listItem)} //if checked, its in the checklist, if thats true, return true for checked
        onChange={(e) => {
          const tickValue = e.target.checked;

          if (!selectedCheckbox.includes(listItem)) {
            setSelectedCheckbox(prev => [...prev, listItem])
          } else {
            setSelectedCheckbox(prev => prev.filter(item => item !== listItem)); //run through all items, add to to-be returned filter array if cond is true
          }


          console.log("e value: ", tickValue);
        }}
      />
      <label htmlFor="inputDiv">{listItem}</label>
    </div>
  });

  const handleSubmit = () => {
    setList(list => [...list, userInput]);
    setUserInput('');
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
            value={userInput}
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
      <div>
        {show ? listItems : null}
      </div>
    </>
  )
}
export default Todo;
