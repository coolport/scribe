import { useState, type ChangeEvent, type FormEvent } from 'react';
import styles from './styles/Index.module.css'
import Player from './Player';

//TODO: 
//Validation, etc.
//Loading screens (player mounting etc)
//FIX: 
//Check if player is loaded/has video (clicking submit while playing etc)


function Index() {
  const [formValue, setFormValue] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);

  const handleSubmit = (): void => {
    setUrl(formValue);
    console.log("URL VALUE b4 clear: ", formValue);
    setFormValue('');
    console.log("Submitted Form");
  }

  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.left}>

          <p>Enter YouTube Link</p>
          <form
            onSubmit={(e: FormEvent<HTMLFormElement>): void => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <input
              value={formValue ?? ''}
              onChange={(e: ChangeEvent<HTMLInputElement>): void => {
                const inputValue = e.target.value;
                setFormValue(inputValue);
                console.log(formValue);
              }}
            />
            <button
              type='submit'
            >Enter</button>
          </form>
          <div id="playerContainer">
            {/* HXU5Rxc3vBQ */}
            {/* <Player url={"HXU5Rxc3vBQ"}></Player> */}
            <Player videoId={url} ></Player>
          </div>
        </div>


        <div className={styles.right}>
          <h3>Notes</h3>
          <div
            className={styles.rightTextContainer}
          >
            Placeholder
            HXU5Rxc3vBQ
            yfrbeCFQ65w
          </div>
        </div>
      </div >
    </>
  )
}
export default Index;
