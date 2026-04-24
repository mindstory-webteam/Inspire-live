"use client"

import { useRef, useState, useEffect } from "react"

// Row A — 4 cards, moves LEFT → RIGHT
const VIDEOS_ROW_A = [
  {
    src: "/video/reels/reels-1.mp4",
    label: "Adventure",
    tag: "Explore",
    title: "Into the Wild",
    desc: "Uncharted trails & mountain peaks",
  },
  {
    src: "/video/reels/reels-2.mp4",
    label: "Moments",
    tag: "Golden Hour",
    title: "Chasing Light",
    desc: "Sunsets that stop your breath",
  },
  {
    src: "/video/reels/reels-3.mp4",
    label: "Nature",
    tag: "Forest",
    title: "Forest Soul",
    desc: "Ancient trees, mossy silence",
  },
  {
    src: "/video/reels/reels-4.mp4",
    label: "City",
    tag: "Urban",
    title: "Neon Pulse",
    desc: "City nights that never sleep",
  },
]

// Row B — 4 cards, moves RIGHT → LEFT
const VIDEOS_ROW_B = [
  {
    src: "/video/reels/reels-1.mp4",
    label: "Explore",
    tag: "Ocean",
    title: "Deep Blue",
    desc: "Surf, dive & drift with the tide",
  },
  {
    src: "/video/reels/reels-2.mp4",
    label: "Wilderness",
    tag: "Safari",
    title: "Wild Kingdom",
    desc: "Untamed encounters at dawn",
  },
  {
    src: "/video/reels/reels-3.mp4",
    label: "Journey",
    tag: "Ancient",
    title: "Old Roads",
    desc: "Ruins, spice markets & culture",
  },
  {
    src: "/video/reels/reels-4.mp4",
    label: "Escape",
    tag: "Island",
    title: "Escape Route",
    desc: "Crystal coves & hidden bays",
  },
]

function ReelCard({ src, label, tag, title, desc }) {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)

  const toggle = (e) => {
    e.stopPropagation()
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      v.play()
      setPlaying(true)
    } else {
      v.pause()
      setPlaying(false)
    }
  }

  const toggleMute = (e) => {
    e.stopPropagation()
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
  }

  return (
    <div
      onClick={toggle}
      style={{
        position: "relative",
        width: 135,
        height: 240,
        flexShrink: 0,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 16,
        overflow: "hidden",
        cursor: "pointer",
        display: "inline-block",
        userSelect: "none",
      }}
    >
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
          pointerEvents: "none",
        }}
      />

      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Card content — bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "10px 10px 12px",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontSize: 9,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.65)",
            marginBottom: 3,
          }}
        >
          {tag}
        </div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#fff",
            lineHeight: 1.25,
            marginBottom: 3,
            textShadow: "0 1px 4px rgba(0,0,0,0.7)",
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", lineHeight: 1.35 }}>
          {desc}
        </div>
      </div>

      {/* Play icon — visible when paused */}
      {!playing && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.18)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg style={{ marginLeft: 2 }} width="16" height="16" viewBox="0 0 24 24" fill="white">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          </div>
        </div>
      )}

      {/* Mute toggle — visible when playing */}
      {playing && (
        <button
          onClick={toggleMute}
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(4px)",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            padding: 0,
          }}
        >
          {muted ? (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
              <path d="M16.5 12A4.5 4.5 0 0 0 14 8.07V15.93A4.5 4.5 0 0 0 16.5 12Z" />
              <path d="M3 9v6h4l5 5V4L7 9H3z" />
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
            </svg>
          )}
        </button>
      )}
    </div>
  )
}

// direction:  1 = LEFT → RIGHT (row scrolls rightward)
//            -1 = RIGHT → LEFT (row scrolls leftward)
function ScrollingRow({ videos, direction = 1 }) {
  const trackRef = useRef(null)
  const posRef = useRef(0)
  const velRef = useRef(0)
  const dragRef = useRef({ active: false, startX: 0, startPos: 0 })
  const scrollRef = useRef({ lastY: 0, lastTime: Date.now() })
  const hoveredRef = useRef(false)
  const rafRef = useRef(null)
  // Each card: 135px + 20px margin = 155px
  const CARD_W = 155

  useEffect(() => {
    const setWidth = videos.length * CARD_W
    let lastTime = performance.now()

    const tick = (now) => {
      const dt = Math.min(now - lastTime, 50)
      lastTime = now

      if (!dragRef.current.active) {
        if (hoveredRef.current) {
          // Smoothly brake to a stop on hover
          velRef.current *= 0.85
        } else {
          // direction  1 → velocity is positive → translateX grows → row moves RIGHT
          // direction -1 → velocity is negative → translateX shrinks → row moves LEFT
          const baseSpeed = direction === 1 ? 1.5 : -1.5
          velRef.current += (baseSpeed - velRef.current) * 0.05
        }
        posRef.current += velRef.current * (dt / 16)
      } else {
        velRef.current *= 0.92
        posRef.current += velRef.current * (dt / 16)
      }

      // Wrap within one set width so the loop is seamless
      posRef.current = ((posRef.current % setWidth) + setWidth) % setWidth

      // Apply transform: for direction 1 we shift right (+), for -1 we shift left (-)
      trackRef.current.style.transform =
        direction === 1
          ? `translateX(${posRef.current}px)`
          : `translateX(${-posRef.current}px)`

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [direction, videos.length])

  // Page-scroll nudges the rows
  useEffect(() => {
    const onScroll = () => {
      const now = Date.now()
      const dy = window.scrollY - scrollRef.current.lastY
      const dt = now - scrollRef.current.lastTime || 1
      const sv = (dy / dt) * 16
      // Scroll down nudges Row A rightward (+), Row B leftward (-)
      velRef.current += sv * (direction === 1 ? 0.8 : -0.8)
      scrollRef.current = { lastY: window.scrollY, lastTime: now }
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [direction])

  const onPointerDown = (e) => {
    dragRef.current = { active: true, startX: e.clientX, startPos: posRef.current }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e) => {
    if (!dragRef.current.active) return
    const dx = e.clientX - dragRef.current.startX
    const newPos = dragRef.current.startPos + dx * (direction === 1 ? 1 : -1)
    velRef.current = newPos - posRef.current
    posRef.current = newPos
  }

  const onPointerUp = () => {
    dragRef.current.active = false
  }

  return (
    <div
      style={{
        overflow: "hidden",
        width: "100%",
        paddingTop: 10,
        paddingBottom: 10,
        cursor: "grab",
        touchAction: "pan-y",
      }}
      onMouseEnter={() => { hoveredRef.current = true }}
      onMouseLeave={() => { hoveredRef.current = false }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      <div
        ref={trackRef}
        style={{ display: "flex", width: "max-content", willChange: "transform" }}
      >
        {/* 4 duplicate sets for a seamless infinite loop */}
        {[0, 1, 2, 3].map((copy) => (
          <div key={copy} style={{ display: "flex" }}>
            {videos.map((v, idx) => (
              <ReelCard key={idx} {...v} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function ReelsSection() {
  return (
    <section style={{ width: "100%", paddingTop: 80, paddingBottom: 80, overflow: "hidden" }}>

      {/* Heading */}
      <div className="sec-heading style-4 text-center" style={{ marginBottom: 48 }}>
        <span className="sub-title wow fadeInUp" data-wow-delay=".3s">
          <i className="tji-box"></i> Reels &amp; Moments
        </span>
        <h2 className="sec-title title-anim">
          Real Stories,{" "}
          <br />
          Real Vibes.
        </h2>
      </div>

      {/* Scrolling rows */}
      <div style={{ position: "relative" }}>
        {/* Row A: LEFT → RIGHT */}
        <ScrollingRow videos={VIDEOS_ROW_A} direction={1} />
        {/* Row B: RIGHT → LEFT */}
        <ScrollingRow videos={VIDEOS_ROW_B} direction={-1} />

        {/* Edge fades */}
        <div
          style={{
            position: "absolute",
            inset: "0 auto 0 0",
            width: "12%",
            background: "linear-gradient(to right, var(--background, #fff), transparent)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: "0 0 0 auto",
            width: "12%",
            background: "linear-gradient(to left, var(--background, #fff), transparent)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Instagram CTA */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, marginTop: 48 }}>
        <p style={{ margin: 0, fontSize: 15, color: "var(--color-text-secondary, #666)", textAlign: "center" }}>
          Watch more behind-the-scenes, tips &amp; live moments
        </p>
        <a
          href="https://www.instagram.com/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 28px",
            borderRadius: 50,
            background: "linear-gradient(135deg, #f9ce34, #ee2a7b, #6228d7)",
            color: "#fff",
            fontWeight: 600,
            fontSize: 14,
            textDecoration: "none",
            letterSpacing: "0.03em",
            boxShadow: "0 4px 20px rgba(238,42,123,0.35)",
            transition: "opacity 0.2s, transform 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.88"
            e.currentTarget.style.transform = "translateY(-2px)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1"
            e.currentTarget.style.transform = "translateY(0)"
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.5" cy="6.5" r="1" fill="white" stroke="none" />
          </svg>
          Follow us on Instagram
        </a>
      </div>

    </section>
  )
}