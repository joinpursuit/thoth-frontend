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

  const navigate = useNavigate();

  useEffect(() => {
    async function getData() {
      const resp = await axios.get(`${API}/api/exercises/${exerciseId}`);
      const exercise = resp.data;
      let currentSub = exercise.submissions.pop();
      if(!currentSub) {
        let response = await axios.post(`${API}/api/exercises/${exerciseId}/submissions`);
        currentSub = response.data;
      }
      setSubmission(currentSub);
      setProblem(exercise);
    }

    getData();
  }, [exerciseId]);

  const onCodeUpdate = (code) => {
    clearTimeout(codeTimer);
    setSubmission({
      ...submission,
      content: code,
    })
    setSubmitting(true);
  }

  useEffect(() => {
    if(submission) {
      setSubmitting(false);
      codeTimer = setTimeout(async () => {
        await axios.put(
          `${API}/api/exercises/${exerciseId}/submissions/${submission.id}`, 
          { content: submission.content }
        );
        
      }, 1000);
    }
  }, [submission])

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
              <TestEntry testEntry={data} idx={i + 1} lastRunResults={lastRunResults} />
            )
          })
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
        </div>
        { renderCurrentView() }
      </div>
      <div className="workspace-code">
        <AceEditor
          mode="javascript"
          theme="monokai"
          onChange={onCodeUpdate}
          value={submission.content}
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
            💬
          </div>
        )
      }
      
    </div>
  )
}

export default Workspace;