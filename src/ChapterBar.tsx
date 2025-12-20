import { useEffect, useState, type RefObject } from 'react';
import { youtubeService } from './services/youtubeService';
import { Button } from './components/ui/button';

interface Chapter {
  startTime: number;
  endTime: number;
  title: string;
}

interface ChapterBarProps {
  videoId: string;
  playerRef: RefObject<any>;
  duration: number;
}

const ChapterBar = ({ videoId, playerRef, duration }: ChapterBarProps) => {
  const [chapters, setChapters] = useState<Chapter[]>([]);

  useEffect(() => {
    const fetchAndProcessChapters = async () => {
      if (!videoId || duration === 0) return;

      const details = await youtubeService.getVideoDetails(videoId);
      const parsedChapters = parseChapters(details.description);
      const processedChapters = processChapters(parsedChapters, duration);
      setChapters(processedChapters);
    };

    fetchAndProcessChapters();
  }, [videoId, duration]);

  const parseChapters = (description: string): { time: number, title: string }[] => {
    const chapterRegex = /(\d{1,2}:\d{2}(?::\d{2})?)\s*(.*)/g;
    const lines = description.split('\n');
    const chapters: { time: number, title: string }[] = [];

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
  };
  
  const processChapters = (parsedChapters: { time: number, title: string }[], totalDuration: number): Chapter[] => {
    if (parsedChapters.length === 0) return [];
    
    let chaptersWithEndTime: Chapter[] = [];
    
    // Add "Start" chapter if the first chapter doesn't start at 0
    if (parsedChapters[0].time > 0) {
        chaptersWithEndTime.push({
            startTime: 0,
            endTime: parsedChapters[0].time,
            title: 'Start'
        });
    }

    parsedChapters.forEach((chapter, index) => {
        const nextChapter = parsedChapters[index + 1];
        const endTime = nextChapter ? nextChapter.time : totalDuration;
        chaptersWithEndTime.push({
            startTime: chapter.time,
            endTime: endTime,
            title: chapter.title
        });
    });

    return chaptersWithEndTime;
  };

  const timeStringToSeconds = (timeString: string): number => {
    const parts = timeString.split(':').map(Number);
    let seconds = 0;
    if (parts.length === 3) { // HH:MM:SS
      seconds += parts[0] * 3600;
      seconds += parts[1] * 60;
      seconds += parts[2];
    } else if (parts.length === 2) { // MM:SS
      seconds += parts[0] * 60;
      seconds += parts[1];
    }
    return seconds;
  };

  const handleChapterClick = (time: number) => {
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      playerRef.current.seekTo(time, true);
    }
  };

  if (chapters.length === 0) {
    return (
      <div className="p-4 border-y border-border">
        <p className="text-center text-muted-foreground">No chapters found for this video.</p>
      </div>
    );
  }

  return (
    <div className="p-2 border-y border-border">
      <div className="flex w-full">
        {chapters.map((chapter) => {
          const widthPercentage = ((chapter.endTime - chapter.startTime) / duration) * 100;
          return (
            <Button
              key={chapter.startTime}
              variant="outline"
              size="sm"
              className="h-auto rounded-none flex-grow p-2 text-xs"
              style={{ width: `${widthPercentage}%` }}
              onClick={() => handleChapterClick(chapter.startTime)}
            >
              {chapter.title}
            </Button>
          )
        })}
      </div>
    </div>
  );
};

export default ChapterBar;