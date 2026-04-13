import React, { useState } from 'react'
import useResumeStore from '../../store/resumeStore'

const blank = { name: '', description: '', technologies: [], link: '', github: '', startDate: '', endDate: '' }

export default function ProjectsForm() {
  const { currentResume, addItem, updateItem, removeItem } = useResumeStore()
  const projects = currentResume.projects || []
  const [expandedIdx, setExpandedIdx] = useState(null)
  const [techInput, setTechInput] = useState({})

  const u = (idx, field, val) => updateItem('projects', idx, { [field]: val })

  const addTech = (idx) => {
    const val = (techInput[idx] || '').trim()
    if (!val) return
    const proj = projects[idx]
    u(idx, 'technologies', [...(proj.technologies || []), val])
    setTechInput(t => ({ ...t, [idx]: '' }))
  }

  const removeTech = (idx, techIdx) => {
    const proj = projects[idx]
    const techs = [...(proj.technologies || [])]
    techs.splice(techIdx, 1)
    u(idx, 'technologies', techs)
  }

  return (
    <div className="space-y-3">
      {projects.map((proj, idx) => (
        <div key={idx} className="border border-surface-200 rounded-xl overflow-hidden">
          <div
            className="flex items-center justify-between px-4 py-3 bg-surface-50 cursor-pointer hover:bg-surface-100 transition-colors"
            onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
          >
            <div className="min-w-0">
              <p className="font-medium text-sm text-gray-900 truncate">{proj.name || `Project ${idx + 1}`}</p>
              {proj.technologies?.length > 0 && (
                <p className="text-xs text-gray-500 truncate">{proj.technologies.slice(0, 3).join(', ')}</p>
              )}
            </div>
            <div className="flex items-center gap-2 ml-3 flex-shrink-0">
              <button onClick={e => { e.stopPropagation(); removeItem('projects', idx) }} className="p-1 text-gray-400 hover:text-red-500">
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
                <label className="label">Project name</label>
                <input className="input-field" placeholder="My Awesome App" value={proj.name} onChange={e => u(idx, 'name', e.target.value)} />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea className="textarea-field h-24" placeholder="What does this project do? What problem does it solve?" value={proj.description} onChange={e => u(idx, 'description', e.target.value)} />
              </div>
              <div>
                <label className="label">Technologies</label>
                <div className="flex gap-2 mb-2">
                  <input
                    className="input-field flex-1"
                    placeholder="React, Node.js..."
                    value={techInput[idx] || ''}
                    onChange={e => setTechInput(t => ({ ...t, [idx]: e.target.value }))}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTech(idx) }}}
                  />
                  <button onClick={() => addTech(idx)} className="btn-secondary px-3 flex-shrink-0">Add</button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(proj.technologies || []).map((tech, tIdx) => (
                    <span key={tIdx} className="flex items-center gap-1 px-2.5 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium">
                      {tech}
                      <button onClick={() => removeTech(idx, tIdx)} className="hover:text-primary-900 ml-0.5">×</button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Live URL</label>
                  <input className="input-field" placeholder="https://myapp.com" value={proj.link} onChange={e => u(idx, 'link', e.target.value)} />
                </div>
                <div>
                  <label className="label">GitHub URL</label>
                  <input className="input-field" placeholder="https://github.com/..." value={proj.github} onChange={e => u(idx, 'github', e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Start date</label>
                  <input className="input-field" placeholder="Jan 2023" value={proj.startDate} onChange={e => u(idx, 'startDate', e.target.value)} />
                </div>
                <div>
                  <label className="label">End date</label>
                  <input className="input-field" placeholder="Present" value={proj.endDate} onChange={e => u(idx, 'endDate', e.target.value)} />
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      <button onClick={() => { addItem('projects', { ...blank }); setExpandedIdx(projects.length) }} className="btn-secondary w-full justify-center py-2.5 border-dashed">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M12 5v14M5 12h14" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        Add project
      </button>
    </div>
  )
}
