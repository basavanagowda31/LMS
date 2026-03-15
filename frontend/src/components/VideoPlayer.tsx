'use client';

import YouTube from 'react-youtube';
import { useEffect, useRef } from 'react';
import { useVideoStore } from '../store/videoStore';
import api from '../lib/api';

export default function VideoPlayer({ video, onProgressUpdate }: { video: any, onProgressUpdate: any }) {
  const playerRef = useRef<any>(null);
  const { progress } = useVideoStore();
  const currentProgress = progress.find((p: any) => p.videoId === video.id) || { lastPosition: 0, isCompleted: false };
  
  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      start: currentProgress.lastPosition,
      modestbranding: 1,
      rel: 0,
      origin: typeof window !== 'undefined' ? window.location.origin : undefined
    },
  };

  const syncProgress = async (isPlaying = false) => {
    if (!playerRef.current) return;
    try {
      const currentTime = await playerRef.current.getCurrentTime();
      if (currentTime > 0) {
        onProgressUpdate(video.id, Math.floor(currentTime), currentProgress.isCompleted);
      }
    } catch (err) {}
  };

  useEffect(() => {
    const interval = setInterval(() => {
      syncProgress();
    }, 5000); // Sync every 5 seconds
    
    // Sync on unmount
    return () => {
      clearInterval(interval);
      syncProgress();
    };
  }, [video.id]);

  const extractYoutubeId = (url: any) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = extractYoutubeId(video.youtube_url);

  const onReady = (event: any) => {
    playerRef.current = event.target;
    // ensure it starts from the previous position if autoplay fails
    if (currentProgress.lastPosition > 0) {
      event.target.seekTo(currentProgress.lastPosition);
    }
  };

  const onStateChange = (event: any) => {
    // 0 = ended, 1 = playing, 2 = paused
    if (event.data === 2 || event.data === 0) {
      syncProgress();
    }
    if (event.data === 0) {
      onProgressUpdate(video.id, video.duration_seconds, true); // Mark completed
    }
  };

  if (!videoId) return <div className="p-10 bg-zinc-800 text-center rounded-lg text-red-400">Invalid YouTube URL</div>;

  return (
    <div className="w-full h-full relative group">
      <div className="absolute inset-0 z-0">
        <YouTube 
          videoId={videoId} 
          opts={opts} 
          onReady={onReady}
          onStateChange={onStateChange}
          className="w-full h-full"
          iframeClassName="w-full h-full rounded-xl shadow-2xl"
        />
      </div>
    </div>
  );
}
