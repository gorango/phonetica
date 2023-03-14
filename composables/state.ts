import type { Session } from './chat'

const useSharedState = createSharedComposable(useLocalStorage)

export function useLocalState() {
  return useSharedState('phonetica', {
    createdAt: Date.now(),
    audio: {
      isMuted: false,
      playbackRate: 1.5,
    },
    sessions: [] as Session[],
  }, { flush: 'sync' })
}
