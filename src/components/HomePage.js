// HomePage.js
import React, { useEffect, useState } from 'react';
import Navbar from './navbar';
import PropertyList from './PropertyListPage';
import CreatePropertyModal from './createPropertyModal';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';
import {auth} from '../firebase/firebaseconfig'

const HomePage = () => {
  
  const navigate=useNavigate()
  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged(user => {
        if (!user) {
          // User is not logged in, redirect to login page
          navigate('/signin');
        }
      });
  
      return () => unsubscribe();
  },[navigate])
 
  
  return (
    <div className="home-page">
      <Navbar />
      <div className="content">
        <PropertyList />
      </div>
    </div>
  );
};

export default HomePage;
