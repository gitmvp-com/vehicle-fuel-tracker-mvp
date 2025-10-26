import { Base44 } from '@base44/client'

export const base44 = new Base44({
  apiKey: import.meta.env.VITE_BASE44_API_KEY || 'demo-key',
  projectId: import.meta.env.VITE_BASE44_PROJECT_ID || 'demo-project',
})