import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Kyc from './pages/kyc';  // Ensure this path is correct
import HomeLayout from './layout/HomeLayout';
import About from './pages/about';
import Result from './pages/result';
import NotFoundPage from './pages/notfoundpage';
import Login from './pages/login';
import Guidelines from './pages/guidelines';
import Home from './pages/home';

function App() {
  return (
    <main>
      <Router>
        <Routes>
          {/* Route for Login Page */}
          <Route path="/" element={<Login />} />

          {/* Nested routes for Home, KYC, Result, and Guidelines */}
          <Route path="/home" element={<HomeLayout />}>
            <Route index element={<Home />} />
            <Route path="kyc/:electionId" element={<Kyc />} /> {/* Dynamic route for KYC */}
            <Route path="result" element={<Result />} />
            <Route path="guidelines" element={<Guidelines />} />
          </Route>

          {/* Catch-all route for unmatched paths */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </main>
  );
}

export default App;
