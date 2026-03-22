// pages/cases.jsx
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { supabase, getUserCases, signOut } from '../lib/supabase'

const URGENCY = {
  CRITICAL: { color:'#de9090', bg:'rgba(139,32,32,0.1)', border:'rgba(139,32,32,0.4)' },
  HIGH:     { color:'#c4a060', bg:'rgba(180,120,30,0.1)', border:'rgba(180,120,30,0.35)' },
  MEDIUM:   { color:'#80a8d0', bg:'rgba(50,100,180,0.1)', border:'rgba(50,100,180,0.35)' },
  LOW:      { color:'#7a6e58', bg:'transparent', border:'rgba(200,168,75,0.2)' },
}

const FLAG_LABELS = {
  is_stateless:'Stateless', involves_minor:'Minor',
  deportation_risk:'Deportation Risk', trafficking_indicators:'Trafficking',
  child_abduction:'Child Abduction', mandate_human_lawyer:'Lawyer Required',
}

export default function CasesPage() {
  const router = useRouter()
  const [user, setUser]         = useState(null)
  const [cases, setCases]       = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [activeDoc, setActiveDoc] = useState(0)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push('/auth'); return }
      setUser(session.user)
      getUserCases().then(data => { setCases(data); if(data[0]) setSelected(data[0]) })
        .finally(() => setLoading(false))
    })
  }, [])

  async function handleSignOut() {
    await signOut()
    router.push('/auth')
  }

  if (loading) return (
    <div style={{minHeight:'100vh', background:'var(--ink)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Playfair Display',serif"}}>
      <style>{fonts}</style>
      <div style={{textAlign:'center'}}>
        <div style={s.lring}/>
        <div style={s.ltxt}>Retrieving your cases…</div>
      </div>
    </div>
  )

  return (
    <>
      <Head>
        <title>LEXSWARM — Case History</title>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet"/>
      </Head>
      <style>{`
        ${fonts}
        *{box-sizing:border-box;margin:0;padding:0}
        :root{
          --ink:#080d1a;--ink2:#0c1220;--ink3:#101828;--ink4:#141f35;
          --gold:#c8a84b;--gold-l:#e2c87a;
          --gold-line:rgba(200,168,75,0.32);--gold-faint:rgba(200,168,75,0.08);
          --cream:#e8e0ce;--cream2:#b8a88a;--cream3:#7a6e58;
        }
        body{font-family:'DM Sans',sans-serif;background:var(--ink);color:var(--cream);overflow-x:hidden}
        ::-webkit-scrollbar{width:3px} ::-webkit-scrollbar-thumb{background:var(--gold-line)}
        @keyframes rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pip{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(1.5)}}
        @keyframes wfill{from{width:0}to{width:var(--w)}}
      `}</style>

      {/* Nav */}
      <nav style={s.nav}>
        <div style={s.navLogo}>
          <div style={s.shield}>⚖</div>
          <span style={s.logoTxt}>LEX<span style={s.logoSub}>SWARM</span></span>
        </div>
        <div style={s.navRight}>
          <span style={s.navEmail}>{user?.email || user?.phone || 'User'}</span>
          <button style={s.navBtn} onClick={() => router.push('/')}>← New Case</button>
          <button style={s.navBtnOut} onClick={handleSignOut}>Sign Out</button>
        </div>
      </nav>

      <div style={s.layout}>

        {/* Sidebar */}
        <div style={s.sidebar}>
          <div style={s.sideHead}>
            <div style={s.sideOrnL}/><span style={s.sideHeadTxt}>Case History</span><div style={s.sideOrnR}/>
          </div>
          <div style={s.sideCount}>{cases.length} case{cases.length !== 1 ? 's' : ''} on record</div>

          {cases.length === 0 && (
            <div style={s.empty}>
              <div style={s.emptyIcon}>⚖</div>
              <div style={s.emptyTxt}>No cases on record. Submit your first case to begin.</div>
              <button style={s.emptyBtn} onClick={() => router.push('/')}>Analyze a Case</button>
            </div>
          )}

          {cases.map((c, i) => {
            const u = URGENCY[c.urgency] || URGENCY.MEDIUM
            const isActive = selected?.id === c.id
            return (
              <div key={c.id} onClick={() => { setSelected(c); setActiveDoc(0) }}
                style={{...s.caseItem, ...(isActive ? s.caseItemOn : {}),
                  animation:`rise .4s ${i*0.06}s both`}}>
                {isActive && <div style={s.caseItemBar}/>}
                <div style={s.caseItemTop}>
                  <span style={{...s.urgPill, color:u.color, background:u.bg, borderColor:u.border}}>
                    {c.urgency}
                  </span>
                  <span style={s.caseRef}>{c.case_ref}</span>
                </div>
                <div style={s.caseType}>{c.case_type} · {c.country}</div>
                <div style={s.casePreview}>{c.description.slice(0,90)}{c.description.length>90?'…':''}</div>
                <div style={s.caseDate}>
                  {new Date(c.created_at).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}
                </div>
              </div>
            )
          })}
        </div>

        {/* Main detail */}
        <div style={s.main}>
          {!selected ? (
            <div style={s.noSelect}>
              <div style={s.noSelectIcon}>⚖</div>
              <div style={s.noSelectTxt}>Select a case from the left to view details</div>
            </div>
          ) : (
            <CaseDetail c={selected} activeDoc={activeDoc} setActiveDoc={setActiveDoc}/>
          )}
        </div>

      </div>
    </>
  )
}

function CaseDetail({ c, activeDoc, setActiveDoc }) {
  const u = URGENCY[c.urgency] || URGENCY.MEDIUM
  const win = Math.round((c.win_probability || 0.5) * 100)
  const activeFlags = Object.entries(c.flags || {})
    .filter(([,v]) => v === true).map(([k]) => FLAG_LABELS[k] || k)
  const docs = c.documents || []

  return (
    <div style={s.detail}>

      {/* Critical alert */}
      {c.lawyer_alerted && (
        <div style={s.alert}>
          <div style={s.alertPip}/>
          <div style={s.alertTxt}>
            <strong>A volunteer lawyer was notified for this case.</strong>{' '}
            Expected response within {c.urgency === 'CRITICAL' ? '15 minutes' : '2 hours'}.
          </div>
        </div>
      )}

      {/* Case header */}
      <div style={s.detailCard}>
        {['ftl','ftr','fbl','fbr'].map(cn => <div key={cn} style={{...s.corner,...s[cn]}}/>)}
        <div style={s.detailRef}>Case Reference <span style={{color:'var(--gold)'}}>{c.case_ref}</span></div>
        <div style={s.detailType}>{c.case_type} case</div>
        <div style={s.chips}>
          <span style={{...s.chip, color:u.color, background:u.bg, borderColor:u.border}}>{c.urgency}</span>
          <span style={s.chip}>{c.country}</span>
          <span style={s.chip}>{(c.language||'EN').toUpperCase()}</span>
          {c.lawyer_alerted && <span style={{...s.chip, color:'#de9090', background:'rgba(139,32,32,0.1)', borderColor:'rgba(139,32,32,0.4)'}}>Lawyer Required</span>}
        </div>
        {activeFlags.length > 0 && (
          <div style={s.flagRow}>
            {activeFlags.map(f => <span key={f} style={s.flagPill}>{f}</span>)}
          </div>
        )}
      </div>

      {/* Description */}
      <SectionCard label="Case Description">
        <div style={s.descBox}>{c.description}</div>
      </SectionCard>

      {/* Win probability */}
      <div style={s.wcard}>
        <div style={s.wlbl}>Courtroom Win Probability</div>
        <div style={s.wnum}>{win}%</div>
        <div style={s.wtrack}>
          <div style={{...s.wfill, width:`${win}%`}}/>
        </div>
        <div style={s.wnote}>Based on 500-agent MiroFish swarm — judge · jury · prosecution · defence · opposing counsel</div>
      </div>

      {/* Legal rights */}
      {(c.legal_rights||[]).length > 0 && (
        <SectionCard label="Your Legal Rights" count={`${c.legal_rights.length} statutes found`}>
          {c.legal_rights.map((r, i) => (
            <div key={i} style={{...s.ri, ...(i===0?{paddingTop:0}:{}), ...(i===c.legal_rights.length-1?{borderBottom:'none',paddingBottom:0}:{})}}>
              <div style={s.rtit}>{r.right}</div>
              <div style={s.rst}>{r.statute}</div>
              <div style={s.rpl}>{r.plain_english||r.plain||r.meaning}</div>
            </div>
          ))}
        </SectionCard>
      )}

      {/* Action plan */}
      {(c.action_plan||[]).length > 0 && (
        <SectionCard label="Action Plan" count={`${c.action_plan.length} steps`}>
          {c.action_plan.map((a, i) => (
            <div key={i} style={{...s.ai, ...(i===0?{paddingTop:0}:{}), ...(i===c.action_plan.length-1?{borderBottom:'none',paddingBottom:0}:{})}}>
              <div style={{...s.anum, ...(a.requires_human||a.h?{color:'#c07070'}:{})}}>
                {a.step_number||a.n||i+1}
              </div>
              <div>
                <div style={s.atitle}>{a.action}</div>
                <div style={s.awhen}>{a.deadline||a.when}</div>
                <div style={s.ahow}>{a.how_to||a.how}</div>
                {(a.requires_human||a.h) && <span style={s.htag}>Requires Lawyer</span>}
              </div>
            </div>
          ))}
        </SectionCard>
      )}

      {/* Documents */}
      {docs.length > 0 && (
        <div style={s.docCard}>
          <div style={s.csh}>
            <div style={s.cdm}/>
            <div style={s.cst}>Generated Documents</div>
            <div style={s.csc}>{docs.length} ready to use</div>
          </div>
          <div style={s.dtabs}>
            {docs.map((d, i) => (
              <button key={i} style={{...s.dtab, ...(activeDoc===i?s.dtabOn:{})}}
                onClick={() => setActiveDoc(i)}>
                {d.title||d.doc_type}
              </button>
            ))}
          </div>
          <div style={s.dbody}>{docs[activeDoc]?.content||''}</div>
          <div style={s.crow}>
            <button style={s.cb} onClick={() => {
              navigator.clipboard.writeText(docs[activeDoc]?.content||'')
                .then(() => {})
            }}>Copy Document</button>
          </div>
        </div>
      )}

      <div style={s.caseFooter}>
        Submitted {new Date(c.created_at).toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
      </div>
    </div>
  )
}

function SectionCard({ label, count, children }) {
  return (
    <div style={s.cs}>
      <div style={s.csh}>
        <div style={s.cdm}/>
        <div style={s.cst}>{label}</div>
        {count && <div style={s.csc}>{count}</div>}
      </div>
      <div style={s.csb}>{children}</div>
    </div>
  )
}

const fonts = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');
`

const s = {
  // Loading
  lring:{ width:44,height:44,border:'1px solid rgba(200,168,75,0.3)',borderTop:'1px solid var(--gold)',borderRadius:'50%',margin:'0 auto 20px',animation:'spin 1.4s linear infinite' },
  ltxt:{ fontFamily:"'Playfair Display',serif",fontSize:20,fontStyle:'italic',color:'var(--cream2)' },

  // Nav
  nav:{ position:'sticky',top:0,zIndex:100,height:72,padding:'0 52px',display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(8,13,26,0.9)',borderBottom:'1px solid var(--gold-line)',backdropFilter:'blur(20px)',fontFamily:"'DM Sans',sans-serif" },
  shield:{ width:32,height:32,border:'1px solid var(--gold-line)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,color:'var(--gold)',flexShrink:0 },
  navLogo:{ display:'flex',alignItems:'center',gap:14 },
  logoTxt:{ fontFamily:"'Playfair Display',serif",fontSize:16,letterSpacing:5,color:'var(--gold)' },
  logoSub:{ color:'var(--cream2)',fontWeight:400 },
  navRight:{ display:'flex',alignItems:'center',gap:16 },
  navEmail:{ fontFamily:"'Playfair Display',serif",fontSize:11,letterSpacing:1,color:'var(--cream3)',fontStyle:'italic' },
  navBtn:{ fontFamily:"'Playfair Display',serif",fontSize:11,letterSpacing:2,textTransform:'uppercase',padding:'8px 20px',background:'var(--gold)',color:'var(--ink)',border:'none',cursor:'pointer',fontWeight:600 },
  navBtnOut:{ fontFamily:"'Playfair Display',serif",fontSize:11,letterSpacing:2,textTransform:'uppercase',padding:'7px 18px',border:'1px solid var(--gold-line)',color:'var(--cream3)',background:'transparent',cursor:'pointer' },

  // Layout
  layout:{ display:'flex',height:'calc(100vh - 72px)',overflow:'hidden' },

  // Sidebar
  sidebar:{ width:320,borderRight:'1px solid var(--gold-line)',overflowY:'auto',flexShrink:0,background:'var(--ink2)' },
  sideHead:{ padding:'24px 24px 4px',display:'flex',alignItems:'center',gap:0 },
  sideOrnL:{ flex:1,height:1,background:'var(--gold-line)' },
  sideOrnR:{ flex:1,height:1,background:'var(--gold-line)' },
  sideHeadTxt:{ fontFamily:"'Playfair Display',serif",fontSize:11,letterSpacing:3,textTransform:'uppercase',color:'var(--gold)',padding:'0 12px',whiteSpace:'nowrap' },
  sideCount:{ fontFamily:"'Playfair Display',serif",fontSize:11,letterSpacing:1,color:'var(--cream3)',fontStyle:'italic',textAlign:'center',padding:'0 24px 16px',borderBottom:'1px solid rgba(200,168,75,0.1)' },
  empty:{ padding:'48px 24px',textAlign:'center' },
  emptyIcon:{ fontSize:28,color:'var(--cream3)',marginBottom:16 },
  emptyTxt:{ fontFamily:"'Playfair Display',serif",fontSize:14,fontStyle:'italic',color:'var(--cream3)',lineHeight:1.7,marginBottom:20 },
  emptyBtn:{ fontFamily:"'Playfair Display',serif",fontSize:11,letterSpacing:2,textTransform:'uppercase',padding:'10px 22px',border:'1px solid var(--gold-line)',color:'var(--gold)',background:'transparent',cursor:'pointer' },
  caseItem:{ padding:'18px 24px',borderBottom:'1px solid rgba(200,168,75,0.06)',cursor:'pointer',transition:'background .15s',position:'relative' },
  caseItemOn:{ background:'var(--gold-faint)' },
  caseItemBar:{ position:'absolute',left:0,top:0,bottom:0,width:2,background:'var(--gold)' },
  caseItemTop:{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:7 },
  urgPill:{ fontFamily:"'Playfair Display',serif",fontSize:9,letterSpacing:2,textTransform:'uppercase',padding:'3px 10px',border:'1px solid',fontWeight:400 },
  caseRef:{ fontFamily:"'DM Mono',monospace",fontSize:10,color:'var(--cream3)' },
  caseType:{ fontFamily:"'Playfair Display',serif",fontSize:12,letterSpacing:1,color:'var(--cream2)',textTransform:'capitalize',marginBottom:6 },
  casePreview:{ fontSize:13,color:'var(--cream3)',lineHeight:1.5,marginBottom:7,fontStyle:'italic' },
  caseDate:{ fontFamily:"'Playfair Display',serif",fontSize:10,letterSpacing:1,color:'rgba(122,110,88,0.6)' },

  // Main
  main:{ flex:1,overflowY:'auto',background:'var(--ink)' },
  noSelect:{ height:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:16 },
  noSelectIcon:{ fontSize:32,color:'var(--cream3)' },
  noSelectTxt:{ fontFamily:"'Playfair Display',serif",fontSize:16,fontStyle:'italic',color:'var(--cream3)' },

  // Detail
  detail:{ padding:'36px 44px',maxWidth:820 },
  alert:{ display:'flex',alignItems:'center',gap:12,padding:'14px 20px',background:'rgba(139,32,32,0.1)',border:'1px solid rgba(139,32,32,0.4)',marginBottom:4 },
  alertPip:{ width:8,height:8,borderRadius:'50%',background:'#8b2020',flexShrink:0,animation:'pip 1.4s infinite' },
  alertTxt:{ fontSize:14,color:'#e08080',lineHeight:1.6,fontStyle:'italic' },

  // Case header card
  detailCard:{ border:'1px solid var(--gold-line)',background:'linear-gradient(160deg,var(--ink3),var(--ink2))',padding:'28px 32px',position:'relative',marginBottom:4 },
  corner:{ position:'absolute',width:14,height:14,borderColor:'var(--gold)',borderStyle:'solid' },
  ftl:{ top:-1,left:-1,borderWidth:'1px 0 0 1px' },
  ftr:{ top:-1,right:-1,borderWidth:'1px 1px 0 0' },
  fbl:{ bottom:-1,left:-1,borderWidth:'0 0 1px 1px' },
  fbr:{ bottom:-1,right:-1,borderWidth:'0 1px 1px 0' },
  detailRef:{ fontFamily:"'Playfair Display',serif",fontSize:11,letterSpacing:3,textTransform:'uppercase',color:'var(--cream3)',marginBottom:8 },
  detailType:{ fontFamily:"'Playfair Display',serif",fontSize:34,fontWeight:400,textTransform:'capitalize',color:'var(--cream)',marginBottom:16 },
  chips:{ display:'flex',gap:8,flexWrap:'wrap',marginBottom:8 },
  chip:{ fontFamily:"'Playfair Display',serif",fontSize:10,letterSpacing:2,textTransform:'uppercase',padding:'6px 14px',border:'1px solid rgba(200,168,75,0.2)',color:'var(--cream3)' },
  flagRow:{ display:'flex',flexWrap:'wrap',gap:8,marginTop:8 },
  flagPill:{ fontFamily:"'Playfair Display',serif",fontSize:9,letterSpacing:1.5,textTransform:'uppercase',padding:'4px 10px',border:'1px solid rgba(180,120,30,0.4)',color:'#c4a060',background:'rgba(180,120,30,0.06)' },

  // Description
  descBox:{ fontFamily:"'DM Sans',sans-serif",fontSize:15,color:'var(--cream2)',lineHeight:1.85,fontStyle:'italic',padding:'18px 22px',background:'rgba(8,13,26,0.5)',borderLeft:'2px solid var(--gold-line)' },

  // Win probability
  wcard:{ border:'1px solid rgba(200,168,75,0.15)',background:'linear-gradient(160deg,var(--ink3),var(--ink2))',padding:'26px 32px',marginBottom:4 },
  wlbl:{ fontFamily:"'Playfair Display',serif",fontSize:11,letterSpacing:3,textTransform:'uppercase',color:'var(--cream3)',marginBottom:6 },
  wnum:{ fontFamily:"'Playfair Display',serif",fontSize:60,fontWeight:300,color:'var(--gold-l)',lineHeight:1,marginBottom:14 },
  wtrack:{ height:2,background:'rgba(200,168,75,0.15)',marginBottom:12 },
  wfill:{ height:'100%',background:'linear-gradient(90deg,var(--gold),var(--gold-l))' },
  wnote:{ fontSize:14,color:'var(--cream3)',fontStyle:'italic' },

  // Section card
  cs:{ border:'1px solid rgba(200,168,75,0.15)',background:'linear-gradient(160deg,var(--ink3),var(--ink2))',marginBottom:4,overflow:'hidden' },
  csh:{ padding:'16px 28px',borderBottom:'1px solid rgba(200,168,75,0.1)',display:'flex',alignItems:'center',gap:12 },
  cdm:{ width:6,height:6,border:'1px solid var(--gold)',transform:'rotate(45deg)',flexShrink:0 },
  cst:{ fontFamily:"'Playfair Display',serif",fontSize:11,letterSpacing:2,textTransform:'uppercase',color:'var(--gold)' },
  csc:{ marginLeft:'auto',fontFamily:"'Playfair Display',serif",fontSize:11,letterSpacing:1,color:'var(--cream3)' },
  csb:{ padding:'20px 28px' },

  // Rights
  ri:{ padding:'18px 0',borderBottom:'1px solid rgba(200,168,75,0.08)' },
  rtit:{ fontFamily:"'Playfair Display',serif",fontSize:20,color:'var(--cream)',marginBottom:5 },
  rst:{ fontFamily:"'Playfair Display',serif",fontSize:10,letterSpacing:1.5,textTransform:'uppercase',color:'var(--gold)',marginBottom:7 },
  rpl:{ fontSize:15,color:'var(--cream2)',lineHeight:1.75,fontStyle:'italic' },

  // Actions
  ai:{ display:'flex',gap:18,padding:'18px 0',borderBottom:'1px solid rgba(200,168,75,0.08)' },
  anum:{ fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:300,color:'var(--gold)',minWidth:24,flexShrink:0,marginTop:2 },
  atitle:{ fontFamily:"'Playfair Display',serif",fontSize:20,color:'var(--cream)',marginBottom:4 },
  awhen:{ fontFamily:"'Playfair Display',serif",fontSize:10,letterSpacing:2,textTransform:'uppercase',color:'#b08040',marginBottom:7 },
  ahow:{ fontSize:15,color:'var(--cream2)',lineHeight:1.75,fontStyle:'italic' },
  htag:{ display:'inline-block',fontFamily:"'Playfair Display',serif",fontSize:10,letterSpacing:1.5,textTransform:'uppercase',padding:'4px 10px',border:'1px solid rgba(139,32,32,0.4)',color:'#d09090',marginTop:6 },

  // Documents
  docCard:{ border:'1px solid rgba(200,168,75,0.15)',background:'linear-gradient(160deg,var(--ink3),var(--ink2))',marginBottom:4,overflow:'hidden' },
  dtabs:{ display:'flex',borderBottom:'1px solid rgba(200,168,75,0.1)' },
  dtab:{ fontFamily:"'Playfair Display',serif",fontSize:11,letterSpacing:2,textTransform:'uppercase',padding:'14px 22px',borderRight:'1px solid rgba(200,168,75,0.1)',color:'var(--cream3)',background:'transparent',cursor:'pointer',transition:'all .2s',borderBottom:'2px solid transparent',borderTop:'none',borderLeft:'none' },
  dtabOn:{ color:'var(--gold)',borderBottom:'2px solid var(--gold)',background:'var(--gold-faint)' },
  dbody:{ fontFamily:"'DM Mono',monospace",fontSize:12,lineHeight:2,color:'var(--cream2)',padding:'24px 28px',maxHeight:380,overflowY:'auto',whiteSpace:'pre-wrap',background:'rgba(8,13,26,0.5)' },
  crow:{ padding:'12px 28px',borderTop:'1px solid rgba(200,168,75,0.1)',display:'flex',justifyContent:'flex-end' },
  cb:{ fontFamily:"'Playfair Display',serif",fontSize:10,letterSpacing:2,textTransform:'uppercase',padding:'8px 18px',border:'1px solid rgba(200,168,75,0.2)',color:'var(--cream3)',background:'transparent',cursor:'pointer',transition:'all .2s' },

  // Footer
  caseFooter:{ fontFamily:"'Playfair Display',serif",fontSize:12,letterSpacing:1,color:'var(--cream3)',fontStyle:'italic',textAlign:'center',padding:'24px 0 8px',borderTop:'1px solid rgba(200,168,75,0.08)',marginTop:4 },
}
