import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { Home } from './components/pages/Home';
import { Reviews } from './components/sections/Reviews';

export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reviews" element={<Reviews />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}