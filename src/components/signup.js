// Signup.js
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseconfig';
import './auth.css'; // Import your CSS file
import { useNavigate } from 'react-router-dom';


const Signup = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);
  const navigate=useNavigate()
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        email,
        phone
      });

      console.log('User created and additional info saved:', user.uid);
      navigate('/home')
    
    } catch (error) {
      console.error("error occured",error.message);
      setError(error)
    }finally {
        setLoading(false); 
      }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup} className="auth-form">
        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" required />
        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" required />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" required />
        <button type="submit" disabled={loading} style={{marginBottom:"10px"}}>{loading?"Loading...":"Sign Up"}</button>
        <button onClick={()=>navigate("/signin")}>Sign In</button>
      </form>
      {error && <div className="error-message">{error.message}</div>}
    </div>
  );
};

export default Signup;
