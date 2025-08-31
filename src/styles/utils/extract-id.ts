function extractYouTubeDetails(urlString: string): string | null {
  try {
    const url = new URL(urlString);
    const hostname = url.hostname.toLowerCase();

    // Strictly allow only youtube.com, *.youtube.com, and youtu.be
    const isYouTubeDomain =
      hostname === 'youtube.com' ||
      hostname.endsWith('.youtube.com') ||
      hostname === 'youtu.be';

    if (!isYouTubeDomain) return null;

    let videoId = null;

    if (hostname === 'youtu.be') {
      // Short link: https://youtu.be/VIDEO_ID
      videoId = url.pathname.slice(1);
    } else {
      const pathParts = url.pathname.split('/').filter(Boolean);

      // Handle ?v=VIDEO_ID
      if (url.searchParams.has('v')) {
        videoId = url.searchParams.get('v');
      }

      // Handle /embed/VIDEO_ID, /shorts/VIDEO_ID, /v/VIDEO_ID
      if (!videoId && pathParts.length >= 2 && ['embed', 'shorts', 'v'].includes(pathParts[0])) {
        videoId = pathParts[1];
      }
    }
    return videoId;
  } catch {
    return null; // Not a valid URL
  }
}

export default extractYouTubeDetails;
