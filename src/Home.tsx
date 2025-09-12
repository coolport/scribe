import { useRef } from 'react';
import styles from './styles/Home.module.css'
import Player from './Player';
import ChatBox from './ChatBox';
import { useParams } from 'react-router';

function Home() {
  const playerRef = useRef<any>(null);
  const params = useParams();

  // const vidUrl = location.state.url;
  const vidUrl = params.videoUrl || '';
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
      </div>
    </>
  )
}

export default Home;
