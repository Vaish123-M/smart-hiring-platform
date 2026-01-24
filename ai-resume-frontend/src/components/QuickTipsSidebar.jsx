import { Lightbulb, Target, Shield } from 'lucide-react';

export const QuickTipsSidebar = () => {
  const tips = [
    {
      icon: Target,
      title: 'Keywords Matter',
      description: 'Use exact keywords from the job description in your resume for better ATS matching.'
    },
    {
      icon: Shield,
      title: 'Formatting',
      description: 'Keep your resume simple. Avoid tables, images, and special formatting that ATS systems may not read.'
    },
    {
      icon: Lightbulb,
      title: 'Quantify Results',
      description: 'Add numbers and metrics to your achievements (e.g., "Increased sales by 25%").'
    },
    {
      icon: Target,
      title: 'Match Job Description',
      description: 'Tailor your resume for each job. Use similar language and structure as the job posting.'
    },
    {
      icon: Shield,
      title: 'Use Standard Sections',
      description: 'Include standard sections: Summary, Experience, Education, Skills, Certifications.'
    },
    {
      icon: Lightbulb,
      title: 'One Page Rule',
      description: 'Keep your resume to 1-2 pages. ATS systems work better with concise, focused content.'
    },
  ];

  return (
    <aside className="bg-gradient-to-b from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-yellow-500" />
        Resume Tips
      </h3>
      
      <div className="space-y-4">
        {tips.map((tip, index) => {
          const Icon = tip.icon;
          return (
            <div key={index} className="p-3 bg-white rounded-lg border border-indigo-100 hover:shadow-md transition">
              <div className="flex items-start gap-3">
                <Icon className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-gray-800">{tip.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">{tip.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          <span className="font-semibold">💡 Pro Tip:</span> Your resume is analyzed locally and not permanently stored on our servers.
        </p>
      </div>
    </aside>
  );
};
