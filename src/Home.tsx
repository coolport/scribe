import { useRef } from 'react';
import Player from './Player';
import ChatBox from './ChatBox';
import { useParams } from 'react-router';
import { Button } from '@/components/ui/button';

function Home() {
  const playerRef = useRef<any>(null);
  const params = useParams();
  const vidUrl = params.videoUrl || '';

  return (
    <div className="flex flex-col md:flex-row w-full h-screen bg-background overflow-hidden">
      <div className="w-full md:w-[70%] flex flex-col items-stretch justify-start bg-black">
        <div className="relative w-full flex-shrink-0" style={{ aspectRatio: '16 / 9' }}>
          <Player videoId={vidUrl} ref={playerRef} />
        </div>
        <div className="p-4 border-y border-border">
          <p className="text-center text-muted-foreground">Video chapters will appear here</p>
        </div>
        <div className="grid grid-cols-8 gap-2 p-2 flex-grow">
          <Button className="h-full">Rewind 5s</Button>
          <Button className="h-full">Play/Pause</Button>
          <Button className="h-full">Forward 5s</Button>
          <Button className="h-full">Loop</Button>
          <Button variant="secondary" className="h-full">0.75x</Button>
          <Button variant="secondary" className="h-full">1x</Button>
          <Button variant="secondary" className="h-full">1.5x</Button>
          <Button variant="secondary" className="h-full">2x</Button>
        </div>
      </div>
      <div className="w-full md:w-[30%] p-4 bg-card border-t md:border-t-0 md:border-l border-border flex flex-col flex-grow">
        <ChatBox playerRef={playerRef} />
      </div>
    </div>
  )
}

export default Home;
