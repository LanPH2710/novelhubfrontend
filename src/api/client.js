import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://novelhubbackend.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (username, password) => api.post('/auth/register', { username, password }),
  login: (username, password) => api.post('/auth/login', { username, password })
};

export const storyAPI = {
  getStories: (page = 1, limit = 12) => api.get(`/stories?page=${page}&limit=${limit}`),
  getStoryById: (id) => api.get(`/stories/${id}`),
  createStory: (data) => api.post('/stories', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateStory: (id, data) => api.put(`/stories/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteStory: (id) => api.delete(`/stories/${id}`)
};

export const chapterAPI = {
  getChaptersByStory: (storyId, page = 1, limit = 20) => 
    api.get(`/chapters/${storyId}?page=${page}&limit=${limit}`),
  getChapterByNumber: (storyId, chapterNumber) => 
    api.get(`/chapters/${storyId}/${chapterNumber}`),
  createChapter: (data) => api.post('/chapters', data),
  updateChapter: (storyId, chapterNumber, data) => 
    api.put(`/chapters/${storyId}/${chapterNumber}`, data),
  deleteChapter: (storyId, chapterNumber) => 
    api.delete(`/chapters/${storyId}/${chapterNumber}`)
};

export const progressAPI = {
  // body: { storyId, chapterNumber }
  updateProgress: (body) => api.put(`/progress`, body),
  // get all progress for current user
  getProgress: () => api.get(`/progress`),
  // get progress for a specific story
  getProgressForStory: (storyId) => api.get(`/progress/${storyId}`)
};

export default api;
