// Biggest thing learned here is refs p much
import { useEffect, useState, forwardRef } from "react";
import YouTube, { type YouTubeProps } from "react-youtube";

type PlayerProps = {
  videoId: string | null;
  onReady?: YouTubeProps['onReady'];
  onEnd?: YouTubeProps['onEnd'];
  opts?: YouTubeProps['opts'];
}

const Player = forwardRef<YouTube, PlayerProps>(({ videoId, onReady, onEnd, opts }, ref) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    if (videoId) {
      setIsLoading(true);
      // setIsReady(false);
    }
  }, [videoId])

  const defaultOpts: YouTubeProps['opts'] = {
    height: '100%',
    width: '100%',
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
    // setIsReady(true);

    if (onReady) {
      onReady(event);
    }
  }

  return <>
    {videoId ?
      <>
        {isLoading &&
          <div className="w-10 h-10 border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin" />
        }
        <YouTube
          videoId={videoId}
          opts={opts || defaultOpts}
          onReady={onPlayerReady}
          onEnd={onEnd}
          className="absolute top-0 left-0 w-full h-full" />
      </>
      : <p>Error loading video.</p>
    }
  </>
});

export default Player;
