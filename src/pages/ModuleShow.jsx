import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

const API = process.env.REACT_APP_API_URL;

export default function ModuleShow({ userId }) {
  let { moduleId } = useParams();
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    if(userId) {
      axios.get(`${API}/api/modules/${moduleId}?firebaseId=${userId}`).then(({data}) => {
        setTopics(data.module.topics);
      })
    }
  }, [userId, moduleId]);

  return (
    <div className="page">
      <div class="sidebar">
        <h2>Sidebar</h2>
        <p>This is the sidebar content.</p>
      </div>
      <div class="content">
        {
          topics.map(topic => {
            return (
              <Link to={`/topics/${topic.id}/practice`}>
                <div className="topic">
                  <h3 className="section-header">{topic.name}</h3>
                  <span>Current Level: Proficient</span>
                </div>
              </Link>
            )
          })
        }
      </div>
    </div>
  )
}