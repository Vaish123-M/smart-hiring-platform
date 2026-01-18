import React, { useState, useEffect } from 'react';
import { Trash2, Download, Calendar, BarChart3, Loader, Star } from 'lucide-react';

export default function ResumeDashboard({ onSelectResume }) {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('resumeHistory') || '[]');
    setResumes(history);
    setLoading(false);
  }, []);

  const handleDelete = (index) => {
    const updated = resumes.filter((_, i) => i !== index);
    setResumes(updated);
    localStorage.setItem('resumeHistory', JSON.stringify(updated));
  };

  const handleDownload = (resume) => {
    const data = {
      filename: resume.filename,
      atsScore: resume.atsScore,
      skills: resume.skills,
      uploadedAt: resume.uploadedAt,
      skillCount: Object.keys(resume.skills).length
    };

    const element = document.createElement('a');
    element.setAttribute(
      'href',
      `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`
    );
    element.setAttribute('download', `${resume.filename}-analysis.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreBadge = (score) => {
    if (score >= 8) return 'bg-green-100 text-green-800';
    if (score >= 6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getScoreLabel = (score) => {
    if (score >= 8) return 'Excellent';
    if (score >= 6) return 'Fair';
    return 'Needs Work';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center">
        <BarChart3 className="w-6 h-6 mr-2 text-indigo-600" />
        Resume History
      </h2>
      <p className="text-gray-600 text-sm mb-6">Manage and review your uploaded resumes</p>

      {resumes.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <BarChart3 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg font-semibold">No resumes yet</p>
          <p className="text-gray-400 text-sm">Upload your first resume to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {resumes.map((resume, index) => (
            <div
              key={index}
              className="group border border-gray-200 rounded-lg p-4 hover:shadow-md transition hover:border-indigo-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 cursor-pointer" onClick={() => onSelectResume(resume)}>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition">
                      {resume.filename}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getScoreBadge(resume.atsScore)}`}>
                      ATS: {resume.atsScore.toFixed(1)}/10
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(resume.uploadedAt)}
                    </span>
                    <span className="flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      {Object.keys(resume.skills).length} skills
                    </span>
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">
                      {getScoreLabel(resume.atsScore)}
                    </span>
                  </div>

                  {/* Top Skills Preview */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {Object.entries(resume.skills)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 5)
                      .map(([skill]) => (
                        <span key={skill} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                    {Object.keys(resume.skills).length > 5 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                        +{Object.keys(resume.skills).length - 5}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                  <button
                    onClick={() => handleDownload(resume)}
                    className="p-2 hover:bg-blue-100 rounded-lg transition text-blue-600"
                    title="Download"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="p-2 hover:bg-red-100 rounded-lg transition text-red-600"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      {resumes.length > 0 && (
        <div className="mt-8 pt-6 border-t grid md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-sm text-blue-600 font-semibold uppercase">Total Resumes</p>
            <p className="text-3xl font-bold text-blue-700 mt-2">{resumes.length}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <p className="text-sm text-green-600 font-semibold uppercase">Avg ATS Score</p>
            <p className="text-3xl font-bold text-green-700 mt-2">
              {(resumes.reduce((sum, r) => sum + r.atsScore, 0) / resumes.length).toFixed(1)}
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <p className="text-sm text-purple-600 font-semibold uppercase">Total Skills</p>
            <p className="text-3xl font-bold text-purple-700 mt-2">
              {resumes.reduce((sum, r) => sum + Object.keys(r.skills).length, 0)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
