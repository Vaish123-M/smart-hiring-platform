import React, { useState } from 'react';
import { AlertCircle, Loader, TrendingUp, CheckCircle, XCircle } from 'lucide-react';

export default function JobMatcher({ resumeText }) {
  const [jdText, setJdText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleMatch = async () => {
    if (!jdText.trim()) {
      setError('Please enter a job description');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/matching/jd-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume_text: resumeText,
          job_description: jdText
        })
      });

      if (!response.ok) throw new Error('Matching failed');
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getMatchColor = (percentage) => {
    if (percentage >= 80) return 'from-green-500 to-green-400';
    if (percentage >= 60) return 'from-yellow-500 to-yellow-400';
    return 'from-red-500 to-red-400';
  };

  const getATSColor = (score) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Job Description Matcher</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Paste Job Description
        </label>
        <textarea
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          placeholder="Paste the job description here..."
          rows="6"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition resize-none"
        />
      </div>

      <button
        onClick={handleMatch}
        disabled={loading || !resumeText}
        className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {loading && <Loader className="w-5 h-5 animate-spin mr-2" />}
        {loading ? 'Analyzing...' : 'Analyze Match'}
      </button>

      {result && (
        <div className="space-y-4 border-t pt-6">
          {/* Match Percentage */}
          <div className="bg-gradient-to-r {getMatchColor(result.match_percentage)} rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Match Percentage</h3>
              <TrendingUp className="w-6 h-6" />
            </div>
            <p className="text-5xl font-bold mb-2">{Math.round(result.match_percentage)}%</p>
            <div className="w-full bg-white/30 rounded-full h-2">
              <div
                className="bg-white rounded-full h-2 transition-all"
                style={{ width: `${result.match_percentage}%` }}
              />
            </div>
          </div>

          {/* ATS Score */}
          <div className={`p-4 rounded-lg border-l-4 ${getATSColor(result.ats_score)} border-current bg-opacity-5`}>
            <p className="text-sm text-gray-600 mb-1">ATS Score</p>
            <p className={`text-4xl font-bold ${getATSColor(result.ats_score)}`}>
              {result.ats_score.toFixed(1)}/10
            </p>
          </div>

          {/* Matched Skills */}
          {result.matched_skills.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                Matched Skills ({result.matched_skills.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.matched_skills.map(skill => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium"
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Missing Skills */}
          {result.missing_skills.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <XCircle className="w-5 h-5 text-red-600 mr-2" />
                Missing Skills ({result.missing_skills.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.missing_skills.map(skill => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium"
                  >
                    ✗ {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {result.missing_skills.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> Consider learning or highlighting {result.missing_skills.slice(0, 3).join(', ')} to improve your match score.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
