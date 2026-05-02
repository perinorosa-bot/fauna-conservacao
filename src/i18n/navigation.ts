import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

// Use these instead of next/navigation everywhere: they preserve the locale
// prefix on push/replace and strip it from usePathname so equality checks
// like `path.startsWith('/projetos')` keep working.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
