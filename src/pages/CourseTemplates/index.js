import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CourseTemplates.css';

const API = process.env.REACT_APP_API_URL;

const CourseTemplates = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${API}/api/admin/course_templates/`);
      const data = await response.json();
      setCourses(data);
    };

    fetchData();
  }, []);

  return (
    <div className="course-templates">
      {courses.map((course) => (
        <div key={course.id} className="course-card">
          <Link to={`/admin/course-templates/${course.id}/edit`} className="course-card-link">
            <h2 className="course-card-title">{course.name}</h2>
          </Link>
        </div>
      ))}
      <div className="course-card">
        <Link to="/admin/course-templates/new" className="course-card-link">
          <h2 className="course-card-title">Create Course Template</h2>
        </Link>
      </div>
    </div>
  );
};

export default CourseTemplates;
