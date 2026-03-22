'use client'

import { useEffect } from 'react'

export default function Cursor() {
  useEffect(() => {
    const cur = document.getElementById('cursor')
    const trail = document.getElementById('cursor-trail')
    if (!cur || !trail) return
    let mx = 0, my = 0, tx = 0, ty = 0
    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY
      cur.style.left = mx + 'px'; cur.style.top = my + 'px'
    }
    document.addEventListener('mousemove', onMove)
    const interval = setInterval(() => {
      tx += (mx - tx) * 0.15; ty += (my - ty) * 0.15
      trail.style.left = tx + 'px'; trail.style.top = ty + 'px'
    }, 16)
    return () => { document.removeEventListener('mousemove', onMove); clearInterval(interval) }
  }, [])
  return (
    <>
      <div id="cursor" />
      <div id="cursor-trail" />
    </>
  )
}
