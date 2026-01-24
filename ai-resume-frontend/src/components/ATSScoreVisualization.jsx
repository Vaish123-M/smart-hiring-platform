import { TrendingUp, Target } from 'lucide-react';
import { getATSScoreColor, getATSScoreBg, getProgressBarColor } from '../utils/colorUtils';
import { Tooltip } from './Tooltip';

export const ATSScoreVisualization = ({ atsScore = 0, matchedSkills = 0, totalSkills = 0 }) => {
  const percentage = Math.round((matchedSkills / Math.max(totalSkills, 1)) * 100);
  
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Circular ATS Score */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-8 shadow-sm border border-indigo-200">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray={`${(atsScore / 100) * 339.29} 339.29`}
                className={`transition-all duration-500 ${getATSScoreColor(atsScore)}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-bold ${getATSScoreColor(atsScore)}`}>
                {Math.round(atsScore)}
              </span>
              <span className="text-xs text-gray-600 font-medium">ATS Score</span>
            </div>
          </div>

          <Tooltip text="Your resume's compatibility with Applicant Tracking Systems">
            <span className="text-sm text-gray-600 text-center">
              Powered by AI analysis
            </span>
          </Tooltip>
        </div>
      </div>

      {/* Skills Match Progress */}
      <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <Target className="w-6 h-6 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-800">Skills Match</h3>
        </div>

        <div className="space-y-4">
          {/* Skills counter */}
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-indigo-600">{matchedSkills}</span>
            <span className="text-gray-600">
              of <span className="font-semibold">{totalSkills}</span> skills matched
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className={`h-full ${getProgressBarColor(percentage)} transition-all duration-500 rounded-full`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Percentage text */}
          <div className="text-right">
            <span className="text-2xl font-bold text-indigo-600">{percentage}%</span>
            <span className="text-gray-600 ml-2">Match Rate</span>
          </div>

          {/* Performance indicator */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600">
              {percentage >= 80 && '✨ Excellent match! Your resume is well-optimized.'}
              {percentage >= 60 && percentage < 80 && '👍 Good match. Consider adding more keywords.'}
              {percentage >= 40 && percentage < 60 && '📝 Moderate match. Review suggestions below.'}
              {percentage < 40 && '⚠️ Low match. Significant improvements needed.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
