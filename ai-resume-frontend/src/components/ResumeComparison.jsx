import React, { useState } from 'react';
import { Loader, AlertCircle, Plus, X, BarChart3, Target, Trophy } from 'lucide-react';

export default function ResumeComparison() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleAddResume = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('http://localhost:8000/resume/upload', {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) throw new Error('Upload failed');
        
        const data = await response.json();
        setResumes([...resumes, {
          id: data.resume_id,
          filename: data.filename,
          text: data.resume_text
        }]);
        setError('');
      } catch (err) {
        setError(err.message);
      }
    };
    input.click();
  };

  const handleRemove = (id) => {
    setResumes(resumes.filter(r => r.id !== id));
  };

  const handleCompare = async () => {
    if (resumes.length < 2) {
      setError('Please upload at least 2 resumes to compare');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/analytics-advanced/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume1_text: resumes[0].text,
          resume2_text: resumes[1].text,
          job_description: null
        })
      });

      if (!response.ok) throw new Error('Comparison failed');
      
      const data = await response.json();
      setResult({ ...data, resumes });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center">
        <BarChart3 className="w-6 h-6 mr-2 text-indigo-600" />
        Compare Resumes
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      {/* Resume Upload Section */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-800">
          Resumes to Compare ({resumes.length})
        </h3>

        <div className="space-y-2">
          {resumes.map((resume, idx) => (
            <div
              key={resume.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <span className="text-sm font-medium text-gray-800">
                Resume {idx + 1}: {resume.filename}
              </span>
              <button
                onClick={() => handleRemove(resume.id)}
                className="p-1 hover:bg-red-100 rounded transition text-red-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleAddResume}
          className="w-full border-2 border-dashed border-indigo-300 rounded-lg p-3 text-indigo-600 font-semibold hover:bg-indigo-50 transition flex items-center justify-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Resume
        </button>
      </div>

      {resumes.length >= 2 && (
        <button
          onClick={handleCompare}
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 flex items-center justify-center"
        >
          {loading && <Loader className="w-5 h-5 animate-spin mr-2" />}
          {loading ? 'Analyzing...' : 'Compare Resumes'}
        </button>
      )}

      {/* Comparison Results */}
      {result && (
        <div className="space-y-6 border-t pt-6">
          {/* Overall Scores */}
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-6 rounded-lg border-2 ${result.overall_winner === 'resume1' ? 'bg-green-50 border-green-500' : 'bg-gray-50 border-gray-300'}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-900">Resume 1</h3>
                {result.overall_winner === 'resume1' && <Trophy className="text-green-600" size={24} />}
              </div>
              <div className="text-3xl font-bold text-gray-800">{result.resume1_overall_score.toFixed(1)}</div>
              <div className="text-sm text-gray-600">{resumes[0]?.filename}</div>
            </div>
            <div className={`p-6 rounded-lg border-2 ${result.overall_winner === 'resume2' ? 'bg-green-50 border-green-500' : 'bg-gray-50 border-gray-300'}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-900">Resume 2</h3>
                {result.overall_winner === 'resume2' && <Trophy className="text-green-600" size={24} />}
              </div>
              <div className="text-3xl font-bold text-gray-800">{result.resume2_overall_score.toFixed(1)}</div>
              <div className="text-sm text-gray-600">{resumes[1]?.filename}</div>
            </div>
          </div>

          {/* Detailed Comparisons */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Detailed Comparison</h3>
            <div className="space-y-3">
              {result.comparisons.map((comp, idx) => (
                <div key={idx} className="bg-white border rounded-lg p-4">
                  <div className="font-semibold text-gray-900 mb-2 capitalize">
                    {comp.aspect.replace('_', ' ')}
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-2">
                    <div className={`p-3 rounded ${comp.winner === 'resume1' ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-100'}`}>
                      <div className="text-sm text-gray-600">Resume 1</div>
                      <div className="text-2xl font-bold text-gray-900">{comp.resume1_score.toFixed(1)}</div>
                    </div>
                    <div className={`p-3 rounded ${comp.winner === 'resume2' ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-100'}`}>
                      <div className="text-sm text-gray-600">Resume 2</div>
                      <div className="text-2xl font-bold text-gray-900">{comp.resume2_score.toFixed(1)}</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{comp.explanation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-bold text-blue-900 mb-2">Recommendations</h3>
            <ul className="space-y-1">
              {result.recommendations.map((rec, idx) => (
                <li key={idx} className="text-sm text-blue-800">✓ {rec}</li>
              ))}
            </ul>
          </div>
                      <span className="text-sm text-green-600">Found in {Object.values(counts).filter(c => c > 0).length} resumes</span>
                    </div>
                    <div className="grid grid-cols-{result.resumes.length} gap-2">
                      {result.resumes.map((_, idx) => (
                        <div key={idx} className="text-center text-sm">
                          <p className="text-gray-600">Resume {idx + 1}</p>
                          <p className={`font-bold ${counts[`resume_${idx}`] > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                            ×{counts[`resume_${idx}`]}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Unique Skills */}
          {Object.keys(result.unique_skills).length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Unique Skills ({Object.keys(result.unique_skills).length})
              </h3>
              <div className="space-y-2">
                {Object.entries(result.unique_skills).slice(0, 10).map(([skill, counts]) => {
                  const resumeIdx = Object.entries(counts).find(([_, c]) => c > 0)[0].split('_')[1];
                  return (
                    <div key={skill} className="p-3 bg-orange-50 rounded-lg">
                      <p className="font-medium text-orange-800">
                        {skill}
                        <span className="text-sm text-orange-600 ml-2">
                          Only in Resume {parseInt(resumeIdx) + 1}
                        </span>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Summary:</strong> {result.resumes.length} resumes compared. 
              {Object.keys(result.common_skills).length} skills in common, 
              {Object.keys(result.unique_skills).length} unique skills total.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
