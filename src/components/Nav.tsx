'use client'

const links = ['About', 'Jurisdictions', 'Documentation', 'GitHub', 'Contact']

export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center justify-between px-12 bg-[rgba(8,13,26,0.84)] backdrop-blur-xl border-b border-[var(--gold-line)] after:content-[''] after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-px after:bg-gradient-to-r after:from-transparent after:via-[var(--gold)] after:to-transparent after:opacity-40">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 border border-[var(--gold-line)] flex items-center justify-center text-[var(--gold)] text-sm">⚖</div>
        <span className="font-display text-[15px] tracking-[5px] text-[var(--gold)]">
          LEX<span className="text-[var(--cream2)] font-normal tracking-[4px]">SWARM</span>
        </span>
      </div>
      <div className="hidden md:flex gap-9">
        {links.map(l => (
          <a key={l} href="#"
            className="font-display text-[11px] tracking-[2px] uppercase text-[var(--cream3)] hover:text-[var(--gold)] transition-colors duration-300 relative group">
            {l}
            <span className="absolute -bottom-1 left-0 right-0 h-px bg-[var(--gold)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          </a>
        ))}
      </div>
      <div className="font-display text-[10px] tracking-[2px] px-4 py-[6px] border border-[var(--gold-line)] text-[var(--gold)]">
        v1.0 Live
      </div>
    </nav>
  )
}
