// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Signup from './components/signup';
import Signin from './components/signin';
import './App.css';
import HomePage from './components/HomePage';
import MyProperties from './components/MyProperties';

const App = () => {
  return (
    <Router>
    
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/" element={<HomePage/>} />
          <Route path="/myproperties" element={<MyProperties/>} />
        </Routes>
    
    </Router>
  );
};

export default App;
