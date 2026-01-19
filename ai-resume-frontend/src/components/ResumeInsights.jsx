import React, { useState, useEffect } from 'react';
import { TrendingUp, Target, Zap, AlertCircle, CheckCircle, BookOpen } from 'lucide-react';

const ResumeInsights = ({ resumeText, jobDescription }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('gaps');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (resumeText && jobDescription) {
      analyzeInsights();
    }
  }, [resumeText, jobDescription]);

  const analyzeInsights = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get keyword gaps
      const gapsResponse = await fetch('http://localhost:8000/insights/keyword-gaps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume_text: resumeText,
          job_description: jobDescription,
        }),
      });

      if (!gapsResponse.ok) throw new Error('Failed to fetch keyword gaps');
      const gapsData = await gapsResponse.json();

      // Get job role matches
      const rolesResponse = await fetch('http://localhost:8000/insights/job-role-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume_text: resumeText,
          skills_extracted: [],
        }),
      });

      if (!rolesResponse.ok) throw new Error('Failed to fetch job roles');
      const rolesData = await rolesResponse.json();

      // Get career paths
      const pathsResponse = await fetch('http://localhost:8000/insights/career-paths', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume_text: resumeText,
          skills_extracted: [],
        }),
      });

      if (!pathsResponse.ok) throw new Error('Failed to fetch career paths');
      const pathsData = await pathsResponse.json();

      setInsights({
        gaps: gapsData,
        roles: rolesData,
        paths: pathsData,
      });
    } catch (err) {
      setError(err.message);
      console.error('Error analyzing insights:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!resumeText || !jobDescription) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <AlertCircle className="mx-auto mb-2 text-blue-600" />
        <p className="text-blue-700">Upload resume and job description to view insights</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Analyzing insights...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (!insights) return null;

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab('gaps')}
          className={`px-4 py-2 font-semibold ${
            activeTab === 'gaps'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <AlertCircle className="inline mr-2 h-4 w-4" />
          Keyword Gaps
        </button>
        <button
          onClick={() => setActiveTab('roles')}
          className={`px-4 py-2 font-semibold ${
            activeTab === 'roles'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Target className="inline mr-2 h-4 w-4" />
          Job Roles
        </button>
        <button
          onClick={() => setActiveTab('career')}
          className={`px-4 py-2 font-semibold ${
            activeTab === 'career'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <TrendingUp className="inline mr-2 h-4 w-4" />
          Career Paths
        </button>
      </div>

      {/* Keyword Gaps Tab */}
      {activeTab === 'gaps' && insights.gaps && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-6 rounded-lg border border-orange-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-gray-800">Gap Score</h3>
                <AlertCircle className="text-orange-600" size={24} />
              </div>
              <div className="text-4xl font-bold text-orange-600 mb-2">
                {insights.gaps.total_gap_score.toFixed(1)}%
              </div>
              <p className="text-sm text-gray-600">
                {insights.gaps.total_gap_score > 70
                  ? 'Strong match with minor gaps'
                  : insights.gaps.total_gap_score > 40
                  ? 'Moderate gaps, skill development recommended'
                  : 'Significant gaps, consider upskilling'}
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-lg border border-red-200">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Critical Gaps</h3>
              <div className="space-y-1">
                {insights.gaps.critical_gaps.slice(0, 3).map((gap, idx) => (
                  <div key={idx} className="text-sm text-red-700 font-semibold">
                    • {gap}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Missing Keywords */}
          <div>
            <h3 className="text-lg font-bold mb-4">Missing Keywords</h3>
            <div className="space-y-3">
              {insights.gaps.missing_keywords.slice(0, 10).map((kw, idx) => (
                <div key={idx} className="bg-white border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-semibold text-gray-900">{kw.keyword}</div>
                      <div className="text-sm text-gray-500 capitalize">Category: {kw.category}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-600">
                        {(kw.importance * 100).toFixed(0)}% importance
                      </div>
                      <div className="text-xs text-gray-500">
                        {kw.frequency_in_jd} mentions in JD
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full"
                      style={{ width: `${kw.importance * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-bold text-blue-900 mb-2">📋 Recommendations</h3>
            <ul className="space-y-1">
              {insights.gaps.recommendations.map((rec, idx) => (
                <li key={idx} className="text-sm text-blue-800">
                  ✓ {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Job Roles Tab */}
      {activeTab === 'roles' && insights.roles && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
              <div className="text-sm text-gray-600 mb-1">Current Level</div>
              <div className="text-2xl font-bold text-green-600 capitalize">
                {insights.roles.current_level}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
              <div className="text-sm text-gray-600 mb-1">Match Confidence</div>
              <div className="text-2xl font-bold text-blue-600">
                {(insights.roles.confidence * 100).toFixed(0)}%
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
              <div className="text-sm text-gray-600 mb-1">Best Match</div>
              <div className="text-lg font-bold text-purple-600">
                {insights.roles.top_roles[0]?.title}
              </div>
            </div>
          </div>

          {/* Role Matches */}
          <div className="space-y-3">
            {insights.roles.top_roles.map((role, idx) => (
              <div key={idx} className="bg-white border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-gray-900">{role.title}</h4>
                    <p className="text-sm text-gray-500">
                      Skill Overlap: {(role.skill_overlap * 100).toFixed(0)}%
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {role.match_score.toFixed(0)}%
                    </div>
                    <div className="text-xs text-gray-500">Match Score</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600 mb-1">Your Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {role.your_skills.slice(0, 4).map((skill, i) => (
                        <span key={i} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Required:</p>
                    <div className="flex flex-wrap gap-1">
                      {role.required_skills.slice(0, 4).map((skill, i) => (
                        <span key={i} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${role.match_score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Career Paths Tab */}
      {activeTab === 'career' && insights.paths && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg border border-indigo-200">
            <h3 className="text-lg font-bold text-indigo-900 mb-2">Current Trajectory</h3>
            <p className="text-2xl font-bold text-indigo-600">
              {insights.paths.current_trajectory}
            </p>
          </div>

          {/* Career Progression Paths */}
          <div className="space-y-3">
            {insights.paths.recommended_paths.map((path, idx) => (
              <div key={idx} className="bg-white border rounded-lg overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b">
                  <h4 className="font-bold text-gray-900 mb-1">
                    {path.current_role} → {path.next_role}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Experience Needed: {path.experience_needed}
                  </p>
                </div>

                <div className="p-4">
                  <div className="mb-3">
                    <h5 className="text-sm font-semibold text-gray-800 mb-2">Skills to Develop:</h5>
                    <div className="flex flex-wrap gap-2">
                      {path.skill_gaps.map((skill, i) => (
                        <span
                          key={i}
                          className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {path.learning_resources && (
                    <div>
                      <h5 className="text-sm font-semibold text-gray-800 mb-2">Learning Resources:</h5>
                      <div className="space-y-1">
                        {path.learning_resources.slice(0, 3).map((resource, i) => (
                          <a
                            key={i}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline flex items-center"
                          >
                            <BookOpen size={12} className="mr-1" />
                            {resource.name} ({resource.type})
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Skill Development Plan */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-bold text-green-900 mb-2">📚 Skill Development Plan</h4>
            <ol className="space-y-2">
              {insights.paths.skill_development_plan.map((skill, idx) => (
                <li key={idx} className="text-sm text-green-800 flex items-start">
                  <span className="mr-2 font-bold">{idx + 1}.</span>
                  {skill}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}

      {/* Refresh Button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={analyzeInsights}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold"
        >
          {loading ? 'Analyzing...' : 'Refresh Analysis'}
        </button>
      </div>
    </div>
  );
};

export default ResumeInsights;
