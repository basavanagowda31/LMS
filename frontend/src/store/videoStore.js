import { create } from 'zustand';

export const useVideoStore = create((set, get) => ({
  progress: [],
  currentVideoId: null,

  setProgress: (progress) => set({ progress }),
  
  updateProgress: (videoId, lastPosition, isCompleted, isLocked) => {
    set((state) => ({
      progress: state.progress.map((p) => 
        p.videoId === videoId ? { ...p, lastPosition, isCompleted, isLocked } : p
      )
    }));
  },

  setCurrentVideoId: (id) => set({ currentVideoId: id }),
}));
