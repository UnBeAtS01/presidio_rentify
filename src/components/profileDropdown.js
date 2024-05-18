// ProfileDropdown.js
import React from 'react';
import { signOut } from 'firebase/auth';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { auth, db } from '../firebase/firebaseconfig';
const ProfileDropdown = ({ user }) => {
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        console.log('Sign out successful');
      })
      .catch((error) => {
        // An error happened.
        console.error('Sign out error:', error);
      });
  };

  return (
    <DropdownButton id="dropdown-basic-button" title={user.displayName || 'User'}>
      <Dropdown.Item>Profile</Dropdown.Item>
      <Dropdown.Item onClick={handleSignOut}>Sign Out</Dropdown.Item>
    </DropdownButton>
  );
};

export default ProfileDropdown;
