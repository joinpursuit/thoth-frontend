import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router';
import './CreateCourseTemplate.css';

const API = process.env.REACT_APP_API_URL;

const CreateCourseTemplate = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await axios.post(`${API}/api/admin/course_templates`, { name });
    const { data } = result || {};
    if(data) {
      navigate("/admin/course-templates");
    }
  };

  return (
    <div className="create-course-template">
      <form onSubmit={handleSubmit}>
        <label htmlFor="name" className="form-label">
          Course Template Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="form-input"
        />
        <button type="submit" className="form-button">Create</button>
      </form>
    </div>
  );
};

export default CreateCourseTemplate;
