import { breakpointsTailwind } from '@vueuse/core'

const themes = [
  'light',
  'dark',
  'corporate',
  'business',
  'garden',
  'halloween',
  'retro',
  'dracula',
  'cyberpunk',
  'synthwave',
  'aqua',
  'night',
]

export function useTheme() {
  const colorMode = useColorMode()
  const cycle = useCycleList(themes)
  const screen = useBreakpoints(breakpointsTailwind)
  const breakpoints = reactive({
    sm: screen.greater('sm'),
    md: screen.greater('md'),
    lg: screen.greater('lg'),
    xl: screen.greater('xl'),
    xxl: screen.greater('2xl'),
  })

  onMounted(() => {
    cycle.index.value = themes.indexOf(colorMode.preference)
  })

  function next() {
    const pref = cycle.next()
    colorMode.preference = pref
  }

  function set(theme: string) {
    cycle.index.value = themes.indexOf(theme)
    colorMode.preference = theme
  }

  return {
    themes,
    colorMode,
    cycle,
    breakpoints,
    next,
    set,
  }
}
