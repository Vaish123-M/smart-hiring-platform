// Enhanced ATSAnalyzer with modern UI features
// This preserves all existing logic while adding UI enhancements

import { useState } from 'react';
import { 
  AlertCircle, Loader, TrendingUp, CheckCircle, XCircle, Briefcase, 
  Target, Link2, FileUp, Upload, Zap, Download, Info, ChevronDown, 
  ChevronUp, Moon, Sun, Lightbulb, BarChart3 
} from 'lucide-react';

const API_BASE = 'http://localhost:8000';

export default function EnhancedATSAnalyzer() {
  // Existing states
  const [jdText, setJdText] = useState('');
  const [jdFile, setJdFile] = useState(null);
  const [jdUrl, setJdUrl] = useState('');
  const [jdMode, setJdMode] = useState('paste');
  const [resumeText, setResumeText] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeMode, setResumeMode] = useState('paste');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  // UI Enhancement states
  const [darkMode, setDarkMode] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    matched: true,
    missing: true,
    recommendations: true,
    analysis: true
  });
  const [showSidebar, setShowSidebar] = useState(true);

  // Tooltip Component
  const Tooltip = ({ content, children }) => (
    <div className="relative inline-block group">
      {children}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-xl">
        {content}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
      </div>
    </div>
  );

  // Collapsible Section Component
  const CollapsibleSection = ({ title, icon: Icon, isExpanded, onToggle, children, count }) => (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg overflow-hidden transition-all`}>
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between p-6 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} transition-colors`}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-3">
          <Icon className={`w-6 h-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
          <h3 className="text-xl font-bold">{title}</h3>
          {count !== undefined && (
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${darkMode ? 'bg-indigo-900 text-indigo-300' : 'bg-indigo-100 text-indigo-700'}`}>
              {count}
            </span>
          )}
        </div>
        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
      </button>
      {isExpanded && <div className="p-6 pt-0">{children}</div>}
    </div>
  );

  // Export Function
  const exportReport = () => {
    if (!result) return;
    
    const reportContent = `
ATS ANALYSIS REPORT
===================

OVERALL SCORE: ${result.match_percentage}%

MATCHED SKILLS (${result.matched_skills?.length || 0}):
${result.matched_skills?.map(s => `✓ ${s}`).join('\n') || 'None'}

MISSING SKILLS (${result.missing_skills?.length || 0}):
${result.missing_skills?.map(s => `✗ ${s}`).join('\n') || 'None'}

RECOMMENDATIONS:
${result.recommendations?.map((r, i) => `${i + 1}. ${r}`).join('\n') || 'None'}

EXPERIENCE ANALYSIS:
- Your Experience: ${result.experience_match?.resume_years || 0} years
- Required Experience: ${result.experience_match?.required_years || 0} years
- Meets Requirement: ${result.experience_match?.meets_requirement ? 'Yes' : 'No'}

Generated: ${new Date().toLocaleString()}
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ats-report-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Existing load functions (preserved)
  const loadJDFromFile = async () => {
    if (!jdFile) {
      setError('Please select a PDF or TXT file for job description');
      return '';
    }
    const formData = new FormData();
    formData.append('file', jdFile);
    const resp = await fetch(`${API_BASE}/ats/jd-upload`, {
      method: 'POST',
      body: formData,
    });
    if (!resp.ok) throw new Error('Could not read the job description file');
    const data = await resp.json();
    return data.job_description || '';
  };

  const loadJDFromUrl = async () => {
    if (!jdUrl.trim()) {
      setError('Please paste a job description URL');
      return '';
    }
    const resp = await fetch(`${API_BASE}/ats/jd-fetch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: jdUrl }),
    });
    if (!resp.ok) throw new Error('Could not fetch the job description from the URL');
    const data = await resp.json();
    return data.job_description || '';
  };

  const loadResumeFromFile = async () => {
    if (!resumeFile) {
      setError('Please select a PDF or TXT file for resume');
      return '';
    }
    const formData = new FormData();
    formData.append('file', resumeFile);
    const resp = await fetch(`${API_BASE}/resume/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!resp.ok) throw new Error('Could not read the resume file');
    const data = await resp.json();
    return data.resume_text || '';
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');

    try {
      let finalJdText = jdText;
      let finalResumeText = resumeText;

      if (jdMode === 'upload') finalJdText = await loadJDFromFile();
      else if (jdMode === 'url') finalJdText = await loadJDFromUrl();
      if (resumeMode === 'upload') finalResumeText = await loadResumeFromFile();

      if (!finalJdText || !finalJdText.trim()) throw new Error('Job description is empty');
      if (!finalResumeText || !finalResumeText.trim()) throw new Error('Resume text is empty');

      const response = await fetch(`${API_BASE}/ats/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume_text: finalResumeText,
          job_description: finalJdText,
        }),
      });

      if (!response.ok) throw new Error('Failed to analyze resume');
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to analyze. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 75) return darkMode ? 'text-green-400' : 'text-green-600';
    if (score >= 50) return darkMode ? 'text-yellow-400' : 'text-yellow-600';
    return darkMode ? 'text-red-400' : 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 75) return darkMode ? 'bg-green-900/30' : 'bg-green-100';
    if (score >= 50) return darkMode ? 'bg-yellow-900/30' : 'bg-yellow-100';
    return darkMode ? 'bg-red-900/30' : 'bg-red-100';
  };

  // Render tips sidebar
  const renderSidebar = () => (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 lg:sticky lg:top-6 h-fit`}>
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-yellow-500" />
        <h3 className="font-bold text-lg">Quick Tips</h3>
      </div>
      <ul className="space-y-3 text-sm">
        <li className="flex items-start gap-2">
          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
          <span>Include exact keywords from job description</span>
        </li>
        <li className="flex items-start gap-2">
          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
          <span>List technical skills prominently</span>
        </li>
        <li className="flex items-start gap-2">
          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
          <span>Use standard section headings</span>
        </li>
        <li className="flex items-start gap-2">
          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
          <span>Quantify achievements with numbers</span>
        </li>
        <li className="flex items-start gap-2">
          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
          <span>Avoid images, tables, and graphics</span>
        </li>
      </ul>
    </div>
  );

  return (
    <div className={`${darkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-gray-50'} min-h-screen transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header with Dark Mode */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl shadow-2xl p-8 mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all transform hover:scale-110"
              aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <BarChart3 className="w-10 h-10" />
              <h1 className="text-4xl font-bold">ATS Score Analyzer</h1>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-indigo-100 text-lg">Analyze your resume against job requirements with AI-powered insights</p>
              <Tooltip content="Our ATS analyzer checks keyword matching, skills alignment, and experience requirements">
                <Info className="w-5 h-5 cursor-help opacity-75 hover:opacity-100" />
              </Tooltip>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Rest of the component continues with input sections... */}
            {/* This is a template showing the enhanced structure */}
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              <p className="text-center py-12 text-gray-500">
                Enhanced UI template - Input sections and results would go here
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {renderSidebar()}
          </div>
        </div>
      </div>
    </div>
  );
}
