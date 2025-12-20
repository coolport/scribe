import { useRef } from 'react';
import Player from './Player';
import ChatBox from './ChatBox';
import { useParams } from 'react-router';

function Home() {
  const playerRef = useRef<any>(null);
  const params = useParams();
  const vidUrl = params.videoUrl || '';

  return (
    <div className="flex flex-col md:flex-row w-full h-screen bg-background overflow-hidden">
      <div className="w-full md:w-[70%] flex items-center justify-center bg-black">
        <div className="relative w-full" style={{ aspectRatio: '16 / 9' }}>
          <Player videoId={vidUrl} ref={playerRef} />
        </div>
      </div>
      <div className="w-full md:w-[30%] p-4 bg-card border-t md:border-t-0 md:border-l border-border flex flex-col flex-grow">
        <ChatBox playerRef={playerRef} />
      </div>
    </div>
  )
}

export default Home;
