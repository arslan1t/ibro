'use client'

import { usePathname } from 'next/navigation'
import BottomNav from '@/components/ui/BottomNav'

const BRAND_ROUTES = ['/ibrohim', '/protocol', '/shop', '/training', '/admin']

export default function ConditionalBottomNav() {
  const pathname = usePathname()
  const isBrand = BRAND_ROUTES.some((r) => pathname.startsWith(r))
  if (isBrand) return null
  return <BottomNav />
}
