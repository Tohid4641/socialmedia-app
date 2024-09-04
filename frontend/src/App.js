// src/App.js
import React from "react";
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import CreatePost from "./components/CreatePost";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";

function App() {
  const isAuthenticated = !!localStorage.getItem("token"); // Check if the user is authenticated
  const username = localStorage.getItem("username");

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/" /> : <Register />}
          />
          <Route
            path="/create-post"
            element={isAuthenticated ? <CreatePost /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile/:username"
            element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
