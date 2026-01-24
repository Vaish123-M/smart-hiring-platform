// Color coding utilities for skills and recommendations

export const getSkillColor = (status) => {
  switch(status) {
    case 'matched':
      return { bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-800', dot: 'bg-green-500' };
    case 'missing':
      return { bg: 'bg-red-100', border: 'border-red-300', text: 'text-red-800', dot: 'bg-red-500' };
    case 'suggested':
      return { bg: 'bg-yellow-100', border: 'border-yellow-300', text: 'text-yellow-800', dot: 'bg-yellow-500' };
    default:
      return { bg: 'bg-gray-100', border: 'border-gray-300', text: 'text-gray-800', dot: 'bg-gray-500' };
  }
};

export const getATSScoreColor = (score) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-blue-600';
  if (score >= 40) return 'text-yellow-600';
  return 'text-red-600';
};

export const getATSScoreBg = (score) => {
  if (score >= 80) return 'from-green-400 to-emerald-600';
  if (score >= 60) return 'from-blue-400 to-blue-600';
  if (score >= 40) return 'from-yellow-400 to-orange-600';
  return 'from-red-400 to-red-600';
};

export const getProgressBarColor = (percentage) => {
  if (percentage >= 80) return 'bg-green-500';
  if (percentage >= 60) return 'bg-blue-500';
  if (percentage >= 40) return 'bg-yellow-500';
  return 'bg-red-500';
};
