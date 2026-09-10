import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/public/Home';
import BookCatalog from './pages/public/BookCatalog';
import About from './pages/public/About';
import LocationContact from './pages/public/LocationContact';
import Register from './pages/public/Register';

// Member Pages
import MemberLogin from './pages/member/MemberLogin';
import MemberDashboard from './pages/member/MemberDashboard';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMembers from './pages/admin/AdminMembers';
import AdminBooks from './pages/admin/AdminBooks';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/books" element={<BookCatalog />} />
              <Route path="/about" element={<About />} />
              <Route path="/location" element={<LocationContact />} />
              <Route path="/contact" element={<LocationContact />} />
              <Route path="/register" element={<Register />} />

              {/* Auth Login Routes */}
              <Route path="/member/login" element={<MemberLogin />} />
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Member Protected Routes */}
              <Route
                path="/member/dashboard"
                element={
                  <ProtectedRoute requiredRole="member">
                    <MemberDashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/member" element={<Navigate to="/member/dashboard" replace />} />

              {/* Admin Protected Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/members"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminMembers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/books"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminBooks />
                  </ProtectedRoute>
                }
              />
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
