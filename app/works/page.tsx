'use client'

import { useEffect, useRef, useState } from 'react'
import { useAnimationState } from '@/hooks/useAnimationState'
import { worksData } from '@/lib/constants'

export default function WorksPage() {
  const [isVisible, setIsVisible] = useState(false)
  const [typingActive, setTypingActive] = useState(false)
  const worksListRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)
  const { setShowHeader } = useAnimationState()


  useEffect(() => {
    setShowHeader(true)
         const timer = setTimeout(() => {
      setIsVisible(true)
      setTimeout(() => setTypingActive(true), 300)
    }, 100)
    
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!worksListRef.current) return

    // Setup Intersection Observer for scroll animation
    const rows = worksListRef.current.querySelectorAll('.works-row')
    
    const scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            scrollObserver.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.3,
        rootMargin: '50px',
      }
    )

    rows.forEach((row) => scrollObserver.observe(row))

    // Setup video lazy loading
    const videos = worksListRef.current.querySelectorAll('video[data-src]')
    
    const videoObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const video = entry.target as HTMLVideoElement
            if (video.dataset.src && !video.src) {
              video.src = video.dataset.src
              video.load()
              video.play().catch(() => {})
            }
            videoObserver.unobserve(video)
          }
        })
      },
      { rootMargin: '300px', threshold: 0.1 }
    )

    videos.forEach((video) => videoObserver.observe(video))

    return () => {
      scrollObserver.disconnect()
      videoObserver.disconnect()
    }
  }, [])

  // Typing animation effect
  useEffect(() => {
    if (!typingActive || !textRef.current) return

    const text = `SWIPEDRAMA brings you bite-sized vertical dramas perfect for filling spare moments.
With episodes lasting just 1 minute, immerse yourself instantly in exciting stories about
romance, revenge, horror, and thrilling relationships.`

    const spans: string[] = []
    let delayIndex = 0

    for (const char of text) {
      if (char === '\n') {
        spans.push('<br>')
        continue
      }
      const displayChar = char === ' ' ? '&nbsp;' : char
      spans.push(`<span style="--d:${delayIndex}">${displayChar}</span>`)
      delayIndex++
    }

    textRef.current.innerHTML = spans.join('')
  }, [typingActive])

  return (
    <div id="works-page" className={isVisible ? 'show' : ''}>
      <div className="works-content">
        <div className="intro">
          <img 
            className={`intro-logo ${isVisible ? 'show' : ''}`}
            src="/images/Group 1011.svg" 
            alt="Logo" 
          />
          <p 
            id="typing-text" 
            ref={textRef}
            className={`typing-text ${typingActive ? 'typing-active' : ''}`}
          />
        </div>

        <div id="works-list" ref={worksListRef}>
          {renderWorksList(worksData)}
        </div>
      </div>
    </div>
  )
}

function renderWorksList(items: typeof worksData) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768
  const perRow = isMobile ? 2 : 4
  
  const rows = []
  for (let i = 0; i < items.length; i += perRow) {
    const rowItems = items.slice(i, i + perRow)
    rows.push(
      <div key={i} className="works-row">
        {rowItems.map((item, idx) => (
          <a
            key={idx}
            className="work-item"
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{ 
              transitionDelay: `${idx * 0.1}s` 
            }}
          >
            <video
              muted
              loop
              playsInline
              preload="none"
              data-src={item.source}
            />
          </a>
        ))}
      </div>
    )
  }
  return rows
}
