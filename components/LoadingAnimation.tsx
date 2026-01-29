"use client";

import { useEffect, useMemo, useRef } from "react";
import lottie, { AnimationItem } from "lottie-web";
import { useAnimationState } from "@/hooks/useAnimationState";
import { usePathname } from "next/navigation";

export default function LoadingAnimation() {
  const spinnerRef = useRef<HTMLDivElement>(null);
  const logoLoadingRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loadingWrapperRef = useRef<HTMLDivElement>(null);

  const { setShowHeader, setHasPlayedIntro, hasPlayedIntro } =
    useAnimationState();

  const spinnerAnimRef = useRef<AnimationItem | null>(null);
  const logoAnimRef = useRef<AnimationItem | null>(null);
  const pathname = usePathname();
  const hasRunPixelZoom = useRef(false);
  const rafId = useRef<number | null>(null);

  const isHomePage = useMemo(() => pathname === "/", [pathname]);

  useEffect(() => {
    if (!isHomePage || hasPlayedIntro || !spinnerRef.current) return;

    // Initialize spinner animation
    spinnerAnimRef.current = lottie.loadAnimation({
      container: spinnerRef.current,
      renderer: "svg",
      loop: false,
      autoplay: true,
      path: "/animation/spinner-v3.json",
      initialSegment: [0, 400],
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    });

    const onEnterFrame = (e: any) => {
      const currentTime = e.currentTime;
      if (currentTime >= 365) {
        if (!logoAnimRef.current && logoLoadingRef.current) {
          logoAnimRef.current = lottie.loadAnimation({
            container: logoLoadingRef.current,
            renderer: "svg",
            loop: false,
            autoplay: true,
            path: "animation/logo-highballer.json",
          });

          logoAnimRef.current.addEventListener("complete", () => {
            setHasPlayedIntro();
          });
        }
      }

      const ZOOM_START = 357;
      const ZOOM_END = 400;
      const video = document.getElementById("bg-video") as HTMLVideoElement;
      if (
        currentTime >= ZOOM_START &&
        currentTime <= ZOOM_END &&
        canvasRef.current &&
        video
      ) {
        canvasRef.current.style.opacity = "1";
        video.style.opacity = "0";

        renderPixelZoom(canvasRef.current, video, currentTime);
      }
    };

    const onComplete = () => {
      // Cleanup spinner animation
      if (spinnerAnimRef.current) {
        spinnerAnimRef.current.destroy();
        spinnerAnimRef.current = null;
      }

      // Play background video
      setTimeout(() => {
        const video = document.getElementById("bg-video") as HTMLVideoElement;
        if (video) {
          video
            .play()
            .catch((err) => console.warn("Video autoplay failed:", err));
          video.classList.add("move");
        }
      }, 300);

      if (loadingWrapperRef.current) {
        loadingWrapperRef.current.style.backgroundColor = "transparent";
      }

      // Show header and complete loading
      setShowHeader(true);
    };

    spinnerAnimRef.current.addEventListener("enterFrame", onEnterFrame);
    spinnerAnimRef.current.addEventListener("complete", onComplete);

    return () => {
      // Cancel any pending animation frames
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }

      if (spinnerAnimRef.current) {
        spinnerAnimRef.current.removeEventListener("enterFrame", onEnterFrame);
        spinnerAnimRef.current.removeEventListener("complete", onComplete);
        spinnerAnimRef.current.destroy();
        spinnerAnimRef.current = null;
      }

      if (logoAnimRef.current) {
        // logoAnimRef.current.destroy()
        // logoAnimRef.current = null
      }
    };
  }, [isHomePage, hasPlayedIntro, setShowHeader, setHasPlayedIntro]);

  return (
    <>
      <div id="loading-wrapper" ref={loadingWrapperRef}>
        {isHomePage && !hasPlayedIntro && (
          <div id="lottie" ref={spinnerRef}></div>
        )}
        <div id="lottieBg" ref={logoLoadingRef}></div>
        <div id="overlay"></div>
      </div>

      <canvas
        id="pixel-canvas"
        ref={canvasRef}
        style={{ willChange: "opacity, clip-path" }}
      />
    </>
  );
}

const pixelKeyframes = [
  { frame: 357, pixel: 300, radius: 0.1 },
  { frame: 358, pixel: 300, radius: 0.2 },
  { frame: 359, pixel: 300, radius: 0.3 },
  { frame: 360, pixel: 300, radius: 0.4 },
  { frame: 361, pixel: 300, radius: 0.6 },
  { frame: 362, pixel: 300, radius: 0.8 },
  { frame: 363, pixel: 300, radius: 1.2 },
  { frame: 364, pixel: 300, radius: 1.4 },
  { frame: 365, pixel: 300, radius: 1.8 },
  { frame: 366, pixel: 300, radius: 2.6 },
  { frame: 367, pixel: 300, radius: 3.1 },
  { frame: 368, pixel: 300, radius: 3.6 },
  { frame: 369, pixel: 300, radius: 4.6 },
  { frame: 370, pixel: 300, radius: 5.6 },
  { frame: 371, pixel: 300, radius: 6.6 },
  { frame: 372, pixel: 300, radius: 8.6 },
  { frame: 373, pixel: 300, radius: 10.6 },
  { frame: 374, pixel: 300, radius: 23.6 },
  { frame: 375, pixel: 300, radius: 30.6 },
  { frame: 376, pixel: 300, radius: 80.6 },
  { frame: 377, pixel: 250, radius: 80.6 },
  { frame: 378, pixel: 200, radius: 80.6 },
  { frame: 379, pixel: 150, radius: 80.6 },
  { frame: 380, pixel: 100, radius: 80.6 },
  { frame: 381, pixel: 95, radius: 80.6 },
  { frame: 382, pixel: 90, radius: 80.6 },
  { frame: 383, pixel: 85, radius: 80.6 },
  { frame: 384, pixel: 80, radius: 80.6 },
  { frame: 385, pixel: 75, radius: 80.6 },
  { frame: 386, pixel: 70, radius: 80.6 },
  { frame: 387, pixel: 65, radius: 80.6 },
  { frame: 388, pixel: 60, radius: 80.6 },
  { frame: 389, pixel: 30, radius: 80.6 },
  { frame: 390, pixel: 25, radius: 130 },
  { frame: 391, pixel: 20, radius: 130 },
  { frame: 392, pixel: 18, radius: 130 },
  { frame: 393, pixel: 16, radius: 130 },
  { frame: 394, pixel: 14, radius: 130 },
  { frame: 395, pixel: 12, radius: 130 },
  { frame: 396, pixel: 10, radius: 130 },
  { frame: 397, pixel: 8, radius: 130 },
  { frame: 398, pixel: 6, radius: 130 },
  { frame: 399, pixel: 4, radius: 130 },
  { frame: 400, pixel: 2, radius: 130 },
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function interpolatePixel(frame: number) {
  for (let i = 0; i < pixelKeyframes.length - 1; i++) {
    const k1 = pixelKeyframes[i];
    const k2 = pixelKeyframes[i + 1];

    if (frame >= k1.frame && frame <= k2.frame) {
      const t = (frame - k1.frame) / (k2.frame - k1.frame);
      return {
        pixel: lerp(k1.pixel, k2.pixel, t),
        radius: lerp(k1.radius, k2.radius, t),
      };
    }
  }

  return pixelKeyframes[pixelKeyframes.length - 1];
}

function renderPixelZoom(
  canvas: HTMLCanvasElement,
  video: HTMLVideoElement,
  frame: number,
) {
  const roundedFrame = Math.floor(frame);
  const { pixel, radius } = interpolatePixel(roundedFrame);

  const w = Math.floor(window.innerWidth / pixel);
  const h = Math.floor(window.innerHeight / pixel);

  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }

  const ctx = canvas.getContext("2d");
  if (ctx && video.readyState >= 2) {
    ctx.drawImage(video, 0, 0, w, h);
  }

  const clipPath = `circle(${radius}% at 50% 50%)`;
  canvas.style.clipPath = clipPath;
  video.style.clipPath = clipPath;

  setTimeout(() => {
    video.style.opacity = "1";
    canvas.style.opacity = "0";
  }, 1000);
}
