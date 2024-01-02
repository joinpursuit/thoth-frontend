import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useParams } from 'react-router';
import './ClassMembers.css';

const API_URL = process.env.REACT_APP_API_URL;

const ClassMembers = () => {
  const [members, setMembers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [email, setEmail] = useState('');
  const { id } = useParams();

  useEffect(() => {
    const fetchMembersAndInvitations = async () => {
      const responseMembers = await axios.get(`${API_URL}/api/admin/classes/${id}/memberships`);
      setMembers(responseMembers.data || []);
      
      const responseInvitations = await axios.get(`${API_URL}/api/admin/classes/${id}/invitations`);
      setInvitations(responseInvitations.data || []);
    };

    fetchMembersAndInvitations();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const response = await axios.post(`${API_URL}/api/admin/classes/${id}/invitations`, { email });
  
      if (response.status === 201) {
        setEmail('');
    
        if (response.data.member) {
          setMembers([...members, response.data.member]);
        } else if (response.data.invitation) {
          setInvitations([...invitations, response.data.invitation]);
        }
      }
    } catch (error) {
      console.error(error);
      // handle error properly
    }
  };

  console.log(members, invitations)

  return (
    <div className="class-members">
      <h2 className="header">Members</h2>

      {members.map((member, index) => (
        <div key={index} className="member-card">
          <h3>{member.user.email}</h3>
        </div>
      ))}

      <h2 className="header">Invitations</h2>

      {invitations.map((invitation, index) => (
        <div key={index} className="invitation-card">
          <h3>{invitation.email}</h3>
        </div>
      ))}

      <form onSubmit={handleSubmit} className="member-invitation-form">
        <label htmlFor="email" className="form-label">Invite Member</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-input"
        />
        <button type="submit" className="form-button">Invite</button>
      </form>
    </div>
  );
};

export default ClassMembers;
