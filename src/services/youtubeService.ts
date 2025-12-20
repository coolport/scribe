const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

interface VideoDetails {
  title: string;
  description: string;
}

// Mock function until API key is provided
const getVideoDetails = async (videoId: string): Promise<VideoDetails> => {
  if (!API_KEY) {
    console.error("YouTube API key is not configured.");
    return Promise.resolve({
      title: 'API Key Missing',
      description: 'YouTube API key is not configured. Please add VITE_YOUTUBE_API_KEY to your .env file.',
    });
  }

  const YOUTUBE_API_URL = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`;

  try {
    const response = await fetch(YOUTUBE_API_URL);
    if (!response.ok) {
      const errorData = await response.json();
      console.error("YouTube API error:", errorData);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const snippet = data.items[0].snippet;
      return {
        title: snippet.title,
        description: snippet.description,
      };
    } else {
      throw new Error("No video items found for the given video ID.");
    }
  } catch (error) {
    console.error("Failed to fetch YouTube video details:", error);
    return {
      title: 'Error Loading Video Details',
      description: 'Could not load video description. Please check the video ID and API key.',
    };
  }
};

export const youtubeService = {
  getVideoDetails,
};
