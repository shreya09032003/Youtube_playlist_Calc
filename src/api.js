const API_KEY = 'AIzaSyBlO3kPl84kn5Yn0QAM8DaOPG2b31baOsM'; 


export const calculateMetrics = async (playlistLink) => {
  const playlistId = getPlaylistIdFromUrl(playlistLink);
  if (!playlistId) {
    throw new Error('Invalid YouTube playlist link');
  }

  try {
    const videoIds = await fetchAllPlaylistVideoIds(playlistId);
    const durations = await fetchVideoDurations(videoIds);
    const videoCount = videoIds.length;

    let totalDuration = 0;
    durations.forEach(duration => {
      const seconds = parseVideoDuration(duration);
      totalDuration += seconds;
    });

    const averageDuration = totalDuration / videoCount;
    const speedMetrics = {
      '1.25x': totalDuration / 1.25,
      '1.50x': totalDuration / 1.50,
      '1.75x': totalDuration / 1.75,
      '2.00x': totalDuration / 2.00
    };

    return {
      videoCount,
      totalDuration,
      averageDuration,
      speedMetrics
    };
  } catch (error) {
    console.error('Error fetching playlist data:', error);
    throw error;
  }
};


const getPlaylistIdFromUrl = (url) => {
  const pattern = /(?:list=)([\w-]+)/;
  const match = url.match(pattern);
  return match ? match[1] : null;
};

const fetchAllPlaylistVideoIds = async (playlistId) => {
  let videoIds = [];
  let nextPageToken = '';
  
  do {
    const apiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=${playlistId}&maxResults=50&key=${API_KEY}&pageToken=${nextPageToken}`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    videoIds = videoIds.concat(data.items.map(item => item.contentDetails.videoId));
    nextPageToken = data.nextPageToken || '';
  } while (nextPageToken);
  
  return videoIds;
};


const fetchVideoDurations = async (videoIds) => {
  const durations = [];
  
  for (let i = 0; i < videoIds.length; i += 50) {
    const chunk = videoIds.slice(i, i + 50);
    const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${chunk.join(',')}&key=${API_KEY}`;
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    durations.push(...data.items.map(item => item.contentDetails.duration));
  }
  
  return durations;
};


const parseVideoDuration = (duration) => {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return 0;

  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;

  return hours * 3600 + minutes * 60 + seconds;
};
