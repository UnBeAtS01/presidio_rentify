// CreatePropertyModal.js
import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase/firebaseconfig'; // Firebase firestore instance
import './CreatePropertyModal.css';
import {auth} from '../firebase/firebaseconfig'

const CreatePropertyModal = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [area, setArea] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [place,setPlace]=useState('');
  const [nearbyLocations,setNearbyLocations]=useState('')
  
  let userId=auth.currentUser.uid;
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        let likes=0;
      await addDoc(collection(db, 'properties'), {
        title,
        area,
        bedrooms,
        nearbyLocations,
        place,
        userId,
        likes,
      });
      onClose();
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="create-property-modal">
        <h2>Create New Property</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" required />
          <input type="text" value={area} onChange={(e) => setArea(e.target.value)} placeholder="Area" required />
          <input type="number" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} placeholder="Number of Bedrooms" required />
          <input type="text" value={place} onChange={(e) => setPlace(e.target.value)} placeholder="Place" required />
          <input type="text" value={nearbyLocations} onChange={(e) => setNearbyLocations(e.target.value)} placeholder="Nearby Locations" required />
          <button type="submit">Create Property</button>
        </form>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default CreatePropertyModal;
