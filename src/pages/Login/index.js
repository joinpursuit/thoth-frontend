import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import './LoginPage.css';

import firebase from "../../firebase";
import { getAuth, signInWithPopup, GoogleAuthProvider, setPersistence, browserLocalPersistence } from "firebase/auth";

const LoginPage = ({ currentUser, setCurrentUser }) => {

  const navigate = useNavigate();

  const getOrCreateNewUser = async (firebaseUser) => {
    const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/create`, { 
      firebaseId: firebaseUser.uid, 
      email: firebaseUser.email 
    });
    setCurrentUser(firebaseUser)
  }

  useEffect(() => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    if(currentUser) {
      navigate("/modules");
    }

    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        if(auth.currentUser) {
          getOrCreateNewUser(auth.currentUser); 
        }
      })
      .catch(error => {
        console.log(error);
      })
    
  }, [])

  const onButtonClick = () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    return signInWithPopup(auth, provider)
      .then((result) => {
        getOrCreateNewUser(result.user);
      })
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
