'use client'

import { useState, useEffect } from 'react'
import Nav from '@/components/layout/Nav'
import { NavTheme } from '@/components/layout/NavTheme'
import Image from 'next/image'
import Link from 'next/link'

// ─── Types ────────────────────────────────────────────────────────────────────

type Category = 'todos' | 'fine-art' | 'pins' | 'bolsas' | 'papelaria' | 'vestuario'

type Product = {
  id: string
  name: string
  subtitle: string
  category: Exclude<Category, 'todos'>
  price: number
  image: string
  badge?: string
  description: string
  sizes?: string[]
  variants?: string[]
}

type CartItem = Product & { qty: number; selectedSize?: string }

// ─── Catalog ──────────────────────────────────────────────────────────────────

const PRODUCTS: Product[] = [
  // Fine Art Prints
  {
    id: 'print-onca',
    name: 'Onça-pintada do Pantanal',
    subtitle: 'Fine art print · 40×60 cm',
    category: 'fine-art',
    price: 149,
    badge: 'Mais vendido',
    image: 'https://images.unsplash.com/photo-1551358492-7c8a2a8eb9e8?w=800&auto=format&fit=crop&q=80',
    description: 'Impressão giclée de alta resolução em papel algodão 300g. Cada venda reverte 15% para projetos de conservação de felinos.',
  },
  {
    id: 'print-arara',
    name: 'Arara-azul-grande',
    subtitle: 'Fine art print · 30×40 cm',
    category: 'fine-art',
    price: 129,
    image: 'https://images.unsplash.com/photo-1522926193341-e9ffd686c60f?w=800&auto=format&fit=crop&q=80',
    description: 'Fotografia de campo impressa em papel fine art. Espécie vulnerável — parte da renda financia o Projeto Arara Azul no Pantanal.',
  },
  {
    id: 'print-baleia',
    name: 'Baleia Jubarte',
    subtitle: 'Fine art print · 50×70 cm',
    category: 'fine-art',
    price: 179,
    badge: 'Novo',
    image: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=800&auto=format&fit=crop&q=80',
    description: 'Impressão panorâmica em papel baryté. Capturada durante expedição de monitoramento no Banco dos Abrolhos.',
  },
  {
    id: 'print-lobo',
    name: 'Lobo-guará',
    subtitle: 'Fine art print · 40×60 cm',
    category: 'fine-art',
    price: 139,
    image: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800&auto=format&fit=crop&q=80',
    description: 'Maior canídeo da América do Sul em seu habitat natural no Cerrado. Papel fosco premium 280g.',
  },
  // Pins
  {
    id: 'pin-tartaruga',
    name: 'Tartaruga Marinha',
    subtitle: 'Pin esmaltado · 4 cm',
    category: 'pins',
    price: 32,
    image: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800&auto=format&fit=crop&q=80',
    description: 'Pin esmaltado de duplo poste, acabamento prateado. Ilustração exclusiva Fauna.',
    variants: ['Verde', 'Azul'],
  },
  {
    id: 'pin-panda',
    name: 'Panda Gigante',
    subtitle: 'Pin esmaltado · 3.5 cm',
    category: 'pins',
    price: 32,
    image: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&auto=format&fit=crop&q=80',
    description: 'Pin de soft enamel com trava borboleta. Cada pin financia R$ 3 para programas de conservação de panda.',
  },
  {
    id: 'pin-mico',
    name: 'Mico-leão-dourado',
    subtitle: 'Pin esmaltado · 4 cm',
    category: 'pins',
    price: 32,
    badge: 'Exclusivo',
    image: 'https://images.unsplash.com/photo-1540479859555-17af45c78602?w=800&auto=format&fit=crop&q=80',
    description: 'Espécie endêmica da Mata Atlântica. Design ilustrado por artista brasileira.',
  },
  {
    id: 'pin-pinguim',
    name: 'Pinguim-rei',
    subtitle: 'Pin esmaltado · 4.5 cm',
    category: 'pins',
    price: 35,
    image: 'https://images.unsplash.com/photo-1551986782-d0169b3f8fa7?w=800&auto=format&fit=crop&q=80',
    description: 'Pin de hard enamel com acabamento dourado. O maior pinguim do mundo em miniatura.',
  },
  // Bolsas
  {
    id: 'tote-amazonia',
    name: 'Tote Bag Amazônia',
    subtitle: 'Canvas orgânico · 38×42 cm',
    category: 'bolsas',
    price: 68,
    badge: 'Mais vendido',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80',
    description: 'Canvas 100% algodão orgânico. Estampa serigrafada com motivos da Amazônia. Alças reforçadas.',
    variants: ['Natural', 'Preto'],
  },
  {
    id: 'tote-oceano',
    name: 'Tote Bag Oceano',
    subtitle: 'Canvas orgânico · 38×42 cm',
    category: 'bolsas',
    price: 68,
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&auto=format&fit=crop&q=80',
    description: 'Canvas reciclado. Estampa com fundo do mar e espécies marinhas ameaçadas.',
    variants: ['Azul', 'Areia'],
  },
  // Papelaria
  {
    id: 'stickers-wildlife',
    name: 'Wildlife Sticker Pack',
    subtitle: '12 adesivos vinílicos',
    category: 'papelaria',
    price: 28,
    badge: 'Novo',
    image: 'https://images.unsplash.com/photo-1518795502-f0d3d9c4ef3e?w=800&auto=format&fit=crop&q=80',
    description: '12 adesivos vinílicos resistentes à água com espécies ameaçadas. Perfeito para notebook, garrafa ou cadernos.',
  },
  {
    id: 'caderneta',
    name: 'Caderneta de Campo',
    subtitle: 'Papel reciclado · A6',
    category: 'papelaria',
    price: 55,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    description: 'Miolo em papel off-white 90g reciclado, capa dura. Inspirada nos cadernos de naturalistas do século XIX.',
  },
  // Vestuário
  {
    id: 'camiseta-onca',
    name: 'Camiseta Onça',
    subtitle: 'Algodão 180g · Unissex',
    category: 'vestuario',
    price: 89,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=80',
    description: 'Algodão penteado pré-lavado. Estampa serigrafada frente. R$ 15 de cada venda vai para a Aliança Gato-do-Mato.',
    sizes: ['P', 'M', 'G', 'GG'],
  },
  {
    id: 'camiseta-manta',
    name: 'Camiseta Manta-birostris',
    subtitle: 'Algodão 180g · Unissex',
    category: 'vestuario',
    price: 89,
    badge: 'Novo',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80',
    description: 'Raia manta gigante em serigrafia aquarela. Corte unissex relaxado. 100% algodão orgânico.',
    sizes: ['P', 'M', 'G', 'GG'],
  },
]

const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'todos',     label: 'Todos' },
  { id: 'fine-art',  label: 'Fine Art' },
  { id: 'pins',      label: 'Pins' },
  { id: 'bolsas',    label: 'Bolsas' },
  { id: 'papelaria', label: 'Papelaria' },
  { id: 'vestuario', label: 'Vestuário' },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function LojaPage() {
  const [category, setCategory] = useState<Category>('todos')
  const [cart, setCart]         = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [selected, setSelected] = useState<Product | null>(null)
  const [selectedSize, setSelectedSize] = useState('')
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  // persist cart in localStorage
  useEffect(() => {
    const saved = localStorage.getItem('fauna-cart')
    if (saved) setCart(JSON.parse(saved))
  }, [])
  useEffect(() => {
    localStorage.setItem('fauna-cart', JSON.stringify(cart))
  }, [cart])

  const filtered = category === 'todos' ? PRODUCTS : PRODUCTS.filter(p => p.category === category)
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0)
  const cartCount = cart.reduce((s, i) => s + i.qty, 0)

  function addToCart(product: Product, size?: string) {
    setCart(prev => {
      const key = product.id + (size ?? '')
      const existing = prev.find(i => i.id + (i.selectedSize ?? '') === key)
      if (existing) {
        return prev.map(i =>
          i.id + (i.selectedSize ?? '') === key ? { ...i, qty: i.qty + 1 } : i
        )
      }
      return [...prev, { ...product, qty: 1, selectedSize: size }]
    })
    setSelected(null)
    setCartOpen(true)
  }

  function removeFromCart(id: string, size?: string) {
    setCart(prev => prev.filter(i => !(i.id === id && i.selectedSize === size)))
  }

  function updateQty(id: string, size: string | undefined, delta: number) {
    setCart(prev =>
      prev.map(i =>
        i.id === id && i.selectedSize === size
          ? { ...i, qty: Math.max(1, i.qty + delta) }
          : i
      )
    )
  }

  async function handleCheckout() {
    setCheckoutLoading(true)
    try {
      const res = await fetch('/api/stripe/shop-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {
      // silent — keep button enabled
    } finally {
      setCheckoutLoading(false)
    }
  }

  return (
    <NavTheme theme="light">
      <main className="min-h-screen bg-cream">
        <Nav />

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="pt-40 pb-16 px-10 max-w-screen-xl mx-auto">
          <p className="text-[10px] tracking-widest uppercase text-forest/40 mb-3">
            Loja Fauna
          </p>
          <h1 className="font-serif text-5xl md:text-6xl font-light text-forest leading-tight mb-4">
            Produtos com <em className="italic text-leaf">propósito</em>
          </h1>
          <p className="text-forest/50 text-base max-w-lg leading-relaxed">
            Cada compra reverte uma parte diretamente para projetos de conservação.
            Design exclusivo. Produção responsável.
          </p>
        </section>

        {/* ── Impact strip ─────────────────────────────────────────────────── */}
        <div className="px-10 mb-12 max-w-screen-xl mx-auto">
          <div className="bg-forest/5 border border-forest/10 rounded-2xl px-8 py-5 flex flex-wrap gap-8">
            {[
              { value: '15%', label: 'de cada venda para conservação' },
              { value: '100%', label: 'produção responsável' },
              { value: 'Frete', label: 'grátis acima de R$ 200' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-3">
                <span className="font-serif text-2xl font-light text-leaf">{s.value}</span>
                <span className="text-forest/50 text-xs leading-tight max-w-[120px]">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Category filters ─────────────────────────────────────────────── */}
        <div className="px-10 mb-10 max-w-screen-xl mx-auto">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(c => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`text-[10px] tracking-widest uppercase px-5 py-2.5 rounded-full border transition-all duration-200 ${
                  category === c.id
                    ? 'bg-forest text-cream border-forest'
                    : 'bg-transparent text-forest/50 border-forest/15 hover:border-forest/30 hover:text-forest/80'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Product grid ─────────────────────────────────────────────────── */}
        <div className="px-10 pb-32 max-w-screen-xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map(product => (
              <article
                key={product.id}
                onClick={() => { setSelected(product); setSelectedSize('') }}
                className="group cursor-pointer"
              >
                {/* Image */}
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-forest/5 mb-4">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {product.badge && (
                    <span className="absolute top-3 left-3 bg-leaf text-cream text-[9px] tracking-widests uppercase px-2.5 py-1 rounded-full">
                      {product.badge}
                    </span>
                  )}
                  {/* Quick add overlay */}
                  <div className="absolute inset-0 bg-forest/0 group-hover:bg-forest/10 transition-colors duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        if (product.sizes) { setSelected(product); setSelectedSize('') }
                        else addToCart(product)
                      }}
                      className="bg-cream text-forest text-[10px] tracking-widests uppercase px-5 py-2.5 rounded-full shadow-lg hover:bg-leaf hover:text-cream transition-colors"
                    >
                      {product.sizes ? 'Escolher tamanho' : 'Adicionar'}
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div>
                  <p className="text-forest text-sm font-medium leading-snug mb-0.5">{product.name}</p>
                  <p className="text-forest/40 text-[11px] mb-2">{product.subtitle}</p>
                  <p className="text-forest font-medium text-sm">
                    R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* ── Info strip: atendimento · pagamentos · ajuda ─────────────────── */}
        <div className="border-t border-forest/10 bg-forest/[0.03]">
          <div className="px-10 py-14 max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

            {/* Atendimento */}
            <div>
              <p className="text-[9px] tracking-[0.22em] uppercase text-forest/35 mb-4 font-medium">
                Atendimento online
              </p>
              <p className="text-forest/70 text-sm leading-relaxed mb-1">
                De segunda a sexta, das 8h às 17h.
              </p>
              <p className="text-forest/40 text-xs leading-relaxed mb-4">
                Respondemos em até 1 dia útil.
              </p>
              <a
                href="mailto:loja@fauna.org"
                className="text-leaf text-xs tracking-wide hover:underline"
              >
                loja@fauna.org →
              </a>
            </div>

            {/* Formas de pagamento */}
            <div>
              <p className="text-[9px] tracking-[0.22em] uppercase text-forest/35 mb-4 font-medium">
                Formas de pagamento
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {[
                  { label: 'Visa',       icon: '💳' },
                  { label: 'Mastercard', icon: '💳' },
                  { label: 'Elo',        icon: '💳' },
                  { label: 'Amex',       icon: '💳' },
                  { label: 'Pix',        icon: '⚡' },
                ].map(p => (
                  <span
                    key={p.label}
                    className="flex items-center gap-1.5 text-[10px] text-forest/60 bg-forest/[0.06]
                               border border-forest/10 rounded-md px-2.5 py-1.5"
                  >
                    {p.icon} {p.label}
                  </span>
                ))}
              </div>
              <p className="text-forest/35 text-[11px] leading-relaxed">
                Processamento seguro via Stripe.<br />
                Parcelamento em até 3× sem juros.
              </p>
            </div>

            {/* Precisa de ajuda */}
            <div>
              <p className="text-[9px] tracking-[0.22em] uppercase text-forest/35 mb-4 font-medium">
                Precisa de ajuda?
              </p>
              <nav className="flex flex-col gap-2.5">
                {[
                  { label: 'Contato',                href: '/contato' },
                  { label: 'Política de Privacidade', href: '/privacidade' },
                  { label: 'Política de Troca',       href: '/loja/troca' },
                  { label: 'Política de Cookies',     href: '/cookies' },
                ].map(l => (
                  <a
                    key={l.href}
                    href={l.href}
                    className="text-forest/55 text-sm hover:text-forest transition-colors"
                  >
                    {l.label}
                  </a>
                ))}
              </nav>
            </div>

          </div>
        </div>

        {/* ── Product modal ─────────────────────────────────────────────────── */}
        {selected && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <div
              className="bg-cream rounded-3xl overflow-hidden max-w-2xl w-full flex flex-col md:flex-row shadow-2xl max-h-[90vh]"
              onClick={e => e.stopPropagation()}
            >
              {/* Image */}
              <div className="relative w-full md:w-1/2 aspect-square flex-shrink-0">
                <Image src={selected.image} alt={selected.name} fill className="object-cover" />
                {selected.badge && (
                  <span className="absolute top-4 left-4 bg-leaf text-cream text-[9px] tracking-widests uppercase px-3 py-1 rounded-full">
                    {selected.badge}
                  </span>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 p-8 overflow-y-auto flex flex-col">
                <button
                  onClick={() => setSelected(null)}
                  className="self-end text-forest/30 hover:text-forest text-xl mb-4 leading-none"
                >
                  ×
                </button>
                <p className="text-[10px] tracking-widests uppercase text-forest/35 mb-2">
                  {CATEGORIES.find(c => c.id === selected.category)?.label}
                </p>
                <h2 className="font-serif text-2xl font-light text-forest mb-1">{selected.name}</h2>
                <p className="text-forest/40 text-xs mb-4">{selected.subtitle}</p>
                <p className="text-forest/70 text-sm leading-relaxed mb-6">{selected.description}</p>

                {/* Size selector */}
                {selected.sizes && (
                  <div className="mb-6">
                    <p className="text-[10px] tracking-widests uppercase text-forest/40 mb-2">Tamanho</p>
                    <div className="flex gap-2 flex-wrap">
                      {selected.sizes.map(s => (
                        <button
                          key={s}
                          onClick={() => setSelectedSize(s)}
                          className={`w-10 h-10 rounded-lg border text-xs font-medium transition-all ${
                            selectedSize === s
                              ? 'bg-forest text-cream border-forest'
                              : 'bg-transparent text-forest/60 border-forest/20 hover:border-forest/50'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Variant selector */}
                {selected.variants && (
                  <div className="mb-6">
                    <p className="text-[10px] tracking-widests uppercase text-forest/40 mb-2">Variante</p>
                    <div className="flex gap-2 flex-wrap">
                      {selected.variants.map(v => (
                        <button
                          key={v}
                          onClick={() => setSelectedSize(v)}
                          className={`px-4 py-2 rounded-full border text-xs transition-all ${
                            selectedSize === v
                              ? 'bg-forest text-cream border-forest'
                              : 'bg-transparent text-forest/60 border-forest/20 hover:border-forest/50'
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-auto">
                  <p className="font-serif text-3xl font-light text-forest mb-5">
                    R$ {selected.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <button
                    onClick={() => {
                      if ((selected.sizes || selected.variants) && !selectedSize) return
                      addToCart(selected, selectedSize || undefined)
                    }}
                    disabled={(selected.sizes || selected.variants) ? !selectedSize : false}
                    className="w-full bg-forest text-cream text-[11px] tracking-widests uppercase py-4 rounded-xl
                               hover:bg-leaf transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Adicionar ao carrinho
                  </button>
                  <p className="text-center text-[10px] text-forest/30 mt-3">
                    15% desta compra vai para conservação
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Floating cart button ──────────────────────────────────────────── */}
        {cartCount > 0 && !cartOpen && (
          <button
            onClick={() => setCartOpen(true)}
            className="fixed bottom-8 right-8 z-40 bg-forest text-cream rounded-full px-6 py-4
                       shadow-[0_4px_24px_rgba(0,0,0,0.25)] hover:bg-leaf transition-colors
                       flex items-center gap-3"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            <span className="text-sm font-medium">{cartCount}</span>
            <span className="text-[10px] tracking-widests uppercase">Carrinho</span>
            <span className="font-serif text-sm">
              R$ {cartTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </span>
          </button>
        )}

        {/* ── Cart drawer ───────────────────────────────────────────────────── */}
        {cartOpen && (
          <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div
              className="flex-1 bg-black/30 backdrop-blur-sm"
              onClick={() => setCartOpen(false)}
            />
            {/* Drawer */}
            <div className="w-full max-w-sm bg-cream h-full flex flex-col shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-forest/10">
                <h2 className="font-serif text-xl font-light text-forest">Carrinho</h2>
                <button
                  onClick={() => setCartOpen(false)}
                  className="text-forest/30 hover:text-forest text-xl leading-none"
                >
                  ×
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
                {cart.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
                    <p className="text-forest/30 text-sm mb-4">Seu carrinho está vazio</p>
                    <button
                      onClick={() => setCartOpen(false)}
                      className="text-leaf text-xs tracking-widests uppercase hover:underline"
                    >
                      Continuar explorando →
                    </button>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id + (item.selectedSize ?? '')}
                         className="flex gap-4 items-start border-b border-forest/[0.08] pb-4">
                      {/* thumb */}
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-forest/5">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      {/* info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-forest text-sm font-medium truncate">{item.name}</p>
                        {item.selectedSize && (
                          <p className="text-forest/40 text-[11px]">{item.selectedSize}</p>
                        )}
                        <p className="text-forest/50 text-xs mt-0.5">
                          R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        {/* qty */}
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQty(item.id, item.selectedSize, -1)}
                            className="w-6 h-6 rounded-full border border-forest/20 text-forest/50 text-sm
                                       hover:border-forest hover:text-forest flex items-center justify-center"
                          >−</button>
                          <span className="text-forest text-sm w-4 text-center">{item.qty}</span>
                          <button
                            onClick={() => updateQty(item.id, item.selectedSize, +1)}
                            className="w-6 h-6 rounded-full border border-forest/20 text-forest/50 text-sm
                                       hover:border-forest hover:text-forest flex items-center justify-center"
                          >+</button>
                        </div>
                      </div>
                      {/* subtotal + remove */}
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <p className="text-forest font-medium text-sm">
                          R$ {(item.price * item.qty).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.id, item.selectedSize)}
                          className="text-forest/25 hover:text-red-400 text-xs transition-colors"
                        >
                          remover
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {cart.length > 0 && (
                <div className="px-6 py-5 border-t border-forest/10">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-forest/50 text-sm">Subtotal</span>
                    <span className="font-serif text-xl font-light text-forest">
                      R$ {cartTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <p className="text-forest/30 text-[10px] mb-5">
                    R$ {(cartTotal * 0.15).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} desta compra vai para conservação
                  </p>
                  <button
                    onClick={handleCheckout}
                    disabled={checkoutLoading}
                    className="w-full bg-forest text-cream text-[11px] tracking-widests uppercase py-4 rounded-xl
                               hover:bg-leaf transition-colors disabled:opacity-50"
                  >
                    {checkoutLoading ? 'Aguarde...' : 'Finalizar compra →'}
                  </button>
                  <p className="text-center text-[10px] text-forest/25 mt-3">
                    Pagamento seguro via Stripe
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </NavTheme>
  )
}
