import React, { useState, useEffect } from "react";
import axios from "axios";

function AdminPanel() {
  const [queue, setQueue] = useState([]);
  const [paperName, setPaperName] = useState("");

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/queue");
      setQueue(response.data);
    } catch (error) {
      console.error("Error fetching queue:", error);
    }
  };

  const addPaper = async () => {
    if (!paperName.trim()) {
      alert("Paper name cannot be empty!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/queue", {
        paper_name: paperName,
      });

      setQueue((prevQueue) => [...prevQueue, response.data]);
      setPaperName("");
    } catch (error) {
      console.error("Error adding paper:", error);
    }
  };

  const updateStatus = async (_id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/queue/${_id}`, { status });

      setQueue((prevQueue) =>
        prevQueue.map((item) =>
          item._id === _id ? { ...item, status } : item
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const serveNext = async () => {
    const nextItem = queue.find((item) => item.status === "Ready for Pickup");

    if (!nextItem) {
      alert("No papers are ready for pickup.");
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/queue/serve/${nextItem._id}`);

      setQueue((prevQueue) =>
        prevQueue.filter((item) => item._id !== nextItem._id)
      );
    } catch (error) {
      console.error("Error serving next:", error);
    }
  };

  const clearQueue = async () => {
    if (window.confirm("Are you sure you want to clear the entire queue?")) {
      try {
        await axios.delete("http://localhost:5000/api/queue");
        setQueue([]);
      } catch (error) {
        console.error("Error clearing queue:", error);
      }
    }
  };

  return (
    <div>
      <h2>Admin Panel</h2>
      <input
        type="text"
        value={paperName}
        onChange={(e) => setPaperName(e.target.value)}
        placeholder="Enter Paper Name"
      />
      <button onClick={addPaper}>Add Paper</button>

      <h3>Update Status</h3>
      {queue.map((item) => (
        <div key={item._id}>
          <span>
            {item.queue_number}: {item.paper_name} - {item.status}
          </span>
          <select
            onChange={(e) => updateStatus(item._id, e.target.value)}
            defaultValue={item.status}
          >
            <option value="Received">Received</option>
            <option value="Processing">Processing</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Ready for Pickup">Ready for Pickup</option>
          </select>
        </div>
      ))}

      <div>
        <button onClick={serveNext}>Serve Next</button>
        <button onClick={clearQueue}>Clear Queue</button>
      </div>
    </div>
  );
}

export default AdminPanel;
