"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import AnimationProvider from "@/components/AnimationProvider";
import Header from "@/components/Header";
import MobileMenu from "@/components/MobileMenu";
import VideoBackground from "@/components/VideoBackground";
import LoadingAnimation from "@/components/LoadingAnimation";
import PageTransition from "@/components/PageTransition";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js"
        strategy="beforeInteractive"
      />

      <AnimationProvider>
        <Header />
        <MobileMenu />

        <div id="video-wrapper">
          <VideoBackground />
        </div>
        <LoadingAnimation />

        <PageTransition />
        {children}
      </AnimationProvider>
    </>
  );
}
