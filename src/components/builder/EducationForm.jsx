import React, { useState } from 'react'
import useResumeStore from '../../store/resumeStore'

const blank = { institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', gpa: '', description: '', current: false }

export default function EducationForm() {
  const { currentResume, addItem, updateItem, removeItem } = useResumeStore()
  const education = currentResume.education || []
  const [expandedIdx, setExpandedIdx] = useState(null)

  const handleAdd = () => {
    addItem('education', { ...blank })
    setExpandedIdx(education.length)
  }

  const handleUpdate = (idx, field, val) => updateItem('education', idx, { [field]: val })

  return (
    <div className="space-y-3">
      {education.map((edu, idx) => (
        <div key={idx} className="border border-surface-200 rounded-xl overflow-hidden">
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 bg-surface-50 cursor-pointer hover:bg-surface-100 transition-colors"
            onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
          >
            <div className="min-w-0">
              <p className="font-medium text-sm text-gray-900 truncate">
                {edu.degree || edu.institution || `Education ${idx + 1}`}
              </p>
              {edu.institution && edu.degree && (
                <p className="text-xs text-gray-500 truncate">{edu.institution}</p>
              )}
            </div>
            <div className="flex items-center gap-2 ml-3 flex-shrink-0">
              <button
                onClick={e => { e.stopPropagation(); removeItem('education', idx) }}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${expandedIdx === idx ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M19 9l-7 7-7-7" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          {/* Form */}
          {expandedIdx === idx && (
            <div className="p-4 space-y-3">
              <div>
                <label className="label">Institution</label>
                <input className="input-field" placeholder="University of California" value={edu.institution} onChange={e => handleUpdate(idx, 'institution', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Degree</label>
                  <input className="input-field" placeholder="Bachelor of Science" value={edu.degree} onChange={e => handleUpdate(idx, 'degree', e.target.value)} />
                </div>
                <div>
                  <label className="label">Field of Study</label>
                  <input className="input-field" placeholder="Computer Science" value={edu.fieldOfStudy} onChange={e => handleUpdate(idx, 'fieldOfStudy', e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="label">Start date</label>
                  <input className="input-field" placeholder="2019" value={edu.startDate} onChange={e => handleUpdate(idx, 'startDate', e.target.value)} />
                </div>
                <div>
                  <label className="label">End date</label>
                  <input className="input-field" placeholder={edu.current ? 'Present' : '2023'} value={edu.endDate} disabled={edu.current} onChange={e => handleUpdate(idx, 'endDate', e.target.value)} />
                </div>
                <div>
                  <label className="label">GPA</label>
                  <input className="input-field" placeholder="3.8" value={edu.gpa} onChange={e => handleUpdate(idx, 'gpa', e.target.value)} />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded" checked={edu.current} onChange={e => handleUpdate(idx, 'current', e.target.checked)} />
                <span className="text-sm text-gray-600">Currently studying here</span>
              </label>
              <div>
                <label className="label">Description (optional)</label>
                <textarea className="textarea-field h-20" placeholder="Notable achievements, activities, relevant coursework..." value={edu.description} onChange={e => handleUpdate(idx, 'description', e.target.value)} />
              </div>
            </div>
          )}
        </div>
      ))}

      <button onClick={handleAdd} className="btn-secondary w-full justify-center py-2.5 border-dashed">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        Add education
      </button>
    </div>
  )
}
