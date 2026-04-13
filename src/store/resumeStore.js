import { create } from 'zustand'
import api from '../utils/api'

const defaultResume = {
  title: 'My Resume',
  templateId: 'professional',
  personalInfo: {
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', country: '', zipCode: '',
    linkedin: '', github: '', website: '', summary: '', profileImage: null
  },
  education: [],
  experience: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
}

const useResumeStore = create((set, get) => ({
  resumes: [],
  currentResume: { ...defaultResume },
  isSaving: false,
  isLoading: false,
  hasUnsavedChanges: false,

  // Fetch all resumes
  fetchResumes: async () => {
    set({ isLoading: true })
    const { data } = await api.get('/resume')
    set({ resumes: data.resumes, isLoading: false })
  },

  // Fetch single resume
  fetchResume: async (id) => {
    set({ isLoading: true })
    const { data } = await api.get(`/resume/${id}`)
    set({ currentResume: data.resume, isLoading: false, hasUnsavedChanges: false })
    return data.resume
  },

  // Create resume
  createResume: async (resumeData = {}) => {
    const payload = { ...defaultResume, ...resumeData }
    const { data } = await api.post('/resume', payload)
    set(s => ({ resumes: [data.resume, ...s.resumes] }))
    return data.resume
  },

  // Save current resume
  saveResume: async () => {
    const { currentResume } = get()
    if (!currentResume._id) return
    set({ isSaving: true })
    const { data } = await api.put(`/resume/${currentResume._id}`, currentResume)
    set(s => ({
      currentResume: data.resume,
      isSaving: false,
      hasUnsavedChanges: false,
      resumes: s.resumes.map(r => r._id === data.resume._id ? data.resume : r)
    }))
    return data.resume
  },

  // Delete resume
  deleteResume: async (id) => {
    await api.delete(`/resume/${id}`)
    set(s => ({ resumes: s.resumes.filter(r => r._id !== id) }))
  },

  // Duplicate resume
  duplicateResume: async (id) => {
    const { data } = await api.post(`/resume/${id}/duplicate`)
    set(s => ({ resumes: [data.resume, ...s.resumes] }))
    return data.resume
  },

  // Share resume
  shareResume: async (id) => {
    const { data } = await api.post(`/resume/${id}/share`)
    return data
  },

  // Update current resume field
  updateField: (section, value) => {
    set(s => ({
      currentResume: { ...s.currentResume, [section]: value },
      hasUnsavedChanges: true
    }))
  },

  // Update personal info field
  updatePersonalInfo: (field, value) => {
    set(s => ({
      currentResume: {
        ...s.currentResume,
        personalInfo: { ...s.currentResume.personalInfo, [field]: value }
      },
      hasUnsavedChanges: true
    }))
  },

  // Update array section (education, experience, etc.)
  updateSection: (section, items) => {
    set(s => ({
      currentResume: { ...s.currentResume, [section]: items },
      hasUnsavedChanges: true
    }))
  },

  // Add item to array section
  addItem: (section, item) => {
    set(s => ({
      currentResume: {
        ...s.currentResume,
        [section]: [...(s.currentResume[section] || []), item]
      },
      hasUnsavedChanges: true
    }))
  },

  // Update item in array section
  updateItem: (section, index, item) => {
    set(s => {
      const arr = [...(s.currentResume[section] || [])]
      arr[index] = { ...arr[index], ...item }
      return { currentResume: { ...s.currentResume, [section]: arr }, hasUnsavedChanges: true }
    })
  },

  // Remove item from array section
  removeItem: (section, index) => {
    set(s => {
      const arr = [...(s.currentResume[section] || [])]
      arr.splice(index, 1)
      return { currentResume: { ...s.currentResume, [section]: arr }, hasUnsavedChanges: true }
    })
  },

  // Set template
  setTemplate: (templateId) => {
    set(s => ({
      currentResume: { ...s.currentResume, templateId },
      hasUnsavedChanges: true
    }))
  },

  // Apply extracted CV data
  applyExtractedData: (extracted) => {
    set(s => ({
      currentResume: {
        ...s.currentResume,
        personalInfo: { ...s.currentResume.personalInfo, ...extracted.personalInfo },
        education: extracted.education?.length ? extracted.education : s.currentResume.education,
        experience: extracted.experience?.length ? extracted.experience : s.currentResume.experience,
        skills: extracted.skills?.length ? extracted.skills : s.currentResume.skills,
        certifications: extracted.certifications?.length ? extracted.certifications : s.currentResume.certifications,
        projects: extracted.projects?.length ? extracted.projects : s.currentResume.projects,
      },
      hasUnsavedChanges: true
    }))
  },

  // Reset current resume
  resetCurrent: () => set({ currentResume: { ...defaultResume }, hasUnsavedChanges: false }),

  setCurrentResume: (resume) => set({ currentResume: resume, hasUnsavedChanges: false }),
}))

export default useResumeStore
