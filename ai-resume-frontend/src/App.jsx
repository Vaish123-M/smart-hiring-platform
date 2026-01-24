import { useState, useEffect } from 'react';
import ResumeUpload from './components/ResumeUpload';
import SkillDisplay from './components/SkillDisplay';
import ATSScoreDisplay from './components/ATSScoreDisplay';
import SkillFilterSort from './components/SkillFilterSort';
import ResumeExport from './components/ResumeExport';
import ResumeDashboard from './components/ResumeDashboard';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ResumeBuilder from './components/ResumeBuilder';
import JobMatchAnalyzer from './components/JobMatchAnalyzer';
import { ToastContainer } from './components/ToastContainer';
import { useToast } from './hooks/useToast';
import { uploadResume, extractSkillsFromResume } from './api/resumeApi';
import { Settings, Home, History, DownloadCloud, RefreshCw, Target, Moon, Sun } from 'lucide-react';
import './index.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [skills, setSkills] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [resumeFilename, setResumeFilename] = useState('');
  const [resumeId, setResumeId] = useState('');
  const [error, setError] = useState('');
  const [filteredSkills, setFilteredSkills] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [analysisDelta, setAnalysisDelta] = useState(null);
  const { toasts, removeToast, showSuccess, showError, showInfo } = useToast();

  // Persist dark mode setting
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleUpload = async (file) => {
    try {
      setError('');
      setSkills(null);
      setFilteredSkills(null);
      setIsLoading(true);
      
      // File validation
      if (!file) {
        throw new Error('No file selected');
      }
      
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size exceeds 10MB limit');
      }
      
      if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'].includes(file.type)) {
        throw new Error('Invalid file type. Please upload PDF, DOCX, DOC, or TXT file');
      }

      showInfo('Processing your resume...');
      
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

      // Save to localStorage and compute delta vs previous analysis
      const resumeHistory = JSON.parse(localStorage.getItem('resumeHistory') || '[]');
      const previousEntry = resumeHistory[0];

      const summarize = (skillsObj, text) => {
        const skillValues = skillsObj ? Object.values(skillsObj) : [];
        const skillCount = skillsObj ? Object.keys(skillsObj).length : 0;
        const totalFrequency = skillValues.reduce((a, b) => a + b, 0);
        return {
          skillCount,
          totalFrequency,
          textLength: text ? text.length : 0,
        };
      };

      const currentSummary = summarize(skillsData, resumeTextData);
      const previousSummary = previousEntry ? summarize(previousEntry.skills, previousEntry.text) : null;

      setAnalysisDelta({ current: currentSummary, previous: previousSummary });

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
      showSuccess('Resume processed successfully!');
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to process resume';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
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
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className={`${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}>
        {/* Navigation */}
        <nav className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-sm sticky top-0 z-40 border-b`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <h1 
                className={`text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition`}
                onClick={() => handleReset()}
              >
                📄 Smart Hiring Platform
              </h1>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <button
                  onClick={() => setCurrentPage('home')}
                  className={`flex items-center px-3 sm:px-4 py-2 rounded-lg transition ${
                    currentPage === 'home' 
                      ? 'bg-indigo-100 text-indigo-700 font-semibold' 
                      : darkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'
                  }`}
                  title="Home"
                >
                  <Home className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Home</span>
                </button>
                {skills && (
                  <button
                    onClick={() => setCurrentPage('analyze')}
                    className={`flex items-center px-3 sm:px-4 py-2 rounded-lg transition ${
                      currentPage === 'analyze' 
                        ? 'bg-indigo-100 text-indigo-700 font-semibold' 
                        : darkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'
                    }`}
                    title="Analyze"
                  >
                    <Settings className="w-4 h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Analyze</span>
                  </button>
                )}
                <button
                  onClick={() => setCurrentPage('builder')}
                  className={`flex items-center px-3 sm:px-4 py-2 rounded-lg transition ${
                    currentPage === 'builder' 
                      ? 'bg-indigo-100 text-indigo-700 font-semibold' 
                      : darkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'
                  }`}
                  title="Builder"
                >
                  <DownloadCloud className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Builder</span>
                </button>
                <button
                  onClick={() => setCurrentPage('jobmatch')}
                  className={`flex items-center px-3 sm:px-4 py-2 rounded-lg transition ${
                    currentPage === 'jobmatch'
                      ? 'bg-indigo-100 text-indigo-700 font-semibold'
                      : darkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'
                  }`}
                  title="Job Match"
                >
                  <Target className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Job Match</span>
                </button>
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  className={`flex items-center px-3 sm:px-4 py-2 rounded-lg transition ${
                    currentPage === 'dashboard' 
                      ? 'bg-indigo-100 text-indigo-700 font-semibold' 
                      : darkMode ? 'text-gray-300 hover:text-indigo-400' : 'text-gray-600 hover:text-indigo-600'
                  }`}
                  title="History"
                >
                  <History className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">History</span>
                </button>
                
                {/* Dark Mode Toggle */}
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`flex items-center justify-center p-2 rounded-lg transition ${
                    darkMode 
                      ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  title={darkMode ? 'Light mode' : 'Dark mode'}
                  aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${darkMode ? 'text-gray-100' : ''}`}>
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
                This resume has been analyzed successfully.
              </p>
            </div>

            {/* ATS Score Card */}
            <ATSScoreDisplay 
              skills={skills} 
              filename={resumeFilename}
              atsScore={calculateATSScore(skills)}
            />

            {/* Change Since Last Analysis */}
            {analysisDelta?.previous && (
              <div className={`rounded-lg border shadow-sm p-5 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-semibold text-indigo-600">Change since last upload</p>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Progress snapshot</h3>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Previous file retained locally
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    {
                      label: 'Skill count',
                      current: analysisDelta.current.skillCount,
                      previous: analysisDelta.previous.skillCount,
                    },
                    {
                      label: 'Total skill frequency',
                      current: analysisDelta.current.totalFrequency,
                      previous: analysisDelta.previous.totalFrequency,
                    },
                    {
                      label: 'Resume text length',
                      current: analysisDelta.current.textLength,
                      previous: analysisDelta.previous.textLength,
                    },
                  ].map((item) => {
                    const delta = item.current - item.previous;
                    const deltaColor = delta > 0 ? 'text-green-600' : delta < 0 ? 'text-red-600' : 'text-gray-500';
                    const deltaLabel = delta === 0 ? 'No change' : `${delta > 0 ? '+' : ''}${delta}`;
                    return (
                      <div key={item.label} className={`p-4 rounded-md border ${darkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
                        <p className="text-sm text-gray-500 dark:text-gray-300">{item.label}</p>
                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="text-2xl font-bold text-gray-900 dark:text-gray-50">{item.current}</span>
                          <span className={`text-sm font-semibold ${deltaColor}`}>{deltaLabel}</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Prev: {item.previous}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Skills Display */}
            <SkillDisplay skills={filteredSkills || skills} resumeFilename={resumeFilename} />

            {/* Filtering & Sorting */}
            <SkillFilterSort skills={skills} onFilterApply={handleFilterApply} />

            {/* Enhanced Analytics Dashboard */}
            <AnalyticsDashboard skills={skills} />

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
        {currentPage === 'jobmatch' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Job Match Analyzer</h2>
                <p className="text-gray-600 mt-1">Paste or upload a job description and your resume to see ATS match insights.</p>
              </div>
            </div>
            <JobMatchAnalyzer />
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
        <footer className={`${darkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-white border-t text-gray-600'} border-t mt-16`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-sm space-y-2">
              <p>Smart Hiring Platform © 2026 | Built with React & FastAPI</p>
              <p className="text-xs opacity-75">📌 Your resume is analyzed locally and not permanently stored on our servers.</p>
            </div>
          </div>
        </footer>
      </div>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default App;

