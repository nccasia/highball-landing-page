'use client'

import { usePathname } from 'next/navigation'
import { useAnimationState } from '@/hooks/useAnimationState'

export default function NavItem({ href, children , onClick}: { href: string; children: React.ReactNode; onClick?: () => void }) {
  const pathname = usePathname()
  const { startTransition } = useAnimationState()

  const isActive = pathname === href

  return (
    <button
      type="button"
      onClick={() => {
        startTransition(href)
        onClick && onClick?.()
      }}
      className={`nav-link ${isActive ? 'active' : ''}`}
    >
      {children}
    </button>
  )
}

