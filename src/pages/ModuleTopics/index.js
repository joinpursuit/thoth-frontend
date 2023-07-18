import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import './ModuleTopics.css';

const API_URL = process.env.REACT_APP_API_URL;

const ModuleTopics = () => {
  const [topics, setTopics] = useState([]);
  const { classId, moduleId } = useParams();

  useEffect(() => {
    const fetchTopics = async () => {
      const res = await axios.get(`${API_URL}/api/classes/${classId}/modules/${moduleId}/topics`);
      setTopics(res.data);
    }
    fetchTopics();
  }, [classId, moduleId]);

  return (
    <div className="content-container">
      <h1>Topics</h1>
      <p>
        Here are the topics for the module you've selected. Choosing a topic will bring you to a list of exercises for that topic.
      </p>
      <div className="module-topics">
        {topics.map(topic => (
          <Link to={`/classes/${classId}/modules/${moduleId}/topics/${topic.id}/exercises`}>
            <div className="topic-card" key={topic.id}>
              <h3 className="topic-title">{topic.name}</h3>
              <p className="topic-description">{topic.description}</p>
            </div>
          </Link>
          
        ))}
      </div>
    </div>
    
  );
};

export default ModuleTopics;
