import { useState } from 'react';
import ResumeUpload from './components/ResumeUpload';
import SkillDisplay from './components/SkillDisplay';
import { uploadResume, extractSkillsFromResume } from './api/resumeApi';
import './index.css';

function App() {
  const [skills, setSkills] = useState(null);
  const [resumeFilename, setResumeFilename] = useState('');
  const [error, setError] = useState('');

  const handleUpload = async (file) => {
    try {
      setError('');
      setSkills(null);
      
      // Upload resume to backend
      const uploadResponse = await uploadResume(file);
      
      // Extract the resume text
      const resumeText = uploadResponse.resume_text;
      
      if (!resumeText) {
        throw new Error('Resume text not found in response');
      }

      // Extract skills from the resume text
      const skillsData = await extractSkillsFromResume(resumeText);
      
      setSkills(skillsData);
      setResumeFilename(file.name);
    } catch (err) {
      console.error('Upload error:', err);
      const errorMessage = err.response?.data?.detail || err.response?.data?.message || err.message || 'Failed to process resume';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const handleReset = () => {
    setSkills(null);
    setResumeFilename('');
    setError('');
  };

  return (
    <div className="min-h-screen py-12 px-4">
      {/* Header */}
      <header className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 mb-6 shadow-2xl">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-primary-600 to-cyan-600 bg-clip-text text-transparent">
          AI Resume Analyzer
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
          Upload your resume and let our AI extract and analyze all the skills mentioned. 
          Get instant insights into your skill profile with detailed frequency analysis.
        </p>
        <div className="mt-6 flex items-center justify-center space-x-4 text-sm">
          <div className="flex items-center text-gray-700">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Fast Analysis
          </div>
          <div className="flex items-center text-gray-700">
            <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Secure & Private
          </div>
          <div className="flex items-center text-gray-700">
            <svg className="w-5 h-5 text-purple-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            AI-Powered
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-semibold text-red-800">Error</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <ResumeUpload onUploadSuccess={handleUpload} />

        {skills && (
          <>
            <SkillDisplay skills={skills} resumeFilename={resumeFilename} />
            
            <div className="text-center mt-8">
              <button
                onClick={handleReset}
                className="inline-flex items-center px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg border-2 border-primary-600 hover:bg-primary-50 transition-all shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Analyze Another Resume
              </button>
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center mt-16 pb-8">
        <div className="inline-block bg-white rounded-xl shadow-lg px-8 py-4 border border-gray-100">
          <p className="text-gray-600 text-sm">
            Powered by <span className="font-semibold text-primary-600">FastAPI</span> & 
            <span className="font-semibold text-cyan-600"> AI Technology</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
