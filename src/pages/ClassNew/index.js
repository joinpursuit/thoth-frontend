import React, { useState, useEffect } from 'react';
import axios from 'axios';

import "./NewClassForm.css";

const NewClassForm = () => {
  const [className, setClassName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [courseTemplates, setCourseTemplates] = useState([]);

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchCourseTemplates = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/admin/course_templates/`);
        setCourseTemplates(response.data);
      } catch (error) {
        console.error('An error occurred while fetching the course templates', error);
      }
    };

    fetchCourseTemplates();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/api/admin/classes`, {
        name: className,
        template: selectedTemplate
      });
  
      if (response.status !== 201) {
        throw new Error('Error while creating class');
      }
  
      alert('Class created successfully!');
    } catch (error) {
      console.error(error);
      alert('An error occurred while creating the class');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New Class</h2>

      <label htmlFor="className">Class Name</label>
      <input
        id="className"
        type="text"
        value={className}
        onChange={(e) => setClassName(e.target.value)}
      />

      <label htmlFor="templateSelect">Select Course Template</label>
      <select id="templateSelect" value={selectedTemplate} onChange={(e) => setSelectedTemplate(e.target.value)}>
        <option value="">--Select a template--</option>
        {courseTemplates.map(template => (
          <option key={template.id} value={template.id}>{template.name}</option>
        ))}
      </select>

      <button type="submit">Create Class</button>
    </form>
  );
};

export default NewClassForm;
