import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Mistral } from '@mistralai/mistralai'
import type { ChatRequest, ChatResponse } from '@/lib/types'

// Initialize Supabase with service role for widget API (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// POST /api/widget/chat - Handle chat messages from embedded widget
export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    // Get API key from headers
    const apiKey = request.headers.get('x-agent-api-key')
    console.log('API Key received:', apiKey)

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 401 }
      )
    }

    // Parse request body
    const body: ChatRequest = await request.json()
    console.log('Request body:', body)

    if (!body.message || !body.sessionId) {
      return NextResponse.json(
        { error: 'Message and sessionId are required' },
        { status: 400 }
      )
    }

    // Find agent by API key
    const { data: agent, error: agentError } = await supabaseAdmin
      .from('agents')
      .select('*')
      .eq('api_key', apiKey)
      .eq('is_active', true)
      .single()

    console.log('Agent found:', agent ? `${agent.name} (${agent.id})` : 'none')
    console.log('Agent error:', agentError)

    if (agentError || !agent) {
      return NextResponse.json(
        { error: 'Invalid API key or agent not found' },
        { status: 401 }
      )
    }

    // Find or create conversation
    let conversationId = body.conversationId

    if (!conversationId) {
      const { data: newConversation, error: convError } = await supabaseAdmin
        .from('conversations')
        .insert({
          agent_id: agent.id,
          session_id: body.sessionId,
          visitor_id: body.visitorId || null,
          metadata: body.metadata || null,
        })
        .select()
        .single()

      if (convError || !newConversation) {
        return NextResponse.json(
          { error: 'Failed to create conversation' },
          { status: 500 }
        )
      }

      conversationId = newConversation.id
    }

    // Save user message
    const { data: userMessage, error: userMessageError } = await supabaseAdmin
      .from('messages')
      .insert({
        conversation_id: conversationId,
        role: 'user',
        content: body.message,
      })
      .select()
      .single()

    if (userMessageError) {
      return NextResponse.json(
        { error: 'Failed to save user message' },
        { status: 500 }
      )
    }

    // Get conversation history (last 10 messages for context)
    const { data: history } = await supabaseAdmin
      .from('messages')
      .select('role, content')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(10)

    // Initialize Mistral client
    console.log('Initializing Mistral client...')
    const mistral = new Mistral({
      apiKey: process.env.MISTRAL_API_KEY!,
    })

    // Prepare messages for Mistral
    const messages = [
      {
        role: 'system' as const,
        content: agent.instructions || `Tu es ${agent.role}. Réponds de manière claire et utile.`,
      },
      ...(history || []).map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
    ]

    console.log('Calling Mistral API with model:', agent.model)
    console.log('Messages count:', messages.length)

    // Call Mistral API
    const chatResponse = await mistral.chat.complete({
      model: agent.model,
      messages,
      temperature: agent.temperature,
      maxTokens: agent.max_tokens,
      topP: agent.top_p,
    })

    console.log('Mistral response received:', chatResponse.choices?.[0]?.message?.content ? 'success' : 'empty')

    // Extract message content (handle both string and array formats)
    const messageContent = chatResponse.choices?.[0]?.message?.content
    let assistantMessage: string

    if (typeof messageContent === 'string') {
      assistantMessage = messageContent
    } else if (Array.isArray(messageContent)) {
      // Handle ContentChunk array - extract text from text chunks
      assistantMessage = messageContent
        .map(chunk => {
          if (typeof chunk === 'string') return chunk
          if ('text' in chunk) return chunk.text
          return ''
        })
        .join('')
    } else {
      assistantMessage = 'Désolé, je n\'ai pas pu générer une réponse.'
    }

    const tokensUsed = chatResponse.usage?.totalTokens || 0
    const responseTime = Date.now() - startTime

    // Save assistant message
    const { data: savedAssistantMessage, error: assistantMessageError } = await supabaseAdmin
      .from('messages')
      .insert({
        conversation_id: conversationId,
        role: 'assistant',
        content: assistantMessage,
        tokens_used: tokensUsed,
        response_time_ms: responseTime,
      })
      .select()
      .single()

    if (assistantMessageError) {
      return NextResponse.json(
        { error: 'Failed to save assistant message' },
        { status: 500 }
      )
    }

    const response: ChatResponse = {
      message: assistantMessage,
      conversationId: conversationId || '',
      messageId: savedAssistantMessage?.id || '',
    }

    console.log('Sending response:', response)
    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Chat API error:', error)
    console.error('Error stack:', error.stack)
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      cause: error.cause
    })

    // Handle specific Mistral API errors
    if (error.message?.includes('Status 429')) {
      return NextResponse.json(
        {
          error: 'Le quota Mistral AI a été dépassé. Veuillez réessayer dans quelques instants.',
          details: 'Rate limit exceeded'
        },
        { status: 429 }
      )
    }

    if (error.message?.includes('API error occurred')) {
      return NextResponse.json(
        {
          error: 'Erreur de l\'API Mistral AI. Vérifiez votre clé API et votre quota.',
          details: error.message
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

// OPTIONS /api/widget/chat - Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-agent-api-key',
    },
  })
}
