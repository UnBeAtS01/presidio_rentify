// PropertyList.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs, where, query, onSnapshot,doc,updateDoc, increment ,getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/firebaseconfig'; // Firebase firestore instance
import './PropertyList.css';

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [filters, setFilters] = useState({ area: '', place: '', bedrooms: '' });
  useEffect(() => {
    const unsubscribeAuthListener = auth.onAuthStateChanged(user => {
      // Check if user is authenticated
      if (user) {
        setAuthInitialized(true);
      } else {
        setAuthInitialized(false);
      }
    });

    return () => unsubscribeAuthListener();
  }, []);
  useEffect(() => {
    if (authInitialized) {
    if (!auth.currentUser){ console.log("null");return;}
    const fetchProperties = async () => {
        try{
            const q = query(collection(db, 'properties'), where('userId', '!=', auth.currentUser.uid));
            const unsubscribe = onSnapshot(q, (snapshot) => {
              const propertyData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
              setProperties(propertyData);
              setFilteredProperties(propertyData)
            });
            return () => unsubscribe();
        }
        catch(err){
            console.log("error while fetching data")
        }
      
      
    };

    fetchProperties();
}
  }, [authInitialized]);

  const handleLike = async (propertyId) => {
    try {
      const propertyRef = doc(db, 'properties', propertyId);
  
      // Get the current property document data
      const propertySnapshot = await getDoc(propertyRef);
      const propertyData = propertySnapshot.data();
  
      // Get the list of liked users from the property document
      const likedUsers = propertyData.likedUsers || [];
  
      // Check if the current user's ID is already in the list of liked users
      if (!likedUsers.includes(auth.currentUser.uid)) {
        // If not, update the property document to add the current user's ID to the list and increment the like count
        await updateDoc(propertyRef, {
          likes: increment(1),
          likedUsers: [...likedUsers, auth.currentUser.uid]
        });
      }
    } catch (error) {
      console.error('Error updating like count:', error);
    }
  };
  

  const handleInterest = (propertyId) => {

    console.log(`Interested in property with ID: ${propertyId}`);
  };
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };
  const applyFilters = () => {
    let filtered = properties;
    if (filters.area) {
      filtered = filtered.filter(property => property.area.includes(filters.area));
    }
    if (filters.place) {
      filtered = filtered.filter(property =>property.place.includes(filters.place));
    }
    if (filters.bedrooms) {
      filtered = filtered.filter(property => property.bedrooms === filters.bedrooms);
    }
    setFilteredProperties(filtered);
  };
  const clearFilters = () => {
    setFilters({ area: '', place: '', bedrooms: '' });
    setFilteredProperties(properties); // Reset filteredProperties to all properties
  };
  return (
    <div className="property-list">
      <h2>Property for Rent</h2>
      <div className="filter-container">
        <input type="text" name="area" value={filters.area} onChange={handleFilterChange} placeholder="Area" />
        <input type="text" name="place" value={filters.place} onChange={handleFilterChange} placeholder="Place" />
        <input type="number" name="bedrooms" value={filters.bedrooms} onChange={handleFilterChange} placeholder="Bedrooms" />
        <button onClick={applyFilters}>Apply Filter</button>
        <button onClick={clearFilters}>Clear Filter</button>
      </div>
      {filteredProperties.map(property => (
        <div className="property-card" key={property.id}>
          <h3>{property.title}</h3>
          <p>Area: {property.area}</p>
          <p>Bedrooms: {property.bedrooms}</p>
          <p>Place: {property.place}</p>
          <p>Nearby Location: {property.nearbyLocations}</p>
          <div className="property-buttons">
            <button onClick={() => handleLike(property.id)}>Like {property.likes}</button>
            <button onClick={() => handleInterest(property.id)}>Interested</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PropertyList;
