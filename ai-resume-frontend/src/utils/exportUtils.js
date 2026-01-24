/**
 * Export utilities for generating PDF/DOCX files
 * Note: For production, integrate with a library like jsPDF or html2pdf
 */

export const exportAsJSON = (data, filename = 'resume-analysis.json') => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  downloadFile(blob, filename);
};

export const exportAsCSV = (skills, filename = 'skills-analysis.csv') => {
  let csv = 'Skill,Status,Type\n';
  
  skills.matched?.forEach(skill => {
    csv += `"${skill}",Matched,Matched\n`;
  });
  
  skills.missing?.forEach(skill => {
    csv += `"${skill}",Missing,Missing\n`;
  });
  
  skills.suggested?.forEach(skill => {
    csv += `"${skill}",Suggested,Suggested\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  downloadFile(blob, filename);
};

export const exportAsHTML = (data, filename = 'resume-analysis.html') => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Resume Analysis Report</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; background: #f5f5f5; }
        .container { max-width: 900px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        h1 { color: #1f2937; margin-bottom: 30px; border-bottom: 3px solid #4f46e5; padding-bottom: 10px; }
        h2 { color: #374151; margin-top: 25px; margin-bottom: 15px; font-size: 1.3em; }
        .score-box { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; padding: 30px; border-radius: 8px; margin-bottom: 30px; text-align: center; }
        .score-value { font-size: 3em; font-weight: bold; }
        .skill-group { margin-bottom: 25px; }
        .skill-tags { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 10px; }
        .tag { display: inline-block; padding: 8px 12px; border-radius: 20px; font-size: 0.9em; font-weight: 500; }
        .tag.matched { background: #dbeafe; color: #065f46; }
        .tag.missing { background: #fee2e2; color: #7f1d1d; }
        .tag.suggested { background: #fef3c7; color: #92400e; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 0.9em; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🎯 Resume ATS Analysis Report</h1>
        
        <div class="score-box">
          <div>ATS Compatibility Score</div>
          <div class="score-value">${data.atsScore || 0}%</div>
          <div style="margin-top: 10px; font-size: 0.9em;">Skills Match: ${data.matchedSkills?.length || 0}/${data.totalSkills || 0}</div>
        </div>

        ${data.matchedSkills?.length > 0 ? `
          <div class="skill-group">
            <h2>✅ Matched Skills (${data.matchedSkills.length})</h2>
            <div class="skill-tags">
              ${data.matchedSkills.map(s => `<span class="tag matched">${s}</span>`).join('')}
            </div>
          </div>
        ` : ''}

        ${data.missingSkills?.length > 0 ? `
          <div class="skill-group">
            <h2>❌ Missing Skills (${data.missingSkills.length})</h2>
            <div class="skill-tags">
              ${data.missingSkills.map(s => `<span class="tag missing">${s}</span>`).join('')}
            </div>
          </div>
        ` : ''}

        ${data.suggestedSkills?.length > 0 ? `
          <div class="skill-group">
            <h2>💡 Suggested Skills (${data.suggestedSkills.length})</h2>
            <div class="skill-tags">
              ${data.suggestedSkills.map(s => `<span class="tag suggested">${s}</span>`).join('')}
            </div>
          </div>
        ` : ''}

        <div class="footer">
          <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          <p>Smart Hiring Platform © 2026 - AI Resume Analyzer</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
  downloadFile(blob, filename);
};

const downloadFile = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
