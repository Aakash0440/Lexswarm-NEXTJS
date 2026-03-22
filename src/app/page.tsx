'use client'

import { useState } from 'react'
import BackgroundPaths from '@/components/BackgroundPaths'
import Cursor from '@/components/Cursor'
import Nav from '@/components/Nav'
import CaseForm from '@/components/CaseForm'
import CaseResultView from '@/components/CaseResultView'
import type { CaseResult } from '@/lib/api'

export default function Home() {
  const [result, setResult] = useState<CaseResult | null>(null)

  return (
    <>
      <Cursor />
      <BackgroundPaths />
      <Nav />
      <main>
        {!result ? (
          <CaseForm onResult={r => { setResult(r); window.scrollTo({ top: 0, behavior: 'smooth' }) }} />
        ) : (
          <div className="pt-24">
            <CaseResultView result={result} onReset={() => setResult(null)} />
          </div>
        )}
      </main>
      <footer className="relative z-10 border-t border-[rgba(200,168,75,0.15)] px-12 py-9 text-center">
        <div className="w-20 h-px bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent mx-auto mb-5" />
        <p className="font-display text-[13px] tracking-[5px] text-[var(--gold)] mb-3">LEXSWARM</p>
        <p className="text-[13px] italic text-[var(--cream3)] leading-[1.8] max-w-[580px] mx-auto">
          LEXSWARM provides legal information, not legal advice. All generated documents should be reviewed by a qualified lawyer before filing.
        </p>
      </footer>
    </>
  )
}
