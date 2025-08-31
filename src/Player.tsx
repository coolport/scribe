import { useRef, useEffect, useState } from "react";
import YouTube, { type YouTubeProps } from "react-youtube";
import styles from './styles/Player.module.css'

// Import destructured type YouTubeProps from the pkg. AVOID redefining - it's the point of the pkg.
// we still construct a type PlayerProps with YouTubeProps[] bc 
type PlayerProps = {
  videoId: string | null;
  onReady?: YouTubeProps['onReady'];
  opts?: YouTubeProps['opts'];
}

function Player({ videoId, onReady }: PlayerProps) {
  const playerRef = useRef<any>(null); // For youtube player instance
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    if (videoId) {
      setIsLoading(true);
      setIsReady(false);
    }
  }, [videoId])

  const opts: YouTubeProps['opts'] = {
    height: '390',
    width: '640',
    playerVars: { // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  const onPlayerReady: PlayerProps['onReady'] = (event): void => {
    // Assignemnt here because assign to ref only when it's mounted
    playerRef.current = event.target;

    setIsLoading(false);
    setIsReady(true);

    // For the parent component to pass its own func through the onReady prop
    if (onReady) {
      onReady(event);
    }

    // access to player in all event handlers via event.target under onReady

    // using ref vs event methods.. idk
    // event.target.pauseVideo();
    // playerRef.current.playVideo();  
  }

  const getTimeStamp = (): void => {
    if (!playerRef.current) return;
    const time = playerRef.current.getCurrentTime();
    console.log("TIMESTAMP(s): ", time);
  }

  return <>
    {videoId ?
      <>
        {isLoading && <div className={styles.loader}></div>}
        <YouTube
          videoId={videoId}
          opts={opts}
          onReady={onPlayerReady} />
      </>
      : <p>Enter a link to begin taking notes.</p>
    }

    {/* TODO:  load components only when player has mounted */}
    {isReady && <button onClick={getTimeStamp}>GetTimestamp</button>}
  </>
}

export default Player;
