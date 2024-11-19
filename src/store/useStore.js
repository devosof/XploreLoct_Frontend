import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      // Auth state
      user: null,
      accessToken: null,
      setUser: (user) => set({ user }),
      setAccessToken: (token) => set({ accessToken: token }),
      logout: () => set({ user: null, accessToken: null }),

      // Event state
      trendingEvents: [],
      setTrendingEvents: (events) => set({ trendingEvents: events }),
      interestedEvents: [],
      setInterestedEvents: (events) => set({ interestedEvents: events }),
      toggleEventInterest: (eventId) =>
        set((state) => ({
          interestedEvents: state.interestedEvents.some((e) => e.id === eventId)
            ? state.interestedEvents.filter((e) => e.id !== eventId)
            : [...state.interestedEvents, { id: eventId }],
        })),
    }),
    {
      name: 'xplorelct-storage',
    }
  )
);

export default useStore;