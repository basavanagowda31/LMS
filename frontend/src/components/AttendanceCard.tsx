'use client';

import { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, Clock } from 'lucide-react';
import api from '../lib/api';

export default function AttendanceCard() {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [checkedInToday, setCheckedInToday] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await api.get('/attendance');
        setAttendance(res.data);
        const today = new Date().toISOString().split('T')[0];
        const isPresentToday = res.data.some((a: any) => a.date.startsWith(today));
        setCheckedInToday(isPresentToday);
      } catch (err) {
        console.error('Failed to fetch attendance', err);
      }
    };
    fetchAttendance();
  }, []);

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      await api.post('/attendance/check-in');
      const res = await api.get('/attendance');
      setAttendance(res.data);
      setCheckedInToday(true);
    } catch (err) {
      console.error('Failed to check in', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border-[4px] border-zinc-900 p-8 shadow-[8px_8px_0_0_rgba(255,79,0,1)] relative transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter">Daily Attendance</h2>
          <p className="text-zinc-600 font-bold text-sm">Stay consistent to forge your future.</p>
        </div>
        <div className="w-14 h-14 bg-zinc-900 flex items-center justify-center border-2 border-[#FF4F00]">
          <Calendar size={28} className="text-[#FF4F00]" />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {checkedInToday ? (
          <div className="flex items-center gap-4 p-5 bg-[#FF4F00]/10 border-[3px] border-[#FF4F00] text-[#FF4F00]">
            <CheckCircle2 size={32} strokeWidth={3} />
            <div>
              <p className="text-lg font-black uppercase leading-none">Present Today</p>
              <p className="text-xs font-bold opacity-80 mt-1">Excellent work! Come back tomorrow.</p>
            </div>
          </div>
        ) : (
          <button 
            onClick={handleCheckIn}
            disabled={loading}
            className="w-full py-5 bg-[#FF4F00] text-white border-[3px] border-zinc-900 font-black text-2xl uppercase tracking-[0.2em] shadow-[6px_6px_0_0_rgba(24,24,27,1)] hover:-translate-y-1 hover:shadow-[10px_10px_0_0_rgba(24,24,27,1)] active:translate-y-1 active:shadow-none transition-all disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Mark Present'}
          </button>
        )}

        <div className="border-t-4 border-zinc-900 pt-6 mt-2">
           <div className="flex items-center justify-between font-black uppercase text-sm tracking-widest text-zinc-500 mb-4">
              <span>Recent Activity</span>
              <span className="text-zinc-900">Streak: {attendance.length} Days</span>
           </div>
           <div className="grid grid-cols-7 gap-2">
              {/* Simple visualization of last 7 slots */}
              {[...Array(7)].map((_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (6 - i));
                const dateStr = date.toISOString().split('T')[0];
                const isPresent = attendance.some((a: any) => a.date.startsWith(dateStr));
                
                return (
                  <div key={i} className={`aspect-square border-2 border-zinc-900 flex items-center justify-center transition-colors ${isPresent ? 'bg-[#FF4F00]' : 'bg-zinc-100'}`} title={dateStr}>
                    {isPresent && <CheckCircle2 size={12} className="text-white" />}
                  </div>
                );
              })}
           </div>
        </div>
      </div>
    </div>
  );
}
