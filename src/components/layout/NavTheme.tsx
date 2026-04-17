'use client'

import { createContext, useContext, type ReactNode } from 'react'

type Theme = 'dark' | 'light'

const NavThemeContext = createContext<Theme>('dark')

export function NavTheme({ theme, children }: { theme: Theme; children: ReactNode }) {
  return <NavThemeContext.Provider value={theme}>{children}</NavThemeContext.Provider>
}

export function useNavTheme() {
  return useContext(NavThemeContext)
}