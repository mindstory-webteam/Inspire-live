"use client"

import { useRef, useState, useEffect, useCallback } from "react"

const VIDEOS = [
  {
    src: "/video/reels/reels-1.mp4",
    poster: "/video/reels/thumb-1.jpg",
    tag: "Adventure",
    title: "Into the Wild",
    desc: "Uncharted trails & breathtaking mountain peaks waiting to be explored.",
    link: "/reels/adventure",
  },
  {
    src: "/video/reels/reels-2.mp4",
    poster: "/video/reels/thumb-2.jpg",
    tag: "Golden Hour",
    title: "Chasing Light",
    desc: "Sunsets that paint the sky in colours you won't believe are real.",
    link: "/reels/golden-hour",
  },
  {
    src: "/video/reels/reels-3.mp4",
    poster: "/video/reels/thumb-3.jpg",
    tag: "Forest",
    title: "Forest Soul",
    desc: "Ancient trees, mossy silence and air so fresh it feels brand new.",
    link: "/reels/forest",
  },
  {
    src: "/video/reels/reels-4.mp4",
    poster: "/video/reels/thumb-4.jpg",
    tag: "Urban",
    title: "Neon Pulse",
    desc: "City nights alive with energy, light and stories at every corner.",
    link: "/reels/urban",
  },
  {
    src: "/video/reels/reels-2.mp4",
    poster: "/video/reels/thumb-5.jpg",
    tag: "Ocean",
    title: "Deep Blue",
    desc: "Surf, dive and drift wherever the tide decides to take you today.",
    link: "/reels/ocean",
  },
 
]

const VISIBLE = 4

function VideoCard({ src, poster, tag, title, desc, link, isActive, onPlayingChange }) {
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [thumbReady, setThumbReady] = useState(false)

  useEffect(() => {
    if (!isActive && videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
      setPlaying(false)
      setProgress(0)
      onPlayingChange?.(false)
    }
  }, [isActive])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return

    const onTime = () => {
      if (v.duration) setProgress((v.currentTime / v.duration) * 100)
    }
    const onEnded = () => {
      setPlaying(false)
      setProgress(0)
      onPlayingChange?.(false)
    }
    const onSeeked = () => {
      if (!playing) setThumbReady(true)
    }

    v.addEventListener("timeupdate", onTime)
    v.addEventListener("ended", onEnded)
    v.addEventListener("seeked", onSeeked)

    // Seek to first frame to use as cover thumbnail
    v.preload = "metadata"
    v.load()
    const onLoaded = () => {
      v.currentTime = 0.01
    }
    v.addEventListener("loadedmetadata", onLoaded)

    return () => {
      v.removeEventListener("timeupdate", onTime)
      v.removeEventListener("ended", onEnded)
      v.removeEventListener("seeked", onSeeked)
      v.removeEventListener("loadedmetadata", onLoaded)
    }
  }, [])

  const handleCardClick = async (e) => {
    e.stopPropagation()
    const v = videoRef.current
    if (!v) return
    if (playing) {
      v.pause()
      setPlaying(false)
      onPlayingChange?.(false)
    } else {
      v.muted = false
      setMuted(false)
      try {
        await v.play()
        setPlaying(true)
        onPlayingChange?.(true)
      } catch {
        v.muted = true
        setMuted(true)
        await v.play()
        setPlaying(true)
        onPlayingChange?.(true)
      }
    }
  }

  const handleMute = (e) => {
    e.stopPropagation()
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
  }

  const handleLink = (e) => e.stopPropagation()

  return (
    <div
      className="vc-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleCardClick}
    >
      {!thumbReady && (
        <div
          className="vc-poster-fallback"
          style={{ backgroundImage: `url(${poster})` }}
        />
      )}

      <video
        ref={videoRef}
        src={src}
        loop={false}
        playsInline
        muted
        preload="metadata"
        className="vc-video"
        style={{ opacity: thumbReady || playing ? 1 : 0 }}
      />

      <div className="vc-gradient" />

      {playing && (
        <div className="vc-progress-track">
          <div className="vc-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      )}

      <div className={`vc-play-icon ${playing && !hovered ? "vc-hidden" : ""}`}>
        <div className="vc-play-circle">
          {playing ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <polygon points="6,3 20,12 6,21" />
            </svg>
          )}
        </div>
      </div>

      <div className="vc-bottom">
        <div className="vc-footer">
          {playing && (
            <button className="vc-mute" onClick={handleMute} title={muted ? "Unmute" : "Mute"}>
              {muted ? (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <line x1="23" y1="9" x2="17" y2="15" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <line x1="17" y1="9" x2="23" y2="15" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export function VideoReelsCarousel() {
  const [current, setCurrent] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const [videoPlaying, setVideoPlaying] = useState(false)
  const autoRef = useRef(null)
  const total = VIDEOS.length
  const maxIndex = total - VISIBLE

  const startAuto = useCallback(() => {
    clearInterval(autoRef.current)
    autoRef.current = setInterval(() => {
      setCurrent((c) => (c >= maxIndex ? 0 : c + 1))
    }, 2500)
  }, [maxIndex])

  const stopAuto = useCallback(() => {
    clearInterval(autoRef.current)
  }, [])

  useEffect(() => {
    if (!videoPlaying) {
      startAuto()
    } else {
      stopAuto()
    }
    return () => clearInterval(autoRef.current)
  }, [videoPlaying, startAuto, stopAuto])

  const goTo = useCallback((idx) => {
    if (transitioning) return
    const clamped = Math.max(0, Math.min(idx, maxIndex))
    setTransitioning(true)
    setCurrent(clamped)
    setTimeout(() => setTransitioning(false), 650)
  }, [transitioning, maxIndex])

  const offset = -(current * (100 / VISIBLE))

  return (
    <>
      <style>{`
        .vcc-wrap {
          --card-w: 25%;
          --gap: 16px;
          --radius: 18px;
          --accent: #1a598a;
          --accent-light: #2272b0;
          --accent2: #4a9fd4;
          width: 100%;
          padding: 70px 0 80px;
          background: #ecf0f0;
          position: relative;
          font-family: 'DM Sans', system-ui, sans-serif;
        }

        .vcc-head {
          text-align: center;
          padding: 0 24px;
          margin-bottom: 44px;
        }

        .vcc-viewport {
          position: relative;
          padding: 14px 16px;
          overflow: visible;
        }

        .vcc-track {
          display: flex;
          gap: var(--gap);
          transition: transform 0.65s cubic-bezier(0.33, 1, 0.68, 1);
          will-change: transform;
        }

        .vc-card {
          flex: 0 0 calc(var(--card-w) - var(--gap) * (var(--vis,4) - 1) / var(--vis,4));
          min-width: 0;
          height: 520px;
          border-radius: var(--radius);
          overflow: hidden;
          position: relative;
          cursor: pointer;
          background: #111 center/cover no-repeat;
          transition: transform 0.35s cubic-bezier(0.33, 1, 0.68, 1), box-shadow 0.35s ease;
          user-select: none;
          transform-origin: center center;
        }
        .vc-card:hover {
          transform: translateY(-10px) scale(1.03);
         
          z-index: 10;
        }

        .vc-poster-fallback {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center center;
          z-index: 1;
        }

        .vc-video {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          display: block;
          z-index: 2;
          transition: opacity 0.3s ease;
        }

        .vc-gradient {
          position: absolute;
          inset: 0;
          z-index: 3;
          background: linear-gradient(
            to top,
            rgba(0,0,0,0.75) 0%,
            rgba(0,0,0,0.15) 48%,
            rgba(0,0,0,0.02) 100%
          );
          pointer-events: none;
        }

        .vc-progress-track {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: rgba(255,255,255,0.12);
          z-index: 8;
          pointer-events: none;
        }
        .vc-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent), var(--accent2));
          transition: width 0.15s linear;
        }

        .vc-play-icon {
          position: absolute;
          inset: 0;
          z-index: 6;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          transition: opacity 0.25s ease;
        }
        .vc-hidden { opacity: 0; }
        .vc-play-circle {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: rgba(255,255,255,0.14);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.22);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.25s, transform 0.25s;
        }
        .vc-card:hover .vc-play-circle {
          background: rgba(26,89,138,0.65);
          border-color: rgba(26,89,138,0.85);
          transform: scale(1.12);
        }

        .vc-bottom {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          z-index: 7;
          padding: 16px 16px 18px;
          pointer-events: none;
        }
        .vc-footer {
          display: flex;
          align-items: center;
          gap: 8px;
          pointer-events: all;
        }
        .vc-mute {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(6px);
          border: 1px solid rgba(255,255,255,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          padding: 0;
          transition: background 0.2s;
        }
        .vc-mute:hover { background: rgba(26,89,138,0.4); }

        .vcc-dots {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 28px;
        }
        .vcc-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: rgba(26,89,138,0.3);
          border: none;
          padding: 0;
          cursor: pointer;
          transition: background 0.25s, width 0.3s ease;
        }
        .vcc-dot.active {
          background: #1a598a;
          width: 22px;
          border-radius: 4px;
        }
        .vcc-dot:hover:not(.active) {
          background: rgba(26,89,138,0.6);
        }

        .vcc-cta {
          display: flex;
          justify-content: center;
          margin-top: 36px;
        }
        .vcc-ig {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 11px 24px;
          border-radius: 50px;
          border: 1px solid rgba(26,89,138,0.3);
          background: rgba(26,89,138,0.06);
          color: #1a598a;
          font-size: 13px;
          font-weight: 400;
          text-decoration: none;
          backdrop-filter: blur(8px);
          transition: background 0.2s, border-color 0.2s, transform 0.2s;
        }
        .vcc-ig:hover {
          background: rgba(26,89,138,0.12);
          border-color: #1a598a;
          transform: translateY(-2px);
        }
        .vcc-ig svg { stroke: #1a598a; }

        @media (max-width: 768px) {
          .vcc-wrap { --card-w: 50%; }
          .vc-card { height: 400px; }
        }
        @media (max-width: 480px) {
          .vcc-wrap { --card-w: 85%; }
          .vc-card { height: 340px; }
        }
      `}</style>

      <div className="vcc-wrap">
        <div className="sec-heading style-4 text-center vcc-head">
          <span className="sub-title wow fadeInUp" data-wow-delay=".3s">
            <i className="tji-box"></i> Reels &amp; Moments
          </span>
          <h2 className="sec-title title-anim">
            Real Stories,
            <br />
            Real Vibes.
          </h2>
        </div>

        <div style={{ overflow: "hidden", paddingTop: "14px", paddingBottom: "14px", marginTop: "-14px", marginBottom: "-14px" }}>
          <div className="vcc-viewport">
            <div
              className="vcc-track"
              style={{ transform: `translateX(calc(${offset}% - ${current * 16 / VISIBLE}px))` }}
            >
              {VIDEOS.map((v, i) => {
                const isActive = i >= current && i < current + VISIBLE
                return (
                  <VideoCard
                    key={i}
                    {...v}
                    isActive={isActive}
                    onPlayingChange={(isPlaying) => setVideoPlaying(isPlaying)}
                  />
                )
              })}
            </div>
          </div>
        </div>

        <div className="vcc-dots">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              className={`vcc-dot ${current === i ? "active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <div className="vcc-cta">
          
           <a href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="vcc-ig"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
            Follow us on Instagram
          </a>
        </div>
      </div>
    </>
  )
}