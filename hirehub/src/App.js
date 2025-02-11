import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import JobDetailPage from './pages/JobDetailPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import Layout from './components/Layout';
import PostJobPage from './pages/PostJobPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import EditProfile from './pages/EditProfile';
import MyJobs from './pages/MyJobs';
import SavedJobs from './pages/SavedJobs';
import JobDetailsModal from './pages/JobDetailPage';
import EmployerDashboard from './components/EmployerDashBoard';
import JobPortalSubscriptionPage from './pages/JobPortalSubscriptionPage';
import PaymentDetailsPage from './pages/PaymentDetailsPage';
import ManageApplications from './pages/ManageApplications';
import CandidateProfilePage from './pages/CandidateProfilePage';
import socket from './socket';

const AppContent = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      socket.emit("registerUser", user._id || user.userId);
    }
  }, [user]);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs/:jobId" element={<JobDetailsModal />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/post-job" element={<PostJobPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/profile" element={<EditProfile />} />
          <Route path="/payment" element={<PaymentDetailsPage />} />
          <Route path="/subscribe" element={<JobPortalSubscriptionPage />} />
          <Route path="/my-jobs/:userId" element={<MyJobs />} />
          <Route path="/posted-jobs/:userId" element={<EmployerDashboard />} />
          <Route path="/saved-jobs/:userId" element={<SavedJobs />} />
          <Route path="/manageapplication/:jobId" element={<ManageApplications />} />
          <Route path="/candidates/:candidateId" element={<CandidateProfilePage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
