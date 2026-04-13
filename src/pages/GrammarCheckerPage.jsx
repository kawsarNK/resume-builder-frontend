import React, { useState, useEffect } from 'react'
import AppLayout from '../components/dashboard/AppLayout'
import useResumeStore from '../store/resumeStore'
import api from '../utils/api'

/* ─── Rule-based grammar + resume writing checker ─────────────────── */
function checkGrammar(text) {
  const issues = []
  const lines = text.split('\n')

  // Helper to push issue
  const add = (type, message, suggestion, line = null, severity = 'warning') =>
    issues.push({ type, message, suggestion, line, severity })

  lines.forEach((line, idx) => {
    const l = line.trim()
    if (!l) return
    const lineNum = idx + 1

    // Double spaces
    if (/  +/.test(l)) add('spacing', `Line ${lineNum}: Double space detected.`, 'Use single spaces between words.', lineNum)

    // Starts with lowercase (not a bullet/number)
    if (/^[a-z]/.test(l) && !/^(\d+\.|[-•*])/.test(l))
      add('capitalization', `Line ${lineNum}: Sentence starts with lowercase "${l.slice(0, 20)}..."`, 'Capitalize the first word.', lineNum)

    // Common typos / weak words
    const weakWords = [
      { w: /\bresponsible for\b/gi, s: 'Use action verbs: "Managed", "Led", "Owned"' },
      { w: /\bhelped\b/gi, s: 'Use stronger: "Contributed to", "Collaborated on", "Facilitated"' },
      { w: /\bworked on\b/gi, s: 'Use: "Developed", "Built", "Designed", "Implemented"' },
      { w: /\bvery\b/gi, s: 'Remove "very" — use a stronger adjective instead' },
      { w: /\btried\b/gi, s: 'Use "Delivered", "Achieved", "Completed" instead' },
      { w: /\bbasically\b/gi, s: 'Remove filler word "basically"' },
      { w: /\bthings\b/gi, s: 'Be specific — replace "things" with the actual noun' },
      { w: /\bstuff\b/gi, s: 'Too informal — use specific nouns' },
      { w: /\bgot\b/gi, s: 'Use "Achieved", "Received", "Obtained", "Secured"' },
      { w: /\bdo\b/gi, s: 'Use specific action verbs like "Execute", "Perform", "Implement"' },
    ]
    weakWords.forEach(({ w, s }) => {
      if (w.test(l)) {
        add('weak_word', `Line ${lineNum}: Weak phrasing detected — "${l.match(w)?.[0]}"`, s, lineNum, 'warning')
      }
    })

    // Missing period at end (for full sentences, not bullet points or short fragments)
    if (l.length > 40 && /[a-z0-9]$/.test(l) && !/^[-•*\d]/.test(l) && !l.endsWith(','))
      add('punctuation', `Line ${lineNum}: Consider ending the sentence with proper punctuation.`, 'Add a period at the end.', lineNum, 'info')

    // First-person pronouns (bad on resume)
    if (/\b(I |I'm |I've |my |me |myself )\b/gi.test(l))
      add('first_person', `Line ${lineNum}: Avoid first-person pronouns on a resume.`, 'Remove "I", "my", "me" — start with an action verb instead.', lineNum, 'error')

    // Too long bullet (>25 words)
    const wordCount = l.split(/\s+/).filter(Boolean).length
    if (wordCount > 25)
      add('length', `Line ${lineNum}: Bullet point is too long (${wordCount} words).`, 'Keep bullets under 20 words for readability.', lineNum, 'info')

    // Passive voice patterns
    if (/\b(was|were|been|being)\s+\w+(ed|en)\b/gi.test(l))
      add('passive', `Line ${lineNum}: Possible passive voice detected.`, 'Use active voice: instead of "was developed", write "Developed"', lineNum, 'warning')

    // Missing quantification suggestion (experience lines)
    if (l.length > 30 && /^[•\-*]/.test(l) && !/\d/.test(l))
      add('quantify', `Line ${lineNum}: No numbers found in this bullet.`, 'Add metrics: "Improved performance by 30%", "Led team of 5", etc.', lineNum, 'info')
  })

  // Full text checks
  if (text.length < 200)
    add('length', 'Your resume text seems very short.', 'A strong resume usually has 300–600 words.', null, 'info')

  // Check for email format
  const emails = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g)
  if (emails) {
    emails.forEach(email => {
      if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(email))
        add('email', `Email "${email}" may have formatting issues.`, 'Use lowercase email addresses.', null, 'info')
    })
  }

  // Repeated words check
  const words = text.toLowerCase().split(/\W+/).filter(w => w.length > 4)
  const freq = {}
  words.forEach(w => { freq[w] = (freq[w] || 0) + 1 })
  Object.entries(freq).forEach(([word, count]) => {
    if (count > 4 && !['experience', 'skills', 'education', 'developed', 'managed'].includes(word))
      add('repetition', `Word "${word}" appears ${count} times.`, `Vary your vocabulary — use synonyms for "${word}"`, null, 'info')
  })

  return issues
}

/* ─── Score calculation ───────────────────────────────────────────── */
function calcScore(issues, textLength) {
  if (!textLength) return 0
  const errorPenalty = issues.filter(i => i.severity === 'error').length * 12
  const warnPenalty = issues.filter(i => i.severity === 'warning').length * 6
  const infoPenalty = issues.filter(i => i.severity === 'info').length * 2
  const score = Math.max(0, 100 - errorPenalty - warnPenalty - infoPenalty)
  return score
}

/* ─── Resume text extractor ───────────────────────────────────────── */
function resumeToText(resume) {
  if (!resume) return ''
  const pi = resume.personalInfo || {}
  const parts = []
  if (pi.firstName || pi.lastName) parts.push(`${pi.firstName} ${pi.lastName}`.trim())
  if (pi.email) parts.push(pi.email)
  if (pi.phone) parts.push(pi.phone)
  if (pi.summary) parts.push('\nSUMMARY\n' + pi.summary)

  if (resume.experience?.length) {
    parts.push('\nEXPERIENCE')
    resume.experience.forEach(e => {
      parts.push(`${e.position} at ${e.company}`)
      if (e.description) parts.push(e.description)
    })
  }
  if (resume.education?.length) {
    parts.push('\nEDUCATION')
    resume.education.forEach(e => parts.push(`${e.degree} — ${e.institution}`))
  }
  if (resume.skills?.length) {
    parts.push('\nSKILLS\n' + resume.skills.map(s => s.name).join(', '))
  }
  if (resume.projects?.length) {
    parts.push('\nPROJECTS')
    resume.projects.forEach(p => {
      parts.push(p.name)
      if (p.description) parts.push(p.description)
    })
  }
  return parts.join('\n')
}

const SEVERITY_CONFIG = {
  error:   { color: '#ef4444', bg: '#fef2f2', border: '#fecaca', label: 'Error',   icon: '🔴' },
  warning: { color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', label: 'Warning', icon: '🟡' },
  info:    { color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe', label: 'Tip',     icon: '🔵' },
}

const TYPE_LABELS = {
  first_person: '1st Person', weak_word: 'Weak Word', capitalization: 'Capitalization',
  punctuation: 'Punctuation', passive: 'Passive Voice', quantify: 'Missing Numbers',
  length: 'Length', spacing: 'Spacing', repetition: 'Repetition', email: 'Email'
}

export default function GrammarCheckerPage() {
  const { resumes, fetchResumes } = useResumeStore()
  const [text, setText] = useState('')
  const [issues, setIssues] = useState([])
  const [checked, setChecked] = useState(false)
  const [score, setScore] = useState(0)
  const [selectedResume, setSelectedResume] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => { fetchResumes().catch(() => {}) }, [])

  const handleLoadResume = async () => {
    const resume = resumes.find(r => r._id === selectedResume)
    if (!resume) return
    // Need full resume — fetch it
    try {
      const { data } = await api.get(`/resume/${selectedResume}`)
      const t = resumeToText(data.resume)
      setText(t)
      setChecked(false)
      setIssues([])
    } catch { toast.error('Failed to load resume') }
  }

  const handleCheck = () => {
    if (!text.trim()) return
    setIsAnalyzing(true)
    setTimeout(() => {
      const found = checkGrammar(text)
      setIssues(found)
      setScore(calcScore(found, text.length))
      setChecked(true)
      setIsAnalyzing(false)
    }, 800)
  }

  const handleClear = () => { setText(''); setIssues([]); setChecked(false); setScore(0) }

  const filtered = activeFilter === 'all' ? issues : issues.filter(i => i.severity === activeFilter)

  const errorCount   = issues.filter(i => i.severity === 'error').length
  const warningCount = issues.filter(i => i.severity === 'warning').length
  const infoCount    = issues.filter(i => i.severity === 'info').length

  const scoreColor = score >= 80 ? '#22c55e' : score >= 60 ? '#f59e0b' : '#ef4444'
  const scoreLabel = score >= 80 ? 'Excellent' : score >= 60 ? 'Needs Work' : 'Poor'

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-xl">✅</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Grammar & Writing Checker</h1>
              <p className="text-gray-500 text-sm mt-0.5">Check your resume for grammar errors, weak words, and writing improvements.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── Left: Input panel ── */}
          <div className="space-y-4">

            {/* Load from resume */}
            <div className="card p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Load from existing resume</p>
              <div className="flex gap-2">
                <select
                  className="input-field flex-1 text-sm"
                  value={selectedResume}
                  onChange={e => setSelectedResume(e.target.value)}
                >
                  <option value="">— Select a resume —</option>
                  {resumes.map(r => (
                    <option key={r._id} value={r._id}>
                      {r.title} {r.personalInfo?.firstName ? `(${r.personalInfo.firstName} ${r.personalInfo.lastName || ''})` : ''}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleLoadResume}
                  disabled={!selectedResume}
                  className="btn-secondary text-sm px-3 flex-shrink-0"
                >
                  Load
                </button>
              </div>
            </div>

            {/* Text area */}
            <div className="card p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Or paste your resume text</p>
                {text && (
                  <button onClick={handleClear} className="text-xs text-gray-400 hover:text-red-500 transition-colors">Clear</button>
                )}
              </div>
              <textarea
                className="textarea-field w-full"
                style={{ height: 320, fontFamily: 'JetBrains Mono, monospace', fontSize: 12, lineHeight: 1.7 }}
                placeholder={`Paste your resume content here...\n\nExample:\nJohn Doe\njohn@example.com\n\nSoftware Engineer at Acme Corp\n• Developed REST APIs serving 1M+ requests/day\n• Led team of 5 engineers to deliver payment system\n• Reduced load time by 40% through optimization`}
                value={text}
                onChange={e => { setText(e.target.value); setChecked(false) }}
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-400">
                  {text.split(/\s+/).filter(Boolean).length} words · {text.length} characters
                </span>
                <button
                  onClick={handleCheck}
                  disabled={!text.trim() || isAnalyzing}
                  className="btn-primary text-sm px-6"
                >
                  {isAnalyzing ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Analyzing...
                    </span>
                  ) : '✅ Check Grammar'}
                </button>
              </div>
            </div>
          </div>

          {/* ── Right: Results panel ── */}
          <div className="space-y-4">

            {/* Score card */}
            {checked && (
              <div className="card p-5 animate-fade-in">
                <div className="flex items-center gap-5">
                  {/* Score ring */}
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                      <circle
                        cx="18" cy="18" r="15.9" fill="none"
                        stroke={scoreColor} strokeWidth="3"
                        strokeDasharray={`${score} ${100 - score}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-black" style={{ color: scoreColor }}>{score}</span>
                      <span className="text-[9px] text-gray-400 font-medium">/100</span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <p className="text-lg font-bold text-gray-900">{scoreLabel}</p>
                    <p className="text-sm text-gray-500 mb-3">Resume writing quality score</p>
                    <div className="flex gap-3">
                      <span className="flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 px-2.5 py-1 rounded-full">🔴 {errorCount} errors</span>
                      <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">🟡 {warningCount} warnings</span>
                      <span className="flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">🔵 {infoCount} tips</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Perfect score */}
            {checked && issues.length === 0 && (
              <div className="card p-8 text-center animate-fade-in" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
                <div className="text-5xl mb-3">🎉</div>
                <p className="font-bold text-green-800 text-lg">Perfect! No issues found.</p>
                <p className="text-green-700 text-sm mt-1">Your resume writing looks great!</p>
              </div>
            )}

            {/* Filter tabs */}
            {checked && issues.length > 0 && (
              <div className="card p-4 animate-fade-in">
                <div className="flex gap-2 mb-4 flex-wrap">
                  {[
                    { key: 'all', label: `All (${issues.length})` },
                    { key: 'error', label: `Errors (${errorCount})` },
                    { key: 'warning', label: `Warnings (${warningCount})` },
                    { key: 'info', label: `Tips (${infoCount})` },
                  ].map(f => (
                    <button
                      key={f.key}
                      onClick={() => setActiveFilter(f.key)}
                      className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-all ${activeFilter === f.key ? 'bg-primary-100 text-primary-700' : 'bg-surface-100 text-gray-500 hover:bg-surface-200'}`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-2.5 max-h-96 overflow-y-auto scrollbar-thin pr-1">
                  {filtered.map((issue, i) => {
                    const cfg = SEVERITY_CONFIG[issue.severity]
                    return (
                      <div
                        key={i}
                        className="rounded-xl p-3.5 border"
                        style={{ background: cfg.bg, borderColor: cfg.border }}
                      >
                        <div className="flex items-start gap-2.5">
                          <span className="text-sm flex-shrink-0 mt-0.5">{cfg.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: cfg.color + '20', color: cfg.color }}>
                                {TYPE_LABELS[issue.type] || issue.type}
                              </span>
                              {issue.line && <span className="text-xs text-gray-400">Line {issue.line}</span>}
                            </div>
                            <p className="text-xs font-medium text-gray-800 mb-1">{issue.message}</p>
                            <p className="text-xs text-gray-500 flex items-start gap-1">
                              <span className="flex-shrink-0">💡</span>
                              {issue.suggestion}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Not yet checked */}
            {!checked && !isAnalyzing && (
              <div className="card p-10 text-center">
                <div className="text-5xl mb-4">✍️</div>
                <p className="font-semibold text-gray-900 mb-2">Ready to check your resume</p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Paste your resume text or load an existing resume above,<br />
                  then click "Check Grammar" to get instant feedback.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3">
                  {[
                    { icon: '🔴', label: 'First-person pronouns' },
                    { icon: '🟡', label: 'Weak action verbs' },
                    { icon: '🔵', label: 'Missing metrics' },
                    { icon: '🟡', label: 'Passive voice' },
                    { icon: '🔵', label: 'Long bullets' },
                    { icon: '🟡', label: 'Repeated words' },
                  ].map(c => (
                    <div key={c.label} className="flex items-center gap-2 text-xs text-gray-500 bg-surface-50 rounded-lg px-3 py-2">
                      <span>{c.icon}</span>{c.label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tips box */}
            {checked && (
              <div className="card p-4" style={{ background: '#faf5ff', borderColor: '#e9d5ff' }}>
                <p className="text-xs font-bold text-purple-800 mb-2">✨ Pro Resume Writing Tips</p>
                <ul className="space-y-1.5">
                  {[
                    'Start each bullet with a strong action verb (Led, Built, Achieved...)',
                    'Quantify achievements: "Increased sales by 25%", "Managed team of 8"',
                    'Keep bullets to 1–2 lines for easy scanning',
                    'Avoid first-person pronouns (I, my, me)',
                    'Use industry keywords that match the job description',
                  ].map((tip, i) => (
                    <li key={i} className="flex gap-2 text-xs text-purple-700">
                      <span className="text-purple-400 flex-shrink-0">•</span>{tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
