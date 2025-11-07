// Database types
export interface Agent {
  id: string
  user_id: string
  name: string
  role: string
  instructions: string | null
  model: string
  temperature: number
  max_tokens: number
  top_p: number
  api_key: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Conversation {
  id: string
  agent_id: string
  session_id: string
  visitor_id: string | null
  metadata: Record<string, any> | null
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  conversation_id: string
  role: 'user' | 'assistant'
  content: string
  tokens_used: number | null
  response_time_ms: number | null
  created_at: string
}

export interface AgentStatistics {
  agent_id: string
  user_id: string
  name: string
  total_conversations: number
  total_messages: number
  user_messages: number
  assistant_messages: number
  total_tokens_used: number
  avg_response_time_ms: number
  last_conversation_date: string | null
}

// Form types
export interface CreateAgentInput {
  name: string
  role?: string
  instructions?: string
  model?: string
  temperature?: number
  max_tokens?: number
  top_p?: number
}

export interface UpdateAgentInput extends Partial<CreateAgentInput> {
  is_active?: boolean
}

// API types
export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatRequest {
  message: string
  sessionId: string
  visitorId?: string
  metadata?: Record<string, any>
  conversationId?: string
}

export interface ChatResponse {
  message: string
  conversationId: string
  messageId: string
}

export interface ErrorResponse {
  error: string
  details?: string
}
