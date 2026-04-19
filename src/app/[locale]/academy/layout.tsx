import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale, namespace: 'meta.academy' })
  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      languages: {
        'pt-BR': '/academy',
        'en-US': '/en/academy',
        'es-ES': '/es/academy',
      },
    },
  }
}

export default function AcademyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
