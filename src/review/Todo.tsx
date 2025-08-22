import { useEffect, useState, type ChangeEvent } from "react";

function Todo() {
  const [userInput, setUserInput] = useState<string>('');
  const [list, setList] = useState<string[]>([]);
  const [show, setShow] = useState<boolean>(false);

  const [selectedCheckbox, setSelectedCheckbox] = useState<string[]>([]);
  const [isChecked, setIsChecked] = useState<boolean>(false);


  useEffect(() => {
    console.log("Updated selectedCheckbox:", selectedCheckbox);
  }, [selectedCheckbox]);


  // const listItems = list.map( listItem => <li>{listItem}</li>);
  const listItems = list.map((listItem, index) => {
    return <>
      <div
        key={index} //key uppermost
      >
        <input
          type="checkbox"
          value={listItem}
          id="inputDiv"
          checked={selectedCheckbox.includes(listItem)} //if checked, its in the checklist, if thats true, return true for checked
          onChange={(e) => {
            const tickValue = e.target.checked;
            setSelectedCheckbox(prev => [...prev, listItem])
            if (selectedCheckbox.includes(listItem))
              setSelectedCheckbox(prev => [...prev, listItem])
            // setIsChecked((tickValue) => {
            //   tickValue ? setIsChecked(false) : setIsChecked(true)
            // })
            setIsChecked((tickValue) => !tickValue) //pwede pala to if functional, pero setIsChecked(!tickValue) nope
            console.log("e value: ", tickValue);
          }}
        />
        <label htmlFor="inputDiv">{listItem}</label>
      </div>
    </>
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
