import React, { useEffect, useState } from "react";
import axios from "axios";

function QueueList() {
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/queue");
        setQueue(response.data);
      } catch (error) {
        console.error("Error fetching queue:", error);
      }
    };

    fetchQueue();
    const interval = setInterval(fetchQueue, 5000); // Auto-refresh every 5 sec
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Queue List</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Queue Number</th>
            <th>Paper Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {queue.map((item) => (
            <tr key={item._id}>
              <td>{item.queue_number}</td>
              <td>{item.paper_name}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default QueueList;
