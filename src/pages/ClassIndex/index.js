import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ClassCard from './ClassCard.jsx';
import './ClassesIndex.css';

const ClassesIndex = () => {
  const [classes, setClasses] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchClasses = async () => {
      const response = await axios.get(`${API_URL}/api/admin/classes`);
      setClasses(response.data);
    };

    fetchClasses();
  }, []);

  return (
    <div className="classes-index">
      <h1 className="classes-index__title">Our Classes</h1>

      <div className="classes-index__grid">
        {classes.map(course => (
          <ClassCard key={course.id} course={course} />
        ))}

        <div className="classes-index__create-card">
          <Link to="/admin/classes/new" className="classes-index__create-link">Create New Class</Link>
        </div>
      </div>
    </div>
  );
};

export default ClassesIndex;
