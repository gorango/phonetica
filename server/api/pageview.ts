const startAt = Date.now()
let count = 1

export default defineEventHandler(() => ({
  pageview: count++,
  startAt,
}))
