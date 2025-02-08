import { useEffect, useState } from "react";
import axios from "axios";
import AdminPanel from "./components/AdminPanel";
import QueueList from "./components/QueueList";

function App() {
  return (
    <div>
      <h1>Queueing System</h1>
      <QueueList />
      <AdminPanel />
    </div>
  );
}

export default App;
