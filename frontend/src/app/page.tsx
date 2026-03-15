'use client';

import { useEffect, useState } from 'react';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';
import Link from 'next/link';
import { PlayCircle, Award, BookOpen, UserCircle } from 'lucide-react';
import AttendanceCard from '../components/AttendanceCard';

export default function Home() {
  const [subjects, setSubjects] = useState([]);
  const [mounted, setMounted] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    setMounted(true);
    const fetchSubjects = async () => {
      try {
        const response = await api.get('/subjects');
        setSubjects(response.data);
      } catch (err) {}
    };
    fetchSubjects();
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-pulse w-10 h-10 bg-indigo-500/20 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-zinc-900 selection:bg-[#FF4F00]/30 font-sans">
      <nav className="border-b-[3px] border-zinc-900 bg-white sticky top-0 z-50 shadow-[0_4px_0_0_rgba(24,24,27,1)]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#FF4F00] flex items-center justify-center border-[3px] border-zinc-900 shadow-[2px_2px_0_0_rgba(24,24,27,1)]">
              <BookOpen size={24} className="text-white fill-current" />
            </div>
            <span className="text-2xl font-black tracking-tight uppercase" style={{ fontFamily: 'Inter' }}>TechForge</span>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
               <div className="flex items-center gap-6">
                 <div className="flex items-center gap-2 text-zinc-700 bg-zinc-100 px-4 py-2 rounded-full border-2 border-zinc-900 font-bold">
                    <UserCircle size={20} className="text-[#FF4F00]" />
                    <span className="text-sm">{user?.name}</span>
                 </div>
                 <button onClick={logout} className="text-sm font-bold text-zinc-600 hover:text-[#FF4F00] transition-colors underline decoration-2 underline-offset-4">
                   Sign Out
                 </button>
               </div>
            ) : (
              <div className="flex gap-4">
                <Link href="/login" className="px-6 py-2.5 text-sm font-bold text-zinc-900 hover:text-[#FF4F00] transition-colors uppercase tracking-widest">
                  Log In
                </Link>
                <Link href="/register" className="px-6 py-2.5 text-sm font-black bg-[#FF4F00] text-white border-[3px] border-zinc-900 hover:bg-[#FF3300] transition-transform hover:-translate-y-1 hover:shadow-[4px_4px_0_0_rgba(24,24,27,1)] shadow-[2px_2px_0_0_rgba(24,24,27,1)] uppercase tracking-wide">
                  Start Learning
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-24">
        {!isAuthenticated ? (
          <div className="mb-24 max-w-4xl">
            <h1 className="text-6xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter text-zinc-900 uppercase">
              Learn <br/>
              <span className="text-[#FF4F00] underline decoration-[8px] underline-offset-8">Code.</span><br/>
              No excuses.
            </h1>
            <p className="text-xl md:text-2xl text-zinc-600 font-bold max-w-2xl border-l-[6px] border-[#FF4F00] pl-6 py-2">
              Strict sequential learning paths taking you from beginner to professional. 
              Pure, undeniable progress.
            </p>
          </div>
        ) : (
          <div className="mb-16 border-b-[4px] border-zinc-900 pb-12">
            <h1 className="text-5xl md:text-7xl font-black mb-4 uppercase tracking-tighter">
              Welcome back, <span className="text-[#FF4F00]">{user?.name?.split(' ')[0] || 'Student'}</span>!
            </h1>
            <p className="text-zinc-600 text-xl font-bold bg-[#FF4F00]/10 inline-block px-4 py-2 border-2 border-[#FF4F00]">
              Pick up right where you left off.
            </p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-10 w-3 bg-zinc-900"></div>
              <h2 className="text-3xl font-black uppercase tracking-tight">Available Courses</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {subjects.map((subject: any) => (
                <div key={subject.id} className="relative bg-white border-[4px] border-zinc-900 p-8 flex flex-col items-start hover:-translate-y-2 hover:shadow-[8px_8px_0_0_rgba(24,24,27,1)] transition-all duration-200">
                    <div className="w-16 h-16 bg-[#FF4F00] text-white flex items-center justify-center mb-8 border-[3px] border-zinc-900 shadow-[3px_3px_0_0_rgba(24,24,27,1)]">
                      <Award size={32} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-2xl font-black mb-4 uppercase">{subject.title}</h3>
                    <p className="text-zinc-600 font-bold mb-10 text-sm border-t-2 border-dashed border-zinc-300 pt-4 leading-relaxed">
                      {subject.description}
                    </p>
                    <div className="mt-auto w-full">
                      {isAuthenticated ? (
                        <Link href={`/learn/${subject.id}`} className="flex items-center justify-center w-full gap-2 py-4 bg-zinc-900 text-white font-black hover:bg-[#FF4F00] transition-colors uppercase tracking-widest border-2 border-transparent">
                          <PlayCircle size={20} /> Open Course
                        </Link>
                      ) : (
                        <Link href="/login" className="flex items-center justify-center w-full gap-2 py-4 bg-zinc-100 border-[3px] border-zinc-900 text-zinc-900 font-black hover:bg-zinc-200 transition-colors uppercase tracking-widest">
                          Log In to Start
                        </Link>
                      )}
                    </div>
                </div>
              ))}
            </div>
          </div>

          {isAuthenticated && (
            <div className="lg:w-[400px]">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-10 w-3 bg-[#FF4F00]"></div>
                <h2 className="text-3xl font-black uppercase tracking-tight">Your Stats</h2>
              </div>
              <AttendanceCard />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
