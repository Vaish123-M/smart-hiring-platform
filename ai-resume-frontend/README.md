# AI Resume Analyzer - Frontend

A modern, responsive React frontend for the AI Resume Analyzer application.

## 🎨 Features

- **Clean, Modern UI** - Built with React and Tailwind CSS
- **Drag & Drop Upload** - Easy resume file upload with drag-and-drop support
- **Real-time Analysis** - Instant skill extraction and visualization
- **Responsive Design** - Works perfectly on mobile, tablet, and desktop
- **Beautiful Visualizations** - Color-coded skill cards with frequency bars
- **Error Handling** - User-friendly error messages

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ installed
- Your FastAPI backend running on `http://localhost:8000`

### Installation

1. Navigate to the frontend directory:
```bash
cd ai-resume-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` folder.

## 📁 Project Structure

```
ai-resume-frontend/
├── src/
│   ├── api/
│   │   └── resumeApi.js          # API service for backend calls
│   ├── components/
│   │   ├── ResumeUpload.jsx      # File upload component
│   │   └── SkillDisplay.jsx      # Skills visualization component
│   ├── App.jsx                   # Main app component
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Global styles + Tailwind
├── index.html                    # HTML template
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # Tailwind configuration
└── package.json                 # Dependencies
```

## 🔌 Backend Integration

The frontend connects to your existing FastAPI backend:

- **POST /upload-resume** - Uploads PDF resume, returns `resume_id`
- **GET /skill-count/{resume_id}** - Fetches extracted skills with frequencies

Make sure your backend is running on `http://localhost:8000` before starting the frontend.

## 🎨 Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls

## 📝 Usage

1. Open the application in your browser
2. Click "Browse Files" or drag and drop a PDF resume
3. Click "Analyze Resume" to upload
4. View the extracted skills with frequency counts
5. Click "Analyze Another Resume" to start over

## 🎯 Key Components

### ResumeUpload
- Handles file selection (drag-drop or browse)
- Validates PDF files
- Shows loading state during upload
- Displays error messages

### SkillDisplay
- Shows extracted skills in a grid layout
- Color-coded progress bars
- Summary statistics (total, max, average, top skill)
- Responsive design

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

MIT
