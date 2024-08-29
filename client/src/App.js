import './App.css';
import Home from './pages/Home/Home';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App() {
  return (
    <Router>
      <Routes>
        {/* default / direct to /home */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
}

export default App;
