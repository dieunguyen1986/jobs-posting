import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import JobList from './pages/JobList';
import JobForm from './pages/JobForm';

function App() {
  return (
    <Router>
      <div className="bg-light min-vh-100">
        <Navigation />
        <main className="py-2">
          <Routes>
            <Route path="/" element={<Navigate to="/jobs" />} />
            <Route path="/jobs" element={<JobList />} />
            <Route path="/add-job" element={<JobForm />} />
            <Route path="/edit-job/:id" element={<JobForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
