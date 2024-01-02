import { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import "./File.css";

const API = process.env.REACT_APP_API_URL;

export default function File({ id, fileName, onOpen, onDelete, submissionId, isFolder, content, onCreate, onUpdate, onSelect }) {
  const { exerciseId } = useParams();


  const [name, setName] = useState(fileName);
  const [isEditingName, setIsEditingName] = useState(!fileName);

  const onInputBlur = async () => {
    if(!id) {
      await axios.post(`${API}/api/exercises/${exerciseId}/submissions/${submissionId}/files`, {
        fileName: name,
        content: "",
        isFolder,
      });
      onCreate();
    }
    else {
      await axios.put(`${API}/api/exercises/${exerciseId}/submissions/${submissionId}/files/${id}`, {
        fileName: name,
        content: content,
      });
    }
    setIsEditingName(false);
  }

  const onFileDelete = async () => {
    await axios.delete(`${API}/api/exercises/${exerciseId}/submissions/${submissionId}/files/${id}`);
    onUpdate();
  }

  return (
    <div className="file" onClick={onSelect}>
      <div className="file-details">
        {isEditingName ? (
          <input value={name} onChange={e => setName(e.target.value)} onBlur={onInputBlur} />
        ) : (
          <span>{name}</span>
        )}
      </div>
      {
        fileName && fileName !== "index.js" ? (
          <div className="file-controls">
            <div onClick={e => { e.stopPropagation(); setIsEditingName(true) }}>
              <i class="fa-solid fa-pen"></i>
            </div>
            <div onClick={(e) => { e.stopPropagation(); onFileDelete(); }}>
              <i class="fa-solid fa-trash"></i>
            </div>
          </div>
        ) : (
          null
        )
      }
      
    </div>
  );
}