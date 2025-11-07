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

// All models are now free - no cost calculation needed
export function calculateCost(tokens: number, model: string): number {
  return 0 // All free models
}
