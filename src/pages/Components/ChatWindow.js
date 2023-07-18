import { useEffect, useState } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

const ChatWindow = ({ exerciseId, submissionId }) => {
  const [minimize, setMinimize] = useState(false);
  const [chatLog, setChatLog] = useState([]);
  const [chatMessage, setChatMessage] = useState("");

  // Get all messages for the current submission belonging to the exercise and store them in state
  useEffect(() => {
    fetch(`${API}/api/exercises/${exerciseId}/submissions/${submissionId}/messages`)
      .then(res => res.json())
      .then(data => {
        // Sort the messages by timestamp
        const sortedData = data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setChatLog(sortedData);
      });
  }, []);

  const onMinimize = () => {
    setMinimize(!minimize);
  }

  const onInputChange = (e) => {
    e.preventDefault();
    setChatMessage(e.target.value)
  }

  const onSend = (e) => {
    e.preventDefault();
    let value = chatMessage;
    setChatMessage("");
    let nextMessages = [...chatLog, { content: chatMessage, userId: "exists" }];
    setChatLog([...nextMessages]);
    axios.post(`${API}/api/exercises/${exerciseId}/submissions/${submissionId}/messages`, { content: value }).then(({data}) => {
      setChatLog([...nextMessages, data]);
    });
  }

  return (
    <div className={`chat-window ${minimize ? "minimize" : ""}`}>
      <div className="chat-window-header">
        <div className="chat-window-icon chat-window-close">
          ❌
        </div>
        <div className="chat-window-icon chat-window-minimize" onClick={onMinimize}>
          {
            minimize ? (
              "➕"
            ) : (
              "➖"
            )
          }
        </div>
      </div>
      <div className="chat-window-body">
      {
        chatLog.map((message, i) => (
          <div key={i} className={`chat-message chat-message-${message.userId ? "human" : "bot"}`}>
            <div className="chat-message-content">
              {message.content}
            </div>
            <div className="chat-message-timestamp">
              {new Date(message.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))
      }
      </div>
      <form onSubmit={onSend} className="chat-window-input">
        <input type="text" placeholder="Type a message..." value={chatMessage} onChange={onInputChange} />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}

export default ChatWindow;