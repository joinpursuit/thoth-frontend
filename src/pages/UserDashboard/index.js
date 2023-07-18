import React, { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './UserDashboard.css';

const API_URL = process.env.REACT_APP_API_URL;

const UserDashboard = ({ currentUser }) => {
  const [memberships, setMemberships] = useState([]);
  const [invitations, setInvitations] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {

      const user = currentUser;

      if (user) {
        const membershipResponse = await axios.get(`${API_URL}/api/classes/memberships`, {
          params: { email: user.email },
        });
        setMemberships(membershipResponse.data);

        const invitationResponse = await axios.get(`${API_URL}/api/classes/invitations`, {
          params: { email: user.email },
        });
        setInvitations(invitationResponse.data);
      }
    };

    fetchData();
  }, [currentUser]);

  const onClassClick = (id) => {
    navigate(`/classes/${id}`);
  };

  const onInvitationClick = (id) => {
    navigate(`/invitations/${id}`);
  };

  return (
    <div className="user-dashboard">
      <h2>Your Classes</h2>
      <p>
        The classes that you're already registered for are listed below. You can access them to see what modules exist for that class.
      </p>
      <div className="class-card-container">
        {memberships.map((membership) => (
          <div className="class-card" onClick={() => onClassClick(membership.id)}>
            {membership.name}
          </div>
        ))}
      </div>
      <h2>Your Invitations</h2>
      <p>These are invitations to classes you can join. </p>
      {invitations.map((invitation) => (
        <div className="class-card" onClick={() => onInvitationClick(invitation.id)}>
          {invitation.name}
        </div>
      ))}
    </div>
  );
};

export default UserDashboard;
