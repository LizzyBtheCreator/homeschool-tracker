import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { messages, systemPrompt, studentName } = await req.json()

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role,
        content: m.content,
      })),
    })

    const reply = response.content[0].type === 'text' ? response.content[0].text : "Hmm, try again!"

    return NextResponse.json({ reply })
  } catch (err) {
    console.error('buddy-chat error:', err)
    return NextResponse.json({ reply: "Oops! Something went wrong. Try again!" }, { status: 500 })
  }
}
