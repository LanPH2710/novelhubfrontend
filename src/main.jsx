import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import StoryDetail from './pages/StoryDetail';
import ReadChapter from './pages/ReadChapter';
import AddStory from './pages/AddStory';
import AddChapter from './pages/AddChapter';
import AddBulkChapters from './pages/AddBulkChapters';
import EditStory from './pages/EditStory';
import EditChapter from './pages/EditChapter';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import './styles/index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/story/:id" element={<StoryDetail />} />
        <Route path="/read/:storyId/:chapterNumber" element={<ReadChapter />} />
        <Route path="/add-story" element={<AddStory />} />
        <Route path="/edit-story/:storyId" element={<EditStory />} />
        <Route path="/add-chapter/:storyId" element={<AddChapter />} />
        <Route path="/add-bulk-chapters/:storyId" element={<AddBulkChapters />} />
        <Route path="/edit-chapter/:storyId/:chapterNumber" element={<EditChapter />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/history" element={<History />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

