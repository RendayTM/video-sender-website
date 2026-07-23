import { useState, useEffect } from "react";

function App() {
const [name, setName] = useState("");
const [url, setUrl] = useState("");
const [queue, setQueue] = useState([]);
const [playerOnline, setPlayerOnline] = useState(false);

async function loadQueue() {
try {
const response = await fetch(
"https://video-sender-backend-1.onrender.com/queue"
);

  const data = await response.json();

  setQueue(data);

} catch (error) {
  console.error("Error loading queue:", error);
}

}

async function checkPlayerStatus() {
try {
const response = await fetch(
"https://video-sender-backend-1.onrender.com/player-status"
);

  const data = await response.json();

  setPlayerOnline(data.online);

} catch (error) {
  console.error("Error checking player status:", error);
  setPlayerOnline(false);
}

}

async function submitVideo() {
if (!url.trim()) return;

try {
  const response = await fetch(
    "https://video-sender-backend-1.onrender.com/queue",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name.trim() || "Anonymous",
        url: url,
      }),
    }
  );

  const data = await response.json();

  console.log(data);

  setName("");
  setUrl("");

  loadQueue();

} catch (error) {
  console.error("Error submitting video:", error);
}

}

useEffect(() => {
loadQueue();
checkPlayerStatus();

const queueInterval = setInterval(loadQueue, 2000);

const statusInterval = setInterval(
  checkPlayerStatus,
  5000
);

return () => {
  clearInterval(queueInterval);
  clearInterval(statusInterval);
};

}, []);

return (
<div style={{ padding: "20px" }}>

  <h1>Video Sender</h1>

  <p>
    My Status:{" "}
    {playerOnline ? (
      <span>🟢 Online</span>
    ) : (
      <span>🔴 Offline</span>
    )}
  </p>

  <input
    type="text"
    placeholder="Your name (optional)"
    value={name}
    onChange={(e) => setName(e.target.value)}
    style={{
      width: "250px",
      marginBottom: "10px"
    }}
  />

  <br />

  <input
    type="text"
    placeholder="Paste a YouTube, TikTok or Instagram link"
    value={url}
    onChange={(e) => setUrl(e.target.value)}
    style={{
      width: "400px",
      marginRight: "10px"
    }}
  />

  <button onClick={submitVideo}>
    Submit
  </button>


  <h2>Current Queue</h2>

  {queue.length === 0 ? (

    <p>No videos in queue.</p>

  ) : (

    <ol>

      {queue.map((video, index) => (

        <li key={index}>

          <strong>
            {video.name}
          </strong>

          {" "}submitted{" "}

          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {video.url}
          </a>

        </li>

      ))}

    </ol>

  )}

</div>

);
}

export default App;
