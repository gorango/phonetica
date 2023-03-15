import type { ChatCompletionRequestMessage, CreateChatCompletionRequest } from 'openai'

export default defineEventHandler(async (event) => {
  const messages: ChatCompletionRequestMessage[] = await readBody(event)

  if (!messages.length)
    return { statusCode: 500, message: 'No messages' }

  const completionOpts: CreateChatCompletionRequest = {
    model: 'gpt-3.5-turbo',
    messages,
    n: 1,
    max_tokens: 256, // 4096
    temperature: 0.9,
    stream: true,
  }

  return $fetch('https://api.openai.com/v1/chat/completions', {
    headers: {
      'Authorization': `Bearer ${process.env.GPT_KEY}`,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(completionOpts),
  })
})
