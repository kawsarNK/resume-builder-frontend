import React, { useRef } from 'react'
import useResumeStore from '../../store/resumeStore'
import api from '../../utils/api'
import toast from 'react-hot-toast'

export default function PersonalInfoForm() {
  const { currentResume, updatePersonalInfo } = useResumeStore()
  const info = currentResume.personalInfo || {}
  const fileRef = useRef()

  const f = (field) => ({
    value: info[field] || '',
    onChange: e => updatePersonalInfo(field, e.target.value)
  })

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error('Image too large (max 5MB)'); return }

    const formData = new FormData()
    formData.append('image', file)
    try {
      const { data } = await api.post('/upload/resume-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      updatePersonalInfo('profileImage', data.imageUrl)
      toast.success('Photo uploaded!')
    } catch {
      toast.error('Upload failed')
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile photo */}
      <div className="flex items-center gap-4">
        <div
          onClick={() => fileRef.current?.click()}
          className="w-16 h-16 rounded-2xl bg-surface-100 border-2 border-dashed border-surface-300 flex items-center justify-center cursor-pointer hover:border-primary-400 transition-colors overflow-hidden"
        >
          {info.profileImage ? (
            <img src={info.profileImage} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" strokeWidth="1.5"/>
            </svg>
          )}
        </div>
        <div>
          <button onClick={() => fileRef.current?.click()} className="btn-secondary text-xs py-1.5 px-3">
            {info.profileImage ? 'Change photo' : 'Add photo'}
          </button>
          {info.profileImage && (
            <button onClick={() => updatePersonalInfo('profileImage', null)} className="ml-2 text-xs text-red-500 hover:text-red-700">Remove</button>
          )}
          <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 5MB</p>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
      </div>

      {/* Name */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">First name</label>
          <input className="input-field" placeholder="John" {...f('firstName')} />
        </div>
        <div>
          <label className="label">Last name</label>
          <input className="input-field" placeholder="Doe" {...f('lastName')} />
        </div>
      </div>

      {/* Contact */}
      <div className="grid grid-cols-1 gap-3">
        <div>
          <label className="label">Email</label>
          <input type="email" className="input-field" placeholder="john@example.com" {...f('email')} />
        </div>
        <div>
          <label className="label">Phone</label>
          <input type="tel" className="input-field" placeholder="+1 (555) 000-0000" {...f('phone')} />
        </div>
      </div>

      {/* Address */}
      <div>
        <label className="label">Address</label>
        <input className="input-field" placeholder="123 Main St" {...f('address')} />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="label">City</label>
          <input className="input-field" placeholder="New York" {...f('city')} />
        </div>
        <div>
          <label className="label">State</label>
          <input className="input-field" placeholder="NY" {...f('state')} />
        </div>
        <div>
          <label className="label">Country</label>
          <input className="input-field" placeholder="USA" {...f('country')} />
        </div>
      </div>

      {/* Links */}
      <div className="space-y-3">
        <p className="section-title">Online profiles</p>
        <div>
          <label className="label">LinkedIn URL</label>
          <input className="input-field" placeholder="https://linkedin.com/in/johndoe" {...f('linkedin')} />
        </div>
        <div>
          <label className="label">GitHub URL</label>
          <input className="input-field" placeholder="https://github.com/johndoe" {...f('github')} />
        </div>
        <div>
          <label className="label">Website / Portfolio</label>
          <input className="input-field" placeholder="https://johndoe.dev" {...f('website')} />
        </div>
      </div>

      {/* Summary */}
      <div>
        <label className="label">Professional summary</label>
        <textarea
          className="textarea-field h-28"
          placeholder="A brief summary of your professional background, skills, and career goals..."
          {...f('summary')}
        />
        <p className="text-xs text-gray-400 mt-1">{(info.summary || '').length}/600 characters</p>
      </div>
    </div>
  )
}
