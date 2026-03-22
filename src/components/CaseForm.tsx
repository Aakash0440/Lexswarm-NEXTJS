'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { analyzeCase, type CaseResult } from '@/lib/api'

const EXAMPLES = [
  { label: 'PK Housing', text: 'My landlord changed the locks tonight and threw my belongings outside. I have nowhere to sleep. This is in Karachi, Pakistan.' },
  { label: 'US Wages', text: 'My employer has not paid my salary for 2 months and is threatening to fire me if I complain. This is in New York, United States.' },
  { label: 'Criminal Arrest', text: 'Police arrested me without showing any warrant. They have not told me what I am charged with. I need help immediately.' },
  { label: 'UK Eviction', text: 'My landlord gave me only 3 days notice to leave. I have an assured shorthold tenancy in London, England.' },
  { label: 'Indonesia Labour', text: 'Majikan saya tidak membayar gaji saya selama 3 bulan dan mengancam akan memecat saya di Jakarta, Indonesia.' },
]

const STEPS = ['Classifying', 'Retrieving Law', 'Simulating Courtroom', 'Drafting Documents', 'Action Plan']
const STEP_MSGS = [
  'Waking up the API server…',
  'Classifying your case…',
  'Retrieving applicable statutes…',
  'Simulating courtroom outcomes…',
  'Drafting legal documents…',
]
const STEPS_EXTENDED = [...STEPS, 'Building Plan']

interface Props {
  onResult: (result: CaseResult) => void
}

export default function CaseForm({ onResult }: Props) {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(-1)
  const [stepMsg, setStepMsg] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit() {
    if (!text.trim()) return
    setLoading(true)
    setError('')
    setStep(0)

    for (let i = 0; i < STEPS.length; i++) {
      await sleep(430)
      setStep(i)
      setStepMsg(STEP_MSGS[i])
    }

    try {
      const result = await analyzeCase(text)
      onResult(result)
    } catch (e) {
      setError('Could not reach the LEXSWARM API. Please check your connection.')
      console.error(e)
    } finally {
      setLoading(false)
      setStep(-1)
    }
  }

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-20 relative z-10">
      {/* Ornament */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="flex items-center gap-4 mb-10">
        <div className="w-16 h-px bg-gradient-to-r from-transparent to-[var(--gold)]" />
        <span className="font-display text-[11px] tracking-[5px] text-[var(--gold)] uppercase">AI Legal Defense System</span>
        <div className="w-16 h-px bg-gradient-to-l from-transparent to-[var(--gold)]" />
      </motion.div>

      {/* Hero title */}
      <motion.h1
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 1.2 }}
        className="font-display text-[clamp(52px,9vw,108px)] font-light leading-none tracking-[-2px] text-center mb-8">
        <span className="block text-[0.38em] tracking-[6px] font-normal text-[var(--cream3)] uppercase mb-3">Justice for</span>
        <span className="text-[var(--gold-light)] italic">Every</span>{' '}Human
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
        className="text-[19px] font-light italic text-[var(--cream2)] text-center max-w-[560px] leading-[1.9] mb-12">
        5 billion people face legal crises with no counsel. Describe your situation in any language — receive your rights, strategy, and court-ready documents in seconds.
      </motion.p>

      {/* Gold rule */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
        className="flex items-center gap-2 mb-10 w-[300px]">
        <div className="flex-1 h-px bg-[var(--gold-line)]" />
        <div className="w-2 h-2 border border-[var(--gold)] rotate-45 flex-shrink-0" />
        <div className="flex-1 h-px bg-[var(--gold-line)]" />
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
        className="flex border border-[var(--gold-line)] mb-14 relative before:absolute before:inset-0 before:bg-gradient-to-br before:from-[var(--gold-faint)] before:to-transparent">
        {[['100+', 'Languages'], ['15', 'Jurisdictions'], ['500', 'Swarm Agents'], ['Free', 'Always']].map(([n, l]) => (
          <div key={l} className="px-10 py-5 text-center border-r border-[var(--gold-line)] last:border-r-0">
            <span className="font-display text-[32px] font-light text-[var(--gold-light)] block leading-none">{n}</span>
            <span className="font-display text-[10px] tracking-[2px] uppercase text-[var(--cream3)] mt-1 block">{l}</span>
          </div>
        ))}
      </motion.div>

      {/* Input card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }}
        className="w-full max-w-[840px]">
        <div className="relative border border-[var(--gold-line)] bg-gradient-to-br from-[var(--ink3)] to-[var(--ink2)] p-10">
          <div className="frame-corner fc-tl" />
          <div className="frame-corner fc-tr" />
          <div className="frame-corner fc-bl" />
          <div className="frame-corner fc-br" />

          <label className="font-display text-[11px] tracking-[3px] uppercase text-[var(--gold)] block mb-3">
            Describe your legal situation
          </label>
          <textarea
            id="case-description"
          name="case-description"
          value={text}
            onChange={e => setText(e.target.value)}
            rows={5}
            placeholder="e.g. My landlord changed the locks tonight and threw my belongings outside. I have nowhere to sleep. This is in Karachi, Pakistan."
            className="w-full bg-[rgba(8,13,26,0.8)] border border-[rgba(200,168,75,0.2)] text-[var(--cream)] font-sans text-[17px] leading-[1.8] p-5 resize-none outline-none transition-colors duration-300 focus:border-[var(--gold-line)] placeholder:text-[var(--cream3)] placeholder:italic"
          />

          {/* Examples */}
          <div className="flex flex-wrap gap-2 mt-3 mb-6">
            {EXAMPLES.map(ex => (
              <button key={ex.label} onClick={() => setText(ex.text)}
                className="font-display text-[9px] tracking-[1.5px] uppercase px-3 py-[6px] border border-[rgba(200,168,75,0.2)] text-[var(--cream3)] hover:border-[var(--gold-line)] hover:text-[var(--gold)] transition-all duration-200">
                {ex.label}
              </button>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleSubmit}
              disabled={loading || !text.trim()}
              className="font-display text-[11px] tracking-[2.5px] uppercase px-10 py-[14px] bg-[var(--gold)] text-[var(--ink)] font-semibold transition-opacity duration-300 hover:opacity-90 disabled:bg-[var(--cream3)] disabled:text-[var(--ink2)] disabled:cursor-not-allowed">
              {loading ? 'Analyzing…' : 'Analyze My Case'}
            </button>
            <button onClick={() => setText('')}
              className="font-display text-[10px] tracking-[2px] uppercase px-6 py-3 border border-[var(--gold-line)] text-[var(--cream3)] hover:text-[var(--gold)] hover:border-[var(--gold)] transition-all duration-200">
              Clear
            </button>
            <span className="ml-auto text-[13px] italic text-[var(--cream3)]">No account required · Fully confidential</span>
          </div>
        </div>
      </motion.div>

      {/* Loading */}
      {loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-12 text-center">
          <div className="w-12 h-12 border border-[var(--gold-line)] border-t-[var(--gold)] rounded-full mx-auto mb-6"
            style={{ animation: 'spin 1.4s linear infinite' }} />
          <p className="font-display text-[20px] italic text-[var(--cream2)] mb-7">{stepMsg}</p>
          <div className="flex justify-center gap-2 flex-wrap">
            {STEPS.map((s, i) => (
              <span key={s} className={`font-display text-[9px] tracking-[1.5px] uppercase px-3 py-[5px] border transition-all duration-400
                ${i === step ? 'border-[var(--gold)] text-[var(--gold)] bg-[var(--gold-faint)]' :
                  i < step ? 'border-[rgba(200,168,75,0.15)] text-[var(--cream3)] opacity-30' :
                  'border-[rgba(200,168,75,0.15)] text-[var(--cream3)]'}`}>
                {s}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-6 w-full max-w-[840px] bg-[var(--red-bg)] border border-[var(--red-line)] px-6 py-4 text-[14px] text-[#e08080]">
          {error}
        </div>
      )}
    </section>
  )
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }
