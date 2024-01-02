import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router";
import AceEditor from "react-ace";
import Markdown from "react-markdown";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";

import TestEntry from "./Components/TestEntry";
import Loading from "./Loading";
import ChatWindow from "./Components/ChatWindow";
import File from "./Components/File";

const API = process.env.REACT_APP_API_URL;
let codeTimer = null;

const Workspace = (props) => {
  const { exerciseId, classId, moduleId, topicId } = useParams();

  const [submission, setSubmission] = useState(null);
  const [problem, setProblem] = useState(null);
  const [currentView, setCurrentView] = useState("problem");
  const [lastRunResults, setLastRunResults] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [chatWindowActive, setChatWindowActive] = useState(false);
  const [openFiles, setOpenFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState(0);
  const [nextFile, setNextFile] = useState(null);
  const [currentContent, setCurrentContent] = useState("");

  const navigate = useNavigate();

  const reloadFiles = async () => {
    const resp = await axios.get(`${API}/api/exercises/${exerciseId}`);
    const exercise = resp.data;
    let currentSub = exercise.submissions.pop();
    setSubmission(currentSub);
  }

  useEffect(() => {
    async function getData() {
      const resp = await axios.get(`${API}/api/exercises/${exerciseId}`);
      const exercise = resp.data;
      let currentSub = exercise.submissions.pop();
      
      setSubmission(currentSub);
      setProblem(exercise);
    }

    getData();
  }, [exerciseId]);

  useEffect(() => {
    // When first loading the submission, set the open files
    if(submission) {
      const fileIndex = submission.files.findIndex(file => file.fileName === "index.js");

      setOpenFiles([submission.files[fileIndex]]);
    }
  }, [submission])

  useEffect(() => {
    if(currentFile >= 0 && currentFile < openFiles.length) {
      setCurrentContent(openFiles[currentFile].content);
    }
  }, [currentFile, openFiles]);

  useEffect(() => {
    reloadFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextFile, exerciseId]);

  const onCodeUpdate = (code) => {
    clearTimeout(codeTimer);

    setCurrentContent(code);
    
    setSubmitting(true);
  }

  useEffect(() => {
    if(currentFile >= 0 && submitting) {
      codeTimer = setTimeout(async () => {

        const file = openFiles[currentFile];

        await axios.put(
          `${API}/api/exercises/${exerciseId}/submissions/${submission.id}/files/${file.id}`, 
          { content: currentContent }
        );

        setOpenFiles([...openFiles.slice(0, currentFile), {
          ...openFiles[currentFile],
          content: currentContent,
        }, ...openFiles.slice(currentFile + 1)]);
        setSubmitting(false);
      }, 1000);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentContent, submitting, exerciseId, submission?.id])

  const onTabClick = (tab) => {
    return (e) => {
      e.preventDefault();
      setCurrentView(tab);
    }
  }

  const onVerifyClick = () => {

    if(submitting) {
      return;
    }

    // Make an empty post request to /:exerciseId/submissions/:submissionId/run, then finish
    setSubmitting(true);
    axios.post(`${API}/api/exercises/${exerciseId}/submissions/${submission.id}/run`).then(({data}) => {
      setLastRunResults(data);
      setSubmitting(false);
      if(data.failed.length === 0) {
        navigate(`/classes/${classId}/modules/${moduleId}/topics/${topicId}/exercises`)
      }
    });
  }

  const problemView = () => {
    return (
      <>
        <h3>{ problem.name }</h3>
        <Markdown>{ problem.content }</Markdown>
      </>
    )
  }

  const testView = () => {
    const testData = JSON.parse(problem.testData);
    return (
      <>
        {  
          testData.map((data, i) => {
            return (
              <TestEntry key={data.input} testEntry={data} idx={i + 1} lastRunResults={lastRunResults} />
            )
          })
        }
      </>
    );
  }

  const onFileSelect = (file) => {
    if(submitting) {
      return;
    }
    if(!openFiles.some(f => f.id === file.id)) {
      setOpenFiles([...openFiles, file]);
    }

    const fileIndex = openFiles.findIndex(f => f.id === file.id);
    setCurrentFile(fileIndex);
    setCurrentContent(file.content);
  }

  const filesView = () => {
    // On open handler for when we click on a file
    const handleFileClick = (file) => {
      if(!file.isFolder) {
        const fileIndex = openFiles.findIndex(f => f.id === file.id);
        setCurrentFile(fileIndex);
      }
    }

    const onAddFile = () => {
      setNextFile({
        fileName: ""
      });
    }

    return (
      <>
        <div className="main-file-controls">
          <span onClick={onAddFile}>Add File</span>
        </div>
        {submission.files.map((file) => (
          <File 
            key={file.id} 
            id={file.id} 
            fileName={file.fileName} 
            content={file.content}
            onOpen={handleFileClick} 
            onUpdate={reloadFiles}
            isFolder={file.isFolder} 
            submissionId={submission.id}
            onSelect={() => onFileSelect(file)}
          />
        ))}
        {
          nextFile ? (
            <File 
              key={"new"} 
              id={null} 
              fileName={nextFile.fileName} 
              isFolder={true}
              submissionId={submission.id}
              onCreate={() => setNextFile(null)}
            />
          ) : (
            null
          )
        }
      </>
    );
  }

  const renderCurrentView = () => {
    switch(currentView) {
      case "problem":
        return problemView();
      case "tests":
        return testView();
      case "files":
        return filesView();
      default:
        return null;
    }
  }

  if(!problem) {
    return (
      <Loading />
    )
  }

  return (
    <div className="page">
      <div className="verify-container">
        <button onClick={onVerifyClick}>{ submitting ? "Verifying..." : "Verify" }</button>
      </div>
      <div className="workspace-problem">
        <div className="workspace-tabs">
          <span className={`workspace-tab ${currentView === "problem" ? "active" : ""}`} onClick={onTabClick("problem")}>
            Problem
          </span>
          <span className={`workspace-tab ${currentView === "tests" ? "active" : ""}`} onClick={onTabClick("tests")}>
            Tests
          </span>
          <span className={`workspace-tab ${currentView === "files" ? "active" : ""}`} onClick={onTabClick("files")}>
            Files
          </span>
        </div>
        { renderCurrentView() }
      </div>
      <div className="workspace-code">
        <div className="workspace-file-tabs">
          {
            openFiles.map((file, i) => {
              return (
                <div key={file.id} className={`workspace-file-tab ${i === currentFile ? "active" : ""}`} onClick={() => onFileSelect(file)}>
                  {file.fileName}
                </div>
              );
            })
          }
        </div>
        <AceEditor
          mode="javascript"
          theme="monokai"
          onChange={onCodeUpdate}
          value={currentContent}
          width="100%"
          height="100%"
          setOptions={{useWorker: false}}
        />
      </div>
      {
        chatWindowActive ? (
          <ChatWindow exerciseId={problem.id} submissionId={submission.id} />
        ) : (
          <div className="chat-toggle" onClick={() => setChatWindowActive(true)}>
            <i className="fa-solid fa-comment"></i>
          </div>
        )
      }
      
    </div>
  )
}

export default Workspace;