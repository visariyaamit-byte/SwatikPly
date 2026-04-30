import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Merge Tailwind classes without conflicts
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Format date for display
export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

// Format phone number
export function formatPhone(phone) {
  if (!phone) return ''
  return phone.replace(/(\d{5})(\d{5})/, '$1 $2')
}