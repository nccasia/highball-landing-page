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

  //   const { isLoadingComplete, isTransitioning, setTransitioning } = useAnimationState()
  const router = useRouter();
  const { isTransitioning, targetPath, finishTransition } = useAnimationState();

  useEffect(() => {
    console.log('isTransitioning', isTransitioning, 'targetPath', targetPath , pathname);
     if (targetPath === "/") {
      resetToHome();
    }
    if (!isTransitioning || !targetPath || pathname=== "/works") return;

    if (targetPath === "/works") {
      startWorksTransition();
    }

   
  }, [isTransitioning, targetPath]);

  const startWorksTransition = () => {
    if (!worksLoadingRef.current) return;
    const lottieBg = document.getElementById("lottieBg");
    if (lottieBg) {
      lottieBg.style.display = "none";
    }

    // setTransitioning(true)
    const isMobile = window.matchMedia("(max-width: 1024px)").matches;

    worksAnimRef.current = lottie.loadAnimation({
      container: worksLoadingRef.current,
      renderer: "svg",
      loop: false,
      autoplay: true,
      path: "animation/works-page-animation.json",
    });

    if (!isMobile) {
      worksAnimRef.current.addEventListener("DOMLoaded", () => {
        const duration = worksAnimRef.current!.getDuration(true) * (1000 / 30);
        runPixelEffect(duration);
      });
    }

    worksAnimRef.current.addEventListener("enterFrame", (e: any) => {
      if (e.currentTime >= 30 && overlayRef.current) {
        overlayRef.current.style.opacity = "1";
      }
    });

    worksAnimRef.current.addEventListener("complete", () => {
      worksAnimRef.current?.destroy();
      startSuwa(isMobile);
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

  const runPixelEffect = (duration: number) => {
    const canvas = document.getElementById("pixel-canvas") as HTMLCanvasElement;
    const video = document.getElementById("bg-video") as HTMLVideoElement;

    if (!canvas || !video) return;

    video.style.opacity = "0";
    canvas.style.opacity = "1";
    const start = performance.now();

    function animate(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const pixelSize = Math.floor(10 + 90 * progress);

      canvas.width = Math.floor(window.innerWidth / pixelSize);
      canvas.height = Math.floor(window.innerHeight / pixelSize);

      const ctx = canvas.getContext("2d");
      if (ctx && video.readyState >= 2) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        video.style.opacity = "1";
        canvas.style.opacity = "0";
      }
    }

    requestAnimationFrame(animate);
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
      overlayRef.current.classList.remove("fade-out");
    }

    // setTransitioning(false)
  };

  return (
    <>
      <div id="lottie-works" ref={worksLoadingRef}></div>
      <div id="lottie-suwa" ref={suwaRef}></div>
      <div id="overlay" ref={overlayRef}></div>

      <div id="effect-explosion" ref={explosionRef}></div>
    </>
  );
}
