"use client";
import React, { useState } from "react";
import axios from "axios";

function App() {
  const [storyText, setStoryText] = useState("");
  const [taskType, setTaskType] = useState("grammar");
  const [responseText, setResponseText] = useState("");

 
  const handleStream = async () => {
    setResponseText("");
    const wordCount = storyText.split(" ").length;
    await axios.post("http://localhost:8000/api/stream-start", {
      storyText,
      taskType,
      wordCount,
    });

    const eventSource = new EventSource("http://localhost:8000/api/stream");

    eventSource.onmessage = (event) => {
      setResponseText((prev) => prev + event.data);
    };

    eventSource.onerror = (error) => {
      console.error("Error in streaming:", error);
      eventSource.close();
    };

    eventSource.addEventListener("end", () => {
      eventSource.close();
    });
  };

  return (
    <div className="App">
      <h1>Stream GPT Response</h1>
      <textarea
        rows={10}
        cols={50}
        value={storyText}
        onChange={(e) => setStoryText(e.target.value)}
        placeholder="Enter your text here"
      ></textarea>
      <br />
      <select value={taskType} onChange={(e) => setTaskType(e.target.value)}>
        <option value="grammar">Grammar</option>
        <option value="rewrite">Rewrite</option>
        <option value="improve">Improve</option>
      </select>
      <br />

      <br />
      <button onClick={handleStream}>Start Streaming</button>
      <div>
        <h2>Response:</h2>
        <pre>{responseText}</pre>
      </div>
    </div>
  );
}

export default App;
