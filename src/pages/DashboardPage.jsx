import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import AppLayout from '../components/dashboard/AppLayout'
import useAuthStore from '../store/authStore'
import useResumeStore from '../store/resumeStore'

const templateColors = {
  minimal: '#374151', professional: '#4f46e5', creative: '#7c3aed',
  'ats-friendly': '#065f46', corporate: '#1e40af', 'dark-modern': '#1e293b',
  'elegant-serif': '#92400e', sidebar: '#0f766e', timeline: '#7c2d12',
  compact: '#4338ca', portfolio: '#9333ea', executive: '#1d4ed8'
}

function ResumeCard({ resume, onDelete, onDuplicate }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const color = templateColors[resume.templateId] || '#4f46e5'
  const name = [resume.personalInfo?.firstName, resume.personalInfo?.lastName].filter(Boolean).join(' ') || 'Untitled'
  const updated = new Date(resume.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <div className="card overflow-hidden hover:shadow-card-hover transition-all duration-200 group animate-fade-in">
      {/* Preview */}
      <Link to={`/builder/${resume._id}`} className="block">
        <div className="h-36 flex flex-col gap-2 p-4" style={{ background: color }}>
          <div className="h-2 w-16 rounded bg-white/50" />
          <div className="h-1.5 w-24 rounded bg-white/30" />
          <div className="mt-2 space-y-1">
            {[50, 70, 40, 60].map((w, i) => (
              <div key={i} className="h-1 rounded bg-white/20" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link to={`/builder/${resume._id}`} className="font-medium text-gray-900 text-sm hover:text-primary-600 truncate block">
              {resume.title}
            </Link>
            <p className="text-xs text-gray-400 mt-0.5">{name} · {updated}</p>
          </div>

          {/* Menu */}
          <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-1.5 rounded-lg hover:bg-surface-100 text-gray-400 hover:text-gray-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
              </svg>
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-8 z-20 bg-white border border-surface-200 rounded-xl shadow-modal py-1 w-40">
                  <button onClick={() => { navigate(`/builder/${resume._id}`); setMenuOpen(false) }} className="flex items-center gap-2 px-3 py-2 w-full text-left text-sm text-gray-700 hover:bg-surface-50">
                    ✏️ Edit
                  </button>
                  <button onClick={() => { onDuplicate(resume._id); setMenuOpen(false) }} className="flex items-center gap-2 px-3 py-2 w-full text-left text-sm text-gray-700 hover:bg-surface-50">
                    📋 Duplicate
                  </button>
                  <hr className="border-surface-100 my-1" />
                  <button onClick={() => { onDelete(resume._id); setMenuOpen(false) }} className="flex items-center gap-2 px-3 py-2 w-full text-left text-sm text-red-600 hover:bg-red-50">
                    🗑️ Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Template badge */}
        <div className="mt-3">
          <span className="badge text-xs" style={{ background: `${color}15`, color }}>
            {resume.templateId || 'professional'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const user = useAuthStore(s => s.user)
  const { resumes, isLoading, fetchResumes, createResume, deleteResume, duplicateResume } = useResumeStore()
  const navigate = useNavigate()

  useEffect(() => {
    fetchResumes().catch(() => toast.error('Failed to load resumes'))
  }, [])

  const handleCreate = async () => {
    try {
      const resume = await createResume({ title: 'New Resume' })
      navigate(`/builder/${resume._id}`)
    } catch {
      toast.error('Failed to create resume')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this resume? This cannot be undone.')) return
    await deleteResume(id)
    toast.success('Resume deleted')
  }

  const handleDuplicate = async (id) => {
    const resume = await duplicateResume(id)
    toast.success('Resume duplicated!')
    navigate(`/builder/${resume._id}`)
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{greeting}, {user?.name?.split(' ')[0]}! 👋</h1>
            <p className="text-gray-500 text-sm mt-1">
              {resumes.length === 0 ? "Let's create your first resume." : `You have ${resumes.length} resume${resumes.length > 1 ? 's' : ''}.`}
            </p>
          </div>
          <button onClick={handleCreate} className="btn-primary flex-shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            New Resume
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Resumes', value: resumes.length, icon: '📄' },
            { label: 'Templates', value: 12, icon: '🎨' },
            { label: 'AI Parses', value: '∞', icon: '🤖' },
            { label: 'Downloads', value: '∞', icon: '📥' },
          ].map(s => (
            <div key={s.label} className="card p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{s.icon}</span>
                <div>
                  <p className="text-xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-500">{s.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div
            onClick={handleCreate}
            className="card p-5 cursor-pointer hover:shadow-card-hover transition-all border-dashed border-2 border-primary-200 hover:border-primary-400 bg-primary-50/30 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                <span className="text-xl">✨</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Create from scratch</p>
                <p className="text-sm text-gray-500">Start with a blank resume</p>
              </div>
            </div>
          </div>
          <Link
            to="/cv-parser"
            className="card p-5 cursor-pointer hover:shadow-card-hover transition-all border-dashed border-2 border-violet-200 hover:border-violet-400 bg-violet-50/30 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center group-hover:bg-violet-200 transition-colors">
                <span className="text-xl">🤖</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">AI CV Parser</p>
                <p className="text-sm text-gray-500">Upload & auto-fill from existing CV</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Resume grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card overflow-hidden animate-pulse">
                <div className="h-36 bg-surface-100" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-surface-100 rounded w-2/3" />
                  <div className="h-3 bg-surface-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-20 card">
            <div className="text-5xl mb-4">📄</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No resumes yet</h3>
            <p className="text-gray-500 text-sm mb-6">Create your first resume or upload an existing CV to get started.</p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button onClick={handleCreate} className="btn-primary">Create resume</button>
              <Link to="/cv-parser" className="btn-secondary">Upload CV</Link>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Your resumes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {resumes.map(resume => (
                <ResumeCard
                  key={resume._id}
                  resume={resume}
                  onDelete={handleDelete}
                  onDuplicate={handleDuplicate}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
