import React, { useState } from 'react'
import useResumeStore from '../../store/resumeStore'

const blank = { name: '', issuer: '', date: '', expiryDate: '', credentialId: '', link: '' }

export default function CertificationsForm() {
  const { currentResume, addItem, updateItem, removeItem } = useResumeStore()
  const certifications = currentResume.certifications || []
  const [expandedIdx, setExpandedIdx] = useState(null)

  const u = (idx, field, val) => updateItem('certifications', idx, { [field]: val })

  return (
    <div className="space-y-3">
      {certifications.map((cert, idx) => (
        <div key={idx} className="border border-surface-200 rounded-xl overflow-hidden">
          <div
            className="flex items-center justify-between px-4 py-3 bg-surface-50 cursor-pointer hover:bg-surface-100 transition-colors"
            onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
          >
            <div className="min-w-0">
              <p className="font-medium text-sm text-gray-900 truncate">{cert.name || `Certification ${idx + 1}`}</p>
              {cert.issuer && <p className="text-xs text-gray-500 truncate">{cert.issuer}{cert.date ? ` · ${cert.date}` : ''}</p>}
            </div>
            <div className="flex items-center gap-2 ml-3 flex-shrink-0">
              <button onClick={e => { e.stopPropagation(); removeItem('certifications', idx) }} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
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
              <div>
                <label className="label">Certification name</label>
                <input className="input-field" placeholder="AWS Certified Solutions Architect" value={cert.name} onChange={e => u(idx, 'name', e.target.value)} />
              </div>
              <div>
                <label className="label">Issuing organization</label>
                <input className="input-field" placeholder="Amazon Web Services" value={cert.issuer} onChange={e => u(idx, 'issuer', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Issue date</label>
                  <input className="input-field" placeholder="Jan 2023" value={cert.date} onChange={e => u(idx, 'date', e.target.value)} />
                </div>
                <div>
                  <label className="label">Expiry date</label>
                  <input className="input-field" placeholder="Jan 2026 (or No Expiry)" value={cert.expiryDate} onChange={e => u(idx, 'expiryDate', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="label">Credential ID</label>
                <input className="input-field" placeholder="ABC-123-XYZ" value={cert.credentialId} onChange={e => u(idx, 'credentialId', e.target.value)} />
              </div>
              <div>
                <label className="label">Credential URL</label>
                <input className="input-field" placeholder="https://verify.example.com/..." value={cert.link} onChange={e => u(idx, 'link', e.target.value)} />
              </div>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={() => { addItem('certifications', { ...blank }); setExpandedIdx(certifications.length) }}
        className="btn-secondary w-full justify-center py-2.5 border-dashed"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        Add certification
      </button>
    </div>
  )
}
