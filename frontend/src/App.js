import './App.css';
import Auth from './admin/Auth';
import Dashboard from './admin/Dashboard';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      
    <Route index element={<Auth /> } />
    <Route path="/dashboard" element={<Dashboard /> } />
    </Routes>
    
    </BrowserRouter>
  );
}

export default App;
