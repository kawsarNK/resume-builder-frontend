import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function Counter({ to, suffix = '' }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let start = 0
    const step = Math.ceil(to / 50)
    const t = setInterval(() => {
      start += step
      if (start >= to) { setVal(to); clearInterval(t) }
      else setVal(start)
    }, 20)
    return () => clearInterval(t)
  }, [to])
  return <>{val.toLocaleString()}{suffix}</>
}

const mockResumes = [
  { name: 'Junior Data Analyst', updated: '7th Apr 2025', color: '#f0fdf4', accent: '#22c55e', initials: 'JD' },
  { name: 'Creative Copywriter', updated: '7th Apr 2025', color: '#faf5ff', accent: '#a855f7', initials: 'CC' },
  { name: 'Software Engineer', updated: '7th Apr 2025', color: '#eff6ff', accent: '#3b82f6', initials: 'SE' },
  { name: 'Backend Developer', updated: '7th Apr 2025', color: '#fff7ed', accent: '#f97316', initials: 'BD' },
  { name: 'Figma Designer', updated: '7th Apr 2025', color: '#fdf2f8', accent: '#ec4899', initials: 'FD' },
  { name: 'Travel Advisor', updated: '7th Apr 2025', color: '#f0fdfa', accent: '#14b8a6', initials: 'TA' },
  { name: "Mike's Resume", updated: '7th Apr 2025', color: '#fefce8', accent: '#eab308', initials: 'MR' },
  { name: 'Software Engineer', updated: '7th Apr 2025', color: '#f0f9ff', accent: '#0ea5e9', initials: 'SE2' },
]

function MockCard({ r }) {
  return (
    <div style={{ borderRadius: 10, background: 'white', border: '1px solid #f1f5f9', padding: 6, cursor: 'pointer', transition: 'all 0.2s' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = '' }}
    >
      <div style={{ height: 80, borderRadius: 7, background: r.color, padding: 8, marginBottom: 5, position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
          <div style={{ width: 18, height: 18, borderRadius: '50%', background: r.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'white', fontSize: 7, fontWeight: 700 }}>{r.initials.slice(0,1)}</span>
          </div>
          <div style={{ height: 4, borderRadius: 2, width: 36, background: r.accent + '50' }} />
        </div>
        {[60, 40, 70, 35, 50].map((w, i) => (
          <div key={i} style={{ height: 3, borderRadius: 2, width: `${w}%`, background: r.accent + '35', marginBottom: 3 }} />
        ))}
      </div>
      <p style={{ fontSize: 9, fontWeight: 600, color: '#374151', marginBottom: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</p>
      <p style={{ fontSize: 8, color: '#9ca3af' }}>Last Updated {r.updated}</p>
    </div>
  )
}

const features = [
  { icon: '✏️', title: 'Easy Editing', desc: 'Update your resume sections with live preview and instant formatting.', bg: '#f0fdf4', border: '#bbf7d0' },
  { icon: '🎨', title: 'Beautiful Templates', desc: 'Choose from modern, professional templates that are easy to customize.', bg: '#faf5ff', border: '#e9d5ff' },
  { icon: '⚡', title: 'One-Click Export', desc: 'Download your resume instantly as a high-quality PDF with one click.', bg: '#eff6ff', border: '#bfdbfe' },
  { icon: '🤖', title: 'AI CV Parser', desc: 'Upload your old CV and let AI extract all your data automatically.', bg: '#fff7ed', border: '#fed7aa' },
  { icon: '✅', title: 'Grammar Checker', desc: 'Catch errors and improve your writing with smart AI suggestions.', bg: '#fdf2f8', border: '#fbcfe8' },
  { icon: '🔗', title: 'Share Anywhere', desc: 'Generate a public link and share your resume with anyone instantly.', bg: '#f0fdfa', border: '#99f6e4' },
]

const steps = [
  { num: '01', title: 'Create Account', desc: 'Sign up free — no credit card needed.', color: '#a855f7' },
  { num: '02', title: 'Choose Template', desc: 'Pick from 12 stunning professional designs.', color: '#22c55e' },
  { num: '03', title: 'Fill Your Details', desc: 'Add your experience, skills, and education.', color: '#3b82f6' },
  { num: '04', title: 'Download PDF', desc: 'Export a pixel-perfect, ATS-friendly PDF.', color: '#f97316' },
]

const templatePreviews = [
  { name: 'Professional', color: '#4f46e5' }, { name: 'Minimal', color: '#374151' },
  { name: 'Creative', color: '#7c3aed' }, { name: 'ATS Friendly', color: '#065f46' },
  { name: 'Dark Modern', color: '#0f172a' }, { name: 'Elegant Serif', color: '#92400e' },
  { name: 'Sidebar', color: '#0f766e' }, { name: 'Portfolio', color: '#9333ea' },
]

export default function LandingPage() {
  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#fff', minHeight: '100vh' }}>

      {/* ─── Navbar ─────────────────────────────────── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ maxWidth: 1152, margin: '0 auto', padding: '0 20px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#a855f7,#22c55e)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'white', fontWeight: 900, fontSize: 15 }}>R</span>
            </div>
            <span style={{ fontWeight: 900, fontSize: 17, color: '#111827', letterSpacing: -0.3 }}>Resume Builder</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ display: 'flex', gap: 20 }}>
              {[['#features', 'Features'], ['#templates', 'Templates'], ['#how', 'How it works']].map(([href, label]) => (
                <a key={label} href={href} style={{ fontSize: 14, fontWeight: 500, color: '#6b7280', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = '#111827'} onMouseLeave={e => e.target.style.color = '#6b7280'}>{label}</a>
              ))}
            </div>
            <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', padding: '9px 20px', border: '1.5px solid #e5e7eb', borderRadius: 12, fontSize: 13, fontWeight: 600, color: '#374151', textDecoration: 'none', transition: 'all 0.2s', background: 'white' }}
              onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'} onMouseLeave={e => e.currentTarget.style.background = 'white'}>
              Login / Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ────────────────────────────────────── */}
      <section style={{ paddingTop: 104, paddingBottom: 64, padding: '104px 20px 64px' }}>
        <div style={{ maxWidth: 1152, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>

          {/* Left copy */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 100, background: '#f0fdf4', border: '1px solid #bbf7d0', fontSize: 12, fontWeight: 600, color: '#15803d', marginBottom: 24 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              AI-Powered · Free Forever
            </div>

            <h1 style={{ fontSize: 58, fontWeight: 900, color: '#111827', lineHeight: 1.1, marginBottom: 16, letterSpacing: -2 }}>
              Build Your{' '}<span style={{ color: '#a855f7' }}>Resume</span><br />
              <span style={{ color: '#22c55e' }}>Effortlessly</span>
            </h1>

            <p style={{ fontSize: 18, color: '#6b7280', lineHeight: 1.7, marginBottom: 36, maxWidth: 420 }}>
              Craft a standout resume in minutes with our smart and intuitive resume builder.
            </p>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 40 }}>
              <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', background: '#111827', color: 'white', borderRadius: 16, fontSize: 15, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'} onMouseLeave={e => e.currentTarget.style.transform = ''}>
                Get Started
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeWidth="2.5" strokeLinecap="round"/></svg>
              </Link>
              <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', padding: '14px 28px', border: '1.5px solid #e5e7eb', color: '#374151', borderRadius: 16, fontSize: 15, fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s', background: 'white' }}>
                Sign In
              </Link>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 32 }}>
              {[{ n: 12, s: '', l: 'Templates' }, { n: 50000, s: '+', l: 'Users' }, { n: 100, s: '%', l: 'Free' }].map(st => (
                <div key={st.l}>
                  <p style={{ fontSize: 26, fontWeight: 900, color: '#111827', margin: 0 }}><Counter to={st.n} suffix={st.s} /></p>
                  <p style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500, margin: 0 }}>{st.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — mock dashboard */}
          <div style={{ position: 'relative' }}>
            <div style={{ background: 'white', borderRadius: 20, boxShadow: '0 8px 48px rgba(0,0,0,0.12)', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
              {/* Browser bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: '#f9fafb', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', gap: 5 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f87171' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#fbbf24' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#4ade80' }} />
                </div>
                <div style={{ flex: 1, background: 'white', border: '1px solid #e5e7eb', borderRadius: 8, padding: '3px 10px', fontSize: 10, color: '#9ca3af' }}>
                  resumebuilder.app/dashboard
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: 'white', fontSize: 8, fontWeight: 700 }}>M</span>
                  </div>
                  <span style={{ fontSize: 10, color: '#6b7280', fontWeight: 500 }}>Mike</span>
                  <span style={{ fontSize: 10, color: '#9ca3af', cursor: 'pointer' }}>Logout</span>
                </div>
              </div>

              {/* Dashboard */}
              <div style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <p style={{ fontWeight: 700, fontSize: 13, color: '#111827' }}>Resume Builder</p>
                  <p style={{ fontSize: 10, color: '#9ca3af' }}>My Resumes</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                  {/* Add new */}
                  <div style={{ border: '2px dashed #e5e7eb', borderRadius: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '18px 8px', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#a855f7'; e.currentTarget.style.background = '#faf5ff' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.background = 'white' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2px dashed #d1d5db', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: 14, color: '#9ca3af', lineHeight: 1 }}>+</span>
                    </div>
                    <p style={{ fontSize: 9, color: '#9ca3af', textAlign: 'center', lineHeight: 1.4 }}>Add New<br />Resume</p>
                  </div>

                  {mockResumes.slice(0, 7).map((r, i) => <MockCard key={i} r={r} />)}
                </div>
              </div>
            </div>

            {/* Floating badges */}
            <div style={{ position: 'absolute', top: -12, right: -12, background: 'white', borderRadius: 14, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', border: '1px solid #f1f5f9', padding: '10px 14px' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#111827', margin: 0 }}>✨ AI Parser</p>
              <p style={{ fontSize: 10, color: '#9ca3af', margin: 0 }}>Upload → Auto-fill</p>
            </div>
            <div style={{ position: 'absolute', bottom: -12, left: -12, background: 'white', borderRadius: 14, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', border: '1px solid #f1f5f9', padding: '10px 14px' }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#111827', margin: 0 }}>✅ Grammar Check</p>
              <p style={{ fontSize: 10, color: '#9ca3af', margin: 0 }}>Smart suggestions</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features ──────────────────────────────── */}
      <section id="features" style={{ padding: '80px 20px', background: '#fafafa' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 38, fontWeight: 900, color: '#111827', margin: '0 0 10px', letterSpacing: -1 }}>
              Features That Make You <span style={{ color: '#a855f7' }}>Shine</span>
            </h2>
            <p style={{ fontSize: 16, color: '#6b7280', margin: 0 }}>Everything you need to land your dream job.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
            {features.map(f => (
              <div key={f.title} style={{ borderRadius: 18, padding: '24px 22px', border: `1px solid ${f.border}`, background: f.bg, transition: 'all 0.2s', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 24px rgba(0,0,0,0.07)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = '' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Templates ─────────────────────────────── */}
      <section id="templates" style={{ padding: '80px 20px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 38, fontWeight: 900, color: '#111827', margin: '0 0 10px', letterSpacing: -1 }}>
              12 <span style={{ color: '#22c55e' }}>Professional</span> Templates
            </h2>
            <p style={{ fontSize: 16, color: '#6b7280', margin: 0 }}>From minimal to creative, ATS-friendly to portfolio-style.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
            {templatePreviews.map(t => (
              <div key={t.name} style={{ background: 'white', borderRadius: 14, overflow: 'hidden', border: '1px solid #f1f5f9', transition: 'all 0.2s', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = '' }}>
                <div style={{ height: 72, background: t.color, padding: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {[68, 42, 56, 30].map((w, i) => (
                    <div key={i} style={{ height: 4, borderRadius: 2, width: `${w}%`, background: 'rgba(255,255,255,0.35)' }} />
                  ))}
                </div>
                <div style={{ padding: 8, textAlign: 'center' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#4b5563' }}>{t.name}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', background: 'linear-gradient(135deg,#a855f7,#22c55e)', color: 'white', borderRadius: 14, fontSize: 14, fontWeight: 700, textDecoration: 'none', transition: 'opacity 0.2s' }}>
              Browse All 12 Templates →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── How it works ──────────────────────────── */}
      <section id="how" style={{ padding: '80px 20px', background: '#fafafa' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 38, fontWeight: 900, color: '#111827', margin: '0 0 10px', letterSpacing: -1 }}>
              How It <span style={{ color: '#a855f7' }}>Works</span>
            </h2>
            <p style={{ fontSize: 16, color: '#6b7280', margin: 0 }}>Get your resume ready in under 5 minutes.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {steps.map(s => (
              <div key={s.num} style={{ textAlign: 'center' }}>
                <div style={{ width: 60, height: 60, borderRadius: 18, background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 900, color: 'white', margin: '0 auto 16px', boxShadow: `0 6px 20px ${s.color}50` }}>
                  {s.num}
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: '0 0 6px' }}>{s.title}</h3>
                <p style={{ fontSize: 12, color: '#9ca3af', margin: 0, lineHeight: 1.5 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ───────────────────────────────────── */}
      <section style={{ padding: '80px 20px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', background: 'linear-gradient(135deg,#faf5ff,#f0fdf4)', border: '1px solid #e9d5ff', borderRadius: 28, padding: '56px 40px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: '#111827', margin: '0 0 12px', letterSpacing: -1 }}>
            Ready to land your <span style={{ color: '#a855f7' }}>dream job?</span>
          </h2>
          <p style={{ fontSize: 17, color: '#6b7280', marginBottom: 32, lineHeight: 1.6 }}>
            Join thousands of job seekers who've built their perfect resume.
          </p>
          <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 40px', background: '#111827', color: 'white', borderRadius: 18, fontSize: 16, fontWeight: 700, textDecoration: 'none', boxShadow: '0 6px 24px rgba(0,0,0,0.18)', transition: 'all 0.2s' }}>
            Create your free resume
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeWidth="2.5" strokeLinecap="round"/></svg>
          </Link>
          <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 14 }}>No credit card · No limits · Always free</p>
        </div>
      </section>

      {/* ─── Footer ────────────────────────────────── */}
      <footer style={{ background: '#111827', paddingTop: 56 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 20px 32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1.4fr', gap: 40, marginBottom: 48 }}>

            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: 12, background: 'linear-gradient(135deg,#a855f7,#22c55e)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: 'white', fontWeight: 900, fontSize: 15 }}>R</span>
                </div>
                <span style={{ fontWeight: 900, fontSize: 17, color: 'white' }}>Resume Builder</span>
              </div>
              <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.7, marginBottom: 20 }}>
                Build stunning, ATS-friendly resumes in minutes. Free forever — no hidden costs.
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                {['𝕏', '⌥', 'in'].map((icon, i) => (
                  <div key={i} style={{ width: 36, height: 36, borderRadius: 10, background: '#1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background 0.2s', border: '1px solid #374151', fontSize: 13, color: '#9ca3af', fontWeight: 600 }}
                    onMouseEnter={e => e.currentTarget.style.background = '#374151'} onMouseLeave={e => e.currentTarget.style.background = '#1f2937'}>
                    {icon}
                  </div>
                ))}
              </div>
            </div>

            {/* Product */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 18 }}>Product</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['Resume Builder', 'AI CV Parser', 'Grammar Checker', 'Templates', 'PDF Export', 'Share Resume'].map(item => (
                  <li key={item}>
                    <Link to="/register" style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.target.style.color = 'white'} onMouseLeave={e => e.target.style.color = '#9ca3af'}>{item}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 18 }}>Resources</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['Resume Tips', 'Career Guide', 'Cover Letter', 'Interview Prep', 'Salary Guide', 'Blog'].map(item => (
                  <li key={item}>
                    <a href="#" style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.target.style.color = 'white'} onMouseLeave={e => e.target.style.color = '#9ca3af'}>{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company + Newsletter */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 18 }}>Company</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['About Us', 'Contact', 'Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
                  <li key={item}>
                    <a href="#" style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.target.style.color = 'white'} onMouseLeave={e => e.target.style.color = '#9ca3af'}>{item}</a>
                  </li>
                ))}
              </ul>

              <p style={{ fontSize: 11, fontWeight: 700, color: '#4b5563', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 }}>Stay Updated</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="email" placeholder="your@email.com" style={{ flex: 1, background: '#1f2937', border: '1px solid #374151', borderRadius: 10, padding: '8px 12px', fontSize: 12, color: 'white', outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = '#a855f7'} onBlur={e => e.target.style.borderColor = '#374151'} />
                <button style={{ padding: '8px 14px', background: '#a855f7', border: 'none', borderRadius: 10, color: 'white', fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'opacity 0.2s' }}>→</button>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div style={{ borderTop: '1px solid #1f2937', paddingTop: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ fontSize: 12, color: '#4b5563', margin: 0 }}>© {new Date().getFullYear()} Resume Builder. All rights reserved.</p>
            <p style={{ fontSize: 12, color: '#4b5563', margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
              Made with <span style={{ color: '#ef4444' }}>❤️</span> for job seekers worldwide
            </p>
            <div style={{ display: 'flex', gap: 16 }}>
              {['Privacy', 'Terms', 'Cookies'].map(l => (
                <a key={l} href="#" style={{ fontSize: 12, color: '#4b5563', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = 'white'} onMouseLeave={e => e.target.style.color = '#4b5563'}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
