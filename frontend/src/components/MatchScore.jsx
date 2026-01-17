import { useState } from 'react';
import axios from 'axios';

const MatchScore = ({ resumeText }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [matchPercentage, setMatchPercentage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculateMatch = async () => {
    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    // If resumeText is not provided from parent, allow user to paste it
    const resumeTextToUse = resumeText || document.getElementById('resume-text-input')?.value;

    if (!resumeTextToUse || !resumeTextToUse.trim()) {
      setError('Please upload a resume first or paste resume text');
      return;
    }

    setLoading(true);
    setError('');
    setMatchPercentage(null);

    try {
      const response = await axios.post('/match', {
        resume_text: resumeTextToUse,
        job_description: jobDescription
      });

      setMatchPercentage(response.data.match_percentage);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to calculate match score');
    } finally {
      setLoading(false);
    }
  };

  const getMatchColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    if (percentage >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getProgressBarColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-600';
    if (percentage >= 60) return 'bg-yellow-600';
    if (percentage >= 40) return 'bg-orange-600';
    return 'bg-red-600';
  };

  const getMatchLabel = (percentage) => {
    if (percentage >= 80) return 'Excellent Match';
    if (percentage >= 60) return 'Good Match';
    if (percentage >= 40) return 'Fair Match';
    return 'Poor Match';
  };

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <svg className="w-7 h-7 mr-3 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        Resume-JD Match Calculator
      </h2>

      {!resumeText && (
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Resume Text
            <span className="text-gray-500 text-sm ml-2">(or upload resume above)</span>
          </label>
          <textarea
            id="resume-text-input"
            placeholder="Paste your resume text here..."
            rows="4"
            className="textarea-field"
          />
        </div>
      )}

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Job Description *
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here...

Example:
We are looking for a Senior Software Engineer with 5+ years of experience in React, Node.js, and AWS. The ideal candidate should have strong problem-solving skills and experience with microservices architecture."
          rows="8"
          className="textarea-field"
        />
        <p className="text-xs text-gray-500 mt-2">
          {jobDescription.length} characters
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">{error}</span>
          </div>
        </div>
      )}

      <button
        onClick={calculateMatch}
        disabled={loading}
        className="btn-primary w-full flex items-center justify-center"
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Calculating Match...
          </>
        ) : (
          <>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Calculate Match Score
          </>
        )}
      </button>

      {matchPercentage !== null && (
        <div className="mt-8 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
          <div className="text-center mb-6">
            <p className="text-gray-600 text-sm mb-2">Match Score</p>
            <p className={`text-6xl font-bold ${getMatchColor(matchPercentage)}`}>
              {Math.round(matchPercentage)}%
            </p>
            <p className={`text-lg font-semibold mt-2 ${getMatchColor(matchPercentage)}`}>
              {getMatchLabel(matchPercentage)}
            </p>
          </div>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Match Percentage</span>
              <span className="font-medium">{matchPercentage.toFixed(2)}%</span>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${getProgressBarColor(matchPercentage)}`}
                style={{ width: `${matchPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg text-center border border-gray-200">
              <svg className="w-8 h-8 mx-auto mb-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-2xl font-bold text-gray-800">
                {matchPercentage >= 60 ? 'Yes' : 'No'}
              </p>
              <p className="text-xs text-gray-600 mt-1">Recommended</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg text-center border border-gray-200">
              <svg className="w-8 h-8 mx-auto mb-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <p className="text-2xl font-bold text-gray-800">
                {matchPercentage >= 80 ? 'High' : matchPercentage >= 60 ? 'Med' : 'Low'}
              </p>
              <p className="text-xs text-gray-600 mt-1">Priority</p>
            </div>
          </div>

          {matchPercentage < 60 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800">
                <strong>Tip:</strong> Consider improving resume keywords to better match the job requirements.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MatchScore;
