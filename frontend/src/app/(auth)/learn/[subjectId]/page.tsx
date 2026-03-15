'use client';

import { useEffect, useState, use } from 'react';
import api from '../../../../lib/api';
import Sidebar from '../../../../components/Sidebar';
import VideoPlayer from '../../../../components/VideoPlayer';
import { useVideoStore } from '../../../../store/videoStore';
import { AlertCircle, ChevronRight, CheckCircle } from 'lucide-react';

import { useParams } from 'next/navigation';

export default function LearnPage() {
  const params = useParams();
  const subjectId = params.subjectId;
  const [subject, setSubject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { progress, setProgress, updateProgress, currentVideoId, setCurrentVideoId } = useVideoStore();

  useEffect(() => {
    if (!subjectId) return; // Wait for Next.js to populate dynamic route params

    const fetchTree = async () => {
      try {
        const [subjectRes, progressRes] = await Promise.all([
          api.get(`/subjects/${subjectId}/tree`),
          api.get(`/progress/${subjectId}`)
        ]);
        
        setSubject(subjectRes.data);
        setProgress(progressRes.data);
        
        // auto select active lesson
        if (progressRes.data.length > 0) {
          const firstUnlockedIncomplete = progressRes.data.find((p: any) => !p.isCompleted && !p.isLocked);
          if (firstUnlockedIncomplete) {
              setCurrentVideoId(firstUnlockedIncomplete.videoId);
          } else {
             // If all completed, last video 
             const allIds = progressRes.data.map((p: any) => p.videoId);
             setCurrentVideoId(allIds[allIds.length - 1]);
          }
        }
      } catch (err: any) {
        console.error('Fetch error:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'Failed to load course details');
      } finally {
        setLoading(false);
      }
    };
    fetchTree();
  }, [subjectId, setProgress, setCurrentVideoId]);

  const handleProgressUpdate = async (videoId: any, lastPosition: any, isCompleted: any) => {
    try {
      await api.post('/progress/update', {
        videoId,
        lastPosition: Math.floor(lastPosition),
        isCompleted
      });
      // Updating store optimistically
      updateProgress(videoId, lastPosition, isCompleted, false);

      // if completed, we need to unlock next
      if (isCompleted) {
         // Reload full progress to reflect locks accurately or handle locally.
         const progressRes = await api.get(`/progress/${subjectId}`);
         setProgress(progressRes.data);
         
         // Auto-next logic:
         const currentIndex = progressRes.data.findIndex((p: any) => p.videoId === videoId);
         if (currentIndex !== -1 && currentIndex + 1 < progressRes.data.length) {
            const nextVideo = progressRes.data[currentIndex + 1];
            if (!nextVideo.isLocked) {
              setCurrentVideoId(nextVideo.videoId);
            }
         }
      }
    } catch (err) {}
  };

  if (loading) return <div className="p-8 text-zinc-400">Loading learning environment...</div>;
  if (error) return <div className="p-8 text-red-500 font-medium bg-red-900/20 m-8 rounded-xl">{error}</div>;

  let allLessons: any[] = [];
  (subject as any)?.sections?.forEach((s: any) => {
      allLessons = allLessons.concat(s.lessons);
  });
  
  const currentVideo = allLessons.find((l: any) => l.id === currentVideoId);
  const currentProgress = progress.find((p: any) => p.videoId === currentVideoId);

  const completedCount = progress.filter((p: any) => p.isCompleted).length;
  const percentComplete = Math.round((completedCount / (allLessons.length || 1)) * 100);

  return (
    <div className="flex w-full min-h-screen bg-[#FDFBF7] font-sans selection:bg-[#FF4F00]/30 text-zinc-900">
      <Sidebar subject={subject} />
      
      <main className="flex-1 flex flex-col w-full min-h-screen bg-[#FDFBF7] overflow-y-auto">
        <header className="h-24 shrink-0 bg-white border-b-[4px] border-zinc-900 flex items-center justify-between px-8 z-30 sticky top-0 md:static">
           <div className="flex-1 max-w-lg hidden md:block">
              <h1 className="text-2xl font-black text-zinc-900 uppercase tracking-tighter truncate">
                {currentVideo ? currentVideo.title : 'Course Dashboard'}
              </h1>
           </div>
           
           <div className="flex items-center gap-6 ml-auto md:ml-0 bg-white py-3 px-6 border-[3px] border-zinc-900 shadow-[4px_4px_0_0_rgba(24,24,27,1)]">
             <div className="flex flex-col items-end">
               <span className="text-xs uppercase tracking-widest text-[#FF4F00] font-black mb-1">Module Progress</span>
               <div className="flex items-center gap-4">
                 <div className="w-32 h-3 bg-zinc-100 border-[2px] border-zinc-900 overflow-hidden relative">
                   <div 
                     className="absolute top-0 left-0 h-full bg-[#FF4F00] transition-all duration-1000 ease-out border-r-[2px] border-zinc-900"
                     style={{ width: `${percentComplete}%` }}
                   />
                 </div>
                 <span className="text-sm font-black text-zinc-900">{percentComplete}%</span>
               </div>
             </div>
           </div>
        </header>

        <div className="flex-1 p-4 md:p-10 flex flex-col relative overflow-hidden">
           <div className="w-full max-w-6xl mx-auto aspect-video bg-white border-[4px] border-zinc-900 shadow-[8px_8px_0_0_rgba(24,24,27,1)] relative group mb-10">
              {currentVideo ? (
                <VideoPlayer 
                  key={currentVideo.id} // Re-mount on change
                  video={currentVideo} 
                  onProgressUpdate={handleProgressUpdate} 
                />
              ) : (
                 <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-zinc-900 bg-zinc-50">
                    <CheckCircle className="text-[#FF4F00] mb-6" size={80} strokeWidth={3} />
                    <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">You're all set!</h2>
                    <p className="text-xl font-bold text-zinc-600 bg-white border-[3px] border-zinc-900 px-6 py-3 shadow-[4px_4px_0_0_rgba(24,24,27,1)]">
                       Select a lesson from the sidebar to start or review.
                    </p>
                 </div>
              )}
           </div>

           {currentVideo && (
              <div className="w-full max-w-6xl mx-auto bg-white border-[4px] border-zinc-900 p-8 shadow-[8px_8px_0_0_rgba(24,24,27,1)]">
                 <h2 className="text-3xl font-black text-zinc-900 uppercase tracking-tighter mb-4">{currentVideo.title}</h2>
                 <p className="text-zinc-600 font-bold leading-relaxed text-lg border-t-[3px] border-dashed border-zinc-300 pt-6">
                    {currentVideo.description}
                 </p>
              </div>
           )}
        </div>
      </main>
    </div>
  );
}
