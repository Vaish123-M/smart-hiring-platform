import React, { useState } from 'react';
import { Download, FileJson, FileText, Copy, Check } from 'lucide-react';

export default function ResumeExport({ filename, skills, resumeText, atsScore }) {
  const [copied, setCopied] = useState(false);

  const exportAsJSON = () => {
    const data = {
      filename,
      atsScore,
      skills,
      exportedAt: new Date().toISOString(),
      skillCount: Object.keys(skills).length,
      skillSummary: Object.entries(skills)
        .sort((a, b) => b[1] - a[1])
        .map(([skill, count]) => ({ skill, count }))
    };

    const jsonString = JSON.stringify(data, null, 2);
    downloadFile(jsonString, `${filename}-analysis.json`, 'application/json');
  };

  const exportAsCSV = () => {
    let csv = 'Skill,Frequency\n';
    Object.entries(skills)
      .sort((a, b) => b[1] - a[1])
      .forEach(([skill, count]) => {
        csv += `"${skill}",${count}\n`;
      });

    downloadFile(csv, `${filename}-skills.csv`, 'text/csv');
  };

  const exportAsText = () => {
    let text = `Resume Analysis Report\n`;
    text += `=======================\n`;
    text += `Filename: ${filename}\n`;
    text += `ATS Score: ${atsScore.toFixed(1)}/10\n`;
    text += `Exported: ${new Date().toLocaleString()}\n\n`;
    text += `Skills Found (${Object.keys(skills).length} total):\n`;
    text += `-`.repeat(40) + '\n';
    
    Object.entries(skills)
      .sort((a, b) => b[1] - a[1])
      .forEach(([skill, count]) => {
        text += `${skill.padEnd(30)} ${count}x\n`;
      });

    downloadFile(text, `${filename}-analysis.txt`, 'text/plain');
  };

  const downloadFile = (content, filename, type) => {
    const element = document.createElement('a');
    element.setAttribute('href', `data:${type};charset=utf-8,${encodeURIComponent(content)}`);
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const copyToClipboard = async () => {
    const skillsList = Object.entries(skills)
      .sort((a, b) => b[1] - a[1])
      .map(([skill]) => skill)
      .join(', ');

    await navigator.clipboard.writeText(skillsList);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <Download className="w-6 h-6 mr-2 text-indigo-600" />
        Export & Share
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Export Options */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800 mb-4">Download Analysis</h3>
          
          <button
            onClick={exportAsJSON}
            className="w-full flex items-center justify-between p-4 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition group"
          >
            <div className="flex items-center">
              <FileJson className="w-5 h-5 text-indigo-600 mr-3" />
              <div className="text-left">
                <p className="font-semibold text-gray-800 group-hover:text-indigo-700">JSON Format</p>
                <p className="text-xs text-gray-600">Structured data with all details</p>
              </div>
            </div>
            <span className="text-indigo-600">→</span>
          </button>

          <button
            onClick={exportAsCSV}
            className="w-full flex items-center justify-between p-4 border border-green-200 rounded-lg hover:bg-green-50 transition group"
          >
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-green-600 mr-3" />
              <div className="text-left">
                <p className="font-semibold text-gray-800 group-hover:text-green-700">CSV Format</p>
                <p className="text-xs text-gray-600">Import into Excel or Sheets</p>
              </div>
            </div>
            <span className="text-green-600">→</span>
          </button>

          <button
            onClick={exportAsText}
            className="w-full flex items-center justify-between p-4 border border-purple-200 rounded-lg hover:bg-purple-50 transition group"
          >
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-purple-600 mr-3" />
              <div className="text-left">
                <p className="font-semibold text-gray-800 group-hover:text-purple-700">Text Report</p>
                <p className="text-xs text-gray-600">Human-readable format</p>
              </div>
            </div>
            <span className="text-purple-600">→</span>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>

          <button
            onClick={copyToClipboard}
            className="w-full flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition group"
          >
            <div className="flex items-center">
              {copied ? (
                <Check className="w-5 h-5 text-green-600 mr-3" />
              ) : (
                <Copy className="w-5 h-5 text-gray-600 mr-3" />
              )}
              <div className="text-left">
                <p className="font-semibold text-gray-800 group-hover:text-gray-900">
                  {copied ? 'Copied!' : 'Copy Skills List'}
                </p>
                <p className="text-xs text-gray-600">All skills comma-separated</p>
              </div>
            </div>
            <span className="text-gray-600">→</span>
          </button>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>📊 Summary:</strong> {Object.keys(skills).length} skills found with an ATS score of {atsScore.toFixed(1)}/10
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              <strong>✓ Tip:</strong> Share your analysis with recruiters or use it for job applications.
            </p>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="mt-6 pt-6 border-t">
        <h3 className="font-semibold text-gray-800 mb-3">Skills Preview</h3>
        <div className="bg-gray-50 rounded-lg p-4 max-h-32 overflow-y-auto">
          <p className="text-sm text-gray-700 break-words">
            {Object.entries(skills)
              .sort((a, b) => b[1] - a[1])
              .map(([skill]) => skill)
              .join(', ')}
          </p>
        </div>
      </div>
    </div>
  );
}
