import type { ChatCompletionRequestMessage, CreateChatCompletionRequest } from 'openai'
import { Configuration, OpenAIApi } from 'openai'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const openai = new OpenAIApi(new Configuration({ apiKey: process.env.GPT_KEY }))

  if (!body || !body.messages)
    return { statusCode: 500, message: 'No messages' }

  const messages: ChatCompletionRequestMessage[] = JSON.parse(body.messages)

  const completionOpts: CreateChatCompletionRequest = {
    model: 'gpt-3.5-turbo',
    messages,
    n: 1,
    max_tokens: 512, // 4096
    temperature: 0.9,
  }

  const response = await openai.createChatCompletion(completionOpts)
  const responseText = response.data?.choices[0]?.message?.content

  if (response.status !== 200 || !responseText)
    return { statusCode: 500, message: 'No response from OpenAI' }

  return {
    statusCode: 200,
    content: responseText,
  }
})
