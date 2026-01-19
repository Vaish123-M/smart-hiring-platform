# 🚀 Smart Hiring Platform

An **enterprise-grade, AI-powered resume analysis and hiring optimization system** built with FastAPI, React, MongoDB, and Docker. Perfect for recruiters, job seekers, and HR professionals.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.13+](https://img.shields.io/badge/python-3.13+-blue.svg)](https://www.python.org/downloads/)
[![React 18](https://img.shields.io/badge/react-18-blue.svg)](https://reactjs.org/)

---

## ✨ Features

### 🎯 **Core Functionality**
- **Resume Upload & Parsing**: Drag-drop PDF upload with intelligent text extraction
- **ATS Scoring**: Calculate ATS compatibility scores (0-10 scale) with detailed breakdown
- **Skill Extraction**: Automatic skill identification with frequency analysis
- **Job Description Matching**: Match resumes against JDs with 3 input modes (paste/upload/fetch URL)
- **Resume Export**: Download analysis as PDF or JSON
- **Resume Builder**: Create ATS-friendly resumes with live preview

### 🧠 **AI-Powered Features**
- **Resume Improvement Suggestions**: NLP-based analysis for action verbs and quantified achievements
- **Cover Letter Generator**: Tailored cover letters based on resume and JD
- **Interview Q&A Prep**: Generate likely interview questions with STAR-method approaches

### 📊 **Advanced Analytics**
- **Keyword Gap Analysis**: Identify missing keywords between resume and JD
- **Job Role Matching**: Match to relevant roles based on skills and experience (8+ role profiles)
- **Career Path Suggestions**: Personalized career progression with skill development plans
- **Skill Heatmaps**: Visual representation of skill trends and correlations
- **Resume Comparison**: Side-by-side comparison with detailed metrics
- **Trend Analysis**: Track ATS score improvements over time

### 🏗️ **Technical Excellence**
- **Microservices Architecture**: Modular backend with 7 independent service modules
- **MongoDB Database**: Complete schema with 6 collections (users, resumes, JDs, matches, analytics, cover letters)
- **Docker & Kubernetes**: Production-ready containerization with health checks and auto-scaling
- **CI/CD Pipeline**: Automated testing, linting, security scanning with GitHub Actions
- **Authentication**: JWT-based user authentication with bcrypt password hashing

---

## 🎥 Quick Start

### **Option 1: Docker Compose (Recommended)**

```bash
# Clone repository
git clone https://github.com/yourusername/smart-hiring-platform.git
cd smart-hiring-platform

# Start all services (MongoDB, Backend, Frontend, Redis)
docker-compose up -d

# Check status
docker-compose ps

# Access application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/swagger
```

### **Option 2: Local Development**

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload --port 8000

# Frontend (new terminal)
cd ai-resume-frontend
npm install
npm run dev
```

---

## 📁 Project Structure

```
smart-hiring-platform/
├── backend/                     # FastAPI backend
│   ├── main.py                 # App entry point
│   ├── auth/                   # JWT authentication
│   ├── resume/                 # Resume upload & parsing
│   ├── matching/               # ATS scoring & JD matching
│   ├── analytics/              # Skill extraction
│   ├── insights/               # Career insights & role matching
│   ├── ai_enhancements/        # AI suggestions, cover letters, interview prep
│   ├── advanced_analytics/     # Heatmaps, trends, comparisons
│   ├── database/               # MongoDB models & schema
│   │   ├── models.py          # Pydantic models (6 collections)
│   │   └── schema.py          # Database initialization & indexes
│   ├── Dockerfile
│   └── requirements.txt
├── ai-resume-frontend/          # React + Vite + Tailwind frontend
│   ├── src/
│   │   ├── App.jsx            # Main app with navigation
│   │   └── components/         # 13+ React components
│   │       ├── ResumeUpload.jsx
│   │       ├── ATSScoreDisplay.jsx
│   │       ├── JobMatcher.jsx
│   │       ├── ResumeInsights.jsx
│   │       ├── AIEnhancements.jsx
│   │       ├── ResumeComparison.jsx
│   │       ├── ResumeBuilder.jsx
│   │       └── ... (more)
│   └── Dockerfile
├── k8s/                        # Kubernetes manifests
│   ├── backend-deployment.yaml
│   └── README.md
├── .github/workflows/          # CI/CD pipeline
│   └── ci-cd.yml              # Automated testing & deployment
├── docker-compose.yml          # Multi-container orchestration
├── DOCUMENTATION.md            # Comprehensive documentation
└── README.md                   # This file
```

---

## 🔌 API Endpoints

### **Resume & Analysis**
- `POST /resume/upload` - Upload resume PDF
- `GET /resume/{resume_id}` - Get resume details
- `POST /ats/score` - Calculate ATS score
- `POST /ats/match` - Match resume against JD
- `POST /ats/jd-upload` - Upload JD as file
- `POST /ats/jd-fetch` - Fetch JD from URL
- `POST /analytics/extract-skills` - Extract skills

### **AI Enhancements** 🤖
- `POST /ai/resume-improvements` - Get improvement suggestions
- `POST /ai/cover-letter` - Generate cover letter
- `POST /ai/interview-prep` - Interview preparation

### **Insights & Career Guidance** 💡
- `POST /insights/keyword-gaps` - Keyword gap analysis
- `POST /insights/job-role-match` - Job role matching (8+ roles)
- `POST /insights/career-paths` - Career path suggestions

### **Advanced Analytics** 📊
- `POST /analytics-advanced/compare` - Compare 2 resumes
- `POST /analytics-advanced/skill-heatmap` - Skill heatmap
- `POST /analytics-advanced/trends` - ATS trend analysis

**Full API Documentation**: [http://localhost:8000/swagger](http://localhost:8000/swagger)

---

## 🛠️ Technology Stack

### **Backend**
- **FastAPI** (Python 3.13) - High-performance async API framework
- **MongoDB** with **Motor** - NoSQL database with async driver
- **PyPDF2**, **pdfplumber**, **PyMuPDF** - Multi-library PDF extraction
- **NLTK** + **scikit-learn** - NLP (TF-IDF, cosine similarity)
- **JWT** (python-jose) + **bcrypt** - Secure authentication
- **Pydantic** - Data validation and serialization

### **Frontend**
- **React 18** + **Vite** - Modern, fast UI framework
- **Tailwind CSS** - Utility-first styling
- **Lucide Icons** - Beautiful icon library
- **Axios** - HTTP client for API calls

### **Infrastructure**
- **Docker** + **Docker Compose** - Multi-container setup
- **Kubernetes** - Production orchestration with HPA
- **GitHub Actions** - CI/CD with automated testing
- **Redis** - Caching layer (infrastructure ready)
- **MongoDB 7.0** - Primary database

---

## 🚀 Deployment

### **Local Development**
```bash
# Start with Docker Compose
docker-compose up -d

# Or manually start services
# Terminal 1: MongoDB
docker run -d -p 27017:27017 mongo:7.0

# Terminal 2: Backend
cd backend && uvicorn main:app --reload

# Terminal 3: Frontend
cd ai-resume-frontend && npm run dev
```

### **Kubernetes Production**
```bash
# Apply all manifests
kubectl apply -f k8s/

# Check deployment
kubectl get pods
kubectl get services

# Scale backend
kubectl scale deployment smart-hiring-backend --replicas=3

# View logs
kubectl logs -f deployment/smart-hiring-backend
```

### **Cloud Providers**
- **AWS**: ECS Fargate + DocumentDB + S3 + CloudFront
- **Azure**: AKS + Cosmos DB + Blob Storage + CDN
- **GCP**: GKE + Firestore + Cloud Storage + Cloud CDN

See [DOCUMENTATION.md](./DOCUMENTATION.md) for detailed cloud deployment guides.

---

## 🧪 Testing & Quality

### **Backend Tests**
```bash
cd backend
pytest tests/ -v --cov --cov-report=html
```

### **Frontend Tests**
```bash
cd ai-resume-frontend
npm test
npm run test:coverage
```

### **CI/CD Pipeline** (GitHub Actions)
- ✅ Automated backend tests (pytest)
- ✅ Frontend build validation
- ✅ Docker image builds
- ✅ Security scanning (Trivy)
- ✅ Linting (flake8, black)
- ✅ Deployment automation

---

## 📊 Performance & Scalability

### **Current Metrics**
- **Resume Processing**: ~1-2 seconds per PDF
- **ATS Scoring**: ~500ms per analysis
- **Concurrent Users**: Load tested up to 100 simultaneous requests
- **Database Queries**: Indexed for <50ms response time

### **Scaling Strategy**
- **Horizontal Scaling**: Kubernetes HPA (2-10 replicas)
- **Caching**: Redis for frequently accessed data
- **CDN**: Frontend assets via CloudFront/Cloudflare
- **Database**: MongoDB sharding for large datasets
- **Async Processing**: Background jobs for heavy computations

---

## 🔒 Security Features

- ✅ **JWT Authentication**: Token-based auth with expiration
- ✅ **Password Hashing**: bcrypt with salt rounds
- ✅ **CORS Protection**: Configurable allowed origins
- ✅ **Input Validation**: Pydantic schemas for all endpoints
- ✅ **SQL Injection Prevention**: MongoDB ORM
- ✅ **File Upload Validation**: PDF-only, size limits
- ✅ **Security Headers**: HTTPS, X-Frame-Options
- ✅ **Dependency Scanning**: Automated vulnerability checks

---

## 🤝 Contributing

Contributions welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details

---

## 👨‍💻 Author & Portfolio Highlights

Built with ❤️ as a **comprehensive full-stack portfolio project** for 3rd-year Computer Engineering students.

### **Technical Skills Demonstrated:**
- ✅ **Full-Stack Development**: React frontend + FastAPI backend
- ✅ **AI/ML Integration**: NLP (NLTK, scikit-learn), TF-IDF, cosine similarity
- ✅ **Microservices Architecture**: 7 independent backend modules
- ✅ **Database Design**: MongoDB with 6 collections, indexes, and relationships
- ✅ **DevOps**: Docker, Kubernetes, CI/CD (GitHub Actions)
- ✅ **Cloud Ready**: AWS/Azure/GCP deployment configurations
- ✅ **Authentication**: JWT tokens, bcrypt password hashing
- ✅ **Testing**: Unit tests, integration tests, coverage reports
- ✅ **API Design**: RESTful APIs with OpenAPI/Swagger documentation
- ✅ **Modern Frontend**: React hooks, Tailwind CSS, responsive design

### **Project Complexity:**
- **Lines of Code**: ~15,000+ (backend + frontend)
- **API Endpoints**: 25+ RESTful endpoints
- **Frontend Components**: 13+ React components
- **Backend Modules**: 7 microservices
- **Database Collections**: 6 MongoDB collections
- **Infrastructure Files**: Docker, Kubernetes, CI/CD

---

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/yourusername/smart-hiring-platform/issues)
- **Documentation**: [DOCUMENTATION.md](./DOCUMENTATION.md)
- **Email**: support@smarthiring.com

---

## 🎯 Future Roadmap

- [ ] Real-time collaboration on resume editing (WebSockets)
- [ ] Video interview analysis (sentiment detection)
- [ ] Mobile app (React Native)
- [ ] Chrome extension for LinkedIn integration
- [ ] Integration with major ATS systems (Greenhouse, Lever)
- [ ] Multi-tenant SaaS architecture
- [ ] GPT-4 integration for advanced AI features
- [ ] Blockchain-verified credentials

---

**⭐ If you find this project useful, please give it a star on GitHub!**

---

**Version:** 2.0.0 | **Last Updated:** January 19, 2026 | **Status:** Production Ready 🚀
