import { useState, useEffect } from 'react';
import axios from 'axios';

const SkillAnalytics = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSkills = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get('/analytics/top-skills');
      // Assuming response.data is an array or object with skills data
      if (Array.isArray(response.data)) {
        setSkills(response.data);
      } else if (response.data.skills) {
        setSkills(response.data.skills);
      } else {
        // Handle if it's an object with skill names as keys and counts as values
        const skillsArray = Object.entries(response.data).map(([name, count]) => ({
          skill: name,
          count: count
        }));
        setSkills(skillsArray);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch skill analytics');
      setSkills([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const getSkillColor = (index) => {
    const colors = [
      'bg-blue-100 text-blue-800 border-blue-200',
      'bg-indigo-100 text-indigo-800 border-indigo-200',
      'bg-purple-100 text-purple-800 border-purple-200',
      'bg-pink-100 text-pink-800 border-pink-200',
      'bg-green-100 text-green-800 border-green-200',
      'bg-yellow-100 text-yellow-800 border-yellow-200',
      'bg-red-100 text-red-800 border-red-200',
      'bg-cyan-100 text-cyan-800 border-cyan-200',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <svg className="w-7 h-7 mr-3 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Top Skills Analytics
        </h2>
        
        <button
          onClick={fetchSkills}
          disabled={loading}
          className="btn-secondary text-sm py-2 px-4 flex items-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </>
          )}
        </button>
      </div>

      {loading && skills.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <svg className="animate-spin h-12 w-12 text-primary-600 mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading skill data...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">{error}</span>
          </div>
        </div>
      ) : skills.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p className="text-gray-600 font-medium">No skill data available</p>
          <p className="text-gray-500 text-sm mt-2">Upload resumes to see skill analytics</p>
        </div>
      ) : (
        <div>
          <p className="text-gray-600 mb-4 text-sm">
            Most frequently appearing skills across uploaded resumes
          </p>
          
          <div className="flex flex-wrap gap-3">
            {skills.map((item, index) => {
              const skillName = item.skill || item.name || item;
              const skillCount = item.count || item.frequency || '';
              
              return (
                <div
                  key={index}
                  className={`px-4 py-2 rounded-full border font-medium text-sm transition-transform hover:scale-105 ${getSkillColor(index)}`}
                >
                  <span>{skillName}</span>
                  {skillCount && (
                    <span className="ml-2 opacity-75">
                      ({skillCount})
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary-600">{skills.length}</p>
                <p className="text-gray-600 text-sm mt-1">Total Skills</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-indigo-600">
                  {skills[0] ? (skills[0].count || skills[0].frequency || '-') : '-'}
                </p>
                <p className="text-gray-600 text-sm mt-1">Top Skill Count</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">
                  {skills.length > 0 ? Math.round(skills.reduce((acc, s) => acc + (s.count || s.frequency || 0), 0) / skills.length) : '-'}
                </p>
                <p className="text-gray-600 text-sm mt-1">Avg Frequency</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-pink-600">
                  {skills.length > 2 ? skills.length - 2 : 0}+
                </p>
                <p className="text-gray-600 text-sm mt-1">More Skills</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillAnalytics;
