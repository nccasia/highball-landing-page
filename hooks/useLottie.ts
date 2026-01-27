'use client'

import { useEffect, useRef, MutableRefObject } from 'react'
import lottie, { AnimationItem, AnimationConfigWithPath } from 'lottie-web'

interface UseLottieOptions extends Partial<AnimationConfigWithPath> {
  onEnterFrame?: (e: any) => void
  onComplete?: () => void
  onDOMLoaded?: () => void
}

export function useLottie(
  containerRef: MutableRefObject<HTMLDivElement | null>,
  options: UseLottieOptions
) {
  const animRef = useRef<AnimationItem | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const { onEnterFrame, onComplete, onDOMLoaded, ...lottieOptions } = options

    animRef.current = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      ...lottieOptions,
    })

    if (onEnterFrame) {
      animRef.current.addEventListener('enterFrame', onEnterFrame)
    }
    if (onComplete) {
      animRef.current.addEventListener('complete', onComplete)
    }
    if (onDOMLoaded) {
      animRef.current.addEventListener('DOMLoaded', onDOMLoaded)
    }

    return () => {
      animRef.current?.destroy()
      animRef.current = null
    }
  }, [])

  return animRef
}
