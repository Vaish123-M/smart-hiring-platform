import React, { useState, useEffect } from 'react';
import { Download, Trash2, MoreVertical, Calendar, FileText, Loader } from 'lucide-react';

export default function Dashboard({ onSelectResume, token }) {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchResumeHistory();
  }, [token]);

  const fetchResumeHistory = async () => {
    try {
      const response = await fetch(`/resume/history?authorization=Bearer ${token}`);
      if (!response.ok) throw new Error('Failed to fetch history');
      
      const data = await response.json();
      setResumes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (resumeId) => {
    try {
      const response = await fetch(`/resume/${resumeId}?authorization=Bearer ${token}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete');
      
      setResumes(resumes.filter(r => r.resume_id !== resumeId));
      setDeleteConfirm(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDownload = async (resumeId, filename) => {
    try {
      const response = await fetch(`/resume/${resumeId}`);
      if (!response.ok) throw new Error('Failed to download');
      
      const data = await response.json();
      
      // Create download link
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data.resume_text));
      element.setAttribute('download', `${filename}.txt`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (err) {
      setError(err.message);
    }
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
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Resume History</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-red-700 text-sm">
          {error}
        </div>
      )}

      {resumes.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">No resumes uploaded yet</p>
          <p className="text-gray-400 text-sm">Upload your first resume to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {resumes.map(resume => (
            <div
              key={resume.resume_id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition group"
            >
              <div className="flex-1 cursor-pointer" onClick={() => onSelectResume(resume.resume_id)}>
                <p className="font-semibold text-gray-800 group-hover:text-indigo-600 transition">
                  {resume.filename}
                </p>
                <div className="flex items-center text-sm text-gray-500 mt-1 space-x-4">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(resume.created_at).toLocaleDateString()}
                  </span>
                  <span>{resume.text_length} characters</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={() => handleDownload(resume.resume_id, resume.filename)}
                  className="p-2 hover:bg-blue-100 rounded-lg transition text-blue-600"
                  title="Download"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setDeleteConfirm(resume.resume_id)}
                  className="p-2 hover:bg-red-100 rounded-lg transition text-red-600"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {deleteConfirm === resume.resume_id && (
                <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg p-3 z-10">
                  <p className="text-sm text-gray-700 mb-2">Confirm delete?</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDelete(resume.resume_id)}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-3 py-1 bg-gray-300 text-gray-800 rounded text-sm hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
