import { CheckCircle, XCircle, Lightbulb } from 'lucide-react';
import { getSkillColor } from '../utils/colorUtils';
import { Tooltip } from './Tooltip';

export const SkillsVisualization = ({ matchedSkills = [], missingSkills = [], suggestedSkills = [] }) => {
  const SkillTag = ({ skill, status }) => {
    const colors = getSkillColor(status);
    const icons = {
      matched: <CheckCircle className="w-3 h-3" />,
      missing: <XCircle className="w-3 h-3" />,
      suggested: <Lightbulb className="w-3 h-3" />,
    };

    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${colors.bg} border ${colors.border} transition hover:shadow-md`}>
        <span className="text-xs font-medium">{icons[status]}</span>
        <Tooltip text={`${status.charAt(0).toUpperCase() + status.slice(1)} skill`} position="top">
          <span className={`text-sm font-medium ${colors.text}`}>{skill}</span>
        </Tooltip>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Matched Skills */}
      {matchedSkills.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <h4 className="font-semibold text-gray-800">Matched Skills ({matchedSkills.length})</h4>
            <Tooltip text="Skills found in your resume that match job requirements">
              <span className="text-xs text-gray-400">ℹ️</span>
            </Tooltip>
          </div>
          <div className="flex flex-wrap gap-2">
            {matchedSkills.map(skill => (
              <SkillTag key={skill} skill={skill} status="matched" />
            ))}
          </div>
        </div>
      )}

      {/* Missing Skills */}
      {missingSkills.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <h4 className="font-semibold text-gray-800">Missing Skills ({missingSkills.length})</h4>
            <Tooltip text="Skills mentioned in the job description but not in your resume">
              <span className="text-xs text-gray-400">ℹ️</span>
            </Tooltip>
          </div>
          <div className="flex flex-wrap gap-2">
            {missingSkills.map(skill => (
              <SkillTag key={skill} skill={skill} status="missing" />
            ))}
          </div>
        </div>
      )}

      {/* Suggested Skills */}
      {suggestedSkills.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <h4 className="font-semibold text-gray-800">Suggested Skills ({suggestedSkills.length})</h4>
            <Tooltip text="Skills that could strengthen your resume in this industry">
              <span className="text-xs text-gray-400">ℹ️</span>
            </Tooltip>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestedSkills.map(skill => (
              <SkillTag key={skill} skill={skill} status="suggested" />
            ))}
          </div>
        </div>
      )}

      {matchedSkills.length === 0 && missingSkills.length === 0 && suggestedSkills.length === 0 && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center text-gray-600">
          <p className="text-sm">No skills analyzed yet. Upload a resume to get started.</p>
        </div>
      )}
    </div>
  );
};
