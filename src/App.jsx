import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/room/:slug" element={<div>Room View (Coming in Phase 1)</div>} />
    </Routes>
  );
}

export default App;
