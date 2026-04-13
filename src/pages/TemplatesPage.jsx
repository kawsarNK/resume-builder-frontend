import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import AppLayout from '../components/dashboard/AppLayout'
import { ResumeTemplate } from '../components/templates/ResumeTemplates'
import useResumeStore from '../store/resumeStore'

const TEMPLATES = [
  { id: 'minimal', name: 'Minimal', desc: 'Clean typography, maximum white space', tags: ['Simple', 'Timeless'] },
  { id: 'professional', name: 'Professional', desc: 'Bold header with purple accent', tags: ['Popular', 'Modern'] },
  { id: 'creative', name: 'Creative', desc: 'Gradient sidebar with skill bars', tags: ['Designer', 'Visual'] },
  { id: 'ats-friendly', name: 'ATS Friendly', desc: 'Plain text, machine-readable format', tags: ['ATS', 'Safe'] },
  { id: 'corporate', name: 'Corporate', desc: 'Navy blue, structured layout', tags: ['Finance', 'Law'] },
  { id: 'dark-modern', name: 'Dark Modern', desc: 'Sleek dark theme, tech-forward', tags: ['Dev', 'Dark'] },
  { id: 'elegant-serif', name: 'Elegant Serif', desc: 'Warm serif fonts, decorative accents', tags: ['Elegant', 'Academic'] },
  { id: 'sidebar', name: 'Sidebar Layout', desc: 'Teal two-column with skill bars', tags: ['Two-Column', 'Balanced'] },
  { id: 'timeline', name: 'Timeline', desc: 'Visual timeline for career story', tags: ['Timeline', 'Narrative'] },
  { id: 'compact', name: 'Compact', desc: 'Dense layout, fits more content', tags: ['1 Page', 'Dense'] },
  { id: 'portfolio', name: 'Portfolio', desc: 'Projects front and center', tags: ['Developer', 'Creative'] },
  { id: 'executive', name: 'Executive', desc: 'Authoritative double-rule header', tags: ['Senior', 'Leadership'] },
]

const sampleResume = {
  personalInfo: {
    firstName: 'Alex', lastName: 'Morgan',
    email: 'alex@example.com', phone: '+1 (555) 234-5678',
    city: 'San Francisco', state: 'CA', country: 'USA',
    linkedin: 'linkedin.com/in/alexmorgan',
    github: 'github.com/alexmorgan',
    summary: 'Full-stack engineer with 6+ years building scalable web applications. Passionate about clean code, performance, and great user experiences.'
  },
  experience: [
    { position: 'Senior Software Engineer', company: 'TechCorp', location: 'San Francisco, CA', startDate: 'Jan 2021', endDate: '', current: true, description: '• Led development of microservices handling 10M+ daily requests\n• Mentored 4 junior engineers\n• Reduced API response time by 60%' },
    { position: 'Software Engineer', company: 'StartupXYZ', location: 'Remote', startDate: 'Jun 2018', endDate: 'Dec 2020', current: false, description: '• Built React dashboard used by 50k+ users\n• Architected Node.js backend APIs' }
  ],
  education: [
    { degree: 'B.S. Computer Science', institution: 'UC Berkeley', fieldOfStudy: 'Computer Science', startDate: '2014', endDate: '2018', gpa: '3.8' }
  ],
  skills: [
    { name: 'React', level: 'Expert', category: 'Technical' },
    { name: 'Node.js', level: 'Expert', category: 'Technical' },
    { name: 'TypeScript', level: 'Advanced', category: 'Technical' },
    { name: 'AWS', level: 'Advanced', category: 'Technical' },
    { name: 'PostgreSQL', level: 'Advanced', category: 'Technical' },
    { name: 'Docker', level: 'Intermediate', category: 'Tools' },
  ],
  projects: [
    { name: 'ResumeForge', description: 'AI-powered resume builder with 12 templates', technologies: ['React', 'Node.js', 'MongoDB'], link: 'https://resumeforge.app' }
  ],
  certifications: [
    { name: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', date: '2022' }
  ],
  languages: [{ name: 'English', proficiency: 'Native' }, { name: 'Spanish', proficiency: 'Conversational' }]
}

export default function TemplatesPage() {
  const [selected, setSelected] = useState(null)
  const [previewTemplate, setPreviewTemplate] = useState(null)
  const navigate = useNavigate()
  const { createResume } = useResumeStore()

  const handleUseTemplate = async (templateId) => {
    try {
      const resume = await createResume({ title: 'New Resume', templateId })
      toast.success(`${TEMPLATES.find(t => t.id === templateId)?.name} template applied!`)
      navigate(`/builder/${resume._id}`)
    } catch {
      toast.error('Failed to create resume')
    }
  }

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Resume Templates</h1>
          <p className="text-gray-500 text-sm mt-1">Choose from 12 professionally designed templates. Click to preview, then use.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {TEMPLATES.map(t => (
            <div
              key={t.id}
              className={`card overflow-hidden cursor-pointer hover:shadow-card-hover transition-all duration-200 group ${selected === t.id ? 'ring-2 ring-primary-500' : ''}`}
              onClick={() => setPreviewTemplate(t)}
            >
              {/* Mini preview */}
              <div className="aspect-[210/297] overflow-hidden bg-white relative">
                <div style={{ transform: 'scale(0.25)', transformOrigin: 'top left', width: '400%', height: '400%', pointerEvents: 'none' }}>
                  <ResumeTemplate resume={{ ...sampleResume, templateId: t.id }} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 group-hover:to-black/10 transition-all" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="bg-white/90 text-gray-900 text-xs font-medium px-3 py-1.5 rounded-full shadow">Click to preview</span>
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <div className="flex items-start justify-between gap-1">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-snug">{t.desc}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {t.tags.map(tag => (
                    <span key={tag} className="text-[10px] bg-surface-100 text-gray-500 px-2 py-0.5 rounded-full">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-modal flex flex-col max-h-[90vh] w-full max-w-3xl animate-slide-up overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-surface-100 flex-shrink-0">
              <div>
                <h3 className="font-bold text-gray-900">{previewTemplate.name}</h3>
                <p className="text-xs text-gray-500">{previewTemplate.desc}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleUseTemplate(previewTemplate.id)} className="btn-primary text-sm">
                  Use this template →
                </button>
                <button onClick={() => setPreviewTemplate(null)} className="p-2 rounded-xl hover:bg-surface-100">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-6 bg-surface-50">
              <div className="max-w-[680px] mx-auto shadow-xl rounded-lg overflow-hidden">
                <div style={{ transform: 'scale(0.85)', transformOrigin: 'top center', width: '118%', marginLeft: '-9%' }}>
                  <ResumeTemplate resume={{ ...sampleResume, templateId: previewTemplate.id }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
