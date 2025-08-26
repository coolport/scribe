import YouTube, { type YouTubeProps } from "react-youtube";

// Import destructured type YouTubeProps from the pkg. AVOID redefining - it's the point of the pkg.
interface PlayerProps {
  videoId: string | null;
  onReady?: YouTubeProps['onReady']; // Optional, with fallback
}

// function Example() {
//   const onPlayerReady: YouTubeProps['onReady'] = (event) => {
//     // access to player in all event handlers via event.target
//     event.target.pauseVideo();
//   }

function Player({ videoId, onReady }: PlayerProps) {
  function onReadyHandler(): void {
    console.log("Ready")
  }

  return <>
    {videoId ? <YouTube videoId={videoId} onReady={onReady ?? onReadyHandler} /> : <p>URL is NULL</p>}
  </>
}

export default Player;
