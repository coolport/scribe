import { useState, type ChangeEvent, type FormEvent, useRef } from 'react';
import styles from './styles/Home.module.css'
import Player from './Player';
import ChatBox from './ChatBox';
import extractYouTubeDetails from './utils/extract-id';

function Home() {
  const [formValue, setFormValue] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const playerRef = useRef<any>(null);

  const handleSubmit = (): void => {
    const finalUrl = extractYouTubeDetails(formValue || '');
    console.log("Parsed URL: ", finalUrl);
    setUrl(finalUrl);
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
              }}
            />
            <button
              type='submit'
            >Enter</button>
          </form>
          <div id="playerContainer">
            <Player videoId={url} ref={playerRef}></Player>
          </div>
        </div>

        <div className={styles.right}>
          <div>
            <ChatBox playerRef={playerRef} />
          </div>

        </div>
      </div >
    </>
  )
}
export default Home;
