import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router";
import ReactMarkdown from "react-markdown";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import TestEntry from "./Components/TestEntry";

import Loading from "./Loading";
import ChatWindow from "./Components/ChatWindow";

const API = process.env.REACT_APP_API_URL;
let codeTimer = null;

const Workspace = (props) => {
  const { topicId, exerciseId } = useParams();

  const [submission, setSubmission] = useState(null);
  const [problem, setProblem] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatMessage, setChatMessage] = useState("");
  const [currentView, setCurrentView] = useState("problem");
  const [lastRunResults, setLastRunResults] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [chatWindowActive, setChatWindowActive] = useState(false);

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
  }, []);

  const onCodeUpdate = (code) => {
    clearTimeout(codeTimer);
    codeTimer = setTimeout(async () => {
      await axios.put(`${API}/api/exercises/${exerciseId}/submissions/${submission.id}`, { content: code });
    }, 2000);
    setSubmission({
      ...submission,
      content: code,
    })
  }

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
      alert(`${data.filter((result) => result.passing).length} / ${data.length} tests passed!`);
    });
  }

  const problemView = () => {
    return (
      <>
        <h3>{ problem.name }</h3>
        <p>{ problem.content }</p>
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