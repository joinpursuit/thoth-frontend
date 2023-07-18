import React from 'react';
import { Link } from 'react-router-dom';
import './ClassCard.css';

const ClassCard = ({ course }) => (
  <div className="class-card">
    <h2 className="class-card__title">{course.name}</h2>
    <p className="class-card__description">{course.description}</p>
    <Link to={`/admin/classes/${course.id}`} className="class-card__link">View Details</Link>
  </div>
);

export default ClassCard;
