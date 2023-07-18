import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import './ClassModules.css';

const API_URL = process.env.REACT_APP_API_URL;

const ClassModules = () => {
  const [modules, setModules] = useState([]);
  const { classId } = useParams();

  useEffect(() => {
    const fetchModules = async () => {
      const res = await axios.get(`${API_URL}/api/classes/${classId}/modules`);
      setModules(res.data);
    }
    fetchModules();
  }, [classId]);

  return (
    <div className="content-container">
      <h1>Modules</h1>
      <p>
        This is the modules view for your class. Here you can select the relevant module that you want to get some practice in.
      </p>
      <div className="class-modules">
        {modules.map(module => (
          <Link to={`/classes/${classId}/modules/${module.id}/topics`} key={module.id}>
            <div className="module-card">
              <h3 className="module-title">{module.name}</h3>
              <p className="module-description">{module.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
    
  );
};

export default ClassModules;
