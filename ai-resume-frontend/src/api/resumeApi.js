import axios from 'axios';

const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname !== 'localhost' 
  ? '' 
  : 'http://localhost:8000';

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(`${API_BASE_URL}/resume/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const extractSkillsFromResume = async (resumeText) => {
  // This endpoint extracts skills from the resume text
  // Returns skill counts
  const response = await axios.post(`${API_BASE_URL}/analytics/extract-skills`, {
    resume_text: resumeText
  });
  return response.data;
};
