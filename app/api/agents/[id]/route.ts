import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { UpdateAgentInput } from '@/lib/types'
import { ALLOWED_FREE_MODELS } from '@/lib/types'

// GET /api/agents/:id - Get a specific agent
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params

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

    const { data: agent, error } = await supabase
      .from('agents')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error || !agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ agent })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/agents/:id - Update an agent
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params

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

    const body: UpdateAgentInput = await request.json()

    // Validate that only free models are used
    if (body.model !== undefined && !ALLOWED_FREE_MODELS.includes(body.model as any)) {
      return NextResponse.json(
        { error: `Model not allowed. Only free models are supported: ${ALLOWED_FREE_MODELS.join(', ')}` },
        { status: 400 }
      )
    }

    // Build update object with only provided fields
    const updateData: any = {}
    if (body.name !== undefined) updateData.name = body.name
    if (body.role !== undefined) updateData.role = body.role
    if (body.instructions !== undefined) updateData.instructions = body.instructions
    if (body.model !== undefined) updateData.model = body.model
    if (body.temperature !== undefined) updateData.temperature = body.temperature
    if (body.max_tokens !== undefined) updateData.max_tokens = body.max_tokens
    if (body.top_p !== undefined) updateData.top_p = body.top_p
    if (body.is_active !== undefined) updateData.is_active = body.is_active

    const { data: agent, error } = await supabase
      .from('agents')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error || !agent) {
      return NextResponse.json(
        { error: 'Failed to update agent', details: error?.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ agent })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/agents/:id - Delete an agent
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params

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

    const { error } = await supabase
      .from('agents')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete agent', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
