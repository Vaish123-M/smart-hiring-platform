import { useState } from 'react';
import { AlertCircle, Loader, TrendingUp, CheckCircle, XCircle, Briefcase, Target, Link2, FileUp } from 'lucide-react';

const API_BASE = 'http://localhost:8000';

export default function JobMatcher({ resumeText }) {
  const [jdText, setJdText] = useState('');
  const [jdFile, setJdFile] = useState(null);
  const [jdUrl, setJdUrl] = useState('');
  const [mode, setMode] = useState('paste'); // 'paste' | 'upload' | 'url'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const resetErrors = () => setError('');

  const loadJDFromFile = async () => {
    if (!jdFile) {
      setError('Please select a PDF or TXT file');
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

  const handleMatch = async () => {
    if (!resumeText) {
      setError('Please upload a resume first');
      return;
    }

    setLoading(true);
    resetErrors();

    try {
      let jobDescription = jdText;

      if (mode === 'upload') {
        jobDescription = await loadJDFromFile();
      }
      if (mode === 'url') {
        jobDescription = await loadJDFromUrl();
      }

      if (!jobDescription || !jobDescription.trim()) {
        throw new Error('Job description text is empty');
      }

      const response = await fetch(`${API_BASE}/ats/match`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resume_text: resumeText,
          job_description: jobDescription,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to match resume with job description');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
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

  const ModeButton = ({ value, label, icon: Icon }) => (
    <button
      onClick={() => { setMode(value); resetErrors(); }}
      className={`flex items-center px-4 py-2 rounded-lg border transition text-sm font-semibold ${
        mode === value ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-600 hover:border-indigo-200'
      }`}
    >
      <Icon className="w-4 h-4 mr-2" /> {label}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Job Description Input */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center mb-4">
          <Briefcase className="w-6 h-6 text-indigo-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-800">Job Description Matcher</h2>
        </div>

        <p className="text-gray-600 mb-4">
          Paste a JD, upload a JD file (PDF/TXT), or fetch from a URL to see how well your resume matches.
        </p>

        <div className="flex flex-wrap gap-3 mb-4">
          <ModeButton value="paste" label="Paste JD" icon={Target} />
          <ModeButton value="upload" label="Upload JD" icon={FileUp} />
          <ModeButton value="url" label="JD from URL" icon={Link2} />
        </div>

        {mode === 'paste' && (
          <textarea
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Paste job description here...\n\nExample:\nWe are looking for a Software Engineer with 3+ years of experience in Python, React, and AWS..."
            className="w-full h-56 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          />
        )}

        {mode === 'upload' && (
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">Upload JD (PDF or TXT)</label>
            <input
              type="file"
              accept=".pdf,.txt"
              onChange={(e) => setJdFile(e.target.files[0])}
              className="block w-full text-sm text-gray-700"
            />
            {jdFile && <p className="text-sm text-gray-600">Selected: {jdFile.name}</p>}
          </div>
        )}

        {mode === 'url' && (
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Job description URL</label>
            <input
              type="url"
              value={jdUrl}
              onChange={(e) => setJdUrl(e.target.value)}
              placeholder="https://company.com/job-posting"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700 text-sm">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={handleMatch}
          disabled={loading}
          className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin mr-2" />
              Analyzing Match...
            </>
          ) : (
            <>
              <Target className="w-5 h-5 mr-2" />
              Analyze Match
            </>
          )}
        </button>
      </div>

      {/* Match Results */}
      {result && (
        <div className="space-y-6">
          {/* Overall Match Score */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${getScoreBgColor(result.match_percentage)} mb-4`}>
                <span className={`text-4xl font-bold ${getScoreColor(result.match_percentage)}`}>
                  {result.match_percentage}%
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Overall Match Score</h3>
              <p className="text-gray-600">
                {result.match_percentage >= 75 ? 'Excellent match! You are a strong candidate.' :
                 result.match_percentage >= 50 ? 'Good match with room for improvement.' :
                 'Consider developing additional skills for this role.'}
              </p>
            </div>
          </div>

          {/* Skill Gap Analysis */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <TrendingUp className="w-6 h-6 text-indigo-600 mr-2" />
              Skill Gap Analysis
            </h3>
      
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Total Required Skills</p>
                <p className="text-3xl font-bold text-blue-600">
                  {result.skill_gap_analysis.total_required_skills}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Skills Matched</p>
                <p className="text-3xl font-bold text-green-600">
                  {result.skill_gap_analysis.matched_count}
                </p>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Skills Missing</p>
                <p className="text-3xl font-bold text-red-600">
                  {result.skill_gap_analysis.missing_count}
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Match Ratio</p>
                <p className="text-3xl font-bold text-purple-600">
                  {result.skill_gap_analysis.match_ratio}%
                </p>
              </div>
            </div>

            {/* Skill Categories */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-700">Skills by Category:</h4>
              {Object.entries(result.skill_gap_analysis.categories).map(([category, skills]) => (
                skills.length > 0 && (
                  <div key={category} className="border-l-4 border-indigo-500 pl-4">
                    <p className="font-medium text-gray-700 capitalize mb-1">{category}</p>
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
                    <CheckCircle className="w-4 h-4 mr-1" />
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
                    <XCircle className="w-4 h-4 mr-1" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Experience Match */}
          {result.experience_match.required_years > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Experience Requirements</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Required</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {result.experience_match.required_years} years
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Your Experience</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {result.experience_match.resume_years} years
                  </p>
                </div>
                <div className={`text-center p-4 rounded-lg ${result.experience_match.meets_requirement ? 'bg-green-50' : 'bg-yellow-50'}`}>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
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
                Recommendations
              </h3>
              <ul className="space-y-3">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start p-3 bg-orange-50 rounded-lg">
                    <span className="flex-shrink-0 w-6 h-6 bg-orange-200 text-orange-700 rounded-full flex items-center justify-center text-sm font-bold mr-3">
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
