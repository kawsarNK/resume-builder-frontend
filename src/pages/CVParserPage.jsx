import React, { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import AppLayout from '../components/dashboard/AppLayout'
import useResumeStore from '../store/resumeStore'
import api from '../utils/api'

const STEPS = ['upload', 'parsing', 'review', 'choose']

export default function CVParserPage() {
  const [step, setStep] = useState('upload')
  const [file, setFile] = useState(null)
  const [textInput, setTextInput] = useState('')
  const [extracted, setExtracted] = useState(null)
  const [inputMode, setInputMode] = useState('file')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedExistingId, setSelectedExistingId] = useState('')
  const [showExistingModal, setShowExistingModal] = useState(false)

  const navigate = useNavigate()
  const { createResume, applyExtractedData, resumes, fetchResumes, setCurrentResume } = useResumeStore()

  useEffect(() => { fetchResumes().catch(() => {}) }, [])

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles[0]) setFile(acceptedFiles[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
  })

  const handleParse = async () => {
    setIsLoading(true)
    setStep('parsing')
    try {
      let data
      if (inputMode === 'file' && file) {
        const formData = new FormData()
        formData.append('cv', file)
        const res = await api.post('/extract', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        data = res.data.data
      } else if (inputMode === 'text' && textInput.trim()) {
        const res = await api.post('/extract/text', { text: textInput })
        data = res.data.data
      } else {
        toast.error('Please upload a file or paste text')
        setStep('upload')
        setIsLoading(false)
        return
      }
      setExtracted(data)
      setStep('review')
    } catch {
      toast.error('Parsing failed. Please try again.')
      setStep('upload')
    } finally {
      setIsLoading(false)
    }
  }

  /* ── Apply to NEW resume ── */
  const handleApplyNew = async () => {
    try {
      const resume = await createResume({
        title: `${extracted?.personalInfo?.firstName || 'Parsed'} ${extracted?.personalInfo?.lastName || 'Resume'}`.trim(),
      })
      applyExtractedData(extracted)
      toast.success('CV data applied to new resume!')
      navigate(`/builder/${resume._id}`)
    } catch {
      toast.error('Failed to create resume')
    }
  }

  /* ── Apply to EXISTING resume ── */
  const handleApplyExisting = async () => {
    if (!selectedExistingId) { toast.error('Please select a resume'); return }
    try {
      // Load the existing resume into store
      const { data } = await api.get(`/resume/${selectedExistingId}`)
      setCurrentResume(data.resume)
      applyExtractedData(extracted)
      toast.success('CV data merged into existing resume!')
      navigate(`/builder/${selectedExistingId}`)
    } catch {
      toast.error('Failed to load resume')
    }
  }

  const renderSkillBadge = (skill, i) => (
    <span key={i} className="px-2.5 py-1 bg-primary-50 text-primary-700 text-xs rounded-full border border-primary-100">
      {skill.name || skill}
    </span>
  )

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center text-xl">🤖</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI CV Parser</h1>
              <p className="text-gray-500 text-sm">Upload your existing CV and let AI extract all your data automatically.</p>
            </div>
          </div>

          {/* Progress steps */}
          <div className="flex items-center gap-2 mt-6">
            {[['upload','1','Upload'], ['parsing','2','Parsing'], ['review','3','Review'], ['choose','4','Apply']].map(([s, num, label], idx, arr) => (
              <React.Fragment key={s}>
                <div className={`flex items-center gap-2 ${step === s || STEPS.indexOf(step) > STEPS.indexOf(s) ? 'opacity-100' : 'opacity-40'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step === s ? 'bg-primary-600 text-white'
                    : STEPS.indexOf(step) > STEPS.indexOf(s) ? 'bg-green-500 text-white'
                    : 'bg-surface-200 text-gray-500'
                  }`}>
                    {STEPS.indexOf(step) > STEPS.indexOf(s) ? '✓' : num}
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:inline">{label}</span>
                </div>
                {idx < arr.length - 1 && <div className="flex-1 h-px bg-surface-200" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ── STEP: Upload ── */}
        {step === 'upload' && (
          <div className="card p-6 space-y-6 animate-fade-in">
            <div className="flex rounded-xl overflow-hidden border border-surface-200">
              {[['file','📄 Upload File'], ['text','📋 Paste Text']].map(([mode, label]) => (
                <button key={mode} onClick={() => setInputMode(mode)}
                  className={`flex-1 py-2.5 text-sm font-medium transition-all ${inputMode === mode ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-surface-50'}`}>
                  {label}
                </button>
              ))}
            </div>

            {inputMode === 'file' ? (
              <div {...getRootProps()} className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${isDragActive ? 'border-primary-400 bg-primary-50' : file ? 'border-green-400 bg-green-50' : 'border-surface-300 hover:border-primary-300 hover:bg-primary-50/30'}`}>
                <input {...getInputProps()} />
                {file ? (
                  <div>
                    <div className="text-4xl mb-3">✅</div>
                    <p className="font-semibold text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500 mt-1">{(file.size / 1024).toFixed(0)} KB · Ready to parse</p>
                    <button onClick={e => { e.stopPropagation(); setFile(null) }} className="mt-3 text-xs text-red-500 hover:text-red-700">Remove</button>
                  </div>
                ) : (
                  <div>
                    <div className="text-5xl mb-4">📤</div>
                    <p className="font-semibold text-gray-900 mb-1">{isDragActive ? 'Drop your CV here!' : 'Drag & drop your CV here'}</p>
                    <p className="text-sm text-gray-500">or click to browse · PDF, DOCX, TXT up to 10MB</p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <label className="label">Paste your CV / resume text</label>
                <textarea
                  className="textarea-field h-56"
                  placeholder="Paste the plain text of your CV here..."
                  value={textInput}
                  onChange={e => setTextInput(e.target.value)}
                />
                <p className="text-xs text-gray-400 mt-1">{textInput.length} characters · Min 50 required</p>
              </div>
            )}

            <div className="p-4 bg-violet-50 rounded-xl border border-violet-100">
              <p className="text-xs font-semibold text-violet-800 mb-2">🤖 What the AI parser extracts:</p>
              <div className="grid grid-cols-2 gap-1">
                {['Name & contact info', 'Work experience', 'Education history', 'Technical skills', 'Projects', 'Certifications'].map(item => (
                  <p key={item} className="text-xs text-violet-700">✓ {item}</p>
                ))}
              </div>
            </div>

            <button
              onClick={handleParse}
              disabled={inputMode === 'file' ? !file : textInput.trim().length < 50}
              className="btn-primary w-full justify-center py-3"
            >
              🚀 Parse CV with AI
            </button>
          </div>
        )}

        {/* ── STEP: Parsing ── */}
        {step === 'parsing' && (
          <div className="card p-12 text-center animate-fade-in">
            <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 animate-pulse-soft">🤖</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Analysing your CV...</h3>
            <p className="text-gray-500 text-sm mb-8">Extracting your experience, skills, and education</p>
            <div className="space-y-3 max-w-xs mx-auto">
              {['Reading document structure...', 'Extracting contact info...', 'Parsing work history...', 'Identifying skills...'].map((msg, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                  </div>
                  <p className="text-sm text-gray-500">{msg}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP: Review ── */}
        {step === 'review' && extracted && (
          <div className="space-y-5 animate-fade-in">
            <div className="card p-4 flex items-center gap-3" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
              <span className="text-2xl">🎉</span>
              <div>
                <p className="font-semibold text-green-800">CV parsed successfully!</p>
                <p className="text-xs text-green-700">Review the extracted data below, then choose where to apply it.</p>
              </div>
            </div>

            {Object.values(extracted.personalInfo || {}).some(Boolean) && (
              <div className="card p-5">
                <h3 className="font-semibold text-gray-900 mb-3">👤 Personal Information</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(extracted.personalInfo).filter(([k, v]) => v && k !== 'summary').map(([k, v]) => (
                    <div key={k} className="text-sm">
                      <span className="text-gray-400 capitalize">{k}: </span>
                      <span className="text-gray-900">{v}</span>
                    </div>
                  ))}
                </div>
                {extracted.personalInfo.summary && (
                  <p className="text-xs text-gray-600 mt-3 p-3 bg-surface-50 rounded-lg">{extracted.personalInfo.summary}</p>
                )}
              </div>
            )}

            {extracted.experience?.length > 0 && (
              <div className="card p-5">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  💼 Experience <span className="badge bg-primary-50 text-primary-700">{extracted.experience.length}</span>
                </h3>
                {extracted.experience.map((exp, i) => (
                  <div key={i} className="flex items-start gap-3 py-3 border-b border-surface-100 last:border-0">
                    <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center text-sm flex-shrink-0">💼</div>
                    <div>
                      <p className="font-medium text-sm text-gray-900">{exp.position || 'Unknown Role'}</p>
                      <p className="text-xs text-gray-500">{exp.company}{exp.startDate ? ` · ${exp.startDate}${exp.endDate ? `–${exp.endDate}` : exp.current ? '–Present' : ''}` : ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {extracted.education?.length > 0 && (
              <div className="card p-5">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  🎓 Education <span className="badge bg-primary-50 text-primary-700">{extracted.education.length}</span>
                </h3>
                {extracted.education.map((edu, i) => (
                  <div key={i} className="py-2 border-b border-surface-100 last:border-0">
                    <p className="font-medium text-sm">{edu.degree}</p>
                    <p className="text-xs text-gray-500">{edu.institution} {edu.startDate ? `· ${edu.startDate}–${edu.endDate || 'Present'}` : ''}</p>
                  </div>
                ))}
              </div>
            )}

            {extracted.skills?.length > 0 && (
              <div className="card p-5">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  ⚡ Skills <span className="badge bg-primary-50 text-primary-700">{extracted.skills.length}</span>
                </h3>
                <div className="flex flex-wrap gap-2">{extracted.skills.map(renderSkillBadge)}</div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Jobs', val: extracted.experience?.length || 0, icon: '💼' },
                { label: 'Schools', val: extracted.education?.length || 0, icon: '🎓' },
                { label: 'Skills', val: extracted.skills?.length || 0, icon: '⚡' },
                { label: 'Certs', val: extracted.certifications?.length || 0, icon: '🏆' },
              ].map(s => (
                <div key={s.label} className="card p-3 text-center">
                  <p className="text-xl">{s.icon}</p>
                  <p className="text-xl font-bold text-gray-900">{s.val}</p>
                  <p className="text-xs text-gray-500">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={() => { setStep('upload'); setFile(null); setExtracted(null) }} className="btn-secondary px-4">
                ← Retry
              </button>
              <button onClick={() => setStep('choose')} className="btn-primary flex-1 justify-center py-3">
                Continue → Choose Where to Apply
              </button>
            </div>
          </div>
        )}

        {/* ── STEP: Choose ── */}
        {step === 'choose' && extracted && (
          <div className="space-y-5 animate-fade-in">
            <div className="card p-4 flex items-center gap-3" style={{ background: '#eff6ff', borderColor: '#bfdbfe' }}>
              <span className="text-2xl">📋</span>
              <div>
                <p className="font-semibold text-blue-800">Where would you like to apply this data?</p>
                <p className="text-xs text-blue-700">You can add to a new resume or merge into an existing one.</p>
              </div>
            </div>

            {/* Option 1 — New Resume */}
            <div
              className="card p-6 cursor-pointer border-2 hover:border-primary-400 transition-all group"
              style={{ borderColor: '#e0e7ff' }}
              onClick={handleApplyNew}
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform" style={{ background: '#ede9fe' }}>
                  ✨
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-base">Add to New Resume</p>
                  <p className="text-sm text-gray-500 mt-0.5">Create a brand-new resume and auto-fill all extracted data.</p>
                </div>
                <svg className="w-5 h-5 text-gray-400 group-hover:text-primary-600 flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>

            {/* Option 2 — Existing Resume */}
            <div className="card p-6 border-2" style={{ borderColor: '#d1fae5' }}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" style={{ background: '#d1fae5' }}>
                  📝
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-base">Add to Existing Resume</p>
                  <p className="text-sm text-gray-500 mt-0.5">Merge extracted data into one of your existing resumes.</p>
                </div>
              </div>

              {resumes.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-3">No existing resumes found. Create one first.</p>
              ) : (
                <div className="space-y-3">
                  <label className="label">Select a resume to merge into</label>
                  <select
                    className="input-field w-full"
                    value={selectedExistingId}
                    onChange={e => setSelectedExistingId(e.target.value)}
                  >
                    <option value="">— Choose a resume —</option>
                    {resumes.map(r => (
                      <option key={r._id} value={r._id}>
                        {r.title} {r.personalInfo?.firstName ? `(${r.personalInfo.firstName} ${r.personalInfo.lastName || ''})` : ''}
                      </option>
                    ))}
                  </select>

                  {selectedExistingId && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                      <p className="text-xs text-amber-700 font-medium">⚠️ This will overwrite existing fields with extracted data.</p>
                      <p className="text-xs text-amber-600 mt-0.5">Empty fields will be filled. You can edit everything afterwards.</p>
                    </div>
                  )}

                  <button
                    onClick={handleApplyExisting}
                    disabled={!selectedExistingId}
                    className="btn-primary w-full justify-center py-3"
                    style={{ background: '#22c55e' }}
                  >
                    📝 Merge into Selected Resume →
                  </button>
                </div>
              )}
            </div>

            <button onClick={() => setStep('review')} className="btn-ghost w-full justify-center text-sm">
              ← Back to Review
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
