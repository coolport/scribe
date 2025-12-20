const API_KEY = 'YOUR_API_KEY_HERE'; // Placeholder for the API key

interface VideoDetails {
  title: string;
  description: string;
}

// Mock function until API key is provided
const getVideoDetails = async (videoId: string): Promise<VideoDetails> => {
  console.log(`Fetching details for video: ${videoId}`);
  
  // This is mock data.
  // In a real implementation, you would use fetch() with the YouTube Data API.
  return Promise.resolve({
    title: 'Example Video Title',
    description: `
This is a sample video description.

Here are the chapters:
0:00 Intro
1:30 Exploring the Main Topic
5:15 A Deep Dive
10:00 Q&A Session
12:45 Final Thoughts
    `,
  });
};

export const youtubeService = {
  getVideoDetails,
};
