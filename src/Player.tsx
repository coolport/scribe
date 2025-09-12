// Biggest thing learned here is refs p much
import { useEffect, useState, forwardRef } from "react";
import YouTube, { type YouTubeProps } from "react-youtube";
import styles from './styles/Player.module.css'

type PlayerProps = {
  videoId: string | null;
  onReady?: YouTubeProps['onReady'];
  opts?: YouTubeProps['opts'];
}

const Player = forwardRef<any, PlayerProps>(({ videoId, onReady, opts }, ref) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    if (videoId) {
      setIsLoading(true);
      setIsReady(false);
    }
  }, [videoId])

  const defaultOpts: YouTubeProps['opts'] = {
    height: 720,
    width: 1280,
    playerVars: { // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    if (ref && 'current' in ref) {
      ref.current = event.target;
    } else if (typeof ref === 'function') {
      ref(event.target);
    }

    setIsLoading(false);
    setIsReady(true);

    if (onReady) {
      onReady(event);
    }
  }

  const getTimeStamp = (): void => {
    if (ref && 'current' in ref && ref.current) {
      const time = ref.current.getCurrentTime();
      console.log("TIMESTAMP(s): ", time);
    }
  }

  const seekToTime = (): void => {
    if (ref && 'current' in ref && ref.current) {
      const time = ref.current.seekTo(4, true)
      console.log("TIMESTAMP(s): ", time);
    }
  }

  return <>
    {videoId ?
      <>
        {isLoading && <div className={styles.loader}></div>}
        <YouTube
          videoId={videoId}
          opts={opts || defaultOpts}
          onReady={onPlayerReady} />
      </>
      : <p>Enter a link to begin taking notes.</p>
    }
  </>
});

export default Player;
