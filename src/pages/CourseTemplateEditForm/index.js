import React, { useState, useEffect } from 'react';
import './CourseTemplateEditForm.css';
import axios from "axios";
import { useParams } from 'react-router';
import { toast } from 'react-toastify';

const CourseTemplateEditForm = () => {
  const [courseName, setCourseName] = useState('');
  const [moduleTemplates, setModuleTemplates] = useState([]);
  const { id } = useParams();

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchModuleTemplates = async () => {
      const course = await axios.get(`${API_URL}/api/admin/course_templates/${id}`);
      setCourseName(course.data.name);
      const response = await axios.get(`${API_URL}/api/admin/course_templates/${id}/module_templates`);
      setModuleTemplates(response.data);
    };

    fetchModuleTemplates();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const response = await axios.put(`${API_URL}/api/admin/course_templates/${id}`, {
        name: courseName
      });
  
      if (response.statusText !== "OK") throw new Error('Error while updating course name');
  
      toast.success('Course name updated successfully!');
    } catch (error) {
      console.error(error);
      // handle error properly
      toast.error('An error occurred while updating the course name');
    }
  };

  const handleAddModule = async () => {
    const newModule = { name: '', objectives: '' };
    try {
      const response = await axios.post(`${API_URL}/api/admin/course_templates/${id}/module_templates`, newModule);
      if (response.statusText !== "Created") throw new Error('Error while adding module');

      const moduleData = response.data;
      setModuleTemplates([
        ...moduleTemplates,
        moduleData,
      ]);

      toast.success('Module added successfully!');
    } catch (error) {
      console.error(error);
      // handle error properly
    }
  };

  const handleUpdateModule = async (index) => {
    const moduleToUpdate = moduleTemplates[index];
    try {
      const response = await axios.put(`${API_URL}/api/admin/course_templates/${id}/module_templates/${moduleToUpdate.id}`, moduleToUpdate);
      if (response.statusText !== "OK") throw new Error('Error while updating module');

      const updatedModule = await response.data;
      setModuleTemplates([
        ...moduleTemplates.slice(0, index),
        updatedModule,
        ...moduleTemplates.slice(index + 1)
      ]);
      toast.success('Module updated successfully!');
    } catch (error) {
      console.error(error);
      // handle error properly
    }
  };

  const handleDeleteModule = async (index) => {
    const moduleToDelete = moduleTemplates[index];
    try {
      const response = await axios.delete(`${API_URL}/api/admin/course_templates/${id}/module_templates/${moduleToDelete.id}`);
      if (response.statusText !== "OK") throw new Error('Error while deleting module');

      setModuleTemplates([
        ...moduleTemplates.slice(0, index),
        ...moduleTemplates.slice(index + 1)
      ]);
      toast.success('Module deleted successfully!');
    } catch (error) {
      console.error(error);
      // handle error properly
    }
  };

  const handleModuleChange = (index, field, value) => {
    const newModuleTemplates = [...moduleTemplates];
    newModuleTemplates[index][field] = value;
    setModuleTemplates(newModuleTemplates);
  };

  const handleAddTopic = async (modIndex) => {
    const newTopic = { name: '', objectives: '' };
    const modId = moduleTemplates[modIndex].id;
  
    try {
      const response = await axios.post(`${API_URL}/api/admin/course_templates/${id}/module_templates/${modId}/topic_templates`, newTopic);
      console.log(response);
      if (response.statusText !== "Created") throw new Error('Error while adding topic');
  
      const topicData = await response.data;
  
      setModuleTemplates(prevModuleTemplates => {
        const newModuleTemplates = [...prevModuleTemplates];
        newModuleTemplates[modIndex].topics = [...newModuleTemplates[modIndex].topics, topicData];
        return newModuleTemplates;
      });
      toast.success('Topic added successfully!');
    } catch (error) {
      console.error(error);
      // handle error properly
    }
  };
  

  const handleDeleteTopic = async (modIndex, topIndex) => {
    const topicToDelete = moduleTemplates[modIndex].topics[topIndex];
    try {
      const response = await axios.delete(`${API_URL}/api/admin/course_templates/${id}/module_templates/${moduleTemplates[modIndex].id}/topic_templates/${topicToDelete.id}`);
      if (response.statusText !== "OK") throw new Error('Error while deleting topic');

      const newModuleTemplates = [...moduleTemplates];
      newModuleTemplates[modIndex].topics = [
        ...newModuleTemplates[modIndex].topics.slice(0, topIndex),
        ...newModuleTemplates[modIndex].topics.slice(topIndex + 1),
      ];
      setModuleTemplates(newModuleTemplates);
      toast.success('Topic deleted successfully!');
    } catch (error) {
      console.error(error);
      // handle error properly
    }
  };


  const handleTopicChange = async (modIndex, topIndex, field, value) => {
    const newModuleTemplates = [...moduleTemplates];
    newModuleTemplates[modIndex].topics[topIndex][field] = value;
    setModuleTemplates(newModuleTemplates);
  };
  
  const handleUpdateTopic = async (modIndex, topIndex) => {
    const topicToUpdate = moduleTemplates[modIndex].topics[topIndex];
    try {
      const response = await axios.put(`${API_URL}/api/admin/course_templates/${id}/module_templates/${moduleTemplates[modIndex].id}/topic_templates/${topicToUpdate.id}`, topicToUpdate);
      if (response.statusText !== "OK") throw new Error('Error while updating topic');
  
      const topicData = response.data;
      const newModuleTemplates = [...moduleTemplates];
      newModuleTemplates[modIndex].topics[topIndex] = topicData;
      setModuleTemplates(newModuleTemplates);
      toast.success('Topic updated successfully!');
    } catch (error) {
      console.error(error);
      // handle error properly
    }
  };

  return (
    <form onSubmit={handleSubmit} className="course-edit-form">
      <h2 className="form-header">Edit Course Template</h2>

      <label htmlFor="courseName" className="form-label">Course Name</label>
      <input
        id="courseName"
        type="text"
        value={courseName}
        onChange={(e) => setCourseName(e.target.value)}
        className="form-input"
      />

      {moduleTemplates.map((module, moduleIndex) => (
        <div key={moduleIndex} className="module-form">
          <label htmlFor={`name-${moduleIndex}`} className="form-label">Module Name</label>
          <input
            id={`name-${moduleIndex}`}
            type="text"
            value={module.name}
            onChange={(e) => handleModuleChange(moduleIndex, 'name', e.target.value)}
            className="form-input"
          />
          <button type="button" onClick={() => handleUpdateModule(moduleIndex)} className="form-button">Update Module</button>
          <button type="button" onClick={() => handleDeleteModule(moduleIndex)} className="form-button">Delete Module</button>
        
          {module.topics.map((topic, topicIndex) => (
            <div key={topicIndex} className={`topic-form ${topicIndex % 2 === 0 ? 'topic-even' : 'topic-odd'}`}>
              <label htmlFor={`topic-name-${moduleIndex}-${topicIndex}`} className="form-label">Topic Name</label>
              <input
                id={`topic-name-${moduleIndex}-${topicIndex}`}
                type="text"
                value={topic.name}
                onChange={(e) => handleTopicChange(moduleIndex, topicIndex, 'name', e.target.value)}
                className="form-input"
              />

              <label htmlFor={`topic-objectives-${moduleIndex}-${topicIndex}`} className="form-label">Topic Objectives</label>
              <textarea
                id={`topic-objectives-${moduleIndex}-${topicIndex}`}
                value={topic.objectives}
                onChange={(e) => handleTopicChange(moduleIndex, topicIndex, 'objectives', e.target.value)}
                className="form-textarea"
              />

      <button type="button" onClick={() => handleUpdateTopic(moduleIndex, topicIndex)} className="form-button">Update Topic</button>
              <button type="button" onClick={() => handleDeleteTopic(moduleIndex, topicIndex)} className="form-button">Delete Topic</button>
            </div>
          ))}

          <button type="button" onClick={() => handleAddTopic(moduleIndex)} className="form-button">Add Topic</button>

        </div>
      ))}

      <button type="button" onClick={handleAddModule} className="form-button">Add Module</button>
      <button type="submit" className="form-button" onClick={handleSubmit}>Save</button>
    </form>
  );
};

export default CourseTemplateEditForm;
