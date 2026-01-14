import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UploadDashboard from './components/UploadDashboard';
import GhostPage from './components/GhostPage';
import DriveLayout from './components/layout/DriveLayout';

function App() {
  return (
    <Router>
        <Routes>
            {/* Authenticated Drive Routes */}
            <Route path="/" element={
                <DriveLayout>
                    <UploadDashboard />
                </DriveLayout>
            } />
            <Route path="/recent" element={
                <DriveLayout>
                    <UploadDashboard filter="recent" />
                </DriveLayout>
            } />
            
            {/* Public Download Route (No Sidebar) - Google Drive Style */}
            <Route path="/file/d/:safeName" element={
                <div className="min-h-screen bg-dark-900 text-white flex items-center justify-center p-4">
                    <GhostPage />
                </div>
            } />
        </Routes>
    </Router>
  );
}

export default App;
