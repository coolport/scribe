import { useState, type ChangeEvent, type FormEvent, useRef } from 'react';
import styles from './styles/Home.module.css'
import Player from './Player';
import ChatBox from './ChatBox';
import extractYouTubeDetails from './utils/extract-id';
import { useLocation } from 'react-router';

function Home() {
  const [formValue, setFormValue] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const playerRef = useRef<any>(null);

  const location = useLocation();

  const vidUrl = location.state.url;
  console.log("URL from Landing: ", vidUrl);

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

          <div id="playerContainer">
            <Player videoId={vidUrl} ref={playerRef}></Player>
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
