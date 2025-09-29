import { useRef } from 'react';
import Player from './Player';
import ChatBox from './ChatBox';
import { useParams } from 'react-router';

function Home() {
  const playerRef = useRef<any>(null);
  const params = useParams();
  const vidUrl = params.videoUrl || '';

  return (
    <div className="flex w-full h-screen bg-gray-100">
      <div className="w-[70%] h-full">
        <div id="playerContainer" className="w-full h-full">
          <Player videoId={vidUrl} ref={playerRef}></Player>
        </div>
      </div>
      <div className="w-[30%] h-full p-4 bg-white border-l border-gray-200">
        <ChatBox playerRef={playerRef} />
      </div>
    </div>
  )
}

export default Home;
