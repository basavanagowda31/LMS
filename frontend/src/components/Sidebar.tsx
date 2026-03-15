'use client';

import { useSidebarStore } from '../store/sidebarStore';
import { useVideoStore } from '../store/videoStore';
import { CheckCircle, Lock, PlayCircle, Menu, X, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function Sidebar({ subject }) {
  const { isOpen, toggleSidebar } = useSidebarStore();
  const { progress, currentVideoId, setCurrentVideoId } = useVideoStore();

  const getProgressStatus = (videoId) => {
    return progress.find((p) => p.videoId === videoId) || { isCompleted: false, isLocked: true };
  };

  return (
    <>
      <button 
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 md:hidden bg-indigo-600 text-white p-2 rounded-full shadow-lg"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <div className={`
        fixed md:static inset-y-0 left-0 z-40 bg-[#FDFBF7] border-r-[4px] border-zinc-900 
        w-80 flex flex-col transition-transform duration-300 ease-in-out font-sans
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-0 md:border-r-0 md:overflow-hidden'}
      `}>
        <div className="p-6 border-b-[4px] border-zinc-900 flex flex-col gap-4 max-h-[140px] bg-[#FF4F00] text-white">
          <Link href="/" className="text-white flex items-center gap-2 text-sm font-bold border-[2px] border-transparent hover:border-white w-max px-2 py-1 transition-all">
            <ArrowLeft size={16} strokeWidth={3} /> Back to Hub
          </Link>
          <h2 className="text-xl font-black uppercase leading-tight line-clamp-2">{subject?.title}</h2>
        </div>

        <div className="flex-1 overflow-y-auto w-full bg-[#FDFBF7]">
          {subject?.sections?.map((section, idx) => (
            <div key={section.id} className="border-b-[4px] border-zinc-900 last:border-0 w-full">
              <div className="bg-white p-4 sticky top-0 z-10 border-b-[2px] border-zinc-900">
                <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest">
                  Section {idx + 1}: {section.title}
                </h3>
              </div>
              <ul className="flex flex-col w-full">
                {section.lessons?.map((lesson, lessonIdx) => {
                  const status = getProgressStatus(lesson.id);
                  const isCurrent = currentVideoId === lesson.id;
                  
                  return (
                    <li key={lesson.id} className="w-full">
                      <button
                        disabled={status.isLocked}
                        onClick={() => setCurrentVideoId(lesson.id)}
                        className={`
                          w-full text-left p-4 flex items-start gap-4 transition-all border-b-[2px] border-zinc-200
                          ${status.isLocked ? 'opacity-50 cursor-not-allowed bg-zinc-100' : 'hover:bg-[#FF4F00]/10 cursor-pointer'}
                          ${isCurrent ? 'bg-[#FF4F00]/10 border-l-[8px] border-[#FF4F00]' : 'border-l-[8px] border-transparent'}
                        `}
                      >
                        <div className="mt-0.5 flex-shrink-0">
                          {status.isCompleted ? (
                            <CheckCircle size={20} className="text-[#FF4F00]" strokeWidth={3} />
                          ) : status.isLocked ? (
                            <Lock size={20} className="text-zinc-400" strokeWidth={3} />
                          ) : (
                            <PlayCircle size={20} className={isCurrent ? 'text-[#FF4F00]' : 'text-zinc-600'} strokeWidth={isCurrent ? 3 : 2} />
                          )}
                        </div>
                        <div className="flex flex-col w-full">
                          <span className={`text-sm font-bold leading-snug w-full tracking-wide ${isCurrent ? 'text-zinc-900' : 'text-zinc-700'}`}>
                            {lessonIdx + 1}. {lesson.title}
                          </span>
                          <span className="text-xs text-zinc-500 mt-1 font-bold">
                            {Math.floor(lesson.duration_seconds / 60)}:{(lesson.duration_seconds % 60).toString().padStart(2, '0')}
                          </span>
                        </div>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
