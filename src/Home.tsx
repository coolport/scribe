import { useRef, useState } from 'react';
import Player from './Player';
import ChatBox from './ChatBox';
import ChapterBar from './ChapterBar';
import { useParams } from 'react-router';
import { Button } from '@/components/ui/button';
import type { YouTube } from 'react-youtube';
import { motion } from 'framer-motion';
import { 
  RotateCcw, 
  RotateCw, 
  Play, 
  Pause, 
  Repeat, 
  Settings2, 
  Clock,
  Zap
} from 'lucide-react';

function Home() {
  const playerRef = useRef<YouTube>(null);
  const params = useParams();
  const vidUrl = params.videoUrl || '';
  const [duration, setDuration] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  const onPlayerReady = (event: { target: YouTube }) => {
    setDuration(event.target.getDuration());
    setIsPlaying(true); // YouTube starts playing automatically based on our opts
  };

  const onPlayerEnd = () => {
    if (isLooping) {
      playerRef.current?.seekTo(0, true);
    } else {
      setIsPlaying(false);
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
        setIsPlaying(false);
      } else { // Paused, cued, etc.
        playerRef.current.playVideo();
        setIsPlaying(true);
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
      setPlaybackRate(rate);
    }
  };

  const playbackRates = [0.75, 1, 1.25, 1.5, 2];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col md:flex-row w-full h-screen bg-slate-950 overflow-hidden"
    >
      <div className="w-full md:w-[70%] flex flex-col items-stretch justify-start bg-black/40 relative">
        <div className="relative w-full flex-shrink-0 shadow-2xl z-10" style={{ aspectRatio: '16 / 9' }}>
          <Player videoId={vidUrl} ref={playerRef} onReady={onPlayerReady} onEnd={onPlayerEnd} />
        </div>

        <div className="flex flex-col flex-grow min-h-0 bg-slate-900/50 backdrop-blur-md">
          <ChapterBar videoId={vidUrl} playerRef={playerRef} duration={duration} />
          
          <div className="p-6 flex flex-col items-center justify-center space-y-8 flex-grow">
            {/* Primary Controls */}
            <div className="flex items-center space-x-8">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleRewind}
                className="h-12 w-12 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-all"
              >
                <RotateCcw className="h-6 w-6" />
              </Button>

              <Button 
                onClick={handlePlayPause}
                className={`h-16 w-16 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                  isPlaying ? "bg-white text-black hover:bg-white/90" : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {isPlaying ? <Pause className="h-8 w-8 fill-current" /> : <Play className="h-8 w-8 fill-current ml-1" />}
              </Button>

              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleForward}
                className="h-12 w-12 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-all"
              >
                <RotateCw className="h-6 w-6" />
              </Button>
            </div>

            {/* Secondary Controls */}
            <div className="flex flex-wrap justify-center gap-4 max-w-md">
              <div className="flex items-center bg-white/5 rounded-full p-1 border border-white/10">
                <div className="px-3 text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center">
                  <Repeat className="h-3 w-3 mr-2" />
                  Loop
                </div>
                <Button 
                  size="sm" 
                  variant={isLooping ? 'default' : 'ghost'} 
                  onClick={handleToggleLoop}
                  className={`h-7 px-4 rounded-full text-[10px] font-bold transition-all ${
                    isLooping ? "bg-primary shadow-lg" : "hover:bg-white/10"
                  }`}
                >
                  {isLooping ? "ACTIVE" : "OFF"}
                </Button>
              </div>

              <div className="flex items-center bg-white/5 rounded-full p-1 border border-white/10">
                <div className="px-3 text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center">
                  <Zap className="h-3 w-3 mr-2" />
                  Speed
                </div>
                <div className="flex space-x-1">
                  {playbackRates.map(rate => (
                    <Button 
                      key={rate}
                      size="sm" 
                      variant={playbackRate === rate ? 'default' : 'ghost'} 
                      onClick={() => handleSetPlaybackRate(rate)}
                      className={`h-7 w-10 p-0 rounded-full text-[10px] font-bold transition-all ${
                        playbackRate === rate ? "bg-white text-black" : "hover:bg-white/10 text-white/60"
                      }`}
                    >
                      {rate}x
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between text-[10px] font-medium text-white/20 uppercase tracking-[0.3em]">
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-2" />
              Precision Documenting
            </div>
            <div className="flex items-center">
              <Settings2 className="h-3 w-3 mr-2" />
              Scribe Engine v1
            </div>
          </div>
        </div>
      </div>

      <motion.div 
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="w-full md:w-[30%] p-4 bg-slate-900 border-t md:border-t-0 md:border-l border-white/10 flex flex-col flex-grow min-h-0 relative z-20"
      >
        <ChatBox playerRef={playerRef} />
      </motion.div>
    </motion.div>
  )
}

export default Home;
