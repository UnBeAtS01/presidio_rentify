// Navbar.js
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

import { collection, where, query, onSnapshot,doc,getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/firebaseconfig'; // Firebase firestore instance
import './Navbar.css';
import { useNavigate } from 'react-router-dom';
import CreatePropertyModal from './createPropertyModal';

const Navbar = () => {
  const [currentUser,setCurrentUser]=useState(null)
  const [showModal, setShowModal] = useState(false);
  const [firstName,setFirstName]=useState(null);
  


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
  const openModal = () => {
    setShowModal(true);
  };
  
  const closeModal = () => {
    setShowModal(false);
  };
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      transform: 'translate(-50%, -50%)',
      borderRadius: '8px',
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
      border: 'none',
      padding: '20px',
      // Limit the width of the modal
      width: '50%', // Adjust the width as needed
      height: '50%', // Limit the height of the modal
       // Enable vertical scrolling if needed
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
  };
  
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

      
      <button onClick={toggleModal}>+Create New Property</button>
      <button onClick={showMyProperty}>My Property</button>
      <button onClick={handleSignOut}>Sign Out</button>
      <Modal isOpen={showModal} onRequestClose={closeModal} style={customStyles}>
      <CreatePropertyModal onClose={toggleModal} />
      
    </Modal>
    </div>
      </div>
  );
};

export default Navbar;
