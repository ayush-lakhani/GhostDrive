import { useState, useEffect } from 'react';
import Sidebar from '../Sidebar';
import DriveHeader from '../drive/DriveHeader';
import UploadModal from '../drive/UploadModal';
import { Ghost } from 'lucide-react';

const DriveLayout = ({ children }) => {
    const [isUploadModalOpen, setUploadModalOpen] = useState(false);
    
    // We can use a custom event or context to trigger refresh in children
    const handleUploadComplete = (newFile) => {
        // Dispatch explicit event for other components to listen
        window.dispatchEvent(new CustomEvent('ghost-uploaded', { detail: newFile }));
        
        // Also update local storage immediately if needed, though components usually handle their own state reads
        const saved = localStorage.getItem('ghostUploads');
        const current = saved ? JSON.parse(saved) : [];
        const updated = [newFile, ...current];
        localStorage.setItem('ghostUploads', JSON.stringify(updated));
    };

    return (
        <div className="h-screen flex flex-col bg-dark-900 text-white overflow-hidden font-sans">
            {/* Top Bar - Brand + Search */}
            <div className="flex items-center border-b border-dark-700/50">
                <div className="w-64 h-16 flex items-center px-6 gap-3 shrink-0">
                    <Ghost className="w-8 h-8 text-ghost-accent" />
                    <span className="text-xl font-medium tracking-tight">GhostDrive</span>
                </div>
                <div className="flex-1">
                    <DriveHeader />
                </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 flex overflow-hidden">
                <Sidebar onNewClick={() => setUploadModalOpen(true)} />
                
                <main className="flex-1 bg-dark-900 rounded-tl-2xl overflow-hidden border-t border-l border-dark-700/50 relative shadow-2xl shadow-black">
                    {children}
                </main>
            </div>

            {/* Upload Modal */}
            <UploadModal 
                isOpen={isUploadModalOpen} 
                onClose={() => setUploadModalOpen(false)}
                onUploadComplete={handleUploadComplete}
            />
        </div>
    );
};

export default DriveLayout;
