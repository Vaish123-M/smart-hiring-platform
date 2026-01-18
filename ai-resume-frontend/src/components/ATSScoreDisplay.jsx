import React from 'react';
import { Zap, TrendingUp, BarChart3 } from 'lucide-react';

export default function ATSScoreDisplay({ skills, filename, atsScore }) {
  const scoreColor = atsScore >= 8 ? 'text-green-600' : atsScore >= 6 ? 'text-yellow-600' : 'text-red-600';
  const scoreBg = atsScore >= 8 ? 'from-green-400 to-green-600' : atsScore >= 6 ? 'from-yellow-400 to-yellow-600' : 'from-red-400 to-red-600';
  const scoreRing = atsScore >= 8 ? 'text-green-200' : atsScore >= 6 ? 'text-yellow-200' : 'text-red-200';

  const skillCount = Object.keys(skills).length;
  const avgFrequency = skillCount > 0 
    ? (Object.values(skills).reduce((a, b) => a + b, 0) / skillCount).toFixed(1)
    : 0;

  const getScoreLabel = (score) => {
    if (score >= 9) return 'Excellent';
    if (score >= 8) return 'Very Good';
    if (score >= 7) return 'Good';
    if (score >= 6) return 'Fair';
    if (score >= 5) return 'Average';
    return 'Needs Improvement';
  };

  const getRecommendations = () => {
    const recs = [];
    if (skillCount < 10) recs.push('Include more relevant technical skills');
    if (avgFrequency < 2) recs.push('Mention key skills multiple times');
    if (atsScore < 7) recs.push('Add industry keywords to improve ATS compatibility');
    return recs;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Zap className="w-6 h-6 mr-2 text-yellow-500" />
              ATS Compatibility Score
            </h2>
            <p className="text-gray-600 text-sm mt-1">{filename}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Score Circle */}
          <div className="flex flex-col items-center justify-center">
            <div className={`relative w-40 h-40 flex items-center justify-center rounded-full bg-gradient-to-br ${scoreBg} shadow-lg`}>
              <div className={`absolute w-32 h-32 bg-white rounded-full flex items-center justify-center`}>
                <div className="text-center">
                  <p className={`text-5xl font-bold ${scoreColor}`}>{atsScore.toFixed(1)}</p>
                  <p className="text-xs text-gray-500 mt-1">/10</p>
                </div>
              </div>
            </div>
            <p className={`text-lg font-semibold mt-4 ${scoreColor}`}>{getScoreLabel(atsScore)}</p>
          </div>

          {/* Metrics */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
              <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Skills Found</p>
              <p className="text-3xl font-bold text-blue-900 mt-2">{skillCount}</p>
              <p className="text-xs text-blue-600 mt-1">Total unique skills detected</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
              <p className="text-sm font-semibold text-purple-700 uppercase tracking-wide">Avg Frequency</p>
              <p className="text-3xl font-bold text-purple-900 mt-2">{avgFrequency}x</p>
              <p className="text-xs text-purple-600 mt-1">Average mentions per skill</p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4">
              <p className="text-sm font-semibold text-indigo-700 uppercase tracking-wide">Top Skill</p>
              <p className="text-lg font-bold text-indigo-900 mt-2">
                {skillCount > 0 
                  ? Object.entries(skills).sort((a, b) => b[1] - a[1])[0][0]
                  : 'N/A'
                }
              </p>
              <p className="text-xs text-indigo-600 mt-1">Most mentioned skill</p>
            </div>
          </div>

          {/* Insights */}
          <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-indigo-500">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-indigo-600" />
              Recommendations
            </h3>
            <ul className="space-y-2 text-sm">
              {getRecommendations().length > 0 ? (
                getRecommendations().map((rec, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-indigo-600 font-bold mr-2">→</span>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))
              ) : (
                <li className="text-green-700 font-semibold">✓ Great resume! Excellent ATS compatibility.</li>
              )}
            </ul>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-4">Score Breakdown</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Skill Diversity</span>
                <span className="text-sm font-bold text-gray-900">{Math.min(10, skillCount / 5 * 10).toFixed(1)}/10</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(100, skillCount / 5 * 10 * 10)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Frequency Score</span>
                <span className="text-sm font-bold text-gray-900">{Math.min(10, avgFrequency / 3 * 10).toFixed(1)}/10</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(100, avgFrequency / 3 * 10 * 10)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
