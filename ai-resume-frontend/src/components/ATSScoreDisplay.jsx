import React from 'react';
import { Zap, BarChart3, PieChart } from 'lucide-react';
import { Tooltip } from './Tooltip';
import { CollapsibleSection } from './CollapsibleSection';

export default function ATSScoreDisplay({ skills, filename, atsScore }) {
  const scoreColor = atsScore >= 8 ? 'text-green-600' : atsScore >= 6 ? 'text-yellow-600' : 'text-red-600';
  const scoreBg = atsScore >= 8 ? 'from-green-400 to-green-600' : atsScore >= 6 ? 'from-yellow-400 to-yellow-600' : 'from-red-400 to-red-600';

  const skillCount = Object.keys(skills).length;
  const avgFrequency = skillCount > 0 
    ? (Object.values(skills).reduce((a, b) => a + b, 0) / skillCount).toFixed(1)
    : 0;

  const targetSkills = Math.max(20, skillCount);
  const skillMatchRatio = Math.min(1, skillCount / targetSkills);
  const skillMatchPercent = Math.round(skillMatchRatio * 100);
  const pieColor = atsScore >= 8 ? '#16a34a' : atsScore >= 6 ? '#f59e0b' : '#ef4444';

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
              <Tooltip text="ATS score summarizes skills, keywords, and experience relevance" icon />
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

          {/* Skill Match Pie */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center">
                <PieChart className="w-5 h-5 mr-2 text-indigo-600" />
                Skill Match
              </h3>
              <span className="text-xs text-gray-500">Target {targetSkills} skills</span>
            </div>
            <div className="flex items-center gap-4">
              <div
                className="pie-chart w-24 h-24 rounded-full shadow-inner border border-gray-200"
                style={{ '--pie-value': `${skillMatchPercent}%`, '--pie-color': pieColor }}
                role="img"
                aria-label={`Skill match ${skillMatchPercent} percent`}
              />
              <div className="flex-1">
                <p className="text-3xl font-bold text-gray-900">{skillMatchPercent}%</p>
                <p className="text-sm text-gray-600">{skillCount} matched of {targetSkills} target skills</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                  <div
                    className="h-2 rounded-full"
                    style={{ width: `${skillMatchPercent}%`, backgroundColor: pieColor }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-4">Score Breakdown</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            <Tooltip text="Skills: breadth and relevance to the role">
              <span className="px-3 py-1 text-xs font-semibold bg-indigo-50 text-indigo-700 rounded-full">Skills</span>
            </Tooltip>
            <Tooltip text="Keywords: alignment with common ATS terms">
              <span className="px-3 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 rounded-full">Keywords</span>
            </Tooltip>
            <Tooltip text="Experience: clarity, impact, and consistency">
              <span className="px-3 py-1 text-xs font-semibold bg-amber-50 text-amber-700 rounded-full">Experience</span>
            </Tooltip>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  Skill Diversity
                  <Tooltip text="Measures breadth of unique skills listed" icon />
                </span>
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
                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  Frequency Score
                  <Tooltip text="Shows how often key skills are mentioned" icon />
                </span>
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

        <div className="mt-6">
          <CollapsibleSection title="Recommendations" icon={BarChart3} defaultOpen={false}>
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
          </CollapsibleSection>
        </div>
      </div>
    </div>
  );
}
