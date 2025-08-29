import { useRef } from "react";
import YouTube, { type YouTubeProps } from "react-youtube";

// Import destructured type YouTubeProps from the pkg. AVOID redefining - it's the point of the pkg.
// we still construct a type PlayerProps with YouTubeProps[] bc 
type PlayerProps = {
  videoId: string | null;
  onReady?: YouTubeProps['onReady'];
  opts?: YouTubeProps['opts'];
}

function Player({ videoId, onReady }: PlayerProps) {
  const playerRef = useRef<any>(null); // For youtube player instance

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
    {videoId ? <YouTube
      videoId={videoId}
      opts={opts}
      onReady={onReady ?? onPlayerReady} /> : <p>URL is NULL</p>
    }

    {/* TODO:  load components only when player has mounted */}
    <button onClick={getTimeStamp}>GetTimestamp</button>
  </>
}

export default Player;
