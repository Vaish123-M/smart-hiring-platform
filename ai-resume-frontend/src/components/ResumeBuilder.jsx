import { useMemo, useState } from 'react';
import { Plus, Download, Copy, Trash2 } from 'lucide-react';
import { CollapsibleSection } from './CollapsibleSection';

const emptyExperience = { role: '', company: '', start: '', end: '', bullets: [''] };
const emptyProject = { name: '', tech: '', summary: '' };
const emptyEducation = { school: '', degree: '', year: '' };

export default function ResumeBuilder() {
  const [profile, setProfile] = useState({
    name: '',
    title: '',
    location: '',
    email: '',
    phone: '',
    summary: '',
    skills: '',
  });
  const [experience, setExperience] = useState([emptyExperience]);
  const [projects, setProjects] = useState([emptyProject]);
  const [education, setEducation] = useState([emptyEducation]);
  const [status, setStatus] = useState('');

  const handleProfileChange = (key, value) => {
    setProfile((p) => ({ ...p, [key]: value }));
  };

  const updateList = (setter, list, index, key, value) => {
    const next = [...list];
    next[index] = { ...next[index], [key]: value };
    setter(next);
  };

  const addItem = (setter, itemTemplate) => setter((prev) => [...prev, { ...itemTemplate }]);
  const removeItem = (setter, list, index) => setter(list.filter((_, i) => i !== index));

  const renderBullets = (expIdx) => (
    <div className="space-y-2">
      {experience[expIdx].bullets.map((b, bIdx) => (
        <input
          key={bIdx}
          value={b}
          onChange={(e) => {
            const next = [...experience];
            const bullets = [...next[expIdx].bullets];
            bullets[bIdx] = e.target.value;
            next[expIdx] = { ...next[expIdx], bullets };
            setExperience(next);
          }}
          placeholder="Impactful bullet (use metrics)"
          className="w-full px-3 py-2 border rounded"
        />
      ))}
      <button
        onClick={() => {
          const next = [...experience];
          next[expIdx] = { ...next[expIdx], bullets: [...next[expIdx].bullets, ''] };
          setExperience(next);
        }}
        className="text-sm text-indigo-600 font-semibold"
      >
        + Add bullet
      </button>
    </div>
  );

  const plainText = useMemo(() => {
    const lines = [];
    lines.push(profile.name || 'Your Name');
    lines.push(profile.title || 'Role / Title');
    lines.push([profile.location, profile.email, profile.phone].filter(Boolean).join(' · '));
    if (profile.summary) lines.push('\nSummary');
    if (profile.summary) lines.push(profile.summary);
    if (profile.skills) lines.push('\nSkills');
    if (profile.skills) lines.push(profile.skills);

    if (experience.length) {
      lines.push('\nExperience');
      experience.forEach((exp) => {
        lines.push(`${exp.role || 'Role'} @ ${exp.company || 'Company'} (${exp.start || 'Start'} - ${exp.end || 'Present'})`);
        (exp.bullets || []).filter(Boolean).forEach((b) => lines.push(`- ${b}`));
      });
    }

    if (projects.length) {
      lines.push('\nProjects');
      projects.forEach((p) => {
        lines.push(`${p.name || 'Project'} — ${p.tech || ''}`);
        if (p.summary) lines.push(`- ${p.summary}`);
      });
    }

    if (education.length) {
      lines.push('\nEducation');
      education.forEach((ed) => {
        lines.push(`${ed.degree || 'Degree'}, ${ed.school || 'School'} (${ed.year || ''})`);
      });
    }

    return lines.join('\n');
  }, [profile, experience, projects, education]);

  const jsonData = useMemo(() => JSON.stringify({ profile, experience, projects, education }, null, 2), [profile, experience, projects, education]);

  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(plainText);
      setStatus('Copied plain text');
    } catch {
      setStatus('Copy failed');
    }
  };

  const downloadJSON = () => {
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadText = () => {
    const blob = new Blob([plainText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const sectionCard = (title, children) => (
    <div className="bg-white rounded-xl shadow p-4 sm:p-5 space-y-3 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      {children}
    </div>
  );

  return (
    <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
      <div className="space-y-4 sm:space-y-5">
        {sectionCard('Profile', (
          <div className="grid md:grid-cols-2 gap-3">
            <input className="border rounded px-3 py-2" placeholder="Full Name" value={profile.name} onChange={(e) => handleProfileChange('name', e.target.value)} />
            <input className="border rounded px-3 py-2" placeholder="Title (e.g., Backend Engineer)" value={profile.title} onChange={(e) => handleProfileChange('title', e.target.value)} />
            <input className="border rounded px-3 py-2" placeholder="Location" value={profile.location} onChange={(e) => handleProfileChange('location', e.target.value)} />
            <input className="border rounded px-3 py-2" placeholder="Email" value={profile.email} onChange={(e) => handleProfileChange('email', e.target.value)} />
            <input className="border rounded px-3 py-2" placeholder="Phone" value={profile.phone} onChange={(e) => handleProfileChange('phone', e.target.value)} />
            <textarea className="md:col-span-2 border rounded px-3 py-2" rows={3} placeholder="2-3 sentence summary" value={profile.summary} onChange={(e) => handleProfileChange('summary', e.target.value)} />
            <textarea className="md:col-span-2 border rounded px-3 py-2" rows={2} placeholder="Comma-separated skills" value={profile.skills} onChange={(e) => handleProfileChange('skills', e.target.value)} />
          </div>
        ))}

        {sectionCard('Experience', (
          <div className="space-y-4">
            {experience.map((exp, idx) => (
              <div key={idx} className="border rounded p-3 sm:p-4 space-y-3 relative">
                {experience.length > 1 && (
                  <button
                    onClick={() => removeItem(setExperience, experience, idx)}
                    className="absolute top-2 right-2 text-red-500"
                    title="Remove experience"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <div className="grid md:grid-cols-2 gap-2">
                  <input className="border rounded px-3 py-2" placeholder="Role" value={exp.role} onChange={(e) => updateList(setExperience, experience, idx, 'role', e.target.value)} />
                  <input className="border rounded px-3 py-2" placeholder="Company" value={exp.company} onChange={(e) => updateList(setExperience, experience, idx, 'company', e.target.value)} />
                  <input className="border rounded px-3 py-2" placeholder="Start (e.g., Jan 2023)" value={exp.start} onChange={(e) => updateList(setExperience, experience, idx, 'start', e.target.value)} />
                  <input className="border rounded px-3 py-2" placeholder="End (or Present)" value={exp.end} onChange={(e) => updateList(setExperience, experience, idx, 'end', e.target.value)} />
                </div>
                {renderBullets(idx)}
              </div>
            ))}
            <button
              onClick={() => addItem(setExperience, emptyExperience)}
              className="inline-flex items-center px-3 py-2 bg-indigo-50 text-indigo-700 rounded font-semibold w-full sm:w-auto justify-center"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Experience
            </button>
          </div>
        ))}

        <CollapsibleSection title="Projects" defaultOpen={false}>
          <div className="space-y-4">
            {projects.map((p, idx) => (
              <div key={idx} className="border rounded p-3 sm:p-4 space-y-2 relative">
                {projects.length > 1 && (
                  <button
                    onClick={() => removeItem(setProjects, projects, idx)}
                    className="absolute top-2 right-2 text-red-500"
                    title="Remove project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <input className="border rounded px-3 py-2 w-full" placeholder="Project name" value={p.name} onChange={(e) => updateList(setProjects, projects, idx, 'name', e.target.value)} />
                <input className="border rounded px-3 py-2 w-full" placeholder="Tech stack (comma-separated)" value={p.tech} onChange={(e) => updateList(setProjects, projects, idx, 'tech', e.target.value)} />
                <textarea className="border rounded px-3 py-2 w-full" rows={2} placeholder="What you built and impact" value={p.summary} onChange={(e) => updateList(setProjects, projects, idx, 'summary', e.target.value)} />
              </div>
            ))}
            <button
              onClick={() => addItem(setProjects, emptyProject)}
              className="inline-flex items-center px-3 py-2 bg-indigo-50 text-indigo-700 rounded font-semibold w-full sm:w-auto justify-center"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Project
            </button>
          </div>
        </CollapsibleSection>

        {sectionCard('Education', (
          <div className="space-y-4">
            {education.map((ed, idx) => (
              <div key={idx} className="border rounded p-3 sm:p-4 space-y-2 relative">
                {education.length > 1 && (
                  <button
                    onClick={() => removeItem(setEducation, education, idx)}
                    className="absolute top-2 right-2 text-red-500"
                    title="Remove education"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <input className="border rounded px-3 py-2 w-full" placeholder="School" value={ed.school} onChange={(e) => updateList(setEducation, education, idx, 'school', e.target.value)} />
                <input className="border rounded px-3 py-2 w-full" placeholder="Degree" value={ed.degree} onChange={(e) => updateList(setEducation, education, idx, 'degree', e.target.value)} />
                <input className="border rounded px-3 py-2 w-full" placeholder="Year" value={ed.year} onChange={(e) => updateList(setEducation, education, idx, 'year', e.target.value)} />
              </div>
            ))}
            <button
              onClick={() => addItem(setEducation, emptyEducation)}
              className="inline-flex items-center px-3 py-2 bg-indigo-50 text-indigo-700 rounded font-semibold w-full sm:w-auto justify-center"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Education
            </button>
          </div>
        ))}
      </div>

      <div className="space-y-4 sm:space-y-5">
        <div className="bg-white rounded-xl shadow p-4 sm:p-5 space-y-3 border border-gray-100">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Preview (plain text / ATS-friendly)</h3>
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={copyText} className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-800 rounded font-semibold w-full sm:w-auto justify-center">
                <Copy className="w-4 h-4 mr-1" /> Copy
              </button>
              <button onClick={downloadText} className="inline-flex items-center px-3 py-2 bg-indigo-600 text-white rounded font-semibold w-full sm:w-auto justify-center">
                <Download className="w-4 h-4 mr-1" /> TXT
              </button>
              <button onClick={downloadJSON} className="inline-flex items-center px-3 py-2 bg-purple-600 text-white rounded font-semibold w-full sm:w-auto justify-center">
                <Download className="w-4 h-4 mr-1" /> JSON
              </button>
            </div>
          </div>
          <pre className="bg-gray-50 border rounded p-3 text-sm whitespace-pre-wrap min-h-[260px] sm:min-h-[300px]">{plainText || 'Start filling the form to see preview.'}</pre>
          {status && <p className="text-sm text-green-600">{status}</p>}
        </div>

        <div className="bg-white rounded-xl shadow p-4 sm:p-5 space-y-2 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Tips</h3>
          <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
            <li>Use metrics in bullets (impact, scale, latency, users, revenue).</li>
            <li>Keep skills tight and relevant to the target role/JD.</li>
            <li>One page for students; keep formatting simple for ATS.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
