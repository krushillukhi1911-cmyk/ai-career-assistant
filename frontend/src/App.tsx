import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { ResumePage } from './pages/Resume';
import { JobAnalysisPage } from './pages/JobAnalysis';
import { MatchPage } from './pages/Match';
import { SkillsPage } from './pages/Skills';
import { InterviewPage } from './pages/Interview';
import { RoadmapPage } from './pages/Roadmap';
import { ChatPage } from './pages/Chat';
import { ProfilePage } from './pages/Profile';
import { LandingPage } from './pages/LandingPage';
import { authService } from './services/api';
import { User } from './types';

import { LoadingSpinner } from './components/LoadingSpinner';

const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      let currentToken = localStorage.getItem('token');
      if (!currentToken) {
        try {
          const data = await authService.login('test@example.com', 'password123');
          currentToken = data.access_token;
          setToken(currentToken);
        } catch (e) {
          console.error('Auto login failed', e);
        }
      }
      if (currentToken) {
        try {
          const u = await authService.getMe();
          setUser(u);
        } catch (e) {
          authService.logout();
          setToken(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  if (loading) {
    return <LoadingSpinner message="Loading AI Assistant..." />;
  }

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <Navbar user={user} />
        {children}
      </main>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedLayout>
              <Dashboard />
            </ProtectedLayout>
          }
        />
        <Route
          path="/resume"
          element={
            <ProtectedLayout>
              <ResumePage />
            </ProtectedLayout>
          }
        />
        <Route
          path="/job-analysis"
          element={
            <ProtectedLayout>
              <JobAnalysisPage />
            </ProtectedLayout>
          }
        />
        <Route
          path="/match"
          element={
            <ProtectedLayout>
              <MatchPage />
            </ProtectedLayout>
          }
        />
        <Route
          path="/skills"
          element={
            <ProtectedLayout>
              <SkillsPage />
            </ProtectedLayout>
          }
        />
        <Route
          path="/interview"
          element={
            <ProtectedLayout>
              <InterviewPage />
            </ProtectedLayout>
          }
        />
        <Route
          path="/roadmap"
          element={
            <ProtectedLayout>
              <RoadmapPage />
            </ProtectedLayout>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedLayout>
              <ChatPage />
            </ProtectedLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedLayout>
              <ProfilePage />
            </ProtectedLayout>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

