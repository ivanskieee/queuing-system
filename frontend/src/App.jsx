import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AdminPanel from './components/AdminPanel';

function App() {
  return (
    <div>
      <AdminPanel />
    </div>
  );
}

export default App;
