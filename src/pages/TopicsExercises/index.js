import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TopicExercises.css';
import { useNavigate, useParams } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL;

const TopicExercises = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const { classId, moduleId, topicId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExercises = async () => {
      const res = await axios.get(`${API_URL}/api/classes/${classId}/modules/${moduleId}/topics/${topicId}/exercises`);
      setExercises(res.data);
    }
    fetchExercises();
  }, [classId, moduleId, topicId]);

  const createExercise = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/classes/${classId}/modules/${moduleId}/topics/${topicId}/exercises`);
      setExercises([...exercises, res.data]);
      setLoading(false);
    } catch (error) {
      console.error('Error creating new exercise', error);
      setLoading(false);
    }
  }

  const onExerciseClick = (exerciseId) => {
    navigate(`/classes/${classId}/modules/${moduleId}/topics/${topicId}/exercises/${exerciseId}`);
  };

  return (
    <div className="content-container">
      <h1>Exercises</h1>
      <p>
        These are the exercises for the topic you've selected. Selecting one of these will take you to a workspace where you can start working on the problem.
      </p>
      <div className={`new-exercise-card ${loading ? 'loading' : ''}`} onClick={loading ? null : createExercise}>
        {loading ? 'Creating...' : '+ Create New Exercise'}
      </div>
      <div className="topic-exercises">
        {exercises.map(exercise => {

          const hasSubmission = (exercise?.submissions?.length || 0) > 0;
          const completed = hasSubmission && exercise.submissions[0].passing;

          return (
            <div className={`exercise-card ${hasSubmission && !completed ? "in-progress" : ""} ${completed ? "completed" : ""}`} onClick={() => onExerciseClick(exercise.id)}>
              <h3 className="exercise-title">{exercise.name}</h3>
            </div>
          )})
        }
      </div>
    </div>
  );
};

export default TopicExercises;
