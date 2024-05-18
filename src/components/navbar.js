// Navbar.js
import React, { useEffect, useState } from 'react';

import { collection, where, query, onSnapshot,doc,getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/firebaseconfig'; // Firebase firestore instance
import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import CreatePropertyModal from './createPropertyModal';

const Navbar = () => {
  const [currentUser,setCurrentUser]=useState(null)
  const [showModal, setShowModal] = useState(false);
  const [firstName,setFirstName]=useState(null)
  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged(user => {
        setCurrentUser(user);
      });
      
      return unsubscribe;
},[])
useEffect(() => {
    const fetchFirstName = async () => {
      if (!auth.currentUser) return;
  
      try {
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          const firstName = userDoc.data().firstName;
          setFirstName(firstName);
        } else {
          console.log("User document does not exist.");
        }
      } catch (error) {
        console.error("Error fetching first name:", error);
      }
    };
  
    fetchFirstName();
  }, [currentUser]);
  
const navigate=useNavigate()
  const handleSignOut = async () => {
    await auth.signOut();
    navigate("/signin")
  };
  const toggleModal = () => {
    setShowModal(!showModal);
  };
  const showMyProperty=()=>{
    navigate("/myproperties")
  }
  return (
    <div className="navbar">
      <div className="user-info">
        {currentUser && (
          <div className='user-info-welcome'>
            <span>Welcome, {firstName?firstName:currentUser.email}</span>
           
          </div>
        )}
      </div>
      <div className='navbar-buttons'>

      {showModal && <CreatePropertyModal onClose={toggleModal} />}
      <button onClick={toggleModal}>Create New Property</button>
      <button onClick={handleSignOut}>Sign Out</button>
      <button onClick={showMyProperty}>My Property</button>
    </div>
      </div>
  );
};

export default Navbar;
