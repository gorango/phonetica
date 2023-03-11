import { oneLine } from 'common-tags'
import type { ChatCompletionRequestMessage, CreateChatCompletionRequest } from 'openai'
import { Configuration, OpenAIApi } from 'openai'

const messagesDict: Map<string, ChatCompletionRequestMessage[]> = new Map()

const systemPrompt = oneLine`
You are an entusiastic assistant with general knowledge and you reply to questions
with very brief answers. You also ask a lot of questions to get more information,
to continue the conversation, or to initiate a new one.
`

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const query = getQuery(event)
  const openai = new OpenAIApi(new Configuration({ apiKey: process.env.GPT_KEY }))

  if (!query.id)
    return { statusCode: 400, message: 'Missing id' }

  if (!body || !body.text)
    return { statusCode: 500, message: 'No body' }

  const { text: inputText } = body

  console.log(inputText) // eslint-disable-line no-console

  if (!messagesDict.get(query.id as string)) {
    messagesDict.set(query.id as string, [
      { role: 'system', content: systemPrompt },
    ])
  }
  const messages = messagesDict.get(query.id as string) as ChatCompletionRequestMessage[]
  messages.push({ role: 'user', content: inputText.trim(), name: 'user' })

  const completionOpts: CreateChatCompletionRequest = {
    model: 'gpt-3.5-turbo',
    messages,
    n: 1,
    max_tokens: 256,
    temperature: 0.9,
    // stream: true,
  }

  const response = await openai.createChatCompletion(completionOpts)
  // sendStream(event, response.data)

  if (response.status !== 200 || !response.data?.choices.length)
    return { statusCode: 500, message: 'No response from OpenAI' }

  const responseText = response.data?.choices[0]?.message?.content

  console.log(responseText) // eslint-disable-line no-console

  if (!responseText)
    return { statusCode: 500, message: 'No response from OpenAI' }

  messages.push({ role: 'assistant', content: responseText })

  return {
    statusCode: 200,
    text: responseText,
  }
})
