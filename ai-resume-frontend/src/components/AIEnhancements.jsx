import React, { useState } from 'react';
import { Zap, BookOpen, Lightbulb, Award, FileText, MessageCircle } from 'lucide-react';

const AIEnhancements = ({ resumeText, jobDescription }) => {
  const [activeTab, setActiveTab] = useState('improvements');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchImprovements = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/ai/resume-improvements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume_text: resumeText,
          job_description: jobDescription || '',
          focus_area: 'all',
        }),
      });
      if (!response.ok) throw new Error('Failed to fetch improvements');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCoverLetter = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!jobDescription) {
        setError('Job description required for cover letter generation');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:8000/ai/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume_text: resumeText,
          job_description: jobDescription,
          company_name: 'Target Company',
          position_title: 'Position',
          tone: 'professional',
        }),
      });
      if (!response.ok) throw new Error('Failed to generate cover letter');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchInterviewPrep = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/ai/interview-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume_text: resumeText,
          job_description: jobDescription || '',
        }),
      });
      if (!response.ok) throw new Error('Failed to generate interview prep');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setData(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b overflow-x-auto">
        <button
          onClick={() => {
            handleTabChange('improvements');
            fetchImprovements();
          }}
          className={`px-4 py-2 font-semibold whitespace-nowrap ${
            activeTab === 'improvements'
              ? 'border-b-2 border-green-600 text-green-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Lightbulb className="inline mr-2 h-4 w-4" />
          Improvements
        </button>
        <button
          onClick={() => {
            handleTabChange('coverletter');
            fetchCoverLetter();
          }}
          className={`px-4 py-2 font-semibold whitespace-nowrap ${
            activeTab === 'coverletter'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FileText className="inline mr-2 h-4 w-4" />
          Cover Letter
        </button>
        <button
          onClick={() => {
            handleTabChange('interview');
            fetchInterviewPrep();
          }}
          className={`px-4 py-2 font-semibold whitespace-nowrap ${
            activeTab === 'interview'
              ? 'border-b-2 border-purple-600 text-purple-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <MessageCircle className="inline mr-2 h-4 w-4" />
          Interview Prep
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Generating AI recommendations...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Error: {error}
        </div>
      )}

      {/* Resume Improvements Tab */}
      {activeTab === 'improvements' && data && !loading && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
              <div className="text-sm text-gray-600">Improvement Score</div>
              <div className="text-3xl font-bold text-green-600 mt-1">
                {data.overall_score.toFixed(0)}%
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
              <div className="text-sm text-gray-600">Impact Level</div>
              <div className="text-2xl font-bold text-blue-600 capitalize mt-1">
                {data.estimated_impact}
              </div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-lg border border-amber-200">
              <div className="text-sm text-gray-600">Suggestions</div>
              <div className="text-2xl font-bold text-amber-600 mt-1">
                {data.suggestions.length}
              </div>
            </div>
          </div>

          {/* Top Improvements */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-bold text-green-900 mb-2">Top Improvements</h3>
            <ul className="space-y-1">
              {data.top_improvements.map((imp, i) => (
                <li key={i} className="text-sm text-green-800">
                  ✓ {imp}
                </li>
              ))}
            </ul>
          </div>

          {/* Suggestions Detail */}
          <div className="space-y-3">
            {data.suggestions.map((sugg, idx) => (
              <div key={idx} className="bg-white border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-semibold text-gray-900 capitalize">
                      {sugg.section} - Line {sugg.line_number}
                    </div>
                    <div className="text-sm text-gray-500">
                      {sugg.suggestions[0].improvement_type.replace('_', ' ')}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                      {(sugg.confidence * 100).toFixed(0)}% confidence
                    </span>
                  </div>
                </div>

                {sugg.suggestions.map((s, i) => (
                  <div key={i} className="space-y-2">
                    <div className="text-sm">
                      <p className="text-gray-600">Original:</p>
                      <p className="text-gray-900 font-mono text-xs bg-gray-50 p-2 rounded">
                        {s.original}
                      </p>
                    </div>
                    <div className="text-sm">
                      <p className="text-gray-600">Suggested:</p>
                      <p className="text-green-900 font-mono text-xs bg-green-50 p-2 rounded">
                        {s.suggested}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">💡 {s.reason}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cover Letter Tab */}
      {activeTab === 'coverletter' && data && !loading && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-bold text-blue-900 mb-2">Customization Level</h4>
              <p className="text-2xl font-bold text-blue-600">{data.customization_level}</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h4 className="font-bold text-purple-900 mb-2">Key Highlights</h4>
              <div className="space-y-1">
                {data.key_highlights.slice(0, 2).map((h, i) => (
                  <div key={i} className="text-sm text-purple-800">✓ {h}</div>
                ))}
              </div>
            </div>
          </div>

          {/* Full Cover Letter */}
          <div className="bg-white border rounded-lg p-6">
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-gray-900 text-sm leading-relaxed font-serif">
                {data.cover_letter}
              </div>
            </div>
          </div>

          {/* Copy Button */}
          <div className="flex justify-center">
            <button
              onClick={() => {
                navigator.clipboard.writeText(data.cover_letter);
                alert('Cover letter copied to clipboard!');
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
            >
              Copy to Clipboard
            </button>
          </div>
        </div>
      )}

      {/* Interview Prep Tab */}
      {activeTab === 'interview' && data && !loading && (
        <div className="space-y-4">
          {/* Key Talking Points */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-bold text-purple-900 mb-2">Key Talking Points</h4>
            <ul className="space-y-2">
              {data.key_talking_points.map((point, i) => (
                <li key={i} className="text-sm text-purple-800">
                  • {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Skills to Highlight */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-bold text-blue-900 mb-2">Skills to Highlight</h4>
            <div className="flex flex-wrap gap-2">
              {data.skills_to_highlight.map((skill, i) => (
                <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Generated Questions */}
          <div>
            <h4 className="font-bold text-gray-900 mb-3">Likely Interview Questions</h4>
            <div className="space-y-3">
              {data.questions.map((q, idx) => (
                <div key={idx} className="bg-white border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Award className="text-amber-600 flex-shrink-0 mt-1" size={18} />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{q.question}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        <p><strong>Category:</strong> {q.category}</p>
                        <p><strong>Approach:</strong> {q.suggested_approach}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Common Questions */}
          <div>
            <h4 className="font-bold text-gray-900 mb-3">Common Interview Questions</h4>
            <div className="space-y-3">
              {data.common_questions.map((q, idx) => (
                <div key={idx} className="bg-gray-50 border rounded-lg p-4">
                  <div className="font-semibold text-gray-900 mb-2">{q.question}</div>
                  <p className="text-sm text-gray-700">
                    <strong>Suggested Approach:</strong> {q.suggested_approach}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIEnhancements;
