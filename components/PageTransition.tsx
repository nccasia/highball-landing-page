"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import lottie, { AnimationItem } from "lottie-web";
import { useAnimationState } from "@/hooks/useAnimationState";
import { useRouter } from "next/navigation";

export default function PageTransition() {
  const pathname = usePathname();
  const worksLoadingRef = useRef<HTMLDivElement>(null);
  const suwaRef = useRef<HTMLDivElement>(null);
  const explosionRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const worksAnimRef = useRef<AnimationItem | null>(null);
  const suwaAnimRef = useRef<AnimationItem | null>(null);
  const explosionAnimRef = useRef<AnimationItem | null>(null);

  const router = useRouter();
  const { isTransitioning, targetPath, finishTransition, setShowBlurOverlay } =
    useAnimationState();

  useEffect(() => {
    if (targetPath === "/") {
      resetToHome();
    }
    if (!isTransitioning || !targetPath || pathname === "/works") return;

    if (targetPath === "/works") {
      startWorksTransition();
    }
  }, [isTransitioning, targetPath]);

  const startWorksTransition = () => {
    if (!worksLoadingRef.current) return;
    if (!overlayRef.current) return;
    overlayRef.current.style.opacity = "1";

    setShowBlurOverlay(true);

    worksLoadingRef.current.style.zIndex = "11";

    const isMobile = window.matchMedia("(max-width: 1024px)").matches;

    worksAnimRef.current = lottie.loadAnimation({
      container: worksLoadingRef.current,
      renderer: "svg",
      loop: false,
      autoplay: true,
      path: "animation/works-page-animation.json",
    });

    worksAnimRef.current.addEventListener("enterFrame", (e: any) => {
      const currentTime = e.currentTime;
      if (currentTime >= 30 && overlayRef.current) {
        overlayRef.current.style.opacity = "1";
      }

      const canvas = document.getElementById(
        "pixel-canvas",
      ) as HTMLCanvasElement;

      const ZOOM_START = 13;
      const ZOOM_END = 40;
      const video = document.getElementById("bg-video") as HTMLVideoElement;
      if (
        currentTime >= ZOOM_START &&
        currentTime <= ZOOM_END &&
        canvas &&
        video
      ) {
        canvas.style.opacity = "1";
        video.style.opacity = "0";

        renderPixelZoom(canvas, video, currentTime);
      }
    });

    worksAnimRef.current.addEventListener("complete", () => {
      const lottieBg = document.getElementById("lottieBg");
      if (lottieBg) {
        lottieBg.style.display = "none";
      }
      worksAnimRef.current?.destroy();
      setShowBlurOverlay(false);
      startSuwa(isMobile);
      if (worksLoadingRef.current) {
        worksLoadingRef.current.style.zIndex = "3";
      }
    });
  };

  const startSuwa = (isMobile: boolean) => {
    if (!suwaRef.current) return;

    suwaAnimRef.current = lottie.loadAnimation({
      container: suwaRef.current,
      renderer: "svg",
      loop: false,
      autoplay: true,
      path: "animation/highball_suwa_walk_1fix.json",
      initialSegment: isMobile ? [100, 160] : [0, 210],
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    });

    suwaAnimRef.current.addEventListener("complete", () => {
      playExplosion();
      suwaAnimRef.current?.destroy();
    });
  };

  const playExplosion = () => {
    if (!explosionRef.current || !overlayRef.current) return;
    const video = document.getElementById("bg-video") as HTMLVideoElement;

    video.style.display = "none";

    explosionAnimRef.current = explosionAnimRef.current = lottie.loadAnimation({
      container: explosionRef.current,
      renderer: "svg",
      loop: false,
      autoplay: true,
      path: "animation/explosion.json",
    });
    explosionAnimRef.current.addEventListener("enterFrame", (e: any) => {
      if (e.currentTime >= 8) {
        overlayRef.current!.classList.add("fade-out");
      }
    });

    explosionAnimRef.current.addEventListener("complete", () => {
      explosionAnimRef.current?.destroy();

      setTimeout(() => {
        finishTransition();
        router.push(targetPath!);
      }, 1000);
    });
  };

  const resetToHome = () => {
    const lottieBg = document.getElementById("lottieBg");
    if (lottieBg) {
      lottieBg.style.display = "block";
    }
    finishTransition();
    router.push("/");

    worksAnimRef.current?.destroy();
    suwaAnimRef.current?.destroy();
    const worksContent = document.getElementById("works-page");
    if (worksContent) {
      worksContent.classList.remove("show");
    }
    const video = document.getElementById("bg-video") as HTMLVideoElement;
    video.style.display = "block";
    if (overlayRef.current) {
      overlayRef.current.style.opacity = "0";
      overlayRef.current.style.clipPath = "circle(0% at 50% 50%) ";
      overlayRef.current.classList.remove("fade-out");
    }

  };

  const pixelKeyframes = [
    { frame: 13, pixel: 2, radius: 0.1 },
    { frame: 14, pixel: 4, radius: 0.2 },
    { frame: 15, pixel: 6, radius: 0.3 },
    { frame: 16, pixel: 8, radius: 0.4 },
    { frame: 17, pixel: 10, radius: 0.6 },
    { frame: 18, pixel: 12, radius: 0.8 },
    { frame: 19, pixel: 14, radius: 1.0 },
    { frame: 20, pixel: 16, radius: 1.5 },
    { frame: 21, pixel: 18, radius: 2.0 },
    { frame: 22, pixel: 20, radius: 3.0 },
    { frame: 23, pixel: 40, radius: 4.0 },
    { frame: 24, pixel: 60, radius: 5.0 },
    { frame: 25, pixel: 80, radius: 7.0 },
    { frame: 26, pixel: 100, radius: 10.0 },
    { frame: 27, pixel: 120, radius: 15.0 },
    { frame: 28, pixel: 140, radius: 20.0 },
    { frame: 29, pixel: 160, radius: 30.0 },
    { frame: 30, pixel: 200, radius: 35.0 },
    { frame: 31, pixel: 250, radius: 100 },
    { frame: 32, pixel: 300, radius: 100 },
    { frame: 33, pixel: 300, radius: 100 },
    { frame: 34, pixel: 300, radius: 100 },
    { frame: 35, pixel: 300, radius: 100 },
    { frame: 36, pixel: 300, radius: 100 },
    { frame: 37, pixel: 300, radius: 100 },
    { frame: 38, pixel: 300, radius: 100 },
    { frame: 39, pixel: 300, radius: 100 },
    { frame: 40, pixel: 300, radius: 100 },
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
    if (overlayRef.current) overlayRef.current.style.clipPath = clipPath;
    setTimeout(() => {
      video.style.opacity = "1";
      canvas.style.opacity = "0";
    }, 1000);
  }

  return (
    <>
      <div id="lottie-works" ref={worksLoadingRef}></div>
      <div id="lottie-suwa" ref={suwaRef}></div>
      <div id="overlay" ref={overlayRef}></div>

      <div id="effect-explosion" ref={explosionRef}></div>
    </>
  );
}
