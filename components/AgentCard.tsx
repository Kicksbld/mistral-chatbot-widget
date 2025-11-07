'use client'

import { useState } from 'react'
import type { Agent } from '@/lib/types'
import { formatDate } from '@/lib/utils'

interface AgentCardProps {
  agent: Agent
  onDelete: (agentId: string) => void
  onShowWidget: (agent: Agent) => void
}

export default function AgentCard({ agent, onDelete, onShowWidget }: AgentCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async () => {
    if (!showConfirm) {
      setShowConfirm(true)
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/agents/${agent.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        onDelete(agent.id)
      }
    } catch (error) {
      console.error('Failed to delete agent:', error)
    } finally {
      setIsDeleting(false)
      setShowConfirm(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
          <p className="text-sm text-gray-600 mt-1">{agent.role}</p>
        </div>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            agent.is_active
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {agent.is_active ? 'Actif' : 'Inactif'}
        </span>
      </div>

      {agent.instructions && (
        <p className="text-sm text-gray-700 mb-4 line-clamp-2">
          {agent.instructions}
        </p>
      )}

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Modèle:</span>
          <span className="text-gray-900 font-medium">{agent.model}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Température:</span>
          <span className="text-gray-900 font-medium">{agent.temperature}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Créé le:</span>
          <span className="text-gray-900 font-medium">
            {new Date(agent.created_at).toLocaleDateString('fr-FR')}
          </span>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 flex gap-2">
        <button
          onClick={() => onShowWidget(agent)}
          className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
        >
          Code Widget
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className={`px-4 py-2 text-sm rounded-md transition-colors ${
            showConfirm
              ? 'bg-red-600 text-white hover:bg-red-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {isDeleting ? '...' : showConfirm ? 'Confirmer' : 'Supprimer'}
        </button>
      </div>

      {showConfirm && (
        <p className="text-xs text-red-600 mt-2 text-center">
          Cliquez à nouveau pour confirmer
        </p>
      )}
    </div>
  )
}
