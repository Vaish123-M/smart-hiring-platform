const SkillDisplay = ({ skills, resumeFilename }) => {
  if (!skills || Object.keys(skills).length === 0) {
    return null;
  }

  const skillsArray = Object.entries(skills).sort((a, b) => b[1] - a[1]);
  const maxCount = Math.max(...skillsArray.map(([, count]) => count));

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-cyan-600 rounded-t-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">Analysis Complete! 🎉</h2>
            <p className="text-primary-100">Resume: <span className="font-semibold">{resumeFilename}</span></p>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-xl px-6 py-3 text-center">
            <p className="text-3xl font-bold">{skillsArray.length}</p>
            <p className="text-sm text-primary-100">Skills Found</p>
          </div>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="bg-white rounded-b-2xl shadow-xl p-8 border-x border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
          <svg className="w-5 h-5 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
          Extracted Skills with Frequency
        </h3>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {skillsArray.map(([skill, count], index) => {
            const percentage = (count / maxCount) * 100;
            const colors = [
              'from-blue-500 to-blue-600',
              'from-purple-500 to-purple-600',
              'from-pink-500 to-pink-600',
              'from-indigo-500 to-indigo-600',
              'from-cyan-500 to-cyan-600',
              'from-teal-500 to-teal-600',
            ];
            const colorClass = colors[index % colors.length];

            return (
              <div
                key={skill}
                className="group relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-primary-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800 text-base capitalize">
                    {skill}
                  </h4>
                  <span className={`px-3 py-1 rounded-full text-white text-sm font-bold bg-gradient-to-r ${colorClass} shadow-md`}>
                    {count}
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${colorClass} transition-all duration-500 ease-out`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                
                <p className="text-xs text-gray-500 mt-2">
                  {percentage.toFixed(0)}% of max frequency
                </p>
              </div>
            );
          })}
        </div>

        {/* Summary Stats */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <p className="text-3xl font-bold text-blue-600">{skillsArray.length}</p>
              <p className="text-sm text-gray-700 mt-1">Total Skills</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
              <p className="text-3xl font-bold text-purple-600">{maxCount}</p>
              <p className="text-sm text-gray-700 mt-1">Max Count</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl">
              <p className="text-3xl font-bold text-pink-600">
                {Math.round(skillsArray.reduce((acc, [, count]) => acc + count, 0) / skillsArray.length)}
              </p>
              <p className="text-sm text-gray-700 mt-1">Avg Count</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-xl">
              <p className="text-3xl font-bold text-cyan-600">
                {skillsArray[0][0].toUpperCase()}
              </p>
              <p className="text-sm text-gray-700 mt-1">Top Skill</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillDisplay;
