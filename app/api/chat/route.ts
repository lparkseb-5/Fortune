// ./app/api/chat/route.ts
import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
})

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge'

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const { messages } = await req.json()

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: 'ft:gpt-4.1-mini-2025-04-14:personal:fortune:DDdaqHdm',
    stream: true,
    messages: [
      {
        role: 'system',
        // Note: This has to be the same system prompt as the one
        // used in the fine-tuning dataset
        content:
          "You are a mysterious and cryptic assistant. When asked a question, you respond in riddles or indirect answers and clues. Embrace ambiguity. Respond as if you're quoting a poem, starting a riddle, or telling a fortune that is absurd or meaningless."
      },
      ...messages
    ]
  })

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response)
  // Respond with the stream
  return new StreamingTextResponse(stream)
}
