import { useState, type ChangeEvent, type FormEvent } from 'react';
import styles from './styles/Home.module.css'
import Player from './Player';
import ChatBox from './ChatBox';

//TODO: 
//Validation, etc.
//Loading screens (player mounting etc)
//FIX: 
//Check if player is loaded/has video (clicking submit while playing etc)


function Home() {
  const [formValue, setFormValue] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

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
            <Player videoId={url} ></Player>
          </div>
        </div>

        <div className={styles.right}>
          <h3>Notes
            HXU5Rxc3vBQ
            yfrbeCFQ65w
          </h3>

          {/* <div className={styles.rightTextContainer} > */}
          {/*   <ChatBox /> */}
          {/* </div> */}
          <div>
            <div className={styles.loader}></div>
            <ChatBox />
          </div>

        </div>
      </div >
    </>
  )
}
export default Home;
