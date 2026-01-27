export function runPixelZoomEffect(
  canvas: HTMLCanvasElement,
  video: HTMLVideoElement,
  options: {
    duration?: number
    pixelFrom?: number
    pixelTo?: number
    radiusMid?: number
    radiusTo?: number
  } = {}
) {
  const {
    duration = 900,
    pixelFrom = 48,
    pixelTo = 2,
    radiusMid = 40,
    radiusTo = 130,
  } = options

  const start = performance.now()
  video.style.opacity = '0'
  canvas.style.opacity = '1'

  function animate(now: number) {
    const t = Math.min((now - start) / duration, 1)
    let radius: number
    let pixelSize: number

    if (t < 0.4) {
      const p = t / 0.4
      const eased = Math.pow(p, 4.5)
      radius = 0.1 + (40 - 0.1) * eased
      pixelSize = pixelFrom
    } else {
      const p = (t - 0.4) / 0.6
      const eased = 1 - Math.pow(1 - p, 3.5)
      radius = radiusMid + (radiusTo - radiusMid) * eased
      pixelSize = pixelFrom * 0.7 + (pixelTo - pixelFrom * 0.7) * eased
    }

    canvas.width = Math.floor(window.innerWidth / pixelSize)
    canvas.height = Math.floor(window.innerHeight / pixelSize)

    const ctx = canvas.getContext('2d', {
      alpha: false,
      desynchronized: true,
    })

    if (ctx && video.readyState >= 2) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    }

    canvas.style.clipPath = `circle(${radius}% at 50% 50%)`
    video.style.clipPath = `circle(${radius}% at 50% 50%)`

    if (t < 1) {
      requestAnimationFrame(animate)
    } else {
      video.style.opacity = '1'
    }
  }

  requestAnimationFrame(animate)
}

export function runZoomMaskEffect(
  video: HTMLVideoElement,
  options: {
    duration?: number
    radiusMid?: number
    radiusTo?: number
  } = {}
) {
  const {
    duration = 900,
    radiusMid = 40,
    radiusTo = 130,
  } = options

  const start = performance.now()

  function animate(now: number) {
    const t = Math.min((now - start) / duration, 1)
    let radius: number

    if (t < 0.4) {
      const p = t / 0.4
      const eased = Math.pow(p, 4.5)
      radius = 0.1 + (40 - 0.1) * eased
    } else {
      const p = (t - 0.4) / 0.6
      const eased = 1 - Math.pow(1 - p, 3.5)
      radius = radiusMid + (radiusTo - radiusMid) * eased
    }

    video.style.clipPath = `circle(${radius}% at 50% 50%)`

    if (t < 1) {
      requestAnimationFrame(animate)
    } else {
      video.style.opacity = '1'
    }
  }

  requestAnimationFrame(animate)
}

export function runPixelEffect(
  canvas: HTMLCanvasElement,
  video: HTMLVideoElement,
  options: {
    duration?: number
    from?: number
    to?: number
  } = {}
) {
  const { duration = 2000, from = 10, to = 100 } = options
  const start = performance.now()

  function animate(now: number) {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    const pixelSize = Math.floor(from + (to - from) * progress)

    canvas.width = Math.floor(window.innerWidth / pixelSize)
    canvas.height = Math.floor(window.innerHeight / pixelSize)

    const ctx = canvas.getContext('2d', {
      alpha: false,
      desynchronized: true,
    })

    if (ctx && video.readyState >= 2) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    }

    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }

  requestAnimationFrame(animate)
}