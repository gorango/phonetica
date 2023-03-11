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
    next,
    set,
  }
}
