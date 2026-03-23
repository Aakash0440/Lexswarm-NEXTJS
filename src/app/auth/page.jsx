'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Head from 'next/head'
import { signUpEmail, signInEmail, signInGoogle } from '@/lib/supabase'

export default function AuthPage() {
  const router = useRouter()
  const [mode, setMode]         = useState('login')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleEmail(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'signup') await signUpEmail(email, password)
      else await signInEmail(email, password)
      router.push('/cases')
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  async function handleGoogle() {
    setError('')
    try { await signInGoogle() }
    catch (err) { setError(err.message) }
  }

  return (
    <>
      <Head>
        <title>LEXSWARM — Sign In</title>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet"/>
      </Head>

      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        :root{
          --ink:#080d1a;--ink2:#0c1220;--ink3:#101828;
          --gold:#c8a84b;--gold-l:#e2c87a;--gold-p:#f5e9c0;
          --gold-glow:rgba(200,168,75,0.16);--gold-line:rgba(200,168,75,0.32);--gold-faint:rgba(200,168,75,0.08);
          --cream:#e8e0ce;--cream2:#b8a88a;--cream3:#7a6e58;
          --red:#8b2020;--red-line:rgba(139,32,32,0.4);--red-bg:rgba(139,32,32,0.1);
        }
        body{font-family:'DM Sans',sans-serif;background:var(--ink);color:var(--cream);min-height:100vh}
        @keyframes rise{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .grain{position:fixed;inset:0;pointer-events:none;z-index:1;
          background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='250'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='250' height='250' filter='url(%23n)' opacity='.06'/%3E%3C/svg%3E");opacity:.55}
        input{-webkit-font-smoothing:antialiased}
        input:-webkit-autofill{-webkit-box-shadow:0 0 0 100px var(--ink3) inset!important;-webkit-text-fill-color:var(--cream)!important}
      `}</style>

      <div className="grain"/>

      <div style={s.page}>
        <div style={s.lineLeft}/>
        <div style={s.lineRight}/>

        <div style={s.card}>
          {['ftl','ftr','fbl','fbr'].map(c => <div key={c} style={{...s.corner, ...s[c]}}/>)}

          <div style={s.logo}>
            <div style={s.shield}>⚖</div>
            <span style={s.logoText}>LEX<span style={s.logoSub}>SWARM</span></span>
          </div>

          <div style={s.ornRule}>
            <div style={s.rl}/>
            <div style={s.rd}/>
            <div style={s.rl}/>
          </div>

          <div style={s.tagline}>Access your case history</div>

          {/* Tabs — email only */}
          <div style={s.tabs}>
            {[
              {id:'login', label:'Sign In'},
              {id:'signup', label:'Register'},
            ].map(t => (
              <button key={t.id} style={{...s.tab, ...(mode===t.id ? s.tabOn : {})}}
                onClick={() => { setMode(t.id); setError('') }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Google */}
          <button style={s.googleBtn} onClick={handleGoogle}>
            <svg width="16" height="16" viewBox="0 0 24 24" style={{marginRight:10,flexShrink:0}}>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div style={s.divider}>
            <div style={s.divLine}/>
            <span style={s.divTxt}>or</span>
            <div style={s.divLine}/>
          </div>

          <form onSubmit={handleEmail} style={s.form}>
            <div style={s.fieldWrap}>
              <label style={s.label}>Email Address</label>
              <input style={s.input} type="email" value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" required/>
            </div>
            <div style={s.fieldWrap}>
              <label style={s.label}>Password</label>
              <input style={s.input} type="password" value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required/>
            </div>
            <button style={{...s.submitBtn, opacity: loading ? .7 : 1}} type="submit" disabled={loading}>
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {error && (
            <div style={s.errorBox}>
              <span style={s.errorDot}/>
              {error}
            </div>
          )}

          <div style={s.ornRule}><div style={s.rl}/><div style={s.rd}/><div style={s.rl}/></div>

          <p style={s.footer}>
            LEXSWARM never sells your data. All cases are encrypted and confidential.{' '}
            <a href="/" style={s.footLink}>← Return home</a>
          </p>
        </div>
      </div>
    </>
  )
}

const s = {
  page:{
    minHeight:'100vh', background:'var(--ink)',
    display:'flex', alignItems:'center', justifyContent:'center',
    padding:'40px 20px', position:'relative', zIndex:2,
    fontFamily:"'DM Sans',sans-serif",
  },
  lineLeft:{
    position:'fixed', top:0, left:52, bottom:0,
    width:1, background:'linear-gradient(180deg,transparent,rgba(200,168,75,0.1),transparent)',
    pointerEvents:'none',
  },
  lineRight:{
    position:'fixed', top:0, right:52, bottom:0,
    width:1, background:'linear-gradient(180deg,transparent,rgba(200,168,75,0.1),transparent)',
    pointerEvents:'none',
  },
  card:{
    width:'100%', maxWidth:460,
    background:'linear-gradient(160deg,var(--ink3),var(--ink2))',
    border:'1px solid var(--gold-line)',
    padding:'44px 40px',
    position:'relative',
    animation:'rise .8s cubic-bezier(.16,1,.3,1) both',
  },
  corner:{ position:'absolute', width:14, height:14, borderColor:'var(--gold)', borderStyle:'solid' },
  ftl:{ top:-1, left:-1, borderWidth:'1px 0 0 1px' },
  ftr:{ top:-1, right:-1, borderWidth:'1px 1px 0 0' },
  fbl:{ bottom:-1, left:-1, borderWidth:'0 0 1px 1px' },
  fbr:{ bottom:-1, right:-1, borderWidth:'0 1px 1px 0' },
  logo:{
    display:'flex', alignItems:'center', justifyContent:'center',
    gap:14, marginBottom:20,
  },
  shield:{
    width:36, height:36, border:'1px solid var(--gold-line)',
    display:'flex', alignItems:'center', justifyContent:'center',
    fontSize:16, color:'var(--gold)',
  },
  logoText:{
    fontFamily:"'Playfair Display',serif",
    fontSize:18, letterSpacing:5, color:'var(--gold)',
  },
  logoSub:{ color:'var(--cream2)', fontWeight:400 },
  ornRule:{
    display:'flex', alignItems:'center', gap:0,
    margin:'16px 0',
  },
  rl:{ flex:1, height:1, background:'var(--gold-line)' },
  rd:{
    width:7, height:7, border:'1px solid var(--gold)',
    transform:'rotate(45deg)', margin:'0 10px', flexShrink:0,
  },
  tagline:{
    fontFamily:"'Playfair Display',serif",
    fontSize:13, letterSpacing:3, textTransform:'uppercase',
    color:'var(--cream3)', textAlign:'center', marginBottom:24,
    fontStyle:'italic',
  },
  tabs:{
    display:'flex',
    border:'1px solid rgba(200,168,75,0.15)',
    marginBottom:24,
  },
  tab:{
    flex:1, padding:'11px 0',
    fontFamily:"'Playfair Display',serif",
    fontSize:11, letterSpacing:2, textTransform:'uppercase',
    color:'var(--cream3)', background:'transparent',
    border:'none', borderRight:'1px solid rgba(200,168,75,0.15)',
    cursor:'pointer', transition:'all .2s',
  },
  tabOn:{
    color:'var(--gold)', background:'var(--gold-faint)',
  },
  googleBtn:{
    width:'100%', padding:'12px 16px',
    background:'rgba(255,255,255,0.04)',
    border:'1px solid rgba(200,168,75,0.2)',
    color:'var(--cream2)', cursor:'pointer',
    display:'flex', alignItems:'center', justifyContent:'center',
    fontFamily:"'Playfair Display',serif",
    fontSize:12, letterSpacing:2, textTransform:'uppercase',
    transition:'all .2s', marginBottom:16,
  },
  divider:{
    display:'flex', alignItems:'center', gap:12, marginBottom:16,
  },
  divLine:{ flex:1, height:1, background:'rgba(200,168,75,0.1)' },
  divTxt:{
    fontFamily:"'Playfair Display',serif",
    fontSize:11, letterSpacing:2, color:'var(--cream3)',
    textTransform:'uppercase',
  },
  form:{ display:'flex', flexDirection:'column', gap:14 },
  fieldWrap:{ display:'flex', flexDirection:'column', gap:7 },
  label:{
    fontFamily:"'Playfair Display',serif",
    fontSize:10, letterSpacing:2, textTransform:'uppercase',
    color:'var(--cream3)',
  },
  input:{
    padding:'12px 16px',
    background:'rgba(8,13,26,0.8)',
    border:'1px solid rgba(200,168,75,0.2)',
    color:'var(--cream)',
    fontFamily:"'DM Sans',sans-serif",
    fontSize:15, outline:'none', width:'100%',
    transition:'border-color .3s',
  },
  submitBtn:{
    padding:'14px',
    background:'var(--gold)',
    color:'var(--ink)',
    border:'none', cursor:'pointer',
    fontFamily:"'Playfair Display',serif",
    fontSize:12, letterSpacing:'2.5px',
    textTransform:'uppercase', fontWeight:600,
    marginTop:4, transition:'opacity .2s',
  },
  errorBox:{
    marginTop:14, padding:'12px 16px',
    background:'var(--red-bg)', border:'1px solid var(--red-line)',
    color:'#e08080', fontSize:13,
    display:'flex', alignItems:'center', gap:10,
    fontStyle:'italic',
  },
  errorDot:{
    width:6, height:6, borderRadius:'50%',
    background:'var(--red)', flexShrink:0,
  },
  footer:{
    fontSize:12, color:'var(--cream3)',
    textAlign:'center', lineHeight:1.7,
    fontStyle:'italic',
  },
  footLink:{
    color:'var(--gold)', textDecoration:'none',
  },
}