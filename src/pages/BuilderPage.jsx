import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useReactToPrint } from 'react-to-print'
import toast from 'react-hot-toast'
import api from '../utils/api'
import AppLayout from '../components/dashboard/AppLayout'
import PersonalInfoForm from '../components/builder/PersonalInfoForm'
import EducationForm from '../components/builder/EducationForm'
import ExperienceForm from '../components/builder/ExperienceForm'
import SkillsForm from '../components/builder/SkillsForm'
import ProjectsForm from '../components/builder/ProjectsForm'
import CertificationsForm from '../components/builder/CertificationsForm'
import LanguagesForm from '../components/builder/LanguagesForm'
import { ResumeTemplate } from '../components/templates/ResumeTemplates'
import useResumeStore from '../store/resumeStore'

const TEMPLATES = [
  { id: 'minimal', name: 'Minimal', color: '#374151' },
  { id: 'professional', name: 'Professional', color: '#4f46e5' },
  { id: 'creative', name: 'Creative', color: '#7c3aed' },
  { id: 'ats-friendly', name: 'ATS Friendly', color: '#065f46' },
  { id: 'corporate', name: 'Corporate', color: '#1e40af' },
  { id: 'dark-modern', name: 'Dark Modern', color: '#1e293b' },
  { id: 'elegant-serif', name: 'Elegant Serif', color: '#92400e' },
  { id: 'sidebar', name: 'Sidebar', color: '#0f766e' },
  { id: 'timeline', name: 'Timeline', color: '#7c2d12' },
  { id: 'compact', name: 'Compact', color: '#4338ca' },
  { id: 'portfolio', name: 'Portfolio', color: '#9333ea' },
  { id: 'executive', name: 'Executive', color: '#1d4ed8' },
]

const SECTIONS = [
  { id: 'personal', label: 'Personal Info', icon: '👤', component: PersonalInfoForm },
  { id: 'experience', label: 'Experience', icon: '💼', component: ExperienceForm },
  { id: 'education', label: 'Education', icon: '🎓', component: EducationForm },
  { id: 'skills', label: 'Skills', icon: '⚡', component: SkillsForm },
  { id: 'projects', label: 'Projects', icon: '🚀', component: ProjectsForm },
  { id: 'certifications', label: 'Certifications', icon: '🏆', component: CertificationsForm },
  { id: 'languages', label: 'Languages', icon: '🌐', component: LanguagesForm },
]

export default function BuilderPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const printRef = useRef()
  const saveTimerRef = useRef()

  const { currentResume, fetchResume, createResume, saveResume, updateField, setTemplate, resetCurrent, isSaving, hasUnsavedChanges } = useResumeStore()

  const [activeSection, setActiveSection] = useState('personal')
  const [showTemplates, setShowTemplates] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [showShare, setShowShare] = useState(false)
  const [resumeTitle, setResumeTitle] = useState('')
  const [editingTitle, setEditingTitle] = useState(false)

  useEffect(() => {
    const init = async () => {
      if (id === 'new' || !id) {
        resetCurrent()
        const resume = await createResume({ title: 'New Resume' })
        navigate(`/builder/${resume._id}`, { replace: true })
      } else {
        await fetchResume(id)
      }
    }
    init().catch(() => toast.error('Failed to load resume'))
  }, [id])

  useEffect(() => {
    setResumeTitle(currentResume.title || 'My Resume')
  }, [currentResume._id])

  // Autosave after 2 seconds of inactivity
  useEffect(() => {
    if (!hasUnsavedChanges || !currentResume._id) return
    clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      saveResume().catch(() => {})
    }, 2000)
    return () => clearTimeout(saveTimerRef.current)
  }, [currentResume, hasUnsavedChanges])

  const handleSave = async () => {
    try {
      await saveResume()
      toast.success('Saved!')
    } catch { toast.error('Save failed') }
  }

  const handleTitleSave = async () => {
    setEditingTitle(false)
    updateField('title', resumeTitle || 'My Resume')
  }

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `${currentResume.personalInfo?.firstName || 'Resume'}_${currentResume.personalInfo?.lastName || ''}`,
    onAfterPrint: () => toast.success('PDF download started!'),
  })

  const handleShare = async () => {
    try {
      const { data } = await api.post(`/resume/${currentResume._id}/share`)
      setShareUrl(data.shareUrl)
      setShowShare(true)
    } catch { toast.error('Failed to generate share link') }
  }

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareUrl)
    toast.success('Link copied!')
  }

  const ActiveForm = SECTIONS.find(s => s.id === activeSection)?.component || PersonalInfoForm

  return (
    <AppLayout>
      <div className="flex h-full overflow-hidden" style={{ height: 'calc(100vh - 0px)' }}>

        {/* Left panel - form editor */}
        <div className={`${showPreview ? 'hidden lg:flex' : 'flex'} flex-col w-full lg:w-[400px] xl:w-[440px] flex-shrink-0 border-r border-surface-200 bg-white overflow-hidden`}>

          {/* Header */}
          <div className="flex-shrink-0 border-b border-surface-100 px-4 py-3">
            <div className="flex items-center justify-between gap-2">
              {editingTitle ? (
                <input
                  autoFocus
                  className="input-field text-sm font-semibold flex-1 py-1.5"
                  value={resumeTitle}
                  onChange={e => setResumeTitle(e.target.value)}
                  onBlur={handleTitleSave}
                  onKeyDown={e => e.key === 'Enter' && handleTitleSave()}
                />
              ) : (
                <button onClick={() => setEditingTitle(true)} className="flex items-center gap-1.5 group flex-1 min-w-0">
                  <span className="font-semibold text-gray-900 text-sm truncate">{currentResume.title || 'My Resume'}</span>
                  <svg className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" strokeWidth="1.5"/>
                  </svg>
                </button>
              )}

              <div className="flex items-center gap-1.5 flex-shrink-0">
                {/* Autosave indicator */}
                <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${isSaving ? 'text-amber-600 bg-amber-50' : hasUnsavedChanges ? 'text-gray-400 bg-surface-50' : 'text-green-600 bg-green-50'}`}>
                  {isSaving ? '⏳ Saving...' : hasUnsavedChanges ? '● Unsaved' : '✓ Saved'}
                </span>
                <button onClick={handleSave} className="btn-primary text-xs px-3 py-1.5">Save</button>
              </div>
            </div>
          </div>

          {/* Template selector */}
          <div className="flex-shrink-0 px-4 py-3 border-b border-surface-100">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="flex items-center justify-between w-full text-left px-3 py-2 bg-surface-50 rounded-xl hover:bg-surface-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded" style={{ background: TEMPLATES.find(t => t.id === currentResume.templateId)?.color || '#4f46e5' }} />
                <span className="text-sm font-medium text-gray-700">
                  {TEMPLATES.find(t => t.id === currentResume.templateId)?.name || 'Professional'}
                </span>
              </div>
              <span className="text-xs text-gray-400">Change template</span>
            </button>

            {showTemplates && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {TEMPLATES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => { setTemplate(t.id); setShowTemplates(false) }}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${currentResume.templateId === t.id ? 'border-primary-400 bg-primary-50' : 'border-surface-200 hover:border-primary-200'}`}
                  >
                    <div className="w-full h-10 rounded-lg" style={{ background: t.color }} />
                    <span className="text-[10px] text-gray-600 text-center leading-tight">{t.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Section tabs */}
          <div className="flex-shrink-0 flex gap-1 px-3 py-2 overflow-x-auto scrollbar-thin border-b border-surface-100">
            {SECTIONS.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                  activeSection === s.id ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:bg-surface-100 hover:text-gray-700'
                }`}
              >
                <span>{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>

          {/* Form content */}
          <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
            <ActiveForm />
          </div>

          {/* Bottom actions */}
          <div className="flex-shrink-0 border-t border-surface-100 px-4 py-3 flex items-center gap-2">
            <button onClick={() => setShowPreview(true)} className="btn-secondary flex-1 justify-center text-xs lg:hidden">
              👁 Preview
            </button>
            <button onClick={handlePrint} className="btn-primary flex-1 justify-center text-xs">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Download PDF
            </button>
            <button onClick={handleShare} className="btn-secondary text-xs px-3">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" strokeWidth="1.5"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Right panel - live preview */}
        <div className={`${showPreview ? 'flex' : 'hidden lg:flex'} flex-1 flex-col bg-surface-100 overflow-hidden`}>

          {/* Preview header */}
          <div className="flex-shrink-0 flex items-center justify-between px-4 py-3 bg-white border-b border-surface-200">
            <div className="flex items-center gap-3">
              <button onClick={() => setShowPreview(false)} className="lg:hidden btn-ghost text-xs">
                ← Back
              </button>
              <span className="text-sm font-medium text-gray-600">Live Preview</span>
              <span className="text-xs text-gray-400 hidden sm:inline">Updates as you type</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handlePrint} className="btn-primary text-xs py-1.5 px-3">
                ⬇ PDF
              </button>
            </div>
          </div>

          {/* Preview area */}
          <div className="flex-1 overflow-auto p-4 md:p-8 scrollbar-thin">
            <div className="max-w-[794px] mx-auto shadow-2xl rounded-lg overflow-hidden">
              <div ref={printRef} className="print-page">
                <ResumeTemplate resume={currentResume} />
              </div>
            </div>
          </div>
        </div>

        {/* Share modal */}
        {showShare && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
            <div className="bg-white rounded-2xl shadow-modal p-6 w-full max-w-md animate-slide-up">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Share resume</h3>
                <button onClick={() => setShowShare(false)} className="p-1 rounded-lg hover:bg-surface-100">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-4">Anyone with this link can view your resume:</p>
              <div className="flex gap-2">
                <input readOnly value={shareUrl} className="input-field flex-1 text-xs" />
                <button onClick={copyShareLink} className="btn-primary text-xs px-3 flex-shrink-0">Copy</button>
              </div>
              <p className="text-xs text-gray-400 mt-3">⚠️ Your resume will be publicly accessible via this link.</p>
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  )
}
