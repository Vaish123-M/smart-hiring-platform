import { useState } from 'react';
import { AlertCircle, Loader, TrendingUp, CheckCircle, XCircle, Briefcase, Target, Link2, FileUp, Upload, Zap } from 'lucide-react';

const API_BASE = 'http://localhost:8000';

export default function ATSAnalyzer() {
  // Job Description states
  const [jdText, setJdText] = useState('');
  const [jdFile, setJdFile] = useState(null);
  const [jdUrl, setJdUrl] = useState('');
  const [jdMode, setJdMode] = useState('paste'); // 'paste' | 'upload' | 'url'

  // Resume states
  const [resumeText, setResumeText] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeMode, setResumeMode] = useState('paste');

  // Analysis states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const resetErrors = () => setError('');

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
    resetErrors();

    try {
      let finalJdText = jdText;
      let finalResumeText = resumeText;

      // Load JD based on mode
      if (jdMode === 'upload') {
        finalJdText = await loadJDFromFile();
      } else if (jdMode === 'url') {
        finalJdText = await loadJDFromUrl();
      }

      // Load Resume based on mode
      if (resumeMode === 'upload') {
        finalResumeText = await loadResumeFromFile();
      }

      console.log('🔍 DEBUG: Analyzing with:', {
        jdLength: finalJdText?.length,
        resumeLength: finalResumeText?.length,
        jdPreview: finalJdText?.substring(0, 100),
        resumePreview: finalResumeText?.substring(0, 100)
      });

      if (!finalJdText || !finalJdText.trim()) {
        throw new Error('Job description is empty');
      }

      if (!finalResumeText || !finalResumeText.trim()) {
        throw new Error('Resume text is empty');
      }

      const response = await fetch(`${API_BASE}/ats/match`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resume_text: finalResumeText,
          job_description: finalJdText,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze resume');
      }

      const data = await response.json();
      console.log('📊 ATS Result:', data);
      setResult(data);
    } catch (err) {
      console.error('❌ Error:', err);
      setError(err.message || 'Failed to analyze. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 75) return 'bg-green-100';
    if (score >= 50) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const ModeButton = ({ value, label, icon: Icon, isActive, onChange }) => (
    <button
      onClick={() => onChange(value)}
      className={`flex items-center px-3 py-2 rounded-lg border transition text-xs font-semibold ${
        isActive ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:border-indigo-200'
      }`}
    >
      <Icon className="w-3 h-3 mr-1" /> {label}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center mb-2">
          <Zap className="w-8 h-8 mr-3" />
          <h1 className="text-3xl font-bold">ATS Score Analyzer</h1>
        </div>
        <p className="text-indigo-100">Input your job description and resume side-by-side to get an instant ATS score analysis</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start text-red-700">
          <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Side-by-Side Input Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* LEFT: Job Description */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <Briefcase className="w-6 h-6 text-indigo-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-800">Job Description</h2>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <ModeButton 
              value="paste" 
              label="Paste" 
              icon={Target} 
              isActive={jdMode === 'paste'}
              onChange={setJdMode}
            />
            <ModeButton 
              value="upload" 
              label="Upload" 
              icon={FileUp} 
              isActive={jdMode === 'upload'}
              onChange={setJdMode}
            />
            <ModeButton 
              value="url" 
              label="URL" 
              icon={Link2} 
              isActive={jdMode === 'url'}
              onChange={setJdMode}
            />
          </div>

          {jdMode === 'paste' && (
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste job description here..."
              className="w-full h-80 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
            />
          )}

          {jdMode === 'upload' && (
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Upload JD (PDF or TXT)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <FileUp className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <input
                  type="file"
                  accept=".pdf,.txt"
                  onChange={(e) => setJdFile(e.target.files[0])}
                  className="block w-full text-sm text-gray-700"
                />
                {jdFile && <p className="text-sm text-green-600 mt-2">✓ {jdFile.name}</p>}
              </div>
            </div>
          )}

          {jdMode === 'url' && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Job Description URL</label>
              <input
                type="url"
                value={jdUrl}
                onChange={(e) => setJdUrl(e.target.value)}
                placeholder="https://example.com/job-posting"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              />
            </div>
          )}
        </div>

        {/* RIGHT: Resume */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <Upload className="w-6 h-6 text-purple-600 mr-2" />
            <h2 className="text-xl font-bold text-gray-800">Your Resume</h2>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <ModeButton 
              value="paste" 
              label="Paste" 
              icon={Target} 
              isActive={resumeMode === 'paste'}
              onChange={setResumeMode}
            />
            <ModeButton 
              value="upload" 
              label="Upload" 
              icon={FileUp} 
              isActive={resumeMode === 'upload'}
              onChange={setResumeMode}
            />
          </div>

          {resumeMode === 'paste' && (
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume here..."
              className="w-full h-80 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm"
            />
          )}

          {resumeMode === 'upload' && (
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Upload Resume (PDF or TXT)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <FileUp className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <input
                  type="file"
                  accept=".pdf,.txt"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                  className="block w-full text-sm text-gray-700"
                />
                {resumeFile && <p className="text-sm text-green-600 mt-2">✓ {resumeFile.name}</p>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Analyze Button */}
      <div className="flex gap-4">
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="flex-1 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center text-lg"
        >
          {loading ? (
            <>
              <Loader className="w-6 h-6 animate-spin mr-2" />
              Analyzing...
            </>
          ) : (
            <>
              <Zap className="w-6 h-6 mr-2" />
              Analyze ATS Score
            </>
          )}
        </button>
      </div>

      {/* Results Section */}
      {result && (
        <div className="space-y-6">
          {/* Overall Match Score - Large Card */}
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className={`inline-flex items-center justify-center w-40 h-40 rounded-full ${getScoreBgColor(result.match_percentage)} mb-6`}>
              <div className="text-center">
                <span className={`text-5xl font-bold ${getScoreColor(result.match_percentage)}`}>
                  {result.match_percentage}%
                </span>
                <p className="text-xs text-gray-600 mt-1">ATS SCORE</p>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Overall Match Score</h3>
            <p className="text-gray-600 text-lg">
              {result.match_percentage >= 75 ? '🎉 Excellent match! You are a strong candidate.' :
               result.match_percentage >= 50 ? '👍 Good match with room for improvement.' :
               '⚠️ Consider developing additional skills for this role.'}
            </p>
          </div>

          {/* Skill Gap Analysis */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <TrendingUp className="w-6 h-6 text-indigo-600 mr-2" />
              Skill Gap Analysis
            </h3>

            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-1">TOTAL REQUIRED</p>
                <p className="text-3xl font-bold text-blue-600">
                  {result.skill_gap_analysis.total_required_skills}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-1">MATCHED</p>
                <p className="text-3xl font-bold text-green-600">
                  {result.skill_gap_analysis.matched_count}
                </p>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-1">MISSING</p>
                <p className="text-3xl font-bold text-red-600">
                  {result.skill_gap_analysis.missing_count}
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-1">MATCH RATIO</p>
                <p className="text-3xl font-bold text-purple-600">
                  {result.skill_gap_analysis.match_ratio}%
                </p>
              </div>
            </div>

            {/* Skills by Category */}
            <div className="space-y-4">
              {Object.entries(result.skill_gap_analysis.categories).map(([category, skills]) => (
                skills.length > 0 && (
                  <div key={category} className="border-l-4 border-indigo-500 pl-4">
                    <p className="font-semibold text-gray-700 capitalize mb-2">{category}</p>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <span key={skill} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>

          {/* Matched Skills */}
          {result.matched_skills.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                Matched Skills ({result.matched_skills.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.matched_skills.map((skill) => (
                  <span key={skill} className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Missing Skills */}
          {result.missing_skills.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <XCircle className="w-6 h-6 text-red-600 mr-2" />
                Missing Skills ({result.missing_skills.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.missing_skills.map((skill) => (
                  <span key={skill} className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium flex items-center">
                    <XCircle className="w-4 h-4 mr-2" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience Match */}
          {result.experience_match?.required_years > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Experience Requirements</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">REQUIRED</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {result.experience_match.required_years} yrs
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1">YOUR EXPERIENCE</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {result.experience_match.resume_years} yrs
                  </p>
                </div>
                <div className={`text-center p-4 rounded-lg ${result.experience_match.meets_requirement ? 'bg-green-50' : 'bg-yellow-50'}`}>
                  <p className="text-xs text-gray-600 mb-1">STATUS</p>
                  <p className={`text-lg font-bold ${result.experience_match.meets_requirement ? 'text-green-600' : 'text-yellow-600'}`}>
                    {result.experience_match.meets_requirement ? '✓ Meets' : `${result.experience_match.gap_years} yr gap`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Recommendations */}
          {result.recommendations.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <AlertCircle className="w-6 h-6 text-orange-600 mr-2" />
                Recommendations to Improve
              </h3>
              <ul className="space-y-3">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <span className="flex-shrink-0 w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
