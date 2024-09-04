// src/components/CreatePost.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreatePost() {
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  // src/components/CreatePost.js
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content) {
      alert("Post content cannot be empty!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/posts",
        { content },
        {
          headers: {
            'x-auth-token': `${token}`,
          },
        }
      );
      console.log(response.data);
      alert("Post created");
      navigate("/")
    } catch (error) {
      console.error("There was an error creating the post!", error);
      alert("An error occurred while creating the post. Please try again.");
    }
  };

  return (
    <div>
      <h2>Create a New Post</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">Post</button>
      </form>
    </div>
  );
}

export default CreatePost;
