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
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 10;

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
    if (!editedTitle || !editedArea || !editedPlace || !editedPhoneNumber) {
      alert('All fields are required.');
      return;
    }
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

  // Pagination logic
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = properties.slice(indexOfFirstProperty, indexOfLastProperty);

  const totalPages = Math.ceil(properties.length / propertiesPerPage);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={i === currentPage ? 'active' : ''}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="my-properties">
      <h2>Your Property for Rent</h2>
      {currentProperties.map(property => (
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
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Edit Property</h2>
            <input
              type="text"
              value={editedTitle}
              onChange={e => setEditedTitle(e.target.value)}
              placeholder="Title"
              required
            />
            <input
              type="text"
              value={editedArea}
              onChange={e => setEditedArea(e.target.value)}
              placeholder="Area"
              required
            />
            <input
              type="text"
              value={editedPlace}
              onChange={e => setEditedPlace(e.target.value)}
              placeholder="Place"
              required
            />
            <input
              type="text"
              value={editedPhoneNumber}
              onChange={e => setEditedPhoneNumber(e.target.value)}
              placeholder="Phone Number"
              required
            />
            <div className="modal-buttons">
              <button onClick={handleEditSubmit}>Submit</button>
              <button onClick={handleCloseModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      <div className="pagination">
        {renderPageNumbers()}
      </div>
    </div>
  );
};

export default MyProperties;
