import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/auth/PrivateRoute';
import OrganizerRoute from './components/auth/OrganizerRoute';
import AdminRoute from './components/auth/AdminRoute';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import EventSearch from './pages/EventSearch';
import EventDetails from './pages/EventDetails';
import EventCreate from './pages/EventCreate';
import Login from './pages/Login';
import Register from './pages/Register';
import UserProfile from './pages/UserProfile';
import AdminPanel from './pages/AdminPanel';
import ScrollToTop from './components/layout/ScrollToTop';
import UpdateEvent from './pages/UpdateEvent';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<EventSearch />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route
                path="/events/create"
                element={
                  <OrganizerRoute>
                    <EventCreate />
                  </OrganizerRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <UserProfile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminPanel />
                  </AdminRoute>
                }
              />
              <Route path="/events/:eventId/edit" element={<UpdateEvent />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </Router>
  );
}

export default App;