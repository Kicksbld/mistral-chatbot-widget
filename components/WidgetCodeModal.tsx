'use client'

import { useState } from 'react'
import type { Agent } from '@/lib/types'

interface WidgetCodeModalProps {
  isOpen: boolean
  onClose: () => void
  agent: Agent
}

export default function WidgetCodeModal({ isOpen, onClose, agent }: WidgetCodeModalProps) {
  const [copied, setCopied] = useState(false)

  const widgetCode = `<!-- Widget ChatBot AI - ${agent.name} -->
<div id="chatbot-widget-${agent.id}"></div>
<script>
  (function() {
    const widgetConfig = {
      apiUrl: '${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/widget/chat',
      apiKey: '${agent.api_key}',
      agentName: '${agent.name}',
      agentRole: '${agent.role}',
      position: 'bottom-right', // 'bottom-right', 'bottom-left'
      primaryColor: '#2563eb',
      greetingMessage: 'Bonjour ! Comment puis-je vous aider ?'
    };

    const script = document.createElement('script');
    script.src = '${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/widget.js';
    script.onload = function() {
      if (window.ChatbotWidget) {
        window.ChatbotWidget.init(widgetConfig);
      }
    };
    document.head.appendChild(script);

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/widget.css';
    document.head.appendChild(link);
  })();
</script>`

  const handleCopy = () => {
    navigator.clipboard.writeText(widgetCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Code d'intégration</h2>
              <p className="text-gray-600 mt-1">
                Agent: <span className="font-medium">{agent.name}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Instructions d'installation
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Copiez le code ci-dessous</li>
              <li>Collez-le juste avant la balise <code className="bg-gray-100 px-2 py-1 rounded">&lt;/body&gt;</code> de votre site</li>
              <li>Le widget apparaîtra automatiquement en bas à droite</li>
            </ol>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">
                Code HTML/JavaScript
              </label>
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
              >
                {copied ? 'Copié !' : 'Copier'}
              </button>
            </div>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{widgetCode}</code>
            </pre>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Configuration avancée</h4>
            <p className="text-sm text-blue-800">
              Vous pouvez personnaliser le widget en modifiant les options dans <code className="bg-blue-100 px-2 py-1 rounded">widgetConfig</code>:
            </p>
            <ul className="list-disc list-inside text-sm text-blue-800 mt-2 space-y-1">
              <li><strong>position</strong>: 'bottom-right' ou 'bottom-left'</li>
              <li><strong>primaryColor</strong>: Couleur principale en hexadécimal</li>
              <li><strong>greetingMessage</strong>: Message d'accueil personnalisé</li>
            </ul>
          </div>

          <div className="mt-6">
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
