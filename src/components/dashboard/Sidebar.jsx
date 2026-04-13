import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'

const navItems = [
  { to: '/dashboard', icon: 'grid', label: 'Dashboard' },
  { to: '/builder/new', icon: 'plus', label: 'New Resume' },
  { to: '/cv-parser', icon: 'scan', label: 'AI CV Parser' },
  { to: '/grammar-checker', icon: 'check', label: 'Grammar Checker', badge: 'New' },
  { to: '/templates', icon: 'layout', label: 'Templates' },
]

const icons = {
  grid: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" rx="1" strokeWidth="1.5"/>
      <rect x="14" y="3" width="7" height="7" rx="1" strokeWidth="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1" strokeWidth="1.5"/>
      <rect x="14" y="14" width="7" height="7" rx="1" strokeWidth="1.5"/>
    </svg>
  ),
  plus: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M12 5v14M5 12h14" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  scan: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M3 12h18" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  check: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  layout: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5"/>
      <path d="M3 9h18M9 21V9" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
}

export default function Sidebar({ mobile = false, onClose }) {
  const user = useAuthStore(s => s.user)
  const logout = useAuthStore(s => s.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out!')
    navigate('/login')
  }

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'

  return (
    <div className={`flex flex-col h-full bg-white border-r border-surface-200 ${mobile ? 'w-full' : 'w-64'}`}>
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-surface-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#a855f7,#22c55e)' }}>
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="font-bold text-gray-900 text-lg">ResumeForge</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="section-title px-3 pt-2">Navigation</p>
        {navItems.map(({ to, icon, label, badge }) => {
          const Icon = icons[icon]
          return (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-surface-50 hover:text-gray-900'
                }`
              }
            >
              <Icon />
              <span className="flex-1">{label}</span>
              {badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">{badge}</span>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* User info */}
      <div className="p-4 border-t border-surface-100">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl mb-1">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
            {user?.profileImage ? (
              <img src={user.profileImage} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <span className="text-xs font-bold text-primary-700">{initials}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Sign out
        </button>
      </div>
    </div>
  )
}
