import React, { useState } from 'react';
import { AlertCircle, Loader, TrendingUp, CheckCircle, XCircle, Briefcase, Target } from 'lucide-react';

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

    if (!resumeText) {
      setError('Please upload a resume first');
      return;
    }

    setLoading(true);
    setError('');

    try {
      import { useState } from 'react';
      import { Target, TrendingUp, AlertCircle, CheckCircle, XCircle, Briefcase } from 'lucide-react';

      const JobMatcher = ({ resumeText }) => {
        const [jobDescription, setJobDescription] = useState('');
        const [matchResult, setMatchResult] = useState(null);
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState('');

        const handleMatch = async () => {
          if (!jobDescription.trim()) {
            setError('Please enter a job description');
            return;
          }

          if (!resumeText) {
            setError('Please upload a resume first');
            return;
          }

          setLoading(true);
          setError('');

          try {
            const response = await fetch('http://localhost:8000/ats/match', {
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
            setMatchResult(data);
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

        return (
          <div className="space-y-6">
            {/* Job Description Input */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Briefcase className="w-6 h-6 text-indigo-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-800">Job Description Matcher</h2>
              </div>
        
              <p className="text-gray-600 mb-4">
                Paste the job description below to see how well your resume matches the requirements.
              </p>

              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste job description here...&#10;&#10;Example:&#10;We are looking for a Software Engineer with 3+ years of experience in Python, React, and AWS..."
                className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700 text-sm">
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                onClick={handleMatch}
                disabled={loading || !jobDescription.trim()}
                className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
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
            {matchResult && (
              <div className="space-y-6">
                {/* Overall Match Score */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${getScoreBgColor(matchResult.match_percentage)} mb-4`}>
                      <span className={`text-4xl font-bold ${getScoreColor(matchResult.match_percentage)}`}>
                        {matchResult.match_percentage}%
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Overall Match Score</h3>
                    <p className="text-gray-600">
                      {matchResult.match_percentage >= 75 ? 'Excellent match! You are a strong candidate.' :
                       matchResult.match_percentage >= 50 ? 'Good match with room for improvement.' :
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
                        {matchResult.skill_gap_analysis.total_required_skills}
                      </p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Skills Matched</p>
                      <p className="text-3xl font-bold text-green-600">
                        {matchResult.skill_gap_analysis.matched_count}
                      </p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Skills Missing</p>
                      <p className="text-3xl font-bold text-red-600">
                        {matchResult.skill_gap_analysis.missing_count}
                      </p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-1">Match Ratio</p>
                      <p className="text-3xl font-bold text-purple-600">
                        {matchResult.skill_gap_analysis.match_ratio}%
                      </p>
                    </div>
                  </div>

                  {/* Skill Categories */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-700">Skills by Category:</h4>
                    {Object.entries(matchResult.skill_gap_analysis.categories).map(([category, skills]) => (
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
                {matchResult.matched_skills.length > 0 && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                      Matched Skills ({matchResult.matched_skills.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {matchResult.matched_skills.map((skill) => (
                        <span key={skill} className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium flex items-center">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing Skills */}
                {matchResult.missing_skills.length > 0 && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <XCircle className="w-6 h-6 text-red-600 mr-2" />
                      Missing Skills ({matchResult.missing_skills.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {matchResult.missing_skills.map((skill) => (
                        <span key={skill} className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium flex items-center">
                          <XCircle className="w-4 h-4 mr-1" />
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Experience Match */}
                {matchResult.experience_match.required_years > 0 && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Experience Requirements</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Required</p>
                        <p className="text-2xl font-bold text-gray-800">
                          {matchResult.experience_match.required_years} years
                        </p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">Your Experience</p>
                        <p className="text-2xl font-bold text-gray-800">
                          {matchResult.experience_match.resume_years} years
                        </p>
                      </div>
                      <div className={`text-center p-4 rounded-lg ${matchResult.experience_match.meets_requirement ? 'bg-green-50' : 'bg-yellow-50'}`}>
                        <p className="text-sm text-gray-600 mb-1">Status</p>
                        <p className={`text-lg font-bold ${matchResult.experience_match.meets_requirement ? 'text-green-600' : 'text-yellow-600'}`}>
                          {matchResult.experience_match.meets_requirement ? '✓ Meets' : `${matchResult.experience_match.gap_years} yr gap`}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {matchResult.recommendations.length > 0 && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <AlertCircle className="w-6 h-6 text-orange-600 mr-2" />
                      Recommendations
                    </h3>
                    <ul className="space-y-3">
                      {matchResult.recommendations.map((rec, index) => (
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
      };

      export default JobMatcher;
