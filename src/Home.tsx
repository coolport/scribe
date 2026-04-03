import { useRef, useState } from 'react';
import Player from './Player';
import ChatBox from './ChatBox';
import ChapterBar from './ChapterBar';
import { useParams } from 'react-router';
import { Button } from '@/components/ui/button';
import { type YouTubePlayer } from 'react-youtube';
import { motion } from 'framer-motion';
import AppHeader from './AppHeader';
import WorkspaceSidebar from './WorkspaceSidebar';
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
  const playerRef = useRef<YouTubePlayer | null>(null);
  const params = useParams();
  const vidUrl = params.videoUrl || '';
  const displayVideoId = vidUrl.length > 18 ? `${vidUrl.slice(0, 18)}...` : vidUrl;
  const [duration, setDuration] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  const onPlayerReady = (event: { target: YouTubePlayer }) => {
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
      className="min-h-screen overflow-hidden bg-slate-950 text-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(148,163,184,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.14),transparent_22%),linear-gradient(180deg,#020617_0%,#0f172a_50%,#020617_100%)]" />
      <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <AppHeader eyebrow="Precision video notes" title="Scribe Workspace" detail={displayVideoId} />
        <div className="flex w-full flex-1 gap-3 px-3 pb-3 md:px-4 md:pb-4">
          <WorkspaceSidebar videoId={vidUrl} />

          <div className="flex min-h-0 flex-1 flex-col gap-3 lg:flex-row">
            <div className="flex min-h-0 flex-1 flex-col gap-3 lg:basis-[70%]">
              <section className="rounded-[28px] border border-white/10 bg-black/18 p-1 backdrop-blur-xl">
                <div className="relative w-full overflow-hidden rounded-[24px]" style={{ aspectRatio: '16 / 9' }}>
                  <Player videoId={vidUrl} ref={playerRef} onReady={onPlayerReady} onEnd={onPlayerEnd} />
                </div>
              </section>

              <section className="flex flex-col gap-4 rounded-[28px] border border-white/10 bg-white/6 p-4 md:p-5 backdrop-blur-2xl">
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.32em] text-slate-400">
                      Playback deck
                    </div>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                      Keep the video at hand, not in your face
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm text-slate-400">
                      The player is framed as part of the workspace now. Controls stay close, while the rest of the page has room to grow into navigation, context, and note tools.
                    </p>
                  </div>
                  <div className="rounded-full border border-white/10 bg-black/20 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                    Session active
                  </div>
                </div>

                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div className="flex items-center justify-center gap-6 rounded-[22px] border border-white/10 bg-black/20 px-4 py-4">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleRewind}
                      className="h-12 w-12 rounded-full border border-white/10 bg-white/5 text-white/70 transition-all hover:bg-white/10 hover:text-white"
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
                      className="h-12 w-12 rounded-full border border-white/10 bg-white/5 text-white/70 transition-all hover:bg-white/10 hover:text-white"
                    >
                      <RotateCw className="h-6 w-6" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap justify-center gap-4 xl:justify-end">
                    <div className="flex items-center rounded-full border border-white/10 bg-black/20 p-1">
                      <div className="flex items-center px-3 text-[10px] font-bold uppercase tracking-widest text-white/40">
                        <Repeat className="mr-2 h-3 w-3" />
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

                    <div className="flex items-center rounded-full border border-white/10 bg-black/20 p-1">
                      <div className="flex items-center px-3 text-[10px] font-bold uppercase tracking-widest text-white/40">
                        <Zap className="mr-2 h-3 w-3" />
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

                <div className="grid gap-3 md:grid-cols-[1.25fr_0.75fr]">
                  <div className="rounded-[22px] border border-white/10 bg-black/20 p-4">
                    <ChapterBar videoId={vidUrl} playerRef={playerRef} duration={duration} />
                  </div>
                  <div className="flex items-center justify-between rounded-[22px] border border-white/10 bg-black/20 px-5 py-4 text-[10px] font-medium uppercase tracking-[0.3em] text-white/30">
                    <div className="flex items-center">
                      <Clock className="mr-2 h-3 w-3" />
                      Precision Documenting
                    </div>
                    <div className="flex items-center">
                      <Settings2 className="mr-2 h-3 w-3" />
                      Scribe Engine v1
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex min-h-[420px] w-full flex-col lg:basis-[30%] xl:max-w-[420px]"
            >
              <div className="flex min-h-0 flex-1 rounded-[28px] border border-white/10 bg-slate-900/80 p-3 backdrop-blur-2xl">
                <ChatBox playerRef={playerRef} />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Home;
