'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import type { CaseResult } from '@/lib/api'

interface Props { result: CaseResult; onReset: () => void }

export default function CaseResultView({ result, onReset }: Props) {
  const [activeDoc, setActiveDoc] = useState(0)
  const [winPct, setWinPct] = useState(0)
  const [copied, setCopied] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)

  const urg = result.urgency
  const urgClass = urg === 'CRITICAL' ? 'border-red-800/40 text-red-300 bg-red-900/10' :
    urg === 'HIGH' ? 'border-amber-700/40 text-amber-400' :
    'border-blue-700/40 text-blue-300 bg-blue-900/10'

  const win = Math.round((result.simulation?.win_probability || 0.5) * 100)

  useEffect(() => {
    const timer = setTimeout(() => {
      let v = 0
      const interval = setInterval(() => {
        v += 2
        setWinPct(Math.min(v, win))
        if (v >= win) clearInterval(interval)
      }, 20)
      return () => clearInterval(interval)
    }, 400)
    return () => clearTimeout(timer)
  }, [win])

  function copyDoc() {
    const content = result.documents?.[activeDoc]?.content || ''
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const fade = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } }

  return (
    <section className="w-full max-w-[840px] mx-auto px-6 pb-20 relative z-10">
      {/* Back button */}
      <motion.button {...fade} transition={{ delay: 0 }} onClick={onReset}
        className="mb-8 font-display text-[10px] tracking-[2px] uppercase text-[var(--cream3)] hover:text-[var(--gold)] transition-colors flex items-center gap-2">
        ← New Case
      </motion.button>

      {/* Critical alert */}
      {(result.human_volunteer_alerted || urg === 'CRITICAL') && (
        <motion.div {...fade} transition={{ delay: 0.05 }}
          className="flex items-center gap-3 px-6 py-4 bg-[var(--red-bg)] border border-[var(--red-line)] mb-1">
          <div className="w-2 h-2 rounded-full bg-red-600 flex-shrink-0" style={{ animation: 'pulse-dot 1.4s infinite' }} />
          <p className="text-[14px] text-red-300">
            <strong>Critical situation detected.</strong> A volunteer lawyer has been notified.
            Expected response within {urg === 'CRITICAL' ? '15 minutes' : '2 hours'}.
          </p>
        </motion.div>
      )}

      {/* Case card */}
      <motion.div {...fade} transition={{ delay: 0.1 }}
        className="relative border border-[var(--gold-line)] bg-gradient-to-br from-[var(--ink3)] to-[var(--ink2)] p-8 mb-1">
        <div className="frame-corner fc-tl" /><div className="frame-corner fc-tr" />
        <div className="frame-corner fc-bl" /><div className="frame-corner fc-br" />
        <p className="font-display text-[10px] tracking-[3px] text-[var(--cream3)] mb-2">
          Case Reference <span className="text-[var(--gold)]">{result.case_id}</span>
        </p>
        <h2 className="font-display text-[30px] capitalize text-[var(--cream)] mb-4">
          {result.case_type || 'General'} case
        </h2>
        <div className="flex gap-2 flex-wrap">
          <span className={`font-display text-[9px] tracking-[2px] uppercase px-3 py-[5px] border ${urgClass}`}>{urg}</span>
          <span className="font-display text-[9px] tracking-[2px] uppercase px-3 py-[5px] border border-[rgba(200,168,75,0.2)] text-[var(--cream3)]">{result.country}</span>
          <span className="font-display text-[9px] tracking-[2px] uppercase px-3 py-[5px] border border-[rgba(200,168,75,0.2)] text-[var(--cream3)]">{(result.language || 'EN').toUpperCase()}</span>
          {result.requires_human_lawyer && (
            <span className="font-display text-[9px] tracking-[2px] uppercase px-3 py-[5px] border border-red-800/40 text-red-300 bg-red-900/10">Lawyer Required</span>
          )}
        </div>
      </motion.div>

      {/* Win probability */}
      <motion.div {...fade} transition={{ delay: 0.15 }}
        className="border border-[rgba(200,168,75,0.15)] bg-gradient-to-br from-[var(--ink3)] to-[var(--ink2)] p-8 mb-1">
        <p className="font-display text-[10px] tracking-[3px] uppercase text-[var(--cream3)] mb-1">Courtroom win probability</p>
        <div className="font-display text-[58px] font-light text-[var(--gold-light)] leading-none mb-3">{winPct}%</div>
        <div className="h-[2px] bg-[rgba(200,168,75,0.12)] mb-3">
          <div ref={barRef} className="h-full bg-gradient-to-r from-[var(--gold)] to-[var(--gold-light)] transition-all duration-1000"
            style={{ width: `${winPct}%` }} />
        </div>
        <p className="text-[13px] italic text-[var(--cream3)]">
          Based on 500-agent MiroFish swarm — judge · jury · prosecution · defence · opposing counsel
        </p>
      </motion.div>

      {/* Legal rights */}
      {result.legal_rights?.length > 0 && (
        <motion.div {...fade} transition={{ delay: 0.2 }}
          className="border border-[rgba(200,168,75,0.15)] bg-gradient-to-br from-[var(--ink3)] to-[var(--ink2)] mb-1 overflow-hidden">
          <div className="px-7 py-[18px] border-b border-[rgba(200,168,75,0.1)] flex items-center gap-3">
            <div className="w-[6px] h-[6px] border border-[var(--gold)] rotate-45 flex-shrink-0" />
            <span className="font-display text-[11px] tracking-[2px] uppercase text-[var(--gold)]">Your Legal Rights</span>
            <span className="ml-auto font-display text-[10px] tracking-[1px] text-[var(--cream3)]">{result.legal_rights.length} statutes found</span>
          </div>
          <div className="px-7 py-6">
            {result.legal_rights.map((r, i) => (
              <div key={i} className="py-5 border-b border-[rgba(200,168,75,0.08)] last:border-b-0 last:pb-0 first:pt-0">
                <h3 className="font-display text-[20px] text-[var(--cream)] mb-1">{r.right}</h3>
                <p className="font-display text-[9px] tracking-[1.5px] uppercase text-[var(--gold)] mb-2">{r.statute}</p>
                <p className="text-[15px] italic text-[var(--cream2)] leading-[1.75]">{r.plain}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Action plan */}
      {result.recommended_actions?.length > 0 && (
        <motion.div {...fade} transition={{ delay: 0.25 }}
          className="border border-[rgba(200,168,75,0.15)] bg-gradient-to-br from-[var(--ink3)] to-[var(--ink2)] mb-1 overflow-hidden">
          <div className="px-7 py-[18px] border-b border-[rgba(200,168,75,0.1)] flex items-center gap-3">
            <div className="w-[6px] h-[6px] border border-[var(--gold)] rotate-45 flex-shrink-0" />
            <span className="font-display text-[11px] tracking-[2px] uppercase text-[var(--gold)]">Action Plan</span>
            <span className="ml-auto font-display text-[10px] tracking-[1px] text-[var(--cream3)]">{result.recommended_actions.length} steps</span>
          </div>
          <div className="px-7 py-6">
            {result.recommended_actions.map((a, i) => {
              const isHuman = a.requires_human || (a as any).human || (a as any).h
              return (
                <div key={i} className="flex gap-5 py-5 border-b border-[rgba(200,168,75,0.08)] last:border-b-0 last:pb-0 first:pt-0">
                  <div className={`font-display text-[22px] font-light flex-shrink-0 mt-1 ${isHuman ? 'text-red-400' : 'text-[var(--gold)]'}`}>
                    {a.step_number || (a as any).n || i + 1}
                  </div>
                  <div>
                    <h4 className="font-display text-[19px] text-[var(--cream)] mb-1">{a.action}</h4>
                    <p className="font-display text-[9px] tracking-[2px] uppercase text-amber-600 mb-2">{a.deadline || (a as any).when}</p>
                    <p className="text-[14px] italic text-[var(--cream2)] leading-[1.75]">{a.how_to || (a as any).how}</p>
                    {isHuman && (
                      <span className="inline-block mt-2 font-display text-[8px] tracking-[1.5px] uppercase px-2 py-1 border border-red-800/40 text-red-300">
                        Requires Lawyer
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Courtroom strategy */}
      {result.simulation && (
        <motion.div {...fade} transition={{ delay: 0.3 }}
          className="border border-[rgba(200,168,75,0.15)] bg-gradient-to-br from-[var(--ink3)] to-[var(--ink2)] mb-1 overflow-hidden">
          <div className="px-7 py-[18px] border-b border-[rgba(200,168,75,0.1)] flex items-center gap-3">
            <div className="w-[6px] h-[6px] border border-[var(--gold)] rotate-45 flex-shrink-0" />
            <span className="font-display text-[11px] tracking-[2px] uppercase text-[var(--gold)]">Courtroom Strategy</span>
            <span className="ml-auto font-display text-[10px] tracking-[1px] text-[var(--cream3)]">MiroFish simulation</span>
          </div>
          <div className="px-7 py-6">
            <blockquote className="bg-[rgba(8,13,26,0.6)] border-l-2 border-[var(--gold)] px-6 py-5 font-display text-[19px] italic text-[var(--cream)] leading-[1.85] mb-4">
              {result.simulation.recommended_strategy}
            </blockquote>
            {result.simulation.judge_concerns?.slice(0, 1).map((q, i) => (
              <div key={i} className="text-[14px] italic text-[var(--cream3)] px-4 py-3 bg-[rgba(8,13,26,0.4)] border-l border-amber-700/40">
                The judge will likely ask: &ldquo;{q}&rdquo;
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Documents */}
      {result.documents?.length > 0 && (
        <motion.div {...fade} transition={{ delay: 0.35 }}
          className="border border-[rgba(200,168,75,0.15)] bg-gradient-to-br from-[var(--ink3)] to-[var(--ink2)] mb-1 overflow-hidden">
          <div className="px-7 py-[18px] border-b border-[rgba(200,168,75,0.1)] flex items-center gap-3">
            <div className="w-[6px] h-[6px] border border-[var(--gold)] rotate-45 flex-shrink-0" />
            <span className="font-display text-[11px] tracking-[2px] uppercase text-[var(--gold)]">Generated Documents</span>
            <span className="ml-auto font-display text-[10px] tracking-[1px] text-[var(--cream3)]">{result.documents.length} ready to use</span>
          </div>
          <div className="flex border-b border-[rgba(200,168,75,0.1)]">
            {result.documents.map((doc, i) => (
              <button key={i} onClick={() => setActiveDoc(i)}
                className={`font-display text-[10px] tracking-[2px] uppercase px-5 py-[14px] border-r border-[rgba(200,168,75,0.1)] transition-all duration-200 border-b-2
                  ${i === activeDoc ? 'text-[var(--gold)] border-b-[var(--gold)] bg-[var(--gold-faint)]' : 'text-[var(--cream3)] border-b-transparent hover:text-[var(--cream2)]'}`}>
                {doc.title || doc.doc_type}
              </button>
            ))}
          </div>
          <pre className="font-mono text-[12px] leading-[2] text-[var(--cream2)] px-7 py-6 max-h-[400px] overflow-y-auto whitespace-pre-wrap bg-[rgba(8,13,26,0.5)]">
            {result.documents[activeDoc]?.content}
          </pre>
          <div className="px-7 py-4 border-t border-[rgba(200,168,75,0.1)] flex justify-end">
            <button onClick={copyDoc}
              className="font-display text-[9px] tracking-[2px] uppercase px-4 py-2 border border-[rgba(200,168,75,0.2)] text-[var(--cream3)] hover:border-[var(--gold-line)] hover:text-[var(--gold)] transition-all duration-200">
              {copied ? 'Copied' : 'Copy Document'}
            </button>
          </div>
        </motion.div>
      )}
    </section>
  )
}
