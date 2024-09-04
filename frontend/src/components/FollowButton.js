// src/components/FollowButton.js
import React from 'react';
import axios from 'axios';

function FollowButton({ userId }) {
  const handleFollow = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/api/users/${userId}/follow`,
        {},
        {
          headers: {
            'x-auth-token': `${token}`,
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error('There was an error following the user!', error);
    }
  };

  return <button onClick={handleFollow}>Follow</button>;
}

export default FollowButton;
