import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { Home } from './components/pages/Home';
import { Reviews } from './components/sections/Reviews';
import { NotFound } from './components/pages/NotFound';

export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reviews" element={<Reviews />} />
          {/* Support static 404.html for direct hits */}
          <Route path="/404.html" element={<NotFound />} />
          {/* Wildcard route for SPA unknown paths */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}