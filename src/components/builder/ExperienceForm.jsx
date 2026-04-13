import React, { useState } from 'react'
import useResumeStore from '../../store/resumeStore'

const blank = { company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: '' }

export default function ExperienceForm() {
  const { currentResume, addItem, updateItem, removeItem } = useResumeStore()
  const experience = currentResume.experience || []
  const [expandedIdx, setExpandedIdx] = useState(null)

  const handleAdd = () => {
    addItem('experience', { ...blank })
    setExpandedIdx(experience.length)
  }

  const u = (idx, field, val) => updateItem('experience', idx, { [field]: val })

  return (
    <div className="space-y-3">
      {experience.map((exp, idx) => (
        <div key={idx} className="border border-surface-200 rounded-xl overflow-hidden">
          <div
            className="flex items-center justify-between px-4 py-3 bg-surface-50 cursor-pointer hover:bg-surface-100 transition-colors"
            onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
          >
            <div className="min-w-0">
              <p className="font-medium text-sm text-gray-900 truncate">
                {exp.position || exp.company || `Experience ${idx + 1}`}
              </p>
              {exp.company && exp.position && (
                <p className="text-xs text-gray-500 truncate">{exp.company} · {exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ''}</p>
              )}
            </div>
            <div className="flex items-center gap-2 ml-3 flex-shrink-0">
              <button onClick={e => { e.stopPropagation(); removeItem('experience', idx) }} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${expandedIdx === idx ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M19 9l-7 7-7-7" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          {expandedIdx === idx && (
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Job title / Position</label>
                  <input className="input-field" placeholder="Senior Developer" value={exp.position} onChange={e => u(idx, 'position', e.target.value)} />
                </div>
                <div>
                  <label className="label">Company</label>
                  <input className="input-field" placeholder="Acme Inc." value={exp.company} onChange={e => u(idx, 'company', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="label">Location</label>
                <input className="input-field" placeholder="New York, NY (or Remote)" value={exp.location} onChange={e => u(idx, 'location', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Start date</label>
                  <input className="input-field" placeholder="Jan 2020" value={exp.startDate} onChange={e => u(idx, 'startDate', e.target.value)} />
                </div>
                <div>
                  <label className="label">End date</label>
                  <input className="input-field" placeholder={exp.current ? 'Present' : 'Dec 2023'} disabled={exp.current} value={exp.endDate} onChange={e => u(idx, 'endDate', e.target.value)} />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded" checked={exp.current} onChange={e => u(idx, 'current', e.target.checked)} />
                <span className="text-sm text-gray-600">I currently work here</span>
              </label>
              <div>
                <label className="label">Description & achievements</label>
                <textarea
                  className="textarea-field h-32"
                  placeholder="• Led a team of 5 engineers to deliver a new payment system&#10;• Reduced load time by 40% through performance optimizations&#10;• Built REST APIs serving 1M+ requests/day"
                  value={exp.description}
                  onChange={e => u(idx, 'description', e.target.value)}
                />
                <p className="text-xs text-gray-400 mt-1">Tip: Start each bullet with an action verb (Led, Built, Improved...)</p>
              </div>
            </div>
          )}
        </div>
      ))}

      <button onClick={handleAdd} className="btn-secondary w-full justify-center py-2.5 border-dashed">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        Add experience
      </button>
    </div>
  )
}
