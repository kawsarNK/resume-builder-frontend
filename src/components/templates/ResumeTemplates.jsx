import React from 'react'

/* ─── Shared helpers ──────────────────────────────────────────────── */
const fullName = (info) => [info?.firstName, info?.lastName].filter(Boolean).join(' ')
const contactLine = (info) => [info?.email, info?.phone, info?.city && info?.state ? `${info.city}, ${info.state}` : (info?.city || info?.state)].filter(Boolean).join('  ·  ')
const links = (info) => [
  info?.linkedin && { label: 'LinkedIn', url: info.linkedin },
  info?.github && { label: 'GitHub', url: info.github },
  info?.website && { label: 'Portfolio', url: info.website },
].filter(Boolean)

const Bullet = ({ text }) => text ? <p className="text-[10px] leading-relaxed" style={{ marginBottom: 1 }}>• {text}</p> : null

const BulletList = ({ text, style }) => {
  if (!text) return null
  return text.split('\n').filter(l => l.trim()).map((line, i) => (
    <p key={i} style={{ fontSize: 10, lineHeight: 1.5, marginBottom: 2, ...style }}>
      • {line.replace(/^[•\-]\s*/, '')}
    </p>
  ))
}

/* ─── 1. MINIMAL ──────────────────────────────────────────────────── */
export function MinimalTemplate({ resume }) {
  const { personalInfo: pi = {}, education = [], experience = [], skills = [], projects = [], certifications = [], languages = [] } = resume
  return (
    <div style={{ fontFamily: 'Georgia, serif', fontSize: 11, color: '#222', lineHeight: 1.5, padding: '40px 48px', minHeight: '297mm', background: '#fff' }}>
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 400, letterSpacing: 3, textTransform: 'uppercase', margin: 0 }}>{fullName(pi) || 'Your Name'}</h1>
        <p style={{ fontSize: 10, color: '#666', marginTop: 6 }}>{contactLine(pi)}</p>
        {links(pi).length > 0 && <p style={{ fontSize: 10, color: '#888', marginTop: 3 }}>{links(pi).map(l => l.url).join('  ·  ')}</p>}
      </div>

      {pi.summary && (
        <div style={{ marginBottom: 20 }}>
          <hr style={{ border: 'none', borderTop: '1px solid #ddd', marginBottom: 12 }} />
          <p style={{ fontSize: 10, color: '#555', lineHeight: 1.7 }}>{pi.summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <Section title="Experience">
          {experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: 11 }}>{exp.position}</strong>
                <span style={{ fontSize: 10, color: '#666' }}>{exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ''}{exp.current ? ' – Present' : ''}</span>
              </div>
              <p style={{ fontSize: 10, color: '#666', margin: '2px 0 4px' }}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
              <BulletList text={exp.description} />
            </div>
          ))}
        </Section>
      )}

      {education.length > 0 && (
        <Section title="Education">
          {education.map((edu, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: 11 }}>{edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}</strong>
                <span style={{ fontSize: 10, color: '#666' }}>{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}</span>
              </div>
              <p style={{ fontSize: 10, color: '#666' }}>{edu.institution}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}</p>
            </div>
          ))}
        </Section>
      )}

      {skills.length > 0 && (
        <Section title="Skills">
          <p style={{ fontSize: 10, color: '#444', lineHeight: 1.7 }}>{skills.map(s => s.name).join(' · ')}</p>
        </Section>
      )}

      {projects.length > 0 && (
        <Section title="Projects">
          {projects.map((proj, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <strong style={{ fontSize: 11 }}>{proj.name}</strong>
              {proj.technologies?.length > 0 && <span style={{ fontSize: 9, color: '#888', marginLeft: 6 }}>[{proj.technologies.join(', ')}]</span>}
              <p style={{ fontSize: 10, color: '#555', marginTop: 2 }}>{proj.description}</p>
            </div>
          ))}
        </Section>
      )}

      {certifications.length > 0 && (
        <Section title="Certifications">
          {certifications.map((cert, i) => (
            <p key={i} style={{ fontSize: 10, marginBottom: 4 }}><strong>{cert.name}</strong>{cert.issuer ? ` — ${cert.issuer}` : ''}{cert.date ? ` (${cert.date})` : ''}</p>
          ))}
        </Section>
      )}
    </div>
  )
}

const Section = ({ title, children }) => (
  <div style={{ marginBottom: 18 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
      <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#999', margin: 0, whiteSpace: 'nowrap' }}>{title}</p>
      <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #e5e5e5', margin: 0 }} />
    </div>
    {children}
  </div>
)

/* ─── 2. PROFESSIONAL ─────────────────────────────────────────────── */
export function ProfessionalTemplate({ resume }) {
  const { personalInfo: pi = {}, education = [], experience = [], skills = [], projects = [], certifications = [], languages = [] } = resume
  const accentColor = '#4f46e5'
  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, color: '#1e293b', lineHeight: 1.5, minHeight: '297mm', background: '#fff' }}>
      {/* Header */}
      <div style={{ background: accentColor, color: '#fff', padding: '28px 40px 24px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, letterSpacing: -0.5 }}>{fullName(pi) || 'Your Name'}</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px', marginTop: 8 }}>
          {[pi.email, pi.phone, pi.city && pi.state ? `${pi.city}, ${pi.state}` : ''].filter(Boolean).map((item, i) => (
            <span key={i} style={{ fontSize: 10, opacity: 0.9 }}>{item}</span>
          ))}
        </div>
        {links(pi).length > 0 && (
          <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
            {links(pi).map((l, i) => <span key={i} style={{ fontSize: 9, opacity: 0.7 }}>{l.url}</span>)}
          </div>
        )}
      </div>

      <div style={{ padding: '24px 40px' }}>
        {pi.summary && (
          <div style={{ marginBottom: 20, padding: '12px 16px', background: '#f8f7ff', borderLeft: `3px solid ${accentColor}`, borderRadius: 4 }}>
            <p style={{ fontSize: 10, color: '#475569', lineHeight: 1.7, margin: 0 }}>{pi.summary}</p>
          </div>
        )}

        {experience.length > 0 && (
          <PSection title="Work Experience" color={accentColor}>
            {experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <strong style={{ fontSize: 12, color: '#0f172a' }}>{exp.position}</strong>
                    <p style={{ fontSize: 10, color: accentColor, margin: '1px 0' }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                  </div>
                  <span style={{ fontSize: 9, color: '#94a3b8', background: '#f1f5f9', padding: '2px 8px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                    {exp.startDate}{exp.current ? ' – Present' : exp.endDate ? ` – ${exp.endDate}` : ''}
                  </span>
                </div>
                <div style={{ marginTop: 6 }}><BulletList text={exp.description} style={{ color: '#475569' }} /></div>
              </div>
            ))}
          </PSection>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            {education.length > 0 && (
              <PSection title="Education" color={accentColor}>
                {education.map((edu, i) => (
                  <div key={i} style={{ marginBottom: 10 }}>
                    <strong style={{ fontSize: 11 }}>{edu.degree}</strong>
                    {edu.fieldOfStudy && <p style={{ fontSize: 10, color: '#64748b', margin: '1px 0' }}>{edu.fieldOfStudy}</p>}
                    <p style={{ fontSize: 10, color: '#94a3b8' }}>{edu.institution}{edu.gpa ? ` · ${edu.gpa} GPA` : ''}</p>
                    <p style={{ fontSize: 9, color: '#cbd5e1' }}>{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}</p>
                  </div>
                ))}
              </PSection>
            )}
            {certifications.length > 0 && (
              <PSection title="Certifications" color={accentColor}>
                {certifications.map((cert, i) => (
                  <div key={i} style={{ marginBottom: 8 }}>
                    <strong style={{ fontSize: 10 }}>{cert.name}</strong>
                    <p style={{ fontSize: 9, color: '#94a3b8' }}>{cert.issuer}{cert.date ? ` · ${cert.date}` : ''}</p>
                  </div>
                ))}
              </PSection>
            )}
          </div>
          <div>
            {skills.length > 0 && (
              <PSection title="Skills" color={accentColor}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {skills.map((s, i) => (
                    <span key={i} style={{ fontSize: 9, background: '#ede9fe', color: accentColor, padding: '2px 8px', borderRadius: 20 }}>{s.name}</span>
                  ))}
                </div>
              </PSection>
            )}
            {languages.length > 0 && (
              <PSection title="Languages" color={accentColor}>
                {languages.map((lang, i) => (
                  <p key={i} style={{ fontSize: 10, marginBottom: 3 }}>{lang.name} <span style={{ color: '#94a3b8' }}>— {lang.proficiency}</span></p>
                ))}
              </PSection>
            )}
          </div>
        </div>

        {projects.length > 0 && (
          <PSection title="Projects" color={accentColor}>
            {projects.map((proj, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <strong style={{ fontSize: 11 }}>{proj.name}</strong>
                  {proj.technologies?.length > 0 && (
                    <span style={{ fontSize: 9, color: '#94a3b8' }}>{proj.technologies.join(' · ')}</span>
                  )}
                </div>
                <p style={{ fontSize: 10, color: '#475569', marginTop: 3 }}>{proj.description}</p>
              </div>
            ))}
          </PSection>
        )}
      </div>
    </div>
  )
}

const PSection = ({ title, color, children }) => (
  <div style={{ marginBottom: 18 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
      <div style={{ width: 3, height: 14, background: color, borderRadius: 2 }} />
      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#374151', margin: 0 }}>{title}</p>
    </div>
    {children}
  </div>
)

/* ─── 3. CREATIVE ─────────────────────────────────────────────────── */
export function CreativeTemplate({ resume }) {
  const { personalInfo: pi = {}, education = [], experience = [], skills = [], projects = [], certifications = [] } = resume
  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, color: '#1e1b4b', minHeight: '297mm', background: '#fff', display: 'flex' }}>
      {/* Left sidebar */}
      <div style={{ width: 200, background: 'linear-gradient(180deg, #7c3aed 0%, #4f46e5 100%)', color: '#fff', padding: '32px 20px', flexShrink: 0 }}>
        {pi.profileImage && (
          <div style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 16px', border: '3px solid rgba(255,255,255,0.4)' }}>
            <img src={pi.profileImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
        <h1 style={{ fontSize: 16, fontWeight: 700, textAlign: 'center', margin: '0 0 4px', lineHeight: 1.2 }}>{fullName(pi) || 'Your Name'}</h1>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', margin: '16px 0' }} />
        <SideSection title="Contact">
          {pi.email && <SideItem icon="✉" text={pi.email} />}
          {pi.phone && <SideItem icon="📞" text={pi.phone} />}
          {(pi.city || pi.state) && <SideItem icon="📍" text={[pi.city, pi.state].filter(Boolean).join(', ')} />}
          {pi.linkedin && <SideItem icon="🔗" text="LinkedIn" />}
          {pi.github && <SideItem icon="💻" text="GitHub" />}
        </SideSection>
        {skills.length > 0 && (
          <SideSection title="Skills">
            {skills.slice(0, 12).map((s, i) => (
              <div key={i} style={{ marginBottom: 6 }}>
                <p style={{ fontSize: 9, marginBottom: 2 }}>{s.name}</p>
                <div style={{ height: 3, background: 'rgba(255,255,255,0.2)', borderRadius: 2 }}>
                  <div style={{ height: '100%', background: '#fff', borderRadius: 2, width: s.level === 'Expert' ? '100%' : s.level === 'Advanced' ? '75%' : s.level === 'Intermediate' ? '55%' : '30%' }} />
                </div>
              </div>
            ))}
          </SideSection>
        )}
        {education.length > 0 && (
          <SideSection title="Education">
            {education.map((edu, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <p style={{ fontSize: 9, fontWeight: 700, lineHeight: 1.3 }}>{edu.degree}</p>
                <p style={{ fontSize: 8, opacity: 0.8 }}>{edu.institution}</p>
                <p style={{ fontSize: 8, opacity: 0.6 }}>{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}</p>
              </div>
            ))}
          </SideSection>
        )}
      </div>

      {/* Right content */}
      <div style={{ flex: 1, padding: '32px 28px' }}>
        {pi.summary && (
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 10, color: '#6b7280', lineHeight: 1.7 }}>{pi.summary}</p>
          </div>
        )}
        {experience.length > 0 && (
          <CSection title="Experience">
            {experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: 16, paddingLeft: 16, borderLeft: '2px solid #ede9fe' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong style={{ fontSize: 12 }}>{exp.position}</strong>
                  <span style={{ fontSize: 9, color: '#7c3aed', fontWeight: 600 }}>{exp.startDate}{exp.current ? ' – Now' : exp.endDate ? ` – ${exp.endDate}` : ''}</span>
                </div>
                <p style={{ fontSize: 10, color: '#7c3aed', margin: '2px 0 6px' }}>{exp.company}</p>
                <BulletList text={exp.description} style={{ color: '#6b7280' }} />
              </div>
            ))}
          </CSection>
        )}
        {projects.length > 0 && (
          <CSection title="Projects">
            {projects.map((proj, i) => (
              <div key={i} style={{ marginBottom: 12, paddingLeft: 16, borderLeft: '2px solid #ede9fe' }}>
                <strong style={{ fontSize: 11 }}>{proj.name}</strong>
                {proj.technologies?.length > 0 && <p style={{ fontSize: 9, color: '#7c3aed', margin: '2px 0' }}>{proj.technologies.join(' · ')}</p>}
                <p style={{ fontSize: 10, color: '#6b7280', marginTop: 2 }}>{proj.description}</p>
              </div>
            ))}
          </CSection>
        )}
        {certifications.length > 0 && (
          <CSection title="Certifications">
            {certifications.map((cert, i) => (
              <p key={i} style={{ fontSize: 10, marginBottom: 4 }}><strong>{cert.name}</strong>{cert.issuer ? ` — ${cert.issuer}` : ''}{cert.date ? ` (${cert.date})` : ''}</p>
            ))}
          </CSection>
        )}
      </div>
    </div>
  )
}

const SideSection = ({ title, children }) => (
  <div style={{ marginBottom: 20 }}>
    <p style={{ fontSize: 8, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.7, marginBottom: 8 }}>{title}</p>
    {children}
  </div>
)
const SideItem = ({ icon, text }) => (
  <p style={{ fontSize: 8, marginBottom: 5, display: 'flex', alignItems: 'center', gap: 6, opacity: 0.9 }}><span>{icon}</span>{text}</p>
)
const CSection = ({ title, children }) => (
  <div style={{ marginBottom: 20 }}>
    <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#7c3aed', marginBottom: 12 }}>{title}</p>
    {children}
  </div>
)

/* ─── 4. ATS FRIENDLY ─────────────────────────────────────────────── */
export function ATSTemplate({ resume }) {
  const { personalInfo: pi = {}, education = [], experience = [], skills = [], certifications = [], projects = [], languages = [] } = resume
  return (
    <div style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 11, color: '#000', padding: '36px 48px', minHeight: '297mm', background: '#fff' }}>
      <div style={{ textAlign: 'center', marginBottom: 16, borderBottom: '2px solid #000', paddingBottom: 12 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, textTransform: 'uppercase', letterSpacing: 1 }}>{fullName(pi) || 'YOUR NAME'}</h1>
        <p style={{ fontSize: 10, margin: '6px 0 0' }}>{[pi.email, pi.phone, pi.city && pi.state ? `${pi.city}, ${pi.state}` : ''].filter(Boolean).join(' | ')}</p>
        {links(pi).length > 0 && <p style={{ fontSize: 9, margin: '3px 0 0', color: '#333' }}>{links(pi).map(l => l.url).join(' | ')}</p>}
      </div>
      {pi.summary && <ATSSection title="Professional Summary"><p style={{ fontSize: 10, lineHeight: 1.6 }}>{pi.summary}</p></ATSSection>}
      {experience.length > 0 && (
        <ATSSection title="Work Experience">
          {experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: 11 }}>{exp.position}, {exp.company}</strong>
                <span style={{ fontSize: 10 }}>{exp.startDate}{exp.current ? ' – Present' : exp.endDate ? ` – ${exp.endDate}` : ''}</span>
              </div>
              {exp.location && <p style={{ fontSize: 9, color: '#555', margin: '1px 0 4px' }}>{exp.location}</p>}
              <BulletList text={exp.description} />
            </div>
          ))}
        </ATSSection>
      )}
      {education.length > 0 && (
        <ATSSection title="Education">
          {education.map((edu, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}</strong>
                <span style={{ fontSize: 10 }}>{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}</span>
              </div>
              <p style={{ fontSize: 10 }}>{edu.institution}{edu.gpa ? ` | GPA: ${edu.gpa}` : ''}</p>
            </div>
          ))}
        </ATSSection>
      )}
      {skills.length > 0 && (
        <ATSSection title="Skills">
          <p style={{ fontSize: 10, lineHeight: 1.7 }}>{skills.map(s => s.name).join(', ')}</p>
        </ATSSection>
      )}
      {certifications.length > 0 && (
        <ATSSection title="Certifications">
          {certifications.map((cert, i) => (
            <p key={i} style={{ fontSize: 10, marginBottom: 3 }}>{cert.name}{cert.issuer ? ` | ${cert.issuer}` : ''}{cert.date ? ` | ${cert.date}` : ''}</p>
          ))}
        </ATSSection>
      )}
      {projects.length > 0 && (
        <ATSSection title="Projects">
          {projects.map((proj, i) => (
            <div key={i} style={{ marginBottom: 8 }}>
              <strong style={{ fontSize: 11 }}>{proj.name}</strong>
              {proj.technologies?.length > 0 && <span style={{ fontSize: 9 }}> ({proj.technologies.join(', ')})</span>}
              <p style={{ fontSize: 10, marginTop: 2 }}>{proj.description}</p>
            </div>
          ))}
        </ATSSection>
      )}
    </div>
  )
}
const ATSSection = ({ title, children }) => (
  <div style={{ marginBottom: 16 }}>
    <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', borderBottom: '1px solid #000', paddingBottom: 3, marginBottom: 8 }}>{title}</p>
    {children}
  </div>
)

/* ─── 5. DARK MODERN ──────────────────────────────────────────────── */
export function DarkModernTemplate({ resume }) {
  const { personalInfo: pi = {}, education = [], experience = [], skills = [], projects = [], certifications = [] } = resume
  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, color: '#e2e8f0', minHeight: '297mm', background: '#0f172a' }}>
      <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', padding: '32px 40px 24px', borderBottom: '1px solid #1e293b' }}>
        <h1 style={{ fontSize: 30, fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: -1 }}>{fullName(pi) || 'Your Name'}</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 16px', marginTop: 8 }}>
          {[pi.email, pi.phone, pi.city && pi.state ? `${pi.city}, ${pi.state}` : ''].filter(Boolean).map((item, i) => (
            <span key={i} style={{ fontSize: 10, color: '#64748b' }}>{item}</span>
          ))}
        </div>
        {links(pi).length > 0 && (
          <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
            {links(pi).map((l, i) => (
              <span key={i} style={{ fontSize: 9, color: '#818cf8', background: '#1e1b4b', padding: '2px 8px', borderRadius: 4 }}>{l.label}</span>
            ))}
          </div>
        )}
      </div>
      <div style={{ padding: '24px 40px', display: 'grid', gridTemplateColumns: '1fr 180px', gap: 28 }}>
        <div>
          {pi.summary && <p style={{ fontSize: 10, color: '#94a3b8', lineHeight: 1.7, marginBottom: 20 }}>{pi.summary}</p>}
          {experience.length > 0 && (
            <DSection title="Experience" accent="#818cf8">
              {experience.map((exp, i) => (
                <div key={i} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong style={{ color: '#f1f5f9' }}>{exp.position}</strong>
                    <span style={{ fontSize: 9, color: '#475569' }}>{exp.startDate}{exp.current ? '–Now' : exp.endDate ? `–${exp.endDate}` : ''}</span>
                  </div>
                  <p style={{ fontSize: 10, color: '#818cf8', margin: '2px 0 6px' }}>{exp.company}</p>
                  <BulletList text={exp.description} style={{ color: '#94a3b8' }} />
                </div>
              ))}
            </DSection>
          )}
          {projects.length > 0 && (
            <DSection title="Projects" accent="#818cf8">
              {projects.map((proj, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <strong style={{ color: '#f1f5f9' }}>{proj.name}</strong>
                  {proj.technologies?.length > 0 && <span style={{ fontSize: 9, color: '#475569', marginLeft: 6 }}>{proj.technologies.join(' · ')}</span>}
                  <p style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>{proj.description}</p>
                </div>
              ))}
            </DSection>
          )}
        </div>
        <div>
          {skills.length > 0 && (
            <DSection title="Skills" accent="#818cf8">
              {skills.map((s, i) => (
                <div key={i} style={{ marginBottom: 6 }}>
                  <p style={{ fontSize: 9, color: '#cbd5e1', marginBottom: 2 }}>{s.name}</p>
                  <div style={{ height: 2, background: '#1e293b', borderRadius: 1 }}>
                    <div style={{ height: '100%', background: '#818cf8', borderRadius: 1, width: s.level === 'Expert' ? '100%' : s.level === 'Advanced' ? '75%' : s.level === 'Intermediate' ? '55%' : '30%' }} />
                  </div>
                </div>
              ))}
            </DSection>
          )}
          {education.length > 0 && (
            <DSection title="Education" accent="#818cf8">
              {education.map((edu, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: '#e2e8f0' }}>{edu.degree}</p>
                  <p style={{ fontSize: 9, color: '#94a3b8' }}>{edu.institution}</p>
                  <p style={{ fontSize: 9, color: '#475569' }}>{edu.startDate}{edu.endDate ? `–${edu.endDate}` : ''}</p>
                </div>
              ))}
            </DSection>
          )}
        </div>
      </div>
    </div>
  )
}
const DSection = ({ title, accent, children }) => (
  <div style={{ marginBottom: 20 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
      <div style={{ width: 3, height: 12, background: accent, borderRadius: 2 }} />
      <p style={{ fontSize: 8, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: accent, margin: 0 }}>{title}</p>
    </div>
    {children}
  </div>
)

/* ─── 6. ELEGANT SERIF ────────────────────────────────────────────── */
export function ElegantSerifTemplate({ resume }) {
  const { personalInfo: pi = {}, education = [], experience = [], skills = [], certifications = [], projects = [], languages = [] } = resume
  return (
    <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 11, color: '#3c2415', padding: '44px 52px', minHeight: '297mm', background: '#fffef8' }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: 2, margin: 0, color: '#2c1810' }}>{fullName(pi) || 'Your Name'}</h1>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 8, flexWrap: 'wrap' }}>
          {[pi.email, pi.phone, pi.city && pi.state ? `${pi.city}, ${pi.state}` : ''].filter(Boolean).map((item, i) => (
            <span key={i} style={{ fontSize: 9, color: '#92400e', fontStyle: 'italic' }}>{item}</span>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, margin: '16px 0 0' }}>
          <div style={{ flex: 1, height: 1, background: '#d97706' }} />
          <div style={{ width: 8, height: 8, background: '#d97706', transform: 'rotate(45deg)' }} />
          <div style={{ flex: 1, height: 1, background: '#d97706' }} />
        </div>
      </div>
      {pi.summary && <p style={{ fontSize: 10, color: '#78350f', lineHeight: 1.8, textAlign: 'center', marginBottom: 24, fontStyle: 'italic' }}>{pi.summary}</p>}
      {experience.length > 0 && (
        <ESection title="Professional Experience">
          {experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div><strong style={{ fontSize: 12 }}>{exp.position}</strong><span style={{ fontSize: 11, fontStyle: 'italic', color: '#92400e' }}> — {exp.company}</span></div>
                <span style={{ fontSize: 9, color: '#a16207' }}>{exp.startDate}{exp.current ? ' – Present' : exp.endDate ? ` – ${exp.endDate}` : ''}</span>
              </div>
              <BulletList text={exp.description} style={{ color: '#57350d', fontFamily: 'Georgia, serif' }} />
            </div>
          ))}
        </ESection>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
        <div>
          {education.length > 0 && (
            <ESection title="Education">
              {education.map((edu, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <strong style={{ fontSize: 11 }}>{edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}</strong>
                  <p style={{ fontSize: 10, fontStyle: 'italic', color: '#92400e' }}>{edu.institution}</p>
                  <p style={{ fontSize: 9, color: '#a16207' }}>{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}{edu.gpa ? ` · GPA ${edu.gpa}` : ''}</p>
                </div>
              ))}
            </ESection>
          )}
        </div>
        <div>
          {skills.length > 0 && (
            <ESection title="Expertise">
              <p style={{ fontSize: 10, color: '#78350f', lineHeight: 1.9 }}>{skills.map(s => s.name).join(' · ')}</p>
            </ESection>
          )}
          {languages.length > 0 && (
            <ESection title="Languages">
              {languages.map((l, i) => <p key={i} style={{ fontSize: 10 }}>{l.name} <em style={{ color: '#a16207' }}>({l.proficiency})</em></p>)}
            </ESection>
          )}
        </div>
      </div>
    </div>
  )
}
const ESection = ({ title, children }) => (
  <div style={{ marginBottom: 20 }}>
    <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: '#d97706', margin: '0 0 6px' }}>{title}</p>
    <div style={{ height: 1, background: '#fde68a', marginBottom: 10 }} />
    {children}
  </div>
)

/* ─── 7. CORPORATE ────────────────────────────────────────────────── */
export function CorporateTemplate({ resume }) {
  const { personalInfo: pi = {}, education = [], experience = [], skills = [], certifications = [], projects = [], languages = [] } = resume
  const accent = '#1e40af'
  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', Arial, sans-serif", fontSize: 11, color: '#1e293b', minHeight: '297mm', background: '#fff' }}>
      <div style={{ background: accent, color: '#fff', padding: '0 0 0 0', display: 'flex' }}>
        <div style={{ flex: 1, padding: '28px 36px' }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>{fullName(pi) || 'Your Name'}</h1>
          <p style={{ fontSize: 10, opacity: 0.8, margin: '6px 0 0' }}>
            {[pi.email, pi.phone].filter(Boolean).join('  ·  ')}
          </p>
          {(pi.city || pi.state) && <p style={{ fontSize: 10, opacity: 0.7, margin: '2px 0 0' }}>{[pi.city, pi.state, pi.country].filter(Boolean).join(', ')}</p>}
        </div>
        <div style={{ width: 120, background: '#1e3a8a', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 8, padding: 16 }}>
          {links(pi).map((l, i) => <span key={i} style={{ fontSize: 8, color: '#93c5fd', textAlign: 'center' }}>{l.label}</span>)}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 0, minHeight: '240mm' }}>
        <div style={{ padding: '24px 28px', borderRight: '1px solid #e2e8f0' }}>
          {pi.summary && <p style={{ fontSize: 10, color: '#475569', lineHeight: 1.7, marginBottom: 20, padding: '12px 14px', background: '#eff6ff', borderLeft: `3px solid ${accent}`, borderRadius: 4 }}>{pi.summary}</p>}
          {experience.length > 0 && (
            <CorpSection title="Experience" accent={accent}>
              {experience.map((exp, i) => (
                <div key={i} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong style={{ fontSize: 12 }}>{exp.position}</strong>
                    <span style={{ fontSize: 9, color: '#94a3b8', whiteSpace: 'nowrap' }}>{exp.startDate}{exp.current ? '–Present' : exp.endDate ? `–${exp.endDate}` : ''}</span>
                  </div>
                  <p style={{ fontSize: 10, color: accent, margin: '1px 0 6px', fontWeight: 600 }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                  <BulletList text={exp.description} style={{ color: '#475569' }} />
                </div>
              ))}
            </CorpSection>
          )}
          {projects.length > 0 && (
            <CorpSection title="Key Projects" accent={accent}>
              {projects.map((proj, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <strong>{proj.name}</strong>
                  {proj.technologies?.length > 0 && <span style={{ fontSize: 9, color: '#94a3b8', marginLeft: 6 }}>{proj.technologies.join(', ')}</span>}
                  <p style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>{proj.description}</p>
                </div>
              ))}
            </CorpSection>
          )}
        </div>
        <div style={{ padding: '24px 20px', background: '#f8fafc' }}>
          {education.length > 0 && (
            <CorpSection title="Education" accent={accent}>
              {education.map((edu, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <strong style={{ fontSize: 11 }}>{edu.degree}</strong>
                  {edu.fieldOfStudy && <p style={{ fontSize: 9, color: '#64748b' }}>{edu.fieldOfStudy}</p>}
                  <p style={{ fontSize: 10, color: '#64748b' }}>{edu.institution}</p>
                  <p style={{ fontSize: 9, color: '#94a3b8' }}>{edu.startDate}{edu.endDate ? `–${edu.endDate}` : ''}{edu.gpa ? ` · ${edu.gpa}` : ''}</p>
                </div>
              ))}
            </CorpSection>
          )}
          {skills.length > 0 && (
            <CorpSection title="Skills" accent={accent}>
              {skills.map((s, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                  <span style={{ fontSize: 10 }}>{s.name}</span>
                  <span style={{ fontSize: 8, color: accent, background: '#eff6ff', padding: '1px 6px', borderRadius: 10 }}>{s.level}</span>
                </div>
              ))}
            </CorpSection>
          )}
          {certifications.length > 0 && (
            <CorpSection title="Certifications" accent={accent}>
              {certifications.map((cert, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <p style={{ fontSize: 10, fontWeight: 600 }}>{cert.name}</p>
                  <p style={{ fontSize: 9, color: '#64748b' }}>{cert.issuer}{cert.date ? ` · ${cert.date}` : ''}</p>
                </div>
              ))}
            </CorpSection>
          )}
        </div>
      </div>
    </div>
  )
}
const CorpSection = ({ title, accent, children }) => (
  <div style={{ marginBottom: 18 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, borderBottom: '2px solid #e2e8f0', paddingBottom: 6 }}>
      <div style={{ width: 12, height: 12, background: accent, borderRadius: 2 }} />
      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: '#374151', margin: 0 }}>{title}</p>
    </div>
    {children}
  </div>
)

/* ─── 8. COMPACT ──────────────────────────────────────────────────── */
export function CompactTemplate({ resume }) {
  const { personalInfo: pi = {}, education = [], experience = [], skills = [], certifications = [], projects = [], languages = [] } = resume
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', fontSize: 10, color: '#111', padding: '28px 36px', minHeight: '297mm', background: '#fff', lineHeight: 1.4 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, paddingBottom: 10, borderBottom: '2px solid #111' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>{fullName(pi) || 'Your Name'}</h1>
        <div style={{ textAlign: 'right' }}>
          {[pi.email, pi.phone, pi.city && pi.state ? `${pi.city}, ${pi.state}` : ''].filter(Boolean).map((item, i) => (
            <p key={i} style={{ fontSize: 9, margin: '1px 0', color: '#333' }}>{item}</p>
          ))}
        </div>
      </div>
      {pi.summary && <p style={{ fontSize: 9, lineHeight: 1.6, marginBottom: 12 }}>{pi.summary}</p>}
      {experience.length > 0 && (
        <CompSection title="EXPERIENCE">
          {experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: 10 }}>{exp.position}, {exp.company}</strong>
                <span style={{ fontSize: 9 }}>{exp.startDate}{exp.current ? '–Present' : exp.endDate ? `–${exp.endDate}` : ''}</span>
              </div>
              {exp.location && <p style={{ fontSize: 9, color: '#555', margin: '1px 0 3px' }}>{exp.location}</p>}
              <BulletList text={exp.description} style={{ fontSize: 9 }} />
            </div>
          ))}
        </CompSection>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div>
          {education.length > 0 && (
            <CompSection title="EDUCATION">
              {education.map((edu, i) => (
                <div key={i} style={{ marginBottom: 8 }}>
                  <strong>{edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}</strong>
                  <p style={{ fontSize: 9, color: '#444' }}>{edu.institution}{edu.gpa ? ` | GPA: ${edu.gpa}` : ''}</p>
                  <p style={{ fontSize: 8, color: '#777' }}>{edu.startDate}{edu.endDate ? `–${edu.endDate}` : ''}</p>
                </div>
              ))}
            </CompSection>
          )}
          {certifications.length > 0 && (
            <CompSection title="CERTIFICATIONS">
              {certifications.map((c, i) => <p key={i} style={{ fontSize: 9, marginBottom: 3 }}>{c.name}{c.issuer ? ` — ${c.issuer}` : ''}</p>)}
            </CompSection>
          )}
        </div>
        <div>
          {skills.length > 0 && (
            <CompSection title="SKILLS">
              <p style={{ fontSize: 9, lineHeight: 1.7 }}>{skills.map(s => s.name).join(', ')}</p>
            </CompSection>
          )}
          {languages.length > 0 && (
            <CompSection title="LANGUAGES">
              {languages.map((l, i) => <p key={i} style={{ fontSize: 9 }}>{l.name} ({l.proficiency})</p>)}
            </CompSection>
          )}
          {projects.length > 0 && (
            <CompSection title="PROJECTS">
              {projects.map((p, i) => <p key={i} style={{ fontSize: 9, marginBottom: 4 }}><strong>{p.name}</strong>: {p.description?.substring(0, 80)}{p.description?.length > 80 ? '...' : ''}</p>)}
            </CompSection>
          )}
        </div>
      </div>
    </div>
  )
}
const CompSection = ({ title, children }) => (
  <div style={{ marginBottom: 12 }}>
    <p style={{ fontSize: 8, fontWeight: 700, letterSpacing: 1, color: '#111', borderBottom: '1px solid #ccc', paddingBottom: 3, marginBottom: 6 }}>{title}</p>
    {children}
  </div>
)

/* ─── 9. SIDEBAR LAYOUT ───────────────────────────────────────────── */
export function SidebarTemplate({ resume }) {
  const { personalInfo: pi = {}, education = [], experience = [], skills = [], certifications = [], projects = [], languages = [] } = resume
  const accent = '#0f766e'
  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", display: 'flex', minHeight: '297mm', background: '#fff' }}>
      <div style={{ width: 190, background: '#f0fdfa', borderRight: '1px solid #99f6e4', padding: '32px 18px', flexShrink: 0 }}>
        {pi.profileImage && (
          <div style={{ width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 16px', border: `3px solid ${accent}` }}>
            <img src={pi.profileImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
        <h2 style={{ fontSize: 15, fontWeight: 700, color: accent, textAlign: 'center', margin: '0 0 4px', lineHeight: 1.2 }}>{fullName(pi) || 'Your Name'}</h2>
        <div style={{ height: 1, background: '#99f6e4', margin: '14px 0' }} />
        <SBSection title="Contact" accent={accent}>
          {pi.email && <p style={{ fontSize: 8, color: '#374151', marginBottom: 4, wordBreak: 'break-all' }}>{pi.email}</p>}
          {pi.phone && <p style={{ fontSize: 8, color: '#374151', marginBottom: 4 }}>{pi.phone}</p>}
          {(pi.city || pi.state) && <p style={{ fontSize: 8, color: '#374151', marginBottom: 4 }}>{[pi.city, pi.state].filter(Boolean).join(', ')}</p>}
          {pi.linkedin && <p style={{ fontSize: 8, color: accent, marginBottom: 4 }}>LinkedIn</p>}
          {pi.github && <p style={{ fontSize: 8, color: accent, marginBottom: 4 }}>GitHub</p>}
        </SBSection>
        {skills.length > 0 && (
          <SBSection title="Skills" accent={accent}>
            {skills.map((s, i) => (
              <div key={i} style={{ marginBottom: 5 }}>
                <p style={{ fontSize: 8, color: '#374151', marginBottom: 2 }}>{s.name}</p>
                <div style={{ height: 3, background: '#ccfbf1', borderRadius: 2 }}>
                  <div style={{ height: '100%', background: accent, borderRadius: 2, width: s.level === 'Expert' ? '100%' : s.level === 'Advanced' ? '75%' : s.level === 'Intermediate' ? '55%' : '30%' }} />
                </div>
              </div>
            ))}
          </SBSection>
        )}
        {languages.length > 0 && (
          <SBSection title="Languages" accent={accent}>
            {languages.map((l, i) => <p key={i} style={{ fontSize: 8, color: '#374151', marginBottom: 3 }}>{l.name} — {l.proficiency}</p>)}
          </SBSection>
        )}
        {certifications.length > 0 && (
          <SBSection title="Certifications" accent={accent}>
            {certifications.map((c, i) => <div key={i} style={{ marginBottom: 8 }}><p style={{ fontSize: 8, fontWeight: 700, color: '#374151' }}>{c.name}</p><p style={{ fontSize: 7, color: '#6b7280' }}>{c.issuer}</p></div>)}
          </SBSection>
        )}
      </div>
      <div style={{ flex: 1, padding: '32px 28px' }}>
        {pi.summary && <p style={{ fontSize: 10, color: '#4b5563', lineHeight: 1.7, marginBottom: 20, padding: '12px 14px', background: '#f0fdfa', borderLeft: `3px solid ${accent}`, borderRadius: 4 }}>{pi.summary}</p>}
        {experience.length > 0 && (
          <SBMainSection title="Experience" accent={accent}>
            {experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong style={{ fontSize: 12 }}>{exp.position}</strong>
                  <span style={{ fontSize: 9, color: '#6b7280', background: '#f0fdfa', padding: '1px 8px', borderRadius: 10 }}>{exp.startDate}{exp.current ? '–Now' : exp.endDate ? `–${exp.endDate}` : ''}</span>
                </div>
                <p style={{ fontSize: 10, color: accent, fontWeight: 600, margin: '2px 0 6px' }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                <BulletList text={exp.description} style={{ color: '#4b5563' }} />
              </div>
            ))}
          </SBMainSection>
        )}
        {education.length > 0 && (
          <SBMainSection title="Education" accent={accent}>
            {education.map((edu, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <strong style={{ fontSize: 11 }}>{edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}</strong>
                <p style={{ fontSize: 10, color: accent }}>{edu.institution}</p>
                <p style={{ fontSize: 9, color: '#6b7280' }}>{edu.startDate}{edu.endDate ? `–${edu.endDate}` : ''}{edu.gpa ? ` · GPA ${edu.gpa}` : ''}</p>
              </div>
            ))}
          </SBMainSection>
        )}
        {projects.length > 0 && (
          <SBMainSection title="Projects" accent={accent}>
            {projects.map((proj, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <strong>{proj.name}</strong>
                {proj.technologies?.length > 0 && <span style={{ fontSize: 9, color: '#6b7280', marginLeft: 6 }}>{proj.technologies.join(' · ')}</span>}
                <p style={{ fontSize: 10, color: '#4b5563', marginTop: 2 }}>{proj.description}</p>
              </div>
            ))}
          </SBMainSection>
        )}
      </div>
    </div>
  )
}
const SBSection = ({ title, accent, children }) => (
  <div style={{ marginBottom: 16 }}>
    <p style={{ fontSize: 7, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: accent, marginBottom: 6 }}>{title}</p>
    {children}
  </div>
)
const SBMainSection = ({ title, accent, children }) => (
  <div style={{ marginBottom: 20 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
      <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: accent, margin: 0 }}>{title}</p>
      <div style={{ flex: 1, height: 1, background: '#99f6e4' }} />
    </div>
    {children}
  </div>
)

/* ─── 10. TIMELINE ────────────────────────────────────────────────── */
export function TimelineTemplate({ resume }) {
  const { personalInfo: pi = {}, education = [], experience = [], skills = [], certifications = [], projects = [], languages = [] } = resume
  const accent = '#7c2d12'
  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, color: '#1c1917', padding: '36px 44px', minHeight: '297mm', background: '#fff' }}>
      <div style={{ marginBottom: 24, paddingBottom: 18, borderBottom: '2px solid #fef3c7' }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, color: accent }}>{fullName(pi) || 'Your Name'}</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px 16px', marginTop: 6 }}>
          {[pi.email, pi.phone, pi.city && pi.state ? `${pi.city}, ${pi.state}` : ''].filter(Boolean).map((item, i) => (
            <span key={i} style={{ fontSize: 9, color: '#57534e' }}>{item}</span>
          ))}
        </div>
      </div>
      {pi.summary && <p style={{ fontSize: 10, color: '#57534e', lineHeight: 1.7, marginBottom: 24 }}>{pi.summary}</p>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: 28 }}>
        <div>
          {experience.length > 0 && (
            <TLSection title="Experience" accent={accent}>
              {experience.map((exp, i) => (
                <div key={i} style={{ marginBottom: 16, paddingLeft: 20, position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 0, top: 4, width: 10, height: 10, background: accent, borderRadius: '50%', border: '2px solid #fff', boxSizing: 'border-box' }} />
                  <div style={{ position: 'absolute', left: 4, top: 14, bottom: -6, width: 1, background: '#fde68a' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <strong>{exp.position}</strong>
                    <span style={{ fontSize: 9, color: '#a16207', background: '#fef3c7', padding: '1px 8px', borderRadius: 20, whiteSpace: 'nowrap', marginLeft: 8 }}>{exp.startDate}{exp.current ? '–Now' : exp.endDate ? `–${exp.endDate}` : ''}</span>
                  </div>
                  <p style={{ fontSize: 10, color: accent, fontWeight: 600, margin: '2px 0 5px' }}>{exp.company}</p>
                  <BulletList text={exp.description} style={{ color: '#57534e' }} />
                </div>
              ))}
            </TLSection>
          )}
          {projects.length > 0 && (
            <TLSection title="Projects" accent={accent}>
              {projects.map((proj, i) => (
                <div key={i} style={{ marginBottom: 10, paddingLeft: 20, position: 'relative' }}>
                  <div style={{ position: 'absolute', left: 0, top: 4, width: 8, height: 8, background: '#fbbf24', borderRadius: '50%' }} />
                  <strong style={{ fontSize: 11 }}>{proj.name}</strong>
                  {proj.technologies?.length > 0 && <span style={{ fontSize: 9, color: '#a16207', marginLeft: 6 }}>{proj.technologies.join(' · ')}</span>}
                  <p style={{ fontSize: 10, color: '#57534e', marginTop: 2 }}>{proj.description}</p>
                </div>
              ))}
            </TLSection>
          )}
        </div>
        <div>
          {education.length > 0 && (
            <TLSection title="Education" accent={accent}>
              {education.map((edu, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <strong style={{ fontSize: 10 }}>{edu.degree}</strong>
                  {edu.fieldOfStudy && <p style={{ fontSize: 9, color: '#78716c' }}>{edu.fieldOfStudy}</p>}
                  <p style={{ fontSize: 10, color: accent }}>{edu.institution}</p>
                  <p style={{ fontSize: 9, color: '#a8a29e' }}>{edu.startDate}{edu.endDate ? `–${edu.endDate}` : ''}</p>
                </div>
              ))}
            </TLSection>
          )}
          {skills.length > 0 && (
            <TLSection title="Skills" accent={accent}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {skills.map((s, i) => <span key={i} style={{ fontSize: 8, background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: 20 }}>{s.name}</span>)}
              </div>
            </TLSection>
          )}
          {certifications.length > 0 && (
            <TLSection title="Certifications" accent={accent}>
              {certifications.map((c, i) => <div key={i} style={{ marginBottom: 8 }}><p style={{ fontSize: 9, fontWeight: 700 }}>{c.name}</p><p style={{ fontSize: 8, color: '#a8a29e' }}>{c.issuer}{c.date ? ` · ${c.date}` : ''}</p></div>)}
            </TLSection>
          )}
          {languages.length > 0 && (
            <TLSection title="Languages" accent={accent}>
              {languages.map((l, i) => <p key={i} style={{ fontSize: 9, marginBottom: 3 }}>{l.name} — {l.proficiency}</p>)}
            </TLSection>
          )}
        </div>
      </div>
    </div>
  )
}
const TLSection = ({ title, accent, children }) => (
  <div style={{ marginBottom: 20 }}>
    <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: accent, marginBottom: 10 }}>{title}</p>
    {children}
  </div>
)

/* ─── 11. PORTFOLIO ───────────────────────────────────────────────── */
export function PortfolioTemplate({ resume }) {
  const { personalInfo: pi = {}, education = [], experience = [], skills = [], certifications = [], projects = [], languages = [] } = resume
  const accent = '#9333ea'
  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, color: '#18181b', minHeight: '297mm', background: '#fff' }}>
      <div style={{ background: `linear-gradient(135deg, ${accent}, #7c3aed)`, color: '#fff', padding: '36px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          {pi.profileImage && (
            <div style={{ width: 72, height: 72, borderRadius: '50%', overflow: 'hidden', border: '3px solid rgba(255,255,255,0.5)', marginBottom: 12 }}>
              <img src={pi.profileImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
          <h1 style={{ fontSize: 30, fontWeight: 800, margin: 0 }}>{fullName(pi) || 'Your Name'}</h1>
          <p style={{ fontSize: 10, opacity: 0.8, margin: '6px 0 0' }}>{contactLine(pi)}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          {links(pi).map((l, i) => <p key={i} style={{ fontSize: 9, opacity: 0.7, margin: '2px 0' }}>{l.url}</p>)}
        </div>
      </div>
      <div style={{ padding: '24px 40px' }}>
        {pi.summary && <p style={{ fontSize: 10, color: '#52525b', lineHeight: 1.7, marginBottom: 20 }}>{pi.summary}</p>}
        {projects.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: accent, marginBottom: 12 }}>Featured Projects</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {projects.map((proj, i) => (
                <div key={i} style={{ padding: '14px 16px', background: '#faf5ff', borderRadius: 8, borderLeft: `3px solid ${accent}` }}>
                  <strong style={{ fontSize: 11, color: '#18181b' }}>{proj.name}</strong>
                  {proj.technologies?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, margin: '5px 0' }}>
                      {proj.technologies.map((t, ti) => <span key={ti} style={{ fontSize: 8, background: '#ede9fe', color: accent, padding: '1px 6px', borderRadius: 10 }}>{t}</span>)}
                    </div>
                  )}
                  <p style={{ fontSize: 9, color: '#52525b', lineHeight: 1.5, marginTop: 3 }}>{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
          <div>
            {experience.length > 0 && (
              <PortSection title="Experience" accent={accent}>
                {experience.map((exp, i) => (
                  <div key={i} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong style={{ fontSize: 12 }}>{exp.position}</strong>
                      <span style={{ fontSize: 9, color: '#a1a1aa' }}>{exp.startDate}{exp.current ? '–Present' : exp.endDate ? `–${exp.endDate}` : ''}</span>
                    </div>
                    <p style={{ fontSize: 10, color: accent, margin: '2px 0 5px', fontWeight: 600 }}>{exp.company}</p>
                    <BulletList text={exp.description} style={{ color: '#52525b' }} />
                  </div>
                ))}
              </PortSection>
            )}
          </div>
          <div>
            {skills.length > 0 && (
              <PortSection title="Skills" accent={accent}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {skills.map((s, i) => <span key={i} style={{ fontSize: 8, background: '#faf5ff', color: accent, border: `1px solid #ede9fe`, padding: '2px 8px', borderRadius: 20 }}>{s.name}</span>)}
                </div>
              </PortSection>
            )}
            {education.length > 0 && (
              <PortSection title="Education" accent={accent}>
                {education.map((edu, i) => (
                  <div key={i} style={{ marginBottom: 10 }}>
                    <strong style={{ fontSize: 10 }}>{edu.degree}</strong>
                    <p style={{ fontSize: 9, color: '#52525b' }}>{edu.institution}</p>
                    <p style={{ fontSize: 8, color: '#a1a1aa' }}>{edu.startDate}{edu.endDate ? `–${edu.endDate}` : ''}</p>
                  </div>
                ))}
              </PortSection>
            )}
            {certifications.length > 0 && (
              <PortSection title="Certifications" accent={accent}>
                {certifications.map((c, i) => <p key={i} style={{ fontSize: 9, marginBottom: 4 }}><strong>{c.name}</strong><br /><span style={{ color: '#a1a1aa' }}>{c.issuer}</span></p>)}
              </PortSection>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
const PortSection = ({ title, accent, children }) => (
  <div style={{ marginBottom: 18 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
      <div style={{ width: 6, height: 6, background: accent, borderRadius: '50%' }} />
      <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase', color: '#3f3f46', margin: 0 }}>{title}</p>
      <div style={{ flex: 1, height: 1, background: '#f4f4f5' }} />
    </div>
    {children}
  </div>
)

/* ─── 12. EXECUTIVE ───────────────────────────────────────────────── */
export function ExecutiveTemplate({ resume }) {
  const { personalInfo: pi = {}, education = [], experience = [], skills = [], certifications = [], projects = [], languages = [] } = resume
  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, color: '#111827', padding: '48px 52px', minHeight: '297mm', background: '#fff' }}>
      <div style={{ marginBottom: 28, paddingBottom: 20, borderBottom: '3px double #111827' }}>
        <h1 style={{ fontSize: 34, fontWeight: 800, letterSpacing: -1, margin: 0 }}>{fullName(pi) || 'Your Name'}</h1>
        <div style={{ display: 'flex', gap: 20, marginTop: 8, flexWrap: 'wrap' }}>
          {[pi.email, pi.phone, pi.city && pi.state ? `${pi.city}, ${pi.state}` : ''].filter(Boolean).map((item, i) => (
            <span key={i} style={{ fontSize: 10, color: '#6b7280' }}>{item}</span>
          ))}
          {links(pi).map((l, i) => <span key={i} style={{ fontSize: 10, color: '#1d4ed8', fontWeight: 500 }}>{l.label}</span>)}
        </div>
      </div>
      {pi.summary && (
        <div style={{ marginBottom: 24, padding: '16px 20px', background: '#f9fafb', borderRadius: 6 }}>
          <p style={{ fontSize: 11, lineHeight: 1.8, color: '#374151', margin: 0 }}>{pi.summary}</p>
        </div>
      )}
      {experience.length > 0 && (
        <ExecSection title="Executive Experience">
          {experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e5e7eb', paddingBottom: 5, marginBottom: 8 }}>
                <div>
                  <strong style={{ fontSize: 13 }}>{exp.position}</strong>
                  <span style={{ fontSize: 11, color: '#4b5563' }}> — {exp.company}</span>
                </div>
                <span style={{ fontSize: 10, color: '#6b7280', fontStyle: 'italic' }}>{exp.startDate}{exp.current ? ' – Present' : exp.endDate ? ` – ${exp.endDate}` : ''}{exp.location ? ` · ${exp.location}` : ''}</span>
              </div>
              <BulletList text={exp.description} style={{ color: '#374151', fontSize: 10 }} />
            </div>
          ))}
        </ExecSection>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
        <div>
          {education.length > 0 && (
            <ExecSection title="Education">
              {education.map((edu, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <strong style={{ fontSize: 11 }}>{edu.degree}{edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ''}</strong>
                  <p style={{ fontSize: 10, color: '#4b5563' }}>{edu.institution}</p>
                  <p style={{ fontSize: 9, color: '#9ca3af' }}>{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}</p>
                </div>
              ))}
            </ExecSection>
          )}
          {certifications.length > 0 && (
            <ExecSection title="Certifications">
              {certifications.map((c, i) => <div key={i} style={{ marginBottom: 8 }}><strong style={{ fontSize: 10 }}>{c.name}</strong><p style={{ fontSize: 9, color: '#6b7280' }}>{c.issuer}{c.date ? ` · ${c.date}` : ''}</p></div>)}
            </ExecSection>
          )}
        </div>
        <div>
          {skills.length > 0 && (
            <ExecSection title="Core Competencies">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px 8px' }}>
                {skills.map((s, i) => <p key={i} style={{ fontSize: 10, color: '#374151', margin: 0, padding: '2px 0', borderBottom: '1px dotted #e5e7eb' }}>{s.name}</p>)}
              </div>
            </ExecSection>
          )}
          {projects.length > 0 && (
            <ExecSection title="Key Initiatives">
              {projects.map((p, i) => <div key={i} style={{ marginBottom: 8 }}><strong style={{ fontSize: 10 }}>{p.name}</strong><p style={{ fontSize: 9, color: '#6b7280', marginTop: 2 }}>{p.description}</p></div>)}
            </ExecSection>
          )}
          {languages.length > 0 && (
            <ExecSection title="Languages">
              {languages.map((l, i) => <p key={i} style={{ fontSize: 10 }}>{l.name} <span style={{ color: '#9ca3af' }}>({l.proficiency})</span></p>)}
            </ExecSection>
          )}
        </div>
      </div>
    </div>
  )
}
const ExecSection = ({ title, children }) => (
  <div style={{ marginBottom: 20 }}>
    <p style={{ fontSize: 9, fontWeight: 800, letterSpacing: 2.5, textTransform: 'uppercase', color: '#374151', marginBottom: 10, paddingBottom: 5, borderBottom: '2px solid #111827' }}>{title}</p>
    {children}
  </div>
)

/* ─── Template resolver ───────────────────────────────────────────── */
export function ResumeTemplate({ resume }) {
  const id = resume?.templateId || 'professional'
  const map = {
    minimal: MinimalTemplate,
    professional: ProfessionalTemplate,
    creative: CreativeTemplate,
    'ats-friendly': ATSTemplate,
    'dark-modern': DarkModernTemplate,
    'elegant-serif': ElegantSerifTemplate,
    corporate: CorporateTemplate,
    compact: CompactTemplate,
    sidebar: SidebarTemplate,
    timeline: TimelineTemplate,
    portfolio: PortfolioTemplate,
    executive: ExecutiveTemplate,
  }
  const Comp = map[id] || ProfessionalTemplate
  return <Comp resume={resume} />
}
