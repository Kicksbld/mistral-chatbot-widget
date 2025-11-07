import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateApiKey } from '@/lib/utils'
import type { CreateAgentInput } from '@/lib/types'
import { ALLOWED_FREE_MODELS, DEFAULT_MODEL } from '@/lib/types'

// GET /api/agents - List all agents for the authenticated user
export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data: agents, error } = await supabase
      .from('agents')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch agents', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ agents })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/agents - Create a new agent
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body: CreateAgentInput = await request.json()

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    // Generate unique API key for the agent
    const apiKey = generateApiKey()

    // Validate that only free models are used
    const selectedModel = body.model || DEFAULT_MODEL

    if (!ALLOWED_FREE_MODELS.includes(selectedModel as any)) {
      return NextResponse.json(
        { error: `Model not allowed. Only free models are supported: ${ALLOWED_FREE_MODELS.join(', ')}` },
        { status: 400 }
      )
    }

    const { data: agent, error } = await supabase
      .from('agents')
      .insert({
        user_id: user.id,
        name: body.name,
        role: body.role || 'assistant',
        instructions: body.instructions || null,
        model: selectedModel,
        temperature: body.temperature || 0.7,
        max_tokens: body.max_tokens || 1000,
        top_p: body.top_p || 1.0,
        api_key: apiKey,
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to create agent', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ agent }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
