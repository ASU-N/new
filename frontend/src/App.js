import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Kyc from './pages/kyc'; 
import HomeLayout from './layout/HomeLayout';
import Result from './pages/result';
import NotFoundPage from './pages/notfoundpage';
import Login from './pages/login';
import Guidelines from './pages/guidelines';
import Home from './pages/home';
import ElectionLayout from './layout/ElectionLayout';
import Election from './pages/election';

function App() {
  return (
  <main>
<Router>
  <Routes>
    <Route path='/' element={<Login />} />
    <Route path='home' element={<HomeLayout />}>
      <Route index element={<Home />} />
      <Route path='result' element={<Result />} />
    </Route>
    <Route path='election' element={<ElectionLayout/>}>
        <Route index element={<Election />} />
        <Route path='kyc' element={<Kyc />} />
        <Route path='guidelines' element={<Guidelines />} />
    </Route>

    <Route path="*" element={<NotFoundPage />} />
  </Routes>
</Router>

    </main>
  );
}

export default App;
