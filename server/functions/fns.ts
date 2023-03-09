export async function sayHi(str = 'world') {
  const time = new Date().toLocaleTimeString()
  return `Hello ${str} from server at ${time} local time`
}
