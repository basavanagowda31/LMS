'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../../lib/api';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/auth/register', { name, email, password });
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] px-4 font-sans">
      <div className="w-full max-w-md p-10 bg-white border-[4px] border-zinc-900 shadow-[8px_8px_0_0_rgba(24,24,27,1)] relative z-10 transition-all hover:-translate-y-1 hover:shadow-[12px_12px_0_0_rgba(24,24,27,1)]">
        <div className="mb-8 text-center">
           <h2 className="text-4xl font-black text-zinc-900 tracking-tighter mb-4 uppercase">Create Account</h2>
           <p className="text-zinc-600 font-bold border-b-4 border-[#FF4F00] inline-block pb-1">Start your learning journey.</p>
        </div>

        {error && <div className="p-4 mb-6 bg-[#FF4F00] text-white border-[3px] border-zinc-900 font-black text-center text-sm shadow-[4px_4px_0_0_rgba(24,24,27,1)] uppercase">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-2">
             <label className="text-sm font-black text-zinc-900 tracking-wider uppercase">Full Name</label>
             <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-white border-[3px] border-zinc-900 px-5 py-3.5 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-0 focus:border-[#FF4F00] focus:shadow-[4px_4px_0_0_rgba(255,79,0,1)] transition-all font-bold" placeholder="John Doe" />
          </div>

          <div className="space-y-2">
             <label className="text-sm font-black text-zinc-900 tracking-wider uppercase">Email</label>
             <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-white border-[3px] border-zinc-900 px-5 py-3.5 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-0 focus:border-[#FF4F00] focus:shadow-[4px_4px_0_0_rgba(255,79,0,1)] transition-all font-bold" placeholder="name@example.com" />
          </div>

          <div className="space-y-2">
             <label className="text-sm font-black text-zinc-900 tracking-wider uppercase">Password</label>
             <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-white border-[3px] border-zinc-900 px-5 py-3.5 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-0 focus:border-[#FF4F00] focus:shadow-[4px_4px_0_0_rgba(255,79,0,1)] transition-all font-bold" placeholder="••••••••" />
          </div>

          <button type="submit" disabled={loading} className="w-full py-4 bg-[#FF4F00] text-white border-[3px] border-zinc-900 font-black text-xl hover:bg-[#FF3300] hover:-translate-y-1 hover:shadow-[6px_6px_0_0_rgba(24,24,27,1)] active:translate-y-0 active:shadow-none transition-all disabled:opacity-50 mt-6 uppercase tracking-widest shadow-[4px_4px_0_0_rgba(24,24,27,1)]">
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-8 text-center text-zinc-600 font-bold text-sm bg-zinc-100 p-4 border-[2px] border-zinc-900">
           Already have an account? <Link href="/login" className="text-[#FF4F00] hover:text-[#FF3300] underline decoration-2 underline-offset-4 ml-1">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
