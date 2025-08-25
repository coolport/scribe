import { useState, type ChangeEvent, type FormEvent } from 'react';
import styles from './styles/Index.module.css'
import Player from './Player';

//TODO: 
//Today: YIPA, no validation, etc. yet, just get it to show
//Tom: Validation, etc.

function Index() {
  const [url, setUrl] = useState<string | null>(null);

  const handleSubmit = (): void => {
    console.log("URL VALUE b4 clear: ", url);
    setUrl('');
    console.log("Submitted Form");
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.left}>

          <p>Enter YouTube Link</p>
          <form
            onSubmit={(e: FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <input
              value={url ?? ''}
              onChange={(e: ChangeEvent<HTMLInputElement>): void => {
                const inputValue = e.target.value;
                setUrl(inputValue);
                console.log(url);
              }}
            />
            <button
              type='submit'
            >Enter</button>
          </form>
          <p>for now</p> <br />
          <div id="playerContainer">
            <Player></Player>
          </div>
        </div>


        <div className={styles.right}>
          Write your notes below..
          <div
            className={styles.rightTextContainer}
          >
            hi
          </div>
        </div>
      </div >
    </>
  )
}
export default Index;
