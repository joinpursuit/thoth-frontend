import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import './LoginPage.css';

import { getAuth, signInWithPopup, GoogleAuthProvider, setPersistence, browserLocalPersistence } from "firebase/auth";

const LoginPage = ({ currentUser, setCurrentUser }) => {

  const navigate = useNavigate();  

  if(currentUser) {
    navigate("/dashboard");
  }

  const login = async () => {
    const auth = getAuth();
    console.log(auth.currentUser);
    if(auth.currentUser) {
      try {
        const result = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/login`, {
          email: auth.currentUser.email,
          firebaseId: auth.currentUser.uid
        });
        setCurrentUser(result.data);
      }
      catch(e) {
        signup();
      }
    }
  }

  const signup = async () => {
    const auth = getAuth();
    const firebaseUser = auth.currentUser;
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/users/create`, { 
        firebaseId: firebaseUser.uid, 
        email: firebaseUser.email,
      });
      setCurrentUser(firebaseUser)
    }
    catch(e) {
      console.log(e);
    }
    
  };

  useEffect(() => {
    const auth = getAuth();

    const keepUserLoggedIn = async () => {
      if(auth.currentUser && !currentUser) {
        try {
          login();
          await setPersistence(auth, browserLocalPersistence);
        }
        catch(e) {
          console.log(e);
        }
      }
    }

    keepUserLoggedIn();

    if(currentUser) {
      navigate("/dashboard");
    }
    
  }, [currentUser])

  const onButtonClick = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    await signInWithPopup(auth, provider);
    login();
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h6 className="login-text">
          Use of this application is limited to Pursuit fellows. Please access the site with your Pursuit email.
        </h6>
        <button className="login-button" onClick={onButtonClick}>
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
