import { getUser, getUserRole, logout } from '@/app/actions/auth'
import { redirect } from 'next/navigation'
import Navbar from './navbar'

export default async function DashboardLayout({ children }) {
  const user = await getUser()
  
  if (!user) {
    redirect('/login')
  }

  const role = await getUserRole()

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <header className="bg-white border-b border-neutral-200 print:hidden hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Swastik Plywood</h1>
            <p className="text-xs text-neutral-600 mt-0.5">
              {user.email} • <span className="uppercase font-medium">{role}</span>
            </p>
          </div>
          
          <form action={logout}>
            <button className="px-5 py-2 text-sm font-medium bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors">
              Logout
            </button>
          </form>
        </div>
      </header>

      {/* Responsive Navbar */}
      <Navbar />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 print:p-0 print:max-w-none">
        {children}
      </main>
    </div>
  )
}