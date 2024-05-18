// Signin.js
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseconfig';
import './auth.css'; // Import your CSS file
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';
const Signin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);
  const navigate=useNavigate()
  const handleSignin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setLoading(true);
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        console.log('User data:', userDoc.data());
        navigate("/")
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error(error.message);
      setError(error)
    }finally {
        setLoading(false); 
      }
  };

  return (
    <div className="auth-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSignin} className="auth-form">
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit" disabled={loading} style={{marginBottom:"10px"}}>{loading ? 'Loading...' : 'Sign In'}</button>
        <button onClick={() => navigate("/signup")} disabled={loading}>Register</button>
      </form>
      {error && <div className="error-message">{error.message}</div>}
    </div>
  );
};

export default Signin;
