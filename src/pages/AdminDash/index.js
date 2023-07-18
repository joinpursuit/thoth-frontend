import React from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <div className="admin-card">
        <Link to="/admin/course-templates" className="admin-card-link">
          <h2 className="admin-card-title">View Course Templates</h2>
        </Link>
      </div>
      <div className="admin-card">
        <Link to="/admin/classes" className="admin-card-link">
          <h2 className="admin-card-title">View Classes</h2>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
