'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAnimationState } from '@/hooks/useAnimationState'
import NavItem from './NavItem'

export default function Header() {
  const pathname = usePathname()
  const { showHeader ,targetPath, startTransition} = useAnimationState()

  return (
 <header id="main-header" className={showHeader ? 'show' : ''}>
  <div className="logo">
    <button
      type="button"
      className="logo-btn"
      onClick={() => startTransition('/')}
    >
      <img src="/images/Logo.svg" alt="Logo" />
    </button>
  </div>

  <nav className="sidebar">
    <NavItem href="/">Home</NavItem>
    <NavItem href="/works">Works</NavItem>
    <NavItem href="/about">About</NavItem>
    <NavItem href="/contact">Contact</NavItem>
  </nav>
</header>

  )
}