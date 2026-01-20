import { useState } from 'react';
import { FileUp, Loader, Target, CheckCircle, XCircle, AlertCircle, PieChart } from 'lucide-react';

const API_BASE = 'http://localhost:8000';

export default function JobMatchAnalyzer() {
  const [jdText, setJdText] = useState('');
  const [jdFile, setJdFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    setError('');
    setResult(null);

    if (!jdText && !jdFile) {
      setError('Please paste a job description or upload a JD file.');
      return;
    }
    if (!resumeFile) {
      setError('Please upload a resume file.');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      if (jdText) formData.append('jd_text', jdText);
      if (jdFile) formData.append('jd_file', jdFile);
      formData.append('resume_file', resumeFile);

      const resp = await fetch(`${API_BASE}/ats/job-match-analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!resp.ok) {
        const msg = await resp.json().catch(() => ({}));
        throw new Error(msg.detail || 'Failed to analyze job match');
      }

      const data = await resp.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to analyze job match');
    } finally {
      setLoading(false);
    }
  };

  const matchPercent = result?.match_percentage || 0;
  const matchedCount = result?.matched_skills?.length || 0;
  const missingCount = result?.missing_skills?.length || 0;
  const totalSkills = matchedCount + missingCount || 1;
  const matchedPercent = Math.round((matchedCount / totalSkills) * 100);
  const missingPercent = 100 - matchedPercent;

  const chartStyle = {
    background: `conic-gradient(#16a34a ${matchedPercent}%, #f87171 0)`
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6 flex items-start gap-4">
        <div className="p-3 bg-indigo-50 rounded-lg">
          <Target className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Job Match Analyzer</h2>
          <p className="text-gray-600">Paste or upload a Job Description, upload your resume (PDF/DOCX), and get an ATS match score.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start text-red-700">
          <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600" /> Job Description
          </h3>
          <textarea
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Paste job description here..."
            className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
          />
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">or Upload JD (PDF/DOCX)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <FileUp className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={(e) => setJdFile(e.target.files[0])}
                className="block w-full text-sm text-gray-700"
              />
              {jdFile && <p className="text-sm text-green-600 mt-2">✓ {jdFile.name}</p>}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FileUp className="w-5 h-5 text-purple-600" /> Resume (PDF/DOCX)
          </h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <FileUp className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={(e) => setResumeFile(e.target.files[0])}
              className="block w-full text-sm text-gray-700"
            />
            {resumeFile && <p className="text-sm text-green-600 mt-2">✓ {resumeFile.name}</p>}
          </div>
        </div>
      </div>

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
      >
        {loading ? (
          <>
            <Loader className="w-5 h-5 animate-spin mr-2" />
            Analyzing...
          </>
        ) : (
          <>
            <Target className="w-5 h-5 mr-2" />
            Analyze Match
          </>
        )}
      </button>

      {result && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6 grid md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold text-gray-800">ATS Match Score</h3>
              <p className="text-gray-600">Percentage overlap between your resume and the job description.</p>
              <div className="mt-4 text-5xl font-bold text-indigo-700">{matchPercent}%</div>
            </div>
            <div className="w-32 h-32 rounded-full bg-gray-100 mx-auto flex items-center justify-center" style={chartStyle}>
              <div className="w-20 h-20 bg-white rounded-full flex flex-col items-center justify-center text-xs text-gray-700">
                <span className="font-bold text-lg">{matchedPercent}%</span>
                <span>Matched</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h4 className="text-lg font-semibold text-gray-800">Matched Skills ({matchedCount})</h4>
              </div>
              {matchedCount === 0 ? (
                <p className="text-sm text-gray-500">No matched skills found yet.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {result.matched_skills.map((skill) => (
                    <span key={skill} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">{skill}</span>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="w-5 h-5 text-red-600" />
                <h4 className="text-lg font-semibold text-gray-800">Missing Skills ({missingCount})</h4>
              </div>
              {missingCount === 0 ? (
                <p className="text-sm text-gray-500">Great! No missing skills detected.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {result.missing_skills.map((skill) => (
                    <span key={skill} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">{skill}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-3">
              <PieChart className="w-5 h-5 text-indigo-600" />
              <h4 className="text-lg font-semibold text-gray-800">Skill Gap Summary</h4>
            </div>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-600">Total JD Skills</p>
                <p className="text-2xl font-bold text-blue-700">{result.skill_gap_analysis.total_required_skills}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-600">Matched</p>
                <p className="text-2xl font-bold text-green-700">{result.skill_gap_analysis.matched_count}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-600">Missing</p>
                <p className="text-2xl font-bold text-red-700">{result.skill_gap_analysis.missing_count}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-600">Match Ratio</p>
                <p className="text-2xl font-bold text-purple-700">{result.skill_gap_analysis.match_ratio}%</p>
              </div>
            </div>
          </div>

          {result.recommendations && result.recommendations.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <h4 className="text-lg font-semibold text-gray-800">Improvement Suggestions</h4>
              </div>
              <ul className="space-y-3">
                {result.recommendations.map((rec, idx) => (
                  <li key={idx} className="p-3 bg-orange-50 border border-orange-200 rounded-lg text-sm text-gray-800">
                    {rec}
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
