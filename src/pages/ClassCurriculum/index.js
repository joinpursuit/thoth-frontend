import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ClassCurriculum.css';
import { toast } from 'react-toastify';

const ClassCurriculum = () => {
  const [className, setClassName] = useState('');
  const [modules, setModules] = useState([]);
  const { id } = useParams();

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchClassData = async () => {
      const response = await axios.get(`${API_URL}/api/admin/classes/${id}`);
      setClassName(response.data.name);
      const moduleResponse = await axios.get(`${API_URL}/api/admin/classes/${id}/modules`);
      setModules(moduleResponse.data);
    };

    fetchClassData();
  }, [id]);

  const handleModuleChange = (index, field, value) => {
    const newModules = [...modules];
    newModules[index][field] = value;
    setModules(newModules);
  };

  const handleUpdateModule = async (index) => {
    const moduleToUpdate = modules[index];
    try {
      const response = await axios.put(`${API_URL}/api/admin/classes/${id}/modules/${moduleToUpdate.id}`, moduleToUpdate);
      if (response.statusText !== "OK") throw new Error('Error while updating module');

      const updatedModule = await response.data;
      setModules([
        ...modules.slice(0, index),
        updatedModule,
        ...modules.slice(index + 1)
      ]);
      toast.success('Module updated successfully!');
    } catch (error) {
      console.error(error);
      // handle error properly
      toast.error('An error occurred while updating the module');
    }
  };

  const handleTopicChange = async (modIndex, topIndex, field, value) => {
    const newModules = [...modules];
    newModules[modIndex].topics[topIndex][field] = value;
    setModules(newModules);
  };

  const handleUpdateTopic = async (modIndex, topIndex) => {
    const topicToUpdate = modules[modIndex].topics[topIndex];
    try {
      const response = await axios.put(`${API_URL}/api/admin/classes/${id}/modules/${modules[modIndex].id}/topics/${topicToUpdate.id}`, topicToUpdate);
      if (response.statusText !== "OK") throw new Error('Error while updating topic');

      const topicData = await response.json();
      const newModules = [...modules];
      newModules[modIndex].topics[topIndex] = topicData;
      setModules(newModules);
      toast.success('Topic updated successfully!');
    } catch (error) {
      console.error(error);
      // handle error properly
      toast.error('An error occurred while updating the topic');
    }
  };

  return (
    <div className="curriculum">
      <h2 className="curriculum-header">{className} Curriculum</h2>

      {modules.map((module, moduleIndex) => (
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

          {module.topics.map((topic, topicIndex) => (
            <div key={topicIndex} className="topic-form">
              <label htmlFor={`topic-name-${topicIndex}`} className="form-label">Topic Name</label>
              <input
                id={`topic-name-${topicIndex}`}
                type="text"
                value={topic.name}
                onChange={(e) => handleTopicChange(moduleIndex, topicIndex, 'name', e.target.value)}
                className="form-input"
              />
              <button type="button" onClick={() => handleUpdateTopic(moduleIndex, topicIndex)} className="form-button">Update Topic</button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ClassCurriculum;
