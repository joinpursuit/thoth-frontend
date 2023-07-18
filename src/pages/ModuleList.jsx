import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API = process.env.REACT_APP_API_URL;

export default function ModuleList({ currentUser }) {
  
  const [modules, setModules] = useState([]);

  useEffect(() => {
    axios.get(`${API}/api/modules`).then(({data}) => {
      setModules(data);
    });
  }, []);

  console.log(modules);
  
  return (
    <div className="page">
      <div class="sidebar">
        <h2>Sidebar</h2>
        <p>This is the sidebar content.</p>
      </div>

      <div class="content">
        <h2>Main Content</h2>
        <div className="module-container">
          {
            modules.map(mod => {
              return (
                <Link to={`/modules/${mod.id}`}>
                  <div className="module">
                    <h3 className="section-header">{ mod.name }</h3>
                    <span>Current Progress: 83%</span>
                  </div>
                </Link>
              )
            })
          }
        </div>
      </div>
    </div>
  )
};