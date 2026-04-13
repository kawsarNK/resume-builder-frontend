import React, { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useReactToPrint } from 'react-to-print'
import { ResumeTemplate } from '../components/templates/ResumeTemplates'
import api from '../utils/api'

export default function SharedResumePage() {
  const { token } = useParams()
  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const printRef = useRef()

  useEffect(() => {
    api.get(`/resume/share/${token}`)
      .then(({ data }) => { setResume(data.resume); setLoading(false) })
      .catch(() => { setError('Resume not found or no longer public.'); setLoading(false) })
  }, [token])

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `${resume?.personalInfo?.firstName || 'Resume'}_${resume?.personalInfo?.lastName || ''}`,
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading resume...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-center card p-12 max-w-md mx-4">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Resume not found</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <Link to="/" className="btn-primary">Go to ResumeForge</Link>
        </div>
      </div>
    )
  }

  const name = [resume?.personalInfo?.firstName, resume?.personalInfo?.lastName].filter(Boolean).join(' ')

  return (
    <div className="min-h-screen bg-surface-100">
      {/* Top bar */}
      <div className="no-print sticky top-0 z-10 bg-white border-b border-surface-200 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">R</span>
              </div>
              <span className="font-semibold text-gray-900 text-sm hidden sm:inline">ResumeForge</span>
            </Link>
            <span className="text-surface-300">·</span>
            <span className="text-sm text-gray-600">{name}'s Resume</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handlePrint} className="btn-primary text-sm py-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Download PDF
            </button>
            <Link to="/register" className="btn-secondary text-sm py-2 hidden sm:flex">
              Build your own →
            </Link>
          </div>
        </div>
      </div>

      {/* Resume */}
      <div className="py-8 px-4">
        <div className="max-w-[794px] mx-auto shadow-2xl rounded-lg overflow-hidden">
          <div ref={printRef} className="print-page">
            <ResumeTemplate resume={resume} />
          </div>
        </div>
      </div>

      {/* CTA footer */}
      <div className="no-print py-12 text-center">
        <div className="card max-w-lg mx-auto p-8">
          <p className="text-2xl font-bold text-gray-900 mb-2">Create your own resume</p>
          <p className="text-gray-500 text-sm mb-6">Join ResumeForge — free forever, 12 templates, AI CV parser.</p>
          <Link to="/register" className="btn-primary text-base px-8 py-3">Get started free →</Link>
        </div>
      </div>
    </div>
  )
}
