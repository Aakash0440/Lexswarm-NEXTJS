const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://lexswarm-production.up.railway.app'

export interface LegalRight {
  right: string
  statute: string
  plain: string
}

export interface Action {
  step_number?: number
  n?: number
  action: string
  deadline?: string
  when?: string
  how_to?: string
  how?: string
  requires_human?: boolean
  human?: boolean
}

export interface Document {
  title: string
  doc_type?: string
  content: string
}

export interface Simulation {
  win_probability: number
  recommended_strategy: string
  judge_concerns: string[]
}

export interface CaseResult {
  case_id: string
  case_type: string
  urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  country: string
  language: string
  escalation_score: number
  requires_human_lawyer: boolean
  human_volunteer_alerted: boolean
  legal_rights: LegalRight[]
  recommended_actions: Action[]
  simulation: Simulation
  documents: Document[]
}

export async function analyzeCase(description: string): Promise<CaseResult> {
  const res = await fetch(`${API_BASE}/cases/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description }),
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(5000) })
    return res.ok
  } catch {
    return false
  }
}
