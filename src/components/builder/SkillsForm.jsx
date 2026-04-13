import React, { useState } from 'react'
import useResumeStore from '../../store/resumeStore'

const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert']
const LEVEL_COLORS = { Beginner: 'bg-gray-100 text-gray-600', Intermediate: 'bg-blue-100 text-blue-700', Advanced: 'bg-violet-100 text-violet-700', Expert: 'bg-green-100 text-green-700' }
const CATEGORIES = ['Technical', 'Soft Skills', 'Languages', 'Tools', 'Frameworks', 'Design', 'Other']

export default function SkillsForm() {
  const { currentResume, addItem, updateItem, removeItem } = useResumeStore()
  const skills = currentResume.skills || []
  const [newSkill, setNewSkill] = useState('')
  const [newLevel, setNewLevel] = useState('Intermediate')
  const [newCategory, setNewCategory] = useState('Technical')

  const handleAdd = () => {
    const name = newSkill.trim()
    if (!name) return
    addItem('skills', { name, level: newLevel, category: newCategory })
    setNewSkill('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); handleAdd() }
  }

  // Group by category
  const grouped = skills.reduce((acc, skill, idx) => {
    const cat = skill.category || 'Technical'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push({ ...skill, _idx: idx })
    return acc
  }, {})

  return (
    <div className="space-y-5">
      {/* Add skill */}
      <div className="p-4 bg-surface-50 rounded-xl border border-surface-200 space-y-3">
        <p className="text-xs font-semibold text-gray-500">Add a skill</p>
        <div className="flex gap-2">
          <input
            className="input-field flex-1"
            placeholder="e.g. React, Python, Leadership..."
            value={newSkill}
            onChange={e => setNewSkill(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleAdd} className="btn-primary px-3 flex-shrink-0">Add</button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="label">Level</label>
            <select className="input-field" value={newLevel} onChange={e => setNewLevel(e.target.value)}>
              {LEVELS.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Category</label>
            <select className="input-field" value={newCategory} onChange={e => setNewCategory(e.target.value)}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Skills list grouped by category */}
      {Object.keys(grouped).length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">No skills added yet. Add your first skill above.</p>
      ) : (
        Object.entries(grouped).map(([category, catSkills]) => (
          <div key={category}>
            <p className="section-title">{category}</p>
            <div className="flex flex-wrap gap-2">
              {catSkills.map(skill => (
                <div
                  key={skill._idx}
                  className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-surface-200 bg-white hover:border-red-300 transition-all"
                >
                  <span className="text-sm text-gray-800">{skill.name}</span>
                  <span className={`badge text-xs ${LEVEL_COLORS[skill.level] || LEVEL_COLORS.Intermediate}`}>
                    {skill.level}
                  </span>
                  <button
                    onClick={() => removeItem('skills', skill._idx)}
                    className="ml-1 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {skills.length > 0 && (
        <p className="text-xs text-gray-400">{skills.length} skill{skills.length > 1 ? 's' : ''} added</p>
      )}
    </div>
  )
}
