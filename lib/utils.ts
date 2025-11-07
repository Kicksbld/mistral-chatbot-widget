import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { customAlphabet } from 'nanoid'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate a unique API key for agents
export function generateApiKey(): string {
  const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 32)
  return `agent_${nanoid()}`
}

// Format date
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

// Format number with separators
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('fr-FR').format(num)
}

// Calculate cost based on tokens (approximate Mistral pricing)
export function calculateCost(tokens: number, model: string): number {
  // Approximate pricing per 1M tokens
  const pricing: Record<string, number> = {
    'mistral-small-latest': 1.0,
    'mistral-medium-latest': 2.7,
    'mistral-large-latest': 8.0,
  }

  const pricePerMillion = pricing[model] || 1.0
  return (tokens / 1_000_000) * pricePerMillion
}
