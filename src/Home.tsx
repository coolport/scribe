import { useEffect, useRef, useState } from 'react';
import Player from './Player';
import ChatBox from './ChatBox';
import { useParams } from 'react-router';
import { type YouTubePlayer } from 'react-youtube';
import { motion } from 'framer-motion';
import AppHeader from './AppHeader';
import WorkspaceSidebar from './WorkspaceSidebar';

function Home() {
  const playerRef = useRef<YouTubePlayer | null>(null);
  const playerFrameRef = useRef<HTMLDivElement | null>(null);
  const params = useParams();
  const vidUrl = params.videoUrl || '';
  const displayVideoId = vidUrl.length > 18 ? `${vidUrl.slice(0, 18)}...` : vidUrl;
  const [isLooping, setIsLooping] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [playerHeight, setPlayerHeight] = useState<number | null>(null);

  useEffect(() => {
    const frame = playerFrameRef.current;
    if (!frame) return;

    const updateHeight = () => {
      const isDesktop = window.innerWidth >= 1024;
      setPlayerHeight(isDesktop ? frame.getBoundingClientRect().height : null);
    };

    updateHeight();

    const observer = new ResizeObserver(() => {
      updateHeight();
    });

    observer.observe(frame);
    window.addEventListener('resize', updateHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  const onPlayerReady = (_event: { target: YouTubePlayer }) => {
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
        <AppHeader
          eyebrow="Precision video notes"
          title="Scribe Workspace"
          detail={displayVideoId}
          onOpenMenu={() => setIsMenuOpen(true)}
        />
        <div className="flex w-full flex-1 gap-3 px-3 pb-3 md:px-4 md:pb-4">
          <WorkspaceSidebar
            videoId={vidUrl}
            isLooping={isLooping}
            isPlaying={isPlaying}
            playbackRate={playbackRate}
            playbackRates={playbackRates}
            onToggleLoop={handleToggleLoop}
            onRewind={handleRewind}
            onPlayPause={handlePlayPause}
            onForward={handleForward}
            onSetPlaybackRate={handleSetPlaybackRate}
          />

          <div className="flex min-h-0 flex-1 flex-col gap-3 lg:items-stretch lg:flex-row">
            <div className="flex min-h-0 flex-1 flex-col gap-3 lg:basis-[70%]">
              <section className="rounded-[28px] border border-white/10 bg-black/18 p-1 backdrop-blur-xl">
                <div
                  ref={playerFrameRef}
                  className="relative w-full overflow-hidden rounded-[24px]"
                  style={{ aspectRatio: '16 / 9' }}
                >
                  <Player videoId={vidUrl} ref={playerRef} onReady={onPlayerReady} onEnd={onPlayerEnd} />
                </div>
              </section>
            </div>

            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex min-h-0 w-full flex-col lg:basis-[30%] lg:self-stretch xl:max-w-[420px]"
              style={playerHeight ? { height: `${playerHeight + 8}px` } : undefined}
            >
              <div className="flex min-h-0 flex-1 rounded-[28px] border border-white/10 bg-slate-900/80 p-3 backdrop-blur-2xl">
                <ChatBox
                  playerRef={playerRef}
                  isMenuOpen={isMenuOpen}
                  onMenuOpenChange={setIsMenuOpen}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Home;
