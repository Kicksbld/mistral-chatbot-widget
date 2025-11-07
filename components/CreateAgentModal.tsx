'use client'

import { useState } from 'react'
import type { Agent, CreateAgentInput } from '@/lib/types'
import { DEFAULT_MODEL } from '@/lib/types'

interface CreateAgentModalProps {
  isOpen: boolean
  onClose: () => void
  onAgentCreated: (agent: Agent) => void
}

export default function CreateAgentModal({
  isOpen,
  onClose,
  onAgentCreated,
}: CreateAgentModalProps) {
  const [formData, setFormData] = useState<CreateAgentInput>({
    name: '',
    role: 'assistant',
    instructions: '',
    model: DEFAULT_MODEL,
    temperature: 0.7,
    max_tokens: 1000,
    top_p: 1.0,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create agent')
      }

      onAgentCreated(data.agent)
      setFormData({
        name: '',
        role: 'assistant',
        instructions: '',
        model: DEFAULT_MODEL,
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 1.0,
      })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Créer un nouvel agent</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nom de l'agent *
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="ex: Agent Support Client"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Rôle
            </label>
            <input
              id="role"
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="ex: assistant, support agent, FAQ bot"
            />
          </div>

          <div>
            <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-2">
              Instructions système
            </label>
            <textarea
              id="instructions"
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Décrivez le comportement et les connaissances de votre agent..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">
                Modèle Mistral (Gratuit uniquement)
              </label>
              <select
                id="model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="open-mistral-7b">Mistral 7B (rapide et léger)</option>
                <option value="open-mixtral-8x7b">Mixtral 8x7B (équilibré)</option>
                <option value="mistral-small-2402">Mistral Small (performant)</option>
                <option value="codestral-latest">Codestral (spécialisé code)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Tous les modèles sont gratuits
              </p>
            </div>

            <div>
              <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-2">
                Température ({formData.temperature})
              </label>
              <input
                id="temperature"
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={formData.temperature}
                onChange={(e) =>
                  setFormData({ ...formData, temperature: parseFloat(e.target.value) })
                }
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">
                0 = précis, 1 = créatif
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="max_tokens" className="block text-sm font-medium text-gray-700 mb-2">
                Tokens max
              </label>
              <input
                id="max_tokens"
                type="number"
                min="100"
                max="4000"
                value={formData.max_tokens}
                onChange={(e) =>
                  setFormData({ ...formData, max_tokens: parseInt(e.target.value) })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="top_p" className="block text-sm font-medium text-gray-700 mb-2">
                Top P
              </label>
              <input
                id="top_p"
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={formData.top_p}
                onChange={(e) =>
                  setFormData({ ...formData, top_p: parseFloat(e.target.value) })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Création...' : 'Créer l\'agent'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
