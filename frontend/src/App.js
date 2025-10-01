// App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import StudentDashboard from './components/StudentDashboard';
import LecturerDashboard from './components/LecturerDashboard';
import PrlDashboard from './components/PrlDashboard';
import PlDashboard from './components/PlDashboard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useState, useEffect } from 'react';

function App() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    const token = localStorage.getItem('token');
    if (storedRole && token) {
      setRole(storedRole);
    }
  }, []);

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Navbar role={role} setRole={setRole} />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login setRole={setRole} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              role === 'student' ? <StudentDashboard /> :
              role === 'lecturer' ? <LecturerDashboard /> :
              role === 'prl' ? <PrlDashboard /> :
              role === 'pl' ? <PlDashboard /> : <LandingPage />
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;