import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home/Home';
import Prediction from './Prediction/Prediction';
import AuthProvider from './Auth/AuthProvider';
import AddData  from './Form/AddData';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/form" element={<AddData />} />
          <Route path="/prediction" element={<Prediction />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App
