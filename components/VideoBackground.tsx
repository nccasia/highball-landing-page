'use client'

import { useEffect, useRef } from 'react'

const VIDEO_PATH = {
  Morning: '/background/Morning.mp4',
  Noon: '/background/Noon.mp4',
  Evening: '/background/Evening.mp4',
  Night: '/background/Night.mp4',
}

function getJSTHour() {
  const now = new Date()
  const utc = now.getTime() + now.getTimezoneOffset() * 60000
  const JST_OFFSET = 9 * 60 // 9 hours in minutes
  return new Date(utc + JST_OFFSET * 60000).getHours()
}

function getCurrentBackground(): keyof typeof VIDEO_PATH {
  const hour = getJSTHour()
  if (hour >= 5 && hour < 8) return 'Morning'
  if (hour >= 8 && hour < 17) return 'Noon'
  if (hour >= 17 && hour < 19) return 'Evening'
  return 'Night'
}

export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Set video source based on time
    const bgType = getCurrentBackground()
    video.src = VIDEO_PATH[bgType]
    video.load()

    // Handle visibility change - pause when tab is hidden
    const handleVisibilityChange = () => {
      if (document.hidden) {
        video.pause()
      } else {
        video.play().catch(() => {})
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return (
    <video
      id="bg-video"
      ref={videoRef}
      className="move"
      muted
      loop
      playsInline
      preload="none"
    />
  )
}