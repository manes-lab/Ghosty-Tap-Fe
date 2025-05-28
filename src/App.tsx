import React, { useEffect, useState } from 'react';
import './App.scss';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from "./layout/main";
import Home from './pages/home';
import Game from './pages/game';
import Leaderboard from './pages/leaderboard';
import Invite from './pages/invite';
import Profile from './pages/profile';
import Robot from './pages/robot';


const App: React.FC = () => {


  return (
    <Router>
      <>
        <MainLayout>
          <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/zen' element={<Game/>} />
            <Route path='/adventure' element={<Game/>} />
            <Route path='/square' element={<Game/>} />
            <Route path='/battle' element={<Game/>} />
            <Route path='/leaderboard' element={<Leaderboard/>} />
            <Route path='/invite' element={<Invite/>} />
            <Route path="/user/:id" element={<Profile/>} />
            <Route path='/robot' element={<Robot/>} />
            <Route path='/*' element={<Home/>} />
          </Routes>
        </MainLayout>
      </>
    </Router>
  );
};

export default App;

