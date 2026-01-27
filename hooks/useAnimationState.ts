import { create } from 'zustand'

interface AnimationState {
  isTransitioning: boolean
  showHeader: boolean

  targetPath: string | null
  setShowHeader: (v: boolean) => void

  startTransition: (path: string) => void
  finishTransition: () => void
   hasPlayedIntro: boolean
  setHasPlayedIntro: () => void
}

export const useAnimationState = create<AnimationState>((set) => ({
  isTransitioning: false,
  showHeader: false,

  targetPath: null,

  setShowHeader: (v) => set({ showHeader: v }),

  startTransition: (path) =>
  set({
    isTransitioning: true,
    targetPath: path,
  }),

  finishTransition: () =>
    set({ isTransitioning: false, targetPath: null }),

    hasPlayedIntro: false,

  setHasPlayedIntro: () => set({ hasPlayedIntro: true }),
}))
