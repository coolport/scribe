import { useRef, useState } from 'react';
import Player from './Player';
import ChatBox from './ChatBox';
import ChapterBar from './ChapterBar';
import { useParams } from 'react-router';
import { Button } from '@/components/ui/button';
import type { YouTubePlayer } from 'react-youtube';

function Home() {
  const playerRef = useRef<any>(null);
  const params = useParams();
  const vidUrl = params.videoUrl || '';
  const [duration, setDuration] = useState(0);
  const [isLooping, setIsLooping] = useState(false);

  const onPlayerReady = (event: { target: YouTubePlayer }) => {
    setDuration(event.target.getDuration());
  };

  const onPlayerEnd = () => {
    if (isLooping) {
      playerRef.current?.seekTo(0, true);
    }
  };

  const handleToggleLoop = () => {
    setIsLooping(prev => !prev);
  };


  const handleRewind = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(currentTime - 5, true);
    }
  };

  const handlePlayPause = () => {
    if (playerRef.current) {
      const playerState = playerRef.current.getPlayerState();
      if (playerState === 1) { // Playing
        playerRef.current.pauseVideo();
      } else { // Paused, cued, etc.
        playerRef.current.playVideo();
      }
    }
  };

  const handleForward = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      playerRef.current.seekTo(currentTime + 5, true);
    }
  };

  const handleSetPlaybackRate = (rate: number) => {
    if (playerRef.current) {
      playerRef.current.setPlaybackRate(rate);
    }
  };


  return (
    <div className="flex flex-col md:flex-row w-full h-screen bg-background overflow-hidden">
      <div className="w-full md:w-[70%] flex flex-col items-stretch justify-start bg-black">
        <div className="relative w-full flex-shrink-0" style={{ aspectRatio: '16 / 9' }}>
          <Player videoId={vidUrl} ref={playerRef} onReady={onPlayerReady} onEnd={onPlayerEnd} />
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[768px]">
            <ChapterBar videoId={vidUrl} playerRef={playerRef} duration={duration} />
            <div className="grid grid-cols-8 gap-2 p-2">
              <Button size="sm" variant="outline" className="text-xs" onClick={handleRewind}>Rewind 5s</Button>
              <Button size="sm" variant="outline" className="text-xs" onClick={handlePlayPause}>Play/Pause</Button>
              <Button size="sm" variant="outline" className="text-xs" onClick={handleForward}>Forward 5s</Button>
              <Button size="sm" variant={isLooping ? 'default' : 'outline'} className="text-xs" onClick={handleToggleLoop}>Loop</Button>
              <Button size="sm" variant="outline" className="text-xs" onClick={() => handleSetPlaybackRate(0.75)}>0.75x</Button>
              <Button size="sm" variant="outline" className="text-xs" onClick={() => handleSetPlaybackRate(1)}>1x</Button>
              <Button size="sm" variant="outline" className="text-xs" onClick={() => handleSetPlaybackRate(1.5)}>1.5x</Button>
              <Button size="sm" variant="outline" className="text-xs" onClick={() => handleSetPlaybackRate(2)}>2x</Button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full md:w-[30%] p-4 bg-card border-t md:border-t-0 md:border-l border-border flex flex-col flex-grow min-h-0">
        <ChatBox playerRef={playerRef} />
      </div>
    </div>
  )
}

export default Home;
