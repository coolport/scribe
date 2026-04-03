import { useEffect, useState, type RefObject, useCallback } from "react";
import { youtubeService } from "./services/youtubeService";
import { type YouTubePlayer } from "react-youtube";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Map } from "lucide-react";

interface Chapter {
  startTime: number;
  endTime: number;
  title: string;
}

interface ChapterBarProps {
  videoId: string;
  playerRef: RefObject<YouTubePlayer | null>;
  duration: number;
}

const timeStringToSeconds = (timeString: string): number => {
  const parts = timeString.split(":").map(Number);
  let seconds = 0;
  if (parts.length === 3) {
    seconds += parts[0] * 3600;
    seconds += parts[1] * 60;
    seconds += parts[2];
  } else if (parts.length === 2) {
    seconds += parts[0] * 60;
    seconds += parts[1];
  }
  return seconds;
};

const ChapterBar = ({ videoId, playerRef, duration }: ChapterBarProps) => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [activeChapter, setActiveChapter] = useState<number | null>(null);

  const parseChapters = useCallback(
    (description: string): { time: number; title: string }[] => {
      const chapterRegex = /(\d{1,2}:\d{2}(?::\d{2})?)\s*(.*)/g;
      const lines = description.split("\n");
      const chapters: { time: number; title: string }[] = [];

      for (const line of lines) {
        const match = chapterRegex.exec(line);
        if (match) {
          chapters.push({
            time: timeStringToSeconds(match[1]),
            title: match[2].trim(),
          });
        }
      }
      return chapters;
    },
    [],
  );

  const processChapters = useCallback(
    (
      parsedChapters: { time: number; title: string }[],
      totalDuration: number,
    ): Chapter[] => {
      if (parsedChapters.length === 0) return [];

      const chaptersWithEndTime: Chapter[] = [];

      if (parsedChapters[0].time > 0) {
        chaptersWithEndTime.push({
          startTime: 0,
          endTime: parsedChapters[0].time,
          title: "Introduction",
        });
      }

      parsedChapters.forEach((chapter, index) => {
        const nextChapter = parsedChapters[index + 1];
        const endTime = nextChapter ? nextChapter.time : totalDuration;
        chaptersWithEndTime.push({
          startTime: chapter.time,
          endTime: endTime,
          title: chapter.title || `Segment ${index + 1}`,
        });
      });

      return chaptersWithEndTime;
    },
    [],
  );

  useEffect(() => {
    const fetchAndProcessChapters = async () => {
      if (!videoId || duration === 0) return;

      try {
        const details = await youtubeService.getVideoDetails(videoId);
        const parsedChapters = parseChapters(details.description);
        const processedChapters = processChapters(parsedChapters, duration);
        setChapters(processedChapters);
      } catch (error) {
        console.error("Error fetching chapters:", error);
      }
    };

    fetchAndProcessChapters();
  }, [videoId, duration, parseChapters, processChapters]);

  const handleChapterClick = (time: number, index: number) => {
    if (playerRef.current && typeof playerRef.current.seekTo === "function") {
      playerRef.current.seekTo(time, true);
      setActiveChapter(index);
    }
  };

  if (chapters.length === 0) {
    return (
      <div className="flex items-center justify-center py-6 px-4 border-b border-border/40 bg-muted/5">
        <div className="flex items-center space-x-2 text-muted-foreground/50">
          <BookOpen className="h-4 w-4" />
          <span className="text-[10px] uppercase tracking-[0.2em] font-medium">No chapters detected</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background border-b border-border/40 shadow-sm overflow-hidden">
      <div className="px-4 py-2 flex items-center justify-between bg-muted/20">
        <div className="flex items-center space-x-2">
          <Map className="h-3.5 w-3.5 text-primary/60" />
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/70">
            Timeline
          </h3>
        </div>
        <span className="text-[10px] text-muted-foreground font-medium">
          {chapters.length} Segments
        </span>
      </div>
      
      <div className="flex w-full h-12 p-1 gap-1">
        <AnimatePresence>
          {chapters.map((chapter, index) => {
            const widthPercentage =
              ((chapter.endTime - chapter.startTime) / duration) * 100;
            const isActive = activeChapter === index;

            return (
              <motion.button
                key={`${chapter.startTime}-${index}`}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className={`relative group h-full flex-grow overflow-hidden rounded-sm transition-all duration-300 ${
                  isActive 
                    ? "bg-primary shadow-inner" 
                    : "bg-muted/40 hover:bg-muted/80"
                }`}
                style={{ width: `${widthPercentage}%`, minWidth: '4px' }}
                onClick={() => handleChapterClick(chapter.startTime, index)}
              >
                <div className="absolute inset-0 flex items-center justify-center px-1">
                  <span className={`text-[8px] font-bold tracking-tighter truncate transition-all duration-300 ${
                    isActive ? "text-primary-foreground opacity-100" : "text-muted-foreground/0 group-hover:text-muted-foreground group-hover:opacity-100"
                  }`}>
                    {chapter.title}
                  </span>
                </div>
                
                {/* Tooltip-like indicator on hover */}
                <div className="absolute bottom-0 left-0 h-0.5 w-full bg-primary/20 group-hover:bg-primary transition-colors" />
                
                {/* Progress highlight (simulated) */}
                {isActive && (
                  <motion.div 
                    layoutId="activeGlow"
                    className="absolute inset-0 bg-white/10 blur-md pointer-events-none"
                  />
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChapterBar;
