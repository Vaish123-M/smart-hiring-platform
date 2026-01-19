import { useState, useEffect } from 'react';
import ResumeUpload from './components/ResumeUpload';
import SkillDisplay from './components/SkillDisplay';
import ATSScoreDisplay from './components/ATSScoreDisplay';
import SkillFilterSort from './components/SkillFilterSort';
import ResumeExport from './components/ResumeExport';
import ResumeDashboard from './components/ResumeDashboard';
import JobMatcher from './components/JobMatcher';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ResumeBuilder from './components/ResumeBuilder';
import ResumeInsights from './components/ResumeInsights';
import AIEnhancements from './components/AIEnhancements';
import ResumeComparison from './components/ResumeComparison';
import { uploadResume, extractSkillsFromResume } from './api/resumeApi';
import { Settings, Home, History, DownloadCloud, RefreshCw, BookOpen, Lightbulb, Wand2, GitCompare } from 'lucide-react';
import './index.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [skills, setSkills] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [resumeFilename, setResumeFilename] = useState('');
  const [resumeId, setResumeId] = useState('');
  const [error, setError] = useState('');
  const [filteredSkills, setFilteredSkills] = useState(null);
  const [showJDMatcher, setShowJDMatcher] = useState(false);

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
                onClick={() => setCurrentPage('builder')}
                className={`flex items-center px-4 py-2 rounded-lg transition ${
                  currentPage === 'builder' 
                    ? 'bg-indigo-100 text-indigo-700 font-semibold' 
                    : 'text-gray-600 hover:text-indigo-600'
                }`}
              >
                <DownloadCloud className="w-4 h-4 mr-2" />
                Builder
              </button>
              {skills && (
                <button
                  onClick={() => setCurrentPage('insights')}
                  className={`flex items-center px-4 py-2 rounded-lg transition ${
                    currentPage === 'insights' 
                      ? 'bg-indigo-100 text-indigo-700 font-semibold' 
                      : 'text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Insights
                </button>
              )}
              {skills && (
                <button
                  onClick={() => setCurrentPage('ai')}
                  className={`flex items-center px-4 py-2 rounded-lg transition ${
                    currentPage === 'ai'
                      ? 'bg-indigo-100 text-indigo-700 font-semibold'
                      : 'text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  AI Tools
                </button>
              )}
              <button
                onClick={() => setCurrentPage('compare')}
                className={`flex items-center px-4 py-2 rounded-lg transition ${
                  currentPage === 'compare'
                    ? 'bg-indigo-100 text-indigo-700 font-semibold'
                    : 'text-gray-600 hover:text-indigo-600'
                }`}
              >
                <GitCompare className="w-4 h-4 mr-2" />
                Compare
              </button>
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
              <a
                href="http://localhost:8000/swagger"
                target="_blank"
                rel="noreferrer"
                className="flex items-center px-4 py-2 rounded-lg transition text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                API Docs
              </a>
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

            {/* Optional JD-based ATS toggle */}
            <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-600">
                Default analysis shows general ATS compatibility. Enable Job Description mode to match against a specific JD.
              </p>
              <button
                onClick={() => setShowJDMatcher((v) => !v)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${showJDMatcher ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {showJDMatcher ? 'Disable JD Mode' : 'Use Job Description'}
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

            {/* Enhanced Analytics Dashboard */}
            <AnalyticsDashboard skills={skills} />

            {/* Job Description Matcher */}
            {showJDMatcher && (
              <div className="mt-8">
                <JobMatcher resumeText={resumeText} />
              </div>
            )}
            {/* Export */}
            <ResumeExport 
              filename={resumeFilename}
              skills={skills}
              resumeText={resumeText}
              atsScore={calculateATSScore(skills)}
            />
          </div>
        )}

        {/* Insights Page */}
        {currentPage === 'insights' && resumeText && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Resume Insights</h2>
                <p className="text-gray-600 mt-1">Get keyword gaps, job role matching, and career path suggestions</p>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-blue-800">
                💡 <strong>Tip:</strong> Use the JobMatcher in the Analyze tab to compare against a specific job description for better insights.
              </p>
            </div>
            <ResumeInsights 
              resumeText={resumeText}
              jobDescription={showJDMatcher ? '' : ''}
            />
          </div>
        )}

        {/* AI Enhancements Page */}
        {currentPage === 'ai' && resumeText && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">AI-Powered Tools</h2>
                <p className="text-gray-600 mt-1">Get improvement suggestions, generate cover letters, and prepare for interviews</p>
              </div>
            </div>
            <AIEnhancements
              resumeText={resumeText}
              jobDescription={showJDMatcher ? '' : ''}
            />
          </div>
        )}

        {/* Resume Comparison Page */}
        {currentPage === 'compare' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Resume Comparison</h2>
              <p className="text-gray-600 mt-1">Compare two resumes side-by-side to identify strengths and weaknesses</p>
            </div>
            <ResumeComparison />
          </div>
        )}

        {/* Builder Page */}
        {currentPage === 'builder' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Resume Builder</h2>
                <p className="text-gray-600 mt-1">Create an ATS-friendly resume, export to TXT/JSON.</p>
              </div>
            </div>
            <ResumeBuilder />
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

