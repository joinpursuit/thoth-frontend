import React from 'react';
import { Link, useParams } from 'react-router-dom';
import './ClassView.css';

const ClassView = () => {
  const { id } = useParams();

  return (
    <div className="class-view">
      <h2 className="class-view-header">Class View</h2>

      <Link to={`/admin/classes/${id}/members`}>
        <div className="class-view-card">
          <h3 className="class-view-card-header">Members</h3>
          <p className="class-view-card-description">View the members of this class</p>
        </div>
      </Link>

      <Link to={`/admin/classes/${id}/curriculum`}>
        <div className="class-view-card">
          <h3 className="class-view-card-header">Curriculum</h3>
          <p className="class-view-card-description">View the curriculum for this class</p>
        </div>
      </Link>
    </div>
  );
};

export default ClassView;
