import AdminSidebar from '@/components/admin/AdminSidebar'

export const metadata = { title: 'Admin — Fauna' }

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