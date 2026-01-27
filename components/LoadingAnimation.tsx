'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import lottie, { AnimationItem } from 'lottie-web'
import { useAnimationState } from '@/hooks/useAnimationState'
import { usePathname } from 'next/navigation'

export default function LoadingAnimation() {
  const spinnerRef = useRef<HTMLDivElement>(null)
  const logoLoadingRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const loadingWrapperRef = useRef<HTMLDivElement>(null)
  
  const { setShowHeader, setHasPlayedIntro, hasPlayedIntro } = useAnimationState()
  
  const spinnerAnimRef = useRef<AnimationItem | null>(null)
  const logoAnimRef = useRef<AnimationItem | null>(null)
  const pathname = usePathname()
  const hasRunPixelZoom = useRef(false)
  const rafId = useRef<number | null>(null)

  const isHomePage = useMemo(() => pathname === '/', [pathname])

  useEffect(() => {
    
    if (!isHomePage || hasPlayedIntro || !spinnerRef.current) return

    // Initialize spinner animation
    spinnerAnimRef.current = lottie.loadAnimation({
      container: spinnerRef.current,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      path: '/animation/spinner-v1.json',
      initialSegment: [0, 400],
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
      },
    })

    const onEnterFrame = (e: any) => {
      const currentTime = e.currentTime

      // Scale animation at frame 378
      if (currentTime >= 378 && spinnerRef.current) {
        spinnerRef.current.style.transform = 'scale(1)'
        
        // Show content using will-change for better performance
        const content = document.querySelector('.content') as HTMLElement
        if (content) {
          content.style.willChange = 'opacity'
          content.classList.add('show')
          // Remove will-change after animation
          setTimeout(() => {
            content.style.willChange = 'auto'
          }, 500)
        }
        
        // Play logo animation (only once)
      
      }

      if(currentTime >= 365) {
        // alert('1')

          if (!logoAnimRef.current && logoLoadingRef.current) {
             console.log('Playing logo animation')
          logoAnimRef.current = lottie.loadAnimation({
            container: logoLoadingRef.current,
            renderer: 'svg',
            loop: false,
            autoplay: true,
            path: 'animation/logo-animation.json',
          })
          
          logoAnimRef.current.addEventListener('complete', () => {
            setHasPlayedIntro()
          })
        }
      }

                  const ZOOM_START = 358
      const ZOOM_END = 400
   const video = document.getElementById('bg-video') as HTMLVideoElement
if (
  currentTime >= ZOOM_START &&
  currentTime <= ZOOM_END &&
  canvasRef.current &&
  video
) {
  canvasRef.current.style.opacity = '1'
  video.style.opacity = '0'

  renderPixelZoom(
    canvasRef.current,
    video,
    currentTime
  )
}

 
      // // Start pixel zoom at frame 358
      // if (currentTime >= 358 && !hasRunPixelZoom.current) {
      //   hasRunPixelZoom.current = true
        
      //   if (loadingWrapperRef.current) {
      //     loadingWrapperRef.current.style.background = 'transparent'
      //   }
        
      //   const isMobile = window.matchMedia('(max-width: 1024px)').matches
      //   const video = document.getElementById('bg-video') as HTMLVideoElement

 
        
      //   if (video && canvasRef.current) {
      //     if (isMobile) {
      //       runZoomMask(video, canvasRef.current)
      //     } else {
      //       // runPixelZoom(canvasRef.current, video)
      //     }
      //   }
      // }
    }

    const onComplete = () => {
      // Cleanup spinner animation
      if (spinnerAnimRef.current) {
        spinnerAnimRef.current.destroy()
        spinnerAnimRef.current = null
      }

      // Play background video
      setTimeout(() => {
        const video = document.getElementById('bg-video') as HTMLVideoElement
        if (video) {
          video.play().catch((err) => console.warn('Video autoplay failed:', err))
          video.classList.add('move')
        }
      }, 300)

      if (loadingWrapperRef.current) {
        loadingWrapperRef.current.style.backgroundColor = 'transparent'
      }

      // Show header and complete loading
      setShowHeader(true)
    }

    spinnerAnimRef.current.addEventListener('enterFrame', onEnterFrame)
    spinnerAnimRef.current.addEventListener('complete', onComplete)

    return () => {
      // Cancel any pending animation frames
      if (rafId.current) {
        cancelAnimationFrame(rafId.current)
        rafId.current = null
      }

      if (spinnerAnimRef.current) {
        spinnerAnimRef.current.removeEventListener('enterFrame', onEnterFrame)
        spinnerAnimRef.current.removeEventListener('complete', onComplete)
        spinnerAnimRef.current.destroy()
        spinnerAnimRef.current = null
      }
      
      if (logoAnimRef.current) {
        // logoAnimRef.current.destroy()
        // logoAnimRef.current = null
      }
    }
  }, [isHomePage, hasPlayedIntro, setShowHeader, setHasPlayedIntro])

  return (
    <>
      <div id="loading-wrapper" ref={loadingWrapperRef}>
        {isHomePage && !hasPlayedIntro && <div id="lottie" ref={spinnerRef}></div>}
        <div id="lottieBg" ref={logoLoadingRef}></div>
        <div id="overlay"></div>
      </div>
      
      <canvas 
        id="pixel-canvas" 
        ref={canvasRef}
        style={{ willChange: 'opacity, clip-path' }}
      />
    </>
  )
}

// Pixel zoom effect for desktop - Optimized
function runPixelZoom(canvas: HTMLCanvasElement, video: HTMLVideoElement) {
  const duration = 1500
  const pixelFrom = 100
  const pixelTo = 2
  const radiusMid = 40
  const radiusTo = 130
  const start = performance.now()
  
  // Pre-calculate values
  const radiusDiff1 = radiusMid - 0.1
  const radiusDiff2 = radiusTo - radiusMid
  const pixelDiff = pixelTo - pixelFrom * 0.7
  
  video.style.opacity = '0'
  canvas.style.opacity = '1'
  
  // Use will-change for better performance
  canvas.style.willChange = 'clip-path'
  video.style.willChange = 'opacity, clip-path'

  // Get context once
  const ctx = canvas.getContext('2d', {
    alpha: false,
    desynchronized: true,
    willReadFrequently: false,
  })

  let lastPixelSize = pixelFrom
  let rafId: number

  function animate(now: number) {
    const t = Math.min((now - start) / duration, 1)
    let radius: number
    let pixelSize: number

    if (t < 0.4) {
      const p = t / 0.4
      const eased = p ** 4.5 // Faster than Math.pow
      radius = 0.1 + radiusDiff1 * eased
      pixelSize = pixelFrom
    } else {
      const p = (t - 0.4) / 0.6
      const eased = 1 - (1 - p) ** 3.5
      radius = radiusMid + radiusDiff2 * eased
      pixelSize = pixelFrom * 0.7 + pixelDiff * eased
    }

    // Only resize canvas if pixel size changed significantly
    if (Math.abs(pixelSize - lastPixelSize) > 0.5) {
      canvas.width = Math.floor(window.innerWidth / pixelSize)
      canvas.height = Math.floor(window.innerHeight / pixelSize)
      lastPixelSize = pixelSize
    }

    if (ctx && video.readyState >= 2) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    }

    const clipPath = `circle(${radius}% at 50% 50%)`
    canvas.style.clipPath = clipPath
    video.style.clipPath = clipPath

    if (t < 1) {
      rafId = requestAnimationFrame(animate)
    } else {
      video.style.opacity = '1'
      canvas.style.opacity = '0'
      
      // Clean up will-change
      canvas.style.willChange = 'auto'
      video.style.willChange = 'auto'
    }
  }

  rafId = requestAnimationFrame(animate)
  
  // Return cleanup function
  return () => {
    if (rafId) cancelAnimationFrame(rafId)
  }
}

// Zoom mask effect for mobile - Optimized
function runZoomMask(video: HTMLVideoElement, canvas: HTMLCanvasElement | null) {
  const duration = 1500
  const radiusMid = 40
  const radiusTo = 130
  const start = performance.now()

  if (canvas) {
    canvas.style.display = 'none'
  }

  // Pre-calculate values
  const radiusDiff1 = radiusMid - 0.1
  const radiusDiff2 = radiusTo - radiusMid
  
  video.style.willChange = 'opacity, clip-path'
  let rafId: number

  function animate(now: number) {
    const t = Math.min((now - start) / duration, 1)
    let radius: number

    if (t < 0.4) {
      const p = t / 0.4
      const eased = p ** 4.5
      radius = 0.1 + radiusDiff1 * eased
    } else {
      const p = (t - 0.4) / 0.6
      const eased = 1 - (1 - p) ** 3.5
      radius = radiusMid + radiusDiff2 * eased
    }

    video.style.clipPath = `circle(${radius}% at 50% 50%)`

    if (t < 1) {
      rafId = requestAnimationFrame(animate)
    } else {
      video.style.opacity = '1'
      video.style.willChange = 'auto'
    }
  }

  rafId = requestAnimationFrame(animate)
  
  return () => {
    if (rafId) cancelAnimationFrame(rafId)
  }
}

const pixelKeyframes = [
  { frame: 358, pixel: 100, radius: 0.1 },
  { frame: 359, pixel: 95, radius: 0.2 },
  { frame: 360, pixel: 90, radius: 0.3 },
  { frame: 361, pixel: 85, radius: 0.4 },
  { frame: 362, pixel: 80, radius: 0.8 },
  { frame: 363, pixel: 75, radius: 1.2 },
  { frame: 364, pixel: 70, radius: 1.4 },
  { frame: 365, pixel: 65, radius: 1.8 },
  { frame: 366, pixel: 60, radius: 2.6 },
    { frame: 367, pixel: 57, radius: 3.1 },
  { frame: 368, pixel: 55,  radius: 3.6 },
  { frame: 369, pixel: 50,  radius: 4.6 },
  { frame: 370, pixel: 48,  radius: 5.6 },
  { frame: 371, pixel: 46,  radius: 6.6 },
  { frame: 372, pixel: 44,  radius: 8.6 },
  { frame: 373, pixel: 42,  radius: 10.6 },
  { frame: 374, pixel: 40,  radius: 23.6 },
  { frame: 375, pixel: 38,  radius: 30.6 },
  { frame: 376, pixel: 36,  radius: 80.6 },
  { frame: 377, pixel: 34,  radius: 80.6 },
  { frame: 378, pixel: 32,  radius: 80.6 },
  { frame: 379, pixel: 30,  radius: 80.6 },
  { frame: 380, pixel: 28,  radius: 80.6 },
  { frame: 381, pixel: 26,  radius: 80.6 },
  { frame: 382, pixel: 24,  radius: 80.6 },
  { frame: 383, pixel: 22,  radius: 80.6 },
  { frame: 384, pixel: 20,  radius: 80.6 },
  { frame: 385, pixel: 18,  radius: 80.6 },
  { frame: 386, pixel: 16,   radius: 80.6 },
  { frame: 387, pixel: 14,   radius: 80.6 },
  { frame: 388, pixel: 12,   radius: 80.6 },
  { frame: 389, pixel: 10,   radius: 80.6 },
  { frame: 390, pixel: 9,   radius: 130 },
  { frame: 391, pixel: 8,   radius: 130 },
  { frame: 392, pixel: 7,   radius: 130 },
  { frame: 393, pixel: 6,   radius: 130 },
  { frame: 394, pixel: 5,   radius: 130 },
  { frame: 395, pixel: 4,   radius: 130 },
  { frame: 396, pixel: 3,   radius: 130 },
  { frame: 397, pixel: 2,   radius: 130 },
  { frame: 398, pixel: 2,   radius: 130 },
  { frame: 399, pixel: 2,   radius: 130 },
  { frame: 400, pixel: 2,   radius: 130 },

]



function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function interpolatePixel(frame: number) {
  for (let i = 0; i < pixelKeyframes.length - 1; i++) {
    const k1 = pixelKeyframes[i]
    const k2 = pixelKeyframes[i + 1]
    // console.log(`Checking frames: ${k1.frame} to ${k2.frame}`)
    // console.log(`Current frame: ${frame}`)

    if (frame >= k1.frame && frame <= k2.frame) {
      const t = (frame - k1.frame) / (k2.frame - k1.frame)
      return {
        pixel: lerp(k1.pixel, k2.pixel, t),
        radius: lerp(k1.radius, k2.radius, t),
      }
    }
  }

  return pixelKeyframes[pixelKeyframes.length - 1]
}


function renderPixelZoom(
  canvas: HTMLCanvasElement,
  video: HTMLVideoElement,
  frame: number
) {
    const roundedFrame = Math.floor(frame)
  const { pixel, radius } = interpolatePixel(roundedFrame)

  console.log(`Frame: ${roundedFrame}, Pixel: ${pixel}, Radius: ${radius}`)

  const w = Math.floor(window.innerWidth / pixel)
  const h = Math.floor(window.innerHeight / pixel)

  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w
    canvas.height = h
  }

  const ctx = canvas.getContext('2d')
  if (ctx && video.readyState >= 2) {
    ctx.drawImage(video, 0, 0, w, h)
  }

  const clipPath = `circle(${radius}% at 50% 50%)`
  canvas.style.clipPath = clipPath
  video.style.clipPath = clipPath

 setTimeout(()=>{
    video.style.opacity = '1'
      canvas.style.opacity = '0'
 }, 1000)
}
