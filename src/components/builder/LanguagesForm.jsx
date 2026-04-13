import React, { useState } from 'react'
import useResumeStore from '../../store/resumeStore'

const PROFICIENCY_LEVELS = ['Elementary', 'Conversational', 'Professional', 'Native']
const LEVEL_COLORS = {
  Elementary: 'bg-gray-100 text-gray-600',
  Conversational: 'bg-blue-100 text-blue-700',
  Professional: 'bg-violet-100 text-violet-700',
  Native: 'bg-green-100 text-green-700'
}

export default function LanguagesForm() {
  const { currentResume, addItem, updateItem, removeItem } = useResumeStore()
  const languages = currentResume.languages || []
  const [newLang, setNewLang] = useState('')
  const [newLevel, setNewLevel] = useState('Professional')

  const handleAdd = () => {
    const name = newLang.trim()
    if (!name) return
    addItem('languages', { name, proficiency: newLevel })
    setNewLang('')
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-surface-50 rounded-xl border border-surface-200 space-y-3">
        <p className="text-xs font-semibold text-gray-500">Add a language</p>
        <div className="flex gap-2">
          <input
            className="input-field flex-1"
            placeholder="English, Spanish, French..."
            value={newLang}
            onChange={e => setNewLang(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAdd() } }}
          />
        </div>
        <div>
          <label className="label">Proficiency level</label>
          <select className="input-field" value={newLevel} onChange={e => setNewLevel(e.target.value)}>
            {PROFICIENCY_LEVELS.map(l => <option key={l}>{l}</option>)}
          </select>
        </div>
        <button onClick={handleAdd} className="btn-primary w-full justify-center py-2">Add language</button>
      </div>

      {languages.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">No languages added yet.</p>
      ) : (
        <div className="space-y-2">
          {languages.map((lang, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-white border border-surface-200 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-900">{lang.name}</span>
                <select
                  className="text-xs border border-surface-200 rounded-lg px-2 py-1 bg-white text-gray-600"
                  value={lang.proficiency}
                  onChange={e => updateItem('languages', idx, { proficiency: e.target.value })}
                >
                  {PROFICIENCY_LEVELS.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <button onClick={() => removeItem('languages', idx)} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
