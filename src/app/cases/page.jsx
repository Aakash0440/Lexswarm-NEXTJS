'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function CasesPage() {
  const router = useRouter()
  const [cases, setCases] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { router.push('/auth'); return }
      const { data: rows } = await supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false })
      setCases(rows || [])
      setLoading(false)
    })
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return (
    <div style={{ background: '#080d1a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c8a84b', fontFamily: 'serif', letterSpacing: '4px' }}>
      LOADING...
    </div>
  )

  return (
    <div style={{ background: '#080d1a', minHeight: '100vh', color: '#e8e0cc', fontFamily: 'serif' }}>
      <nav style={{ borderBottom: '1px solid rgba(200,168,75,0.2)', padding: '0 48px', height: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ color: '#c8a84b', textDecoration: 'none', letterSpacing: '5px', fontSize: 15 }}>LEXSWARM</a>
        <div style={{ display: 'flex', gap: 16 }}>
          <a href="/" style={{ color: '#c8a84b', textDecoration: 'none', fontSize: 11, letterSpacing: '2px' }}>NEW CASE</a>
          <button onClick={handleSignOut} style={{ background: 'none', border: '1px solid rgba(200,168,75,0.3)', color: '#a09070', padding: '6px 16px', cursor: 'pointer', fontSize: 11, letterSpacing: '2px' }}>SIGN OUT</button>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px', display: 'grid', gridTemplateColumns: '320px 1fr', gap: 32 }}>
        <div>
          <p style={{ fontSize: 11, letterSpacing: '3px', color: '#c8a84b', marginBottom: 16 }}>CASE HISTORY</p>
          {cases.length === 0 && <p style={{ color: '#6b6050', fontSize: 13 }}>No cases yet.</p>}
          {cases.map((c: any) => (
            <div key={c.id} onClick={() => setSelected(c)}
              style={{ borderLeft: `2px solid ${selected?.id === c.id ? '#c8a84b' : 'rgba(200,168,75,0.2)'}`, padding: '12px 16px', marginBottom: 8, cursor: 'pointer', background: selected?.id === c.id ? 'rgba(200,168,75,0.05)' : 'transparent' }}>
              <div style={{ fontSize: 11, letterSpacing: '2px', color: '#c8a84b' }}>{c.case_type?.toUpperCase()} · {c.country}</div>
              <div style={{ fontSize: 13, color: '#a09070', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.raw_description?.slice(0, 60)}...</div>
              <div style={{ fontSize: 11, color: '#6b6050', marginTop: 4 }}>{new Date(c.created_at).toLocaleDateString()}</div>
            </div>
          ))}
        </div>

        <div style={{ border: '1px solid rgba(200,168,75,0.15)', padding: 32 }}>
          {!selected ? (
            <p style={{ color: '#6b6050', fontSize: 13, fontStyle: 'italic' }}>Select a case to view details.</p>
          ) : (
            <>
              <p style={{ fontSize: 11, letterSpacing: '3px', color: '#c8a84b', marginBottom: 8 }}>CASE {selected.case_id}</p>
              <p style={{ fontSize: 13, color: '#a09070', marginBottom: 24 }}>{selected.raw_description}</p>
              <pre style={{ fontSize: 12, color: '#e8e0cc', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                {JSON.stringify(selected.result, null, 2)}
              </pre>
            </>
          )}
        </div>
      </div>
    </div>
  )
}