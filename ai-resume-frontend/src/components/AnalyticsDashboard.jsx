import { useEffect, useMemo, useState } from 'react';
import { BarChart3, Activity, Clock, TrendingUp, History } from 'lucide-react';

const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

export default function AnalyticsDashboard({ skills }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('resumeHistory') || '[]');
      setHistory(stored.slice(0, 8));
    } catch (e) {
      setHistory([]);
    }
  }, []);

  const topSkills = useMemo(() => {
    if (!skills) return [];
    return Object.entries(skills)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, count]) => ({ name, count }));
  }, [skills]);

  const totals = useMemo(() => {
    if (!skills) return { unique: 0, avg: 0 };
    const entries = Object.entries(skills);
    const unique = entries.length;
    const avg = unique ? entries.reduce((sum, [, c]) => sum + c, 0) / unique : 0;
    return { unique, avg: avg.toFixed(1) };
  }, [skills]);

  const atsTrend = useMemo(() => {
    return history.map((item) => ({
      label: new Date(item.uploadedAt).toLocaleDateString(),
      score: clamp(item.atsScore || 0, 0, 10),
      filename: item.filename,
    }));
  }, [history]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-indigo-600" />
          <h3 className="text-xl font-bold text-gray-800">Analytics Dashboard</h3>
        </div>
        <p className="text-sm text-gray-500">Quick insights for this resume</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
          <p className="text-sm text-blue-700">Unique Skills</p>
          <p className="text-3xl font-bold text-blue-900">{totals.unique}</p>
        </div>
        <div className="p-4 rounded-lg bg-purple-50 border border-purple-100">
          <p className="text-sm text-purple-700">Avg Mentions / Skill</p>
          <p className="text-3xl font-bold text-purple-900">{totals.avg}x</p>
        </div>
        <div className="p-4 rounded-lg bg-green-50 border border-green-100">
          <p className="text-sm text-green-700">Recency</p>
          <p className="text-3xl font-bold text-green-900 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            {history.length > 0 ? 'History On' : 'Current Only'}
          </p>
        </div>
      </div>

      {/* Top skills chart */}
      <div>
        <div className="flex items-center mb-3 text-gray-800 font-semibold">
          <Activity className="w-4 h-4 mr-2 text-indigo-600" /> Top Skills (by frequency)
        </div>
        {topSkills.length === 0 ? (
          <p className="text-sm text-gray-500">No skills detected yet.</p>
        ) : (
          <div className="space-y-2">
            {topSkills.map((skill) => (
              <div key={skill.name}>
                <div className="flex justify-between text-sm text-gray-700 mb-1">
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-gray-500">{skill.count}x</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${clamp(skill.count * 10, 8, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ATS trend (local history) */}
      <div>
        <div className="flex items-center mb-3 text-gray-800 font-semibold">
          <TrendingUp className="w-4 h-4 mr-2 text-green-600" /> ATS Trend (last uploads)
        </div>
        {atsTrend.length === 0 ? (
          <p className="text-sm text-gray-500">Upload resumes to see ATS trends.</p>
        ) : (
          <div className="space-y-3">
            {atsTrend.map((item, idx) => (
              <div key={`${item.label}-${idx}`} className="flex items-center justify-between">
                <div className="text-sm text-gray-700 truncate pr-3">
                  <span className="font-semibold text-gray-900">{item.score.toFixed(1)}/10</span> — {item.filename}
                </div>
                <div className="flex-1 max-w-xs">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${item.score * 10}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">{item.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
