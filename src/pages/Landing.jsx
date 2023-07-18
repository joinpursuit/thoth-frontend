import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const navigateToLogin = () => {  
    navigate("/login");
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundImage: 'url("https://global-uploads.webflow.com/5f6cc9cd16d59d990c8fca33/6253621fbc21de5a2a444790_diverse-stock-photography.jpg")',
      backgroundSize: 'cover',
      height: '100vh',
    },
    overlay: {
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '50px',
      borderRadius: '10px',
    },
    header: {
      fontSize: '3em',
      fontWeight: 'bold',
    },
    button: {
      marginTop: '2em',
      padding: '10px 20px',
      fontSize: '1em',
      fontWeight: 'bold',
      backgroundColor: '#008CBA',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    text: {
      marginTop: '1em',
      fontSize: '1.2em',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay}>
        <h1 style={styles.header}>Pursuit</h1>
        <p style={styles.text}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        <button style={styles.button} onClick={navigateToLogin}>Go to Login</button>
      </div>
    </div>
  );
};


export default LandingPage;