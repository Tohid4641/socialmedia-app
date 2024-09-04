// src/components/Profile.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Profile() {
  const { username } = useParams(); // Get the username from the URL
  const [user, setUser] = useState(null); // State to store the user data
  const [isFollowing, setIsFollowing] = useState(false); // State to track if the logged-in user is following this profile
  const loggedInUsername = localStorage.getItem('username'); // Get the logged-in user's username

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${username}`);
        setUser(response.data);

        // Check if the logged-in user is following this profile
        const followResponse = await axios.get(`http://localhost:5000/api/users/${username}/is-following`, {
          headers: {
            'x-auth-token': `${localStorage.getItem('token')}`,
          },
        });
        setIsFollowing(followResponse.data.isFollowing);
      } catch (error) {
        console.error('Error fetching user by username:', error);
      }
    };

    fetchUserProfile();
  }, [username]);

  const handleFollow = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/users/${user.id}/follow`,
        {},
        {
          headers: {
            'x-auth-token': `${localStorage.getItem('token')}`,
          },
        }
      );
      setIsFollowing(true);
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  const handleUnfollow = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/users/${user.id}/unfollow`,
        {
          headers: {
            'x-auth-token': `${localStorage.getItem('token')}`,
          },
        }
      );
      setIsFollowing(false);
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>{user.username}'s Profile</h2>
      <p>Email: {user.email}</p>
      {/* Conditionally render the follow/unfollow button */}
      {loggedInUsername !== user.username && (
        isFollowing ? (
          <button onClick={handleUnfollow}>Unfollow</button>
        ) : (
          <button onClick={handleFollow}>Follow</button>
        )
      )}
    </div>
  );
}

export default Profile;
