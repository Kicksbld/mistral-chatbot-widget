'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Agent } from '@/lib/types'
import type { User } from '@supabase/supabase-js'
import AgentCard from './AgentCard'
import CreateAgentModal from './CreateAgentModal'
import WidgetCodeModal from './WidgetCodeModal'

interface DashboardClientProps {
  initialAgents: Agent[]
  user: User
}

export default function DashboardClient({ initialAgents, user }: DashboardClientProps) {
  const router = useRouter()
  const [agents, setAgents] = useState<Agent[]>(initialAgents)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [isWidgetModalOpen, setIsWidgetModalOpen] = useState(false)

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  const handleAgentCreated = (newAgent: Agent) => {
    setAgents([newAgent, ...agents])
    setIsCreateModalOpen(false)
  }

  const handleAgentDeleted = (agentId: string) => {
    setAgents(agents.filter((a) => a.id !== agentId))
  }

  const handleShowWidget = (agent: Agent) => {
    setSelectedAgent(agent)
    setIsWidgetModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Mes Agents</h2>
            <p className="text-gray-600 mt-1">Gérez vos agents conversationnels</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
          >
            + Créer un agent
          </button>
        </div>

        {/* Agents Grid */}
        {agents.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Aucun agent</h3>
              <p className="mt-2 text-gray-600">
                Créez votre premier agent conversationnel pour commencer
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Créer mon premier agent
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                onDelete={handleAgentDeleted}
                onShowWidget={handleShowWidget}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <CreateAgentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onAgentCreated={handleAgentCreated}
      />

      {selectedAgent && (
        <WidgetCodeModal
          isOpen={isWidgetModalOpen}
          onClose={() => {
            setIsWidgetModalOpen(false)
            setSelectedAgent(null)
          }}
          agent={selectedAgent}
        />
      )}
    </div>
  )
}
