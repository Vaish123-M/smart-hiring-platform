import { useState, useEffect } from 'react';
import ResumeUpload from './components/ResumeUpload';
import SkillDisplay from './components/SkillDisplay';
import ATSScoreDisplay from './components/ATSScoreDisplay';
import SkillFilterSort from './components/SkillFilterSort';
import ResumeExport from './components/ResumeExport';
import ResumeDashboard from './components/ResumeDashboard';
import { uploadResume, extractSkillsFromResume } from './api/resumeApi';
import { Settings, Home, History, DownloadCloud, RefreshCw } from 'lucide-react';
import './index.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [skills, setSkills] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [resumeFilename, setResumeFilename] = useState('');
  const [resumeId, setResumeId] = useState('');
  const [error, setError] = useState('');
  const [filteredSkills, setFilteredSkills] = useState(null);

  const handleUpload = async (file) => {
    try {
      setError('');
      setSkills(null);
      setFilteredSkills(null);
      
      const uploadResponse = await uploadResume(file);
      const resumeTextData = uploadResponse.resume_text;
      
      if (!resumeTextData) {
        throw new Error('Resume text not found in response');
      }

      setResumeText(resumeTextData);
      setResumeFilename(uploadResponse.filename);
      setResumeId(uploadResponse.resume_id);

      const skillsData = await extractSkillsFromResume(resumeTextData);
      setSkills(skillsData);
      setFilteredSkills(skillsData);

      // Save to localStorage
      const resumeHistory = JSON.parse(localStorage.getItem('resumeHistory') || '[]');
      resumeHistory.unshift({
        id: uploadResponse.resume_id,
        filename: uploadResponse.filename,
        text: resumeTextData,
        skills: skillsData,
        uploadedAt: new Date().toISOString(),
        atsScore: calculateATSScore(skillsData)
      });
      localStorage.setItem('resumeHistory', JSON.stringify(resumeHistory.slice(0, 20)));

      setCurrentPage('analyze');
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to process resume';
      setError(errorMessage);
    }
  };

  const calculateATSScore = (skillsData) => {
    if (!skillsData || typeof skillsData !== 'object') return 0;
    const skillCount = Object.keys(skillsData).length;
    const avgFreq = skillCount > 0 
      ? Object.values(skillsData).reduce((a, b) => a + b, 0) / skillCount 
      : 0;
    return Math.min(10, (skillCount / 5 + avgFreq / 3) * 3);
  };

  const handleSelectResume = (resume) => {
    setResumeText(resume.text);
    setResumeFilename(resume.filename);
    setResumeId(resume.id);
    setSkills(resume.skills);
    setFilteredSkills(resume.skills);
    setCurrentPage('analyze');
  };

  const handleFilterApply = (filtered) => {
    setFilteredSkills(filtered);
  };

  const handleReset = () => {
    setSkills(null);
    setFilteredSkills(null);
    setResumeText('');
    setResumeFilename('');
    setResumeId('');
    setError('');
    setCurrentPage('home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 
              className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition"
              onClick={() => handleReset()}
            >
              📄 Smart Hiring Platform
            </h1>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setCurrentPage('home')}
                className={`flex items-center px-4 py-2 rounded-lg transition ${
                  currentPage === 'home' 
                    ? 'bg-indigo-100 text-indigo-700 font-semibold' 
                    : 'text-gray-600 hover:text-indigo-600'
                }`}
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </button>
              {skills && (
                <button
                  onClick={() => setCurrentPage('analyze')}
                  className={`flex items-center px-4 py-2 rounded-lg transition ${
                    currentPage === 'analyze' 
                      ? 'bg-indigo-100 text-indigo-700 font-semibold' 
                      : 'text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Analyze
                </button>
              )}
              <button
                onClick={() => setCurrentPage('dashboard')}
                className={`flex items-center px-4 py-2 rounded-lg transition ${
                  currentPage === 'dashboard' 
                    ? 'bg-indigo-100 text-indigo-700 font-semibold' 
                    : 'text-gray-600 hover:text-indigo-600'
                }`}
              >
                <History className="w-4 h-4 mr-2" />
                History
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start">
            <span className="mr-3">⚠️</span>
            <div>
              <p className="font-semibold">Error</p>
              <p>{error}</p>
            </div>
          </div>
        )}

        {/* Home Page */}
        {currentPage === 'home' && (
          <>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Smart Hiring</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Upload your resume to extract skills, calculate ATS score, and get insights instantly.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="font-semibold text-gray-800 mb-2">Skill Analysis</h3>
                <p className="text-sm text-gray-600">Extract and analyze skills with frequency counts</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="font-semibold text-gray-800 mb-2">ATS Scoring</h3>
                <p className="text-sm text-gray-600">Get your ATS compatibility score</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition">
                <div className="text-4xl mb-4">📥</div>
                <h3 className="font-semibold text-gray-800 mb-2">Export Results</h3>
                <p className="text-sm text-gray-600">Download your analysis as PDF or JSON</p>
              </div>
            </div>

            <ResumeUpload onUploadSuccess={handleUpload} />
          </>
        )}

        {/* Analyze Page */}
        {currentPage === 'analyze' && skills && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Analysis Results</h2>
                <p className="text-gray-600 mt-1">{resumeFilename}</p>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                New Resume
              </button>
            </div>

            {/* ATS Score Card */}
            <ATSScoreDisplay 
              skills={skills} 
              filename={resumeFilename}
              atsScore={calculateATSScore(skills)}
            />

            {/* Skills Display */}
            <SkillDisplay skills={filteredSkills || skills} resumeFilename={resumeFilename} />

            {/* Filtering & Sorting */}
            <SkillFilterSort skills={skills} onFilterApply={handleFilterApply} />

            {/* Job Description Matcher */}
            <div className="mt-8">
              <JobMatcher resumeText={resumeText} />
            </div>

            {/* Export */}
            <ResumeExport 
              filename={resumeFilename}
              skills={skills}
              resumeText={resumeText}
              atsScore={calculateATSScore(skills)}
            />
          </div>
        )}

        {/* Dashboard Page */}
        {currentPage === 'dashboard' && (
          <ResumeDashboard onSelectResume={handleSelectResume} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-gray-600 text-sm">
          Smart Hiring Platform © 2024 | Built with React & FastAPI
        </div>
      </footer>
    </div>
  );
}

export default App;

