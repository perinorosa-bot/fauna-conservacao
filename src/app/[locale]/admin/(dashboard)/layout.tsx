import AdminSidebar from '@/components/admin/AdminSidebar'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}) {
  const t = await getTranslations({ locale: params.locale, namespace: 'meta.admin' })
  return { title: t('title') }
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0f1a14] flex">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}