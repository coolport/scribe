import { useEffect, useState, forwardRef } from "react";
import YouTube, { type YouTubeProps } from "react-youtube";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";

type PlayerProps = {
  videoId: string | null;
  onReady?: YouTubeProps['onReady'];
  onEnd?: YouTubeProps['onEnd'];
  opts?: YouTubeProps['opts'];
}

const Player = forwardRef<YouTube, PlayerProps>(({ videoId, onReady, onEnd, opts }, ref) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    if (videoId) {
      setIsLoading(true);
      setHasError(false);
    }
  }, [videoId])

  const defaultOpts: YouTubeProps['opts'] = {
    height: '100%',
    width: '100%',
    playerVars: { 
      autoplay: 1,
      modestbranding: 1,
      rel: 0,
    },
  };

  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    if (ref && 'current' in ref) {
      ref.current = event.target;
    } else if (typeof ref === 'function') {
      ref(event.target);
    }

    setIsLoading(false);

    if (onReady) {
      onReady(event);
    }
  }

  const onError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className="relative w-full h-full bg-slate-900 overflow-hidden group">
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900"
          >
            <div className="relative">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
                className="absolute inset-0 bg-primary/20 blur-xl rounded-full"
              />
            </div>
            <p className="mt-4 text-xs font-medium text-slate-400 uppercase tracking-widest animate-pulse">
              Initializing Video
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {hasError && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950 px-6 text-center"
          >
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Signal Lost</h3>
            <p className="text-sm text-slate-400 max-w-xs">
              We couldn't load the requested video. Please check the URL and try again.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {videoId ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoading ? 0 : 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-full h-full"
        >
          <YouTube
            videoId={videoId}
            opts={opts || defaultOpts}
            onReady={onPlayerReady}
            onEnd={onEnd}
            onError={onError}
            className="absolute top-0 left-0 w-full h-full" 
          />
        </motion.div>
      ) : (
        <div className="flex items-center justify-center h-full text-slate-500 italic">
          No source provided
        </div>
      )}
      
      {/* Cinematic overlay on hover */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
});

export default Player;
