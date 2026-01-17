# Resume Analyzer & ATS Matcher - Frontend

A modern, responsive React application for analyzing resumes and calculating ATS match scores.

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls

## Features

- 📤 **Resume Upload** - Drag-and-drop or file picker for PDF resumes
- 📊 **Skill Analytics** - Visual display of top skills from uploaded resumes
- 🎯 **Match Score Calculator** - Compare resumes with job descriptions
- 🎨 **Modern UI** - Clean, professional design with Tailwind CSS
- 📱 **Responsive** - Works on mobile, tablet, and desktop
- ⚡ **Fast** - Powered by Vite for lightning-fast development

## Getting Started

### Prerequisites

- Node.js 16+ installed
- Backend server running on `http://localhost:8000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── UploadResume.jsx    # Resume upload component
│   │   ├── SkillAnalytics.jsx  # Skills visualization
│   │   └── MatchScore.jsx      # Match calculator
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # Entry point
│   └── index.css               # Global styles + Tailwind
├── index.html                  # HTML template
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Tailwind configuration
└── package.json               # Dependencies
```

## API Endpoints Used

- `POST /resume/upload` - Upload PDF resume
- `GET /analytics/top-skills` - Fetch skill analytics
- `POST /match` - Calculate resume-JD match score

## Component Overview

### UploadResume
- Drag-and-drop file upload
- PDF validation
- Success/error feedback
- Loading states

### SkillAnalytics
- Auto-fetch on mount
- Manual refresh button
- Color-coded skill badges
- Statistics display

### MatchScore
- Job description input
- Match percentage calculation
- Progress bar visualization
- Recommendations based on score

## Styling

The app uses Tailwind CSS with a custom color palette:
- Primary: Blue shades (`primary-*`)
- Professional gray tones
- Soft shadows and rounded corners
- Hover and transition effects

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
