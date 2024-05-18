// MyProperties.js
import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase/firebaseconfig';
import './MyProperties.css';

const MyProperties = () => {
  const [properties, setProperties] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedArea, setEditedArea] = useState('');
  const [editedPlace, setEditedPlace] = useState('');
  const [editedPhoneNumber, setEditedPhoneNumber] = useState('');

  useEffect(() => {
    const fetchProperties = async () => {
      if (!auth.currentUser) return;

      const q = query(collection(db, 'properties'), where('userId', '==', auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      const propertyData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProperties(propertyData);
    };

    fetchProperties();
  }, []);

  const handleOpenModal = (property) => {
    setEditingProperty(property);
    setEditedTitle(property.title);
    setEditedArea(property.area);
    setEditedPlace(property.place);
    setEditedPhoneNumber(property.phoneNumber);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingProperty(null);
    setModalOpen(false);
  };

  const handleEditSubmit = async () => {
    try {
      await updateDoc(doc(db, 'properties', editingProperty.id), {
        title: editedTitle,
        area: editedArea,
        place: editedPlace,
        phoneNumber: editedPhoneNumber,
      });
      // Update the local state with the edited property details
      setProperties(properties.map(property =>
        property.id === editingProperty.id
          ? { ...property, title: editedTitle, area: editedArea, place: editedPlace, phoneNumber: editedPhoneNumber }
          : property
      ));
      // Close the modal
      handleCloseModal();
      console.log('Property edited successfully');
    } catch (error) {
      console.error('Error editing property:', error);
    }
  };

  const handleDelete = async (propertyId) => {
    try {
      await deleteDoc(doc(db, 'properties', propertyId));
      // Remove the deleted property from the local state
      setProperties(properties.filter(property => property.id !== propertyId));
      console.log(`Deleted property with ID: ${propertyId}`);
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  return (
    <div className="my-properties">
      <h2>My Properties</h2>
      {properties.map(property => (
        <div className="property-card" key={property.id}>
          <h3>{property.title}</h3>
          <p>Area: {property.area}</p>
          <p>Place: {property.place}</p>
          <p>Phone Number: {property.phoneNumber}</p>
          <p>Number of People Liked: {property.likes}</p>
          <div className="button-container">
            <button onClick={() => handleOpenModal(property)}>Edit</button>
            <button onClick={() => handleDelete(property.id)}>Delete</button>
          </div>
        </div>
      ))}
      {modalOpen && (
        <div className="modal">
          <h2>Edit Property</h2>
          <input type="text" value={editedTitle} onChange={e => setEditedTitle(e.target.value)} />
          <input type="text" value={editedArea} onChange={e => setEditedArea(e.target.value)} />
          <input type="text" value={editedPlace} onChange={e => setEditedPlace(e.target.value)} />
          <input type="text" value={editedPhoneNumber} onChange={e => setEditedPhoneNumber(e.target.value)} />
          <button onClick={handleEditSubmit}>Submit</button>
          <button onClick={handleCloseModal}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default MyProperties;
