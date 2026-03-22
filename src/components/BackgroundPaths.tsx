'use client'

import { useEffect, useRef } from 'react'

export default function BackgroundPaths() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const style = document.createElement('style')
    style.textContent = '@keyframes dp{0%{stroke-dashoffset:5000;opacity:.15}50%{opacity:.7}100%{stroke-dashoffset:0;opacity:.15}}'
    document.head.appendChild(style)
    for (let i = 0; i < 32; i++) {
      const pos = i % 2 === 0 ? 1 : -1
      const d = `M${-380 - i * 5 * pos} ${-189 + i * 6}C${-380 - i * 5 * pos} ${-189 + i * 6} ${-312 - i * 5 * pos} ${216 - i * 6} ${152 - i * 5 * pos} ${343 - i * 6}C${616 - i * 5 * pos} ${470 - i * 6} ${684 - i * 5 * pos} ${875 - i * 6} ${684 - i * 5 * pos} ${875 - i * 6}`
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      path.setAttribute('d', d)
      path.setAttribute('stroke', '#c8a84b')
      path.setAttribute('stroke-width', (0.25 + i * 0.025).toString())
      path.setAttribute('stroke-opacity', (0.03 + i * 0.018).toString())
      path.setAttribute('fill', 'none')
      const len = 3000 + i * 100
      path.style.cssText = `stroke-dasharray:${len};stroke-dashoffset:${len};animation:dp ${16 + Math.random() * 14}s ${i * 0.28}s linear infinite`
      svg.appendChild(path)
    }
    return () => { style.remove() }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
      <svg ref={svgRef} viewBox="0 0 1400 900" className="w-full h-full" />
    </div>
  )
}
