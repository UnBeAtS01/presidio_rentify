// App.js
import React,{useEffect,useState} from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Signup from './components/signup';
import Signin from './components/signin';
import {auth } from './firebase/firebaseconfig'
import './App.css';
import HomePage from './components/HomePage';
import MyProperties from './components/MyProperties';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);
  return (
    <Router>
    
        <Routes>
          <Route exact path="/signup" element={currentUser?<HomePage/>:<Signup />} />
          <Route exact path="/signin" element={currentUser?<HomePage/>:<Signin />} />
          <Route exact path="/" element={<HomePage/>} />
          <Route exact path="/myproperties" element={<MyProperties/>} />
          <Route exact path="*" element={currentUser?<HomePage/>:<Signin/>} />
        </Routes>
    
    </Router>
  );
};

export default App;
