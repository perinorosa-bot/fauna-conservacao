'use client'

import Link from 'next/link'
import Nav from '@/components/layout/Nav'
import { NavTheme } from '@/components/layout/NavTheme'
import { useEffect } from 'react'

export default function LojaSucessoPage() {
  // clear cart from localStorage after successful purchase
  useEffect(() => {
    localStorage.removeItem('fauna-cart')
  }, [])

  return (
    <NavTheme theme="light">
      <main className="min-h-screen bg-cream flex flex-col">
        <Nav />
        <div className="flex-1 flex items-center justify-center px-10">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 rounded-full bg-leaf/10 border border-leaf/20 flex items-center justify-center mx-auto mb-8">
              <span className="text-leaf text-3xl">✓</span>
            </div>
            <h1 className="font-serif text-4xl font-light text-forest mb-3">
              Pedido confirmado
            </h1>
            <p className="text-forest/50 text-sm leading-relaxed mb-2">
              Você vai receber um e-mail com os detalhes do pedido e o rastreamento assim que o envio for feito.
            </p>
            <p className="text-leaf text-sm font-medium mb-10">
              15% do valor foi destinado para projetos de conservação. Obrigado!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/loja"
                className="bg-forest text-cream text-[10px] tracking-widests uppercase px-6 py-3 rounded-sm hover:bg-leaf transition-colors"
              >
                Continuar comprando
              </Link>
              <Link
                href="/projetos"
                className="border border-forest/20 text-forest/60 text-[10px] tracking-widests uppercase px-6 py-3 rounded-sm hover:border-forest/40 hover:text-forest transition-colors"
              >
                Ver projetos de conservação
              </Link>
            </div>
          </div>
        </div>
      </main>
    </NavTheme>
  )
}
