import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import './PageWrapper.css';
import { Link } from 'react-router-dom';

const PageWrapper = ({ children, currentUser, loginRequired=false }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    // Attach the listeners on component mount.
    document.addEventListener("mousedown", handleClickOutside);
    // Detach the listeners on component unmount.
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navigateToLogin = () => {
    navigate("/login");
  }

  function renderProfile() {
    const userData = currentUser.providerData[0];
    return (
      <>
        <img 
          className="profile-image" 
          src={userData.photoURL} 
          alt="Profile" 
          onClick={() => setDropdownOpen(!isDropdownOpen)}
        />
        {isDropdownOpen && (
          <div className="dropdown-menu">
            <a href="/admin">Admin</a>
            <a href="/dashboard">Dashboard</a>
            <a href="/profile-settings">Profile Settings</a>
            <a href="/logout">Logout</a>
          </div>
        )}
      </>
    )
  }

  if(!currentUser && loginRequired) {
    return (
      <div>
        Loading...
      </div>
    )
  }

  return (
    <div className="page-wrapper">
      <header className="page-header">
        <h1>
          {
            currentUser ? (
              <Link to="/dashboard">
                Pursuit
              </Link>
            ) : (
              null
            )
          }
        </h1>
        <div className="profile-section" ref={ref}>
          {
            currentUser ? (
              renderProfile()
            ) : (
              <button className="login-button" onClick={navigateToLogin}>
                Log In
              </button>
            )
          }
          
        </div>
      </header>
      <div className="page-content">
        {children}
      </div>
    </div>
  );
};

export default PageWrapper;
