import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fauna Academy — Captação de recursos para conservação',
  description: 'Treinamentos e workshops para organizações de conservação aprenderem a captar recursos com eficiência.',
}

export default function AcademyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
