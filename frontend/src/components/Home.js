import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Home() {
  const [posts, setPosts] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem("token");

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/posts`, {
        params: {
          page: currentPage,
          limit: 10,
        },
      });
      setPosts(response.data.posts);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("There was an error fetching the posts!", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [currentPage,isLiked]);


  const handleLike = async (postId) => {
    try {
      if (!isAuthenticated) {
        navigate("/login");
      } else {
        const token = localStorage.getItem("token");
        const response = await axios.post(
          `http://localhost:5000/api/posts/${postId}/like`,
          {},
          {
            headers: {
              'x-auth-token': `${token}`,
            },
          }
        );
        console.log(response.data);
        // Optionally, refresh the list of posts after liking
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId ? { ...post, likes: post.likes + 1 } : post
          )
        );
        setIsLiked(!isLiked)
      }
    } catch (error) {
      console.error("There was an error liking the post!", error);
      navigate("/login");
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="container">
      <h2>Posts</h2>
      {posts.length > 0 ? (
        posts.map((post) => (
          <div className="post" key={post.id}>
            <p>{post.content}</p>
            <Link to={`/profile/${post.user.username}`}>
              <small className="button">By User : {post.user.username}</small>
            </Link>
            <p className="likes">Likes: {post.likes}</p>
            <button onClick={() => handleLike(post.id)}>Like</button>
          </div>
        ))
      ) : (
        <p>No posts to display.</p>
      )}

      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
}

export default Home;
