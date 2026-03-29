import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import JobList from './pages/JobList';
import JobForm from './pages/JobForm';

function App() {
  return (
    <Router>
      <div className="bg-light min-vh-100">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
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
