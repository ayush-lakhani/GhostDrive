import { useState, useEffect } from 'react';
import FileList from './FileList';
import { LayoutGrid, List, ChevronDown } from 'lucide-react';

const UploadDashboard = ({ filter }) => {
    const [recentUploads, setRecentUploads] = useState([]);
    const [viewMode, setViewMode] = useState('grid');
    
    // Load and listen for updates
    useEffect(() => {
        const loadFiles = () => {
            const saved = localStorage.getItem('ghostUploads');
            if (saved) {
                setRecentUploads(JSON.parse(saved).filter(item => new Date(item.expiryDate) > new Date()));
            }
        };

        // Initial load
        loadFiles();

        // Listen for new uploads from Modal
        const handleNewUpload = (e) => {
            // Re-read storage or append directly
            // Since the modal writes to storage, let's just reload
            loadFiles();
        };

        window.addEventListener('ghost-uploaded', handleNewUpload);
        return () => window.removeEventListener('ghost-uploaded', handleNewUpload);
    }, []);

    const deleteUpload = (safeName) => {
        const updated = recentUploads.filter(u => u.safeName !== safeName);
        setRecentUploads(updated);
        localStorage.setItem('ghostUploads', JSON.stringify(updated));
    };

    return (
        <div className="h-full flex flex-col p-6 overflow-y-auto custom-scrollbar bg-dark-900">
            {/* Drive Toolbar */}
            <div className="flex justify-between items-center mb-6 pb-2 border-b border-dark-700/50">
                <div className="flex items-center gap-2 text-gray-300">
                    <span className="text-lg font-medium text-white">My Drive</span>
                    <ChevronDown className="w-4 h-4" />
                </div>
                
                <div className="flex items-center bg-dark-800 rounded-lg p-0.5 border border-dark-700">
                    <button 
                        onClick={() => setViewMode('grid')}
                        className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-dark-700 text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => setViewMode('list')}
                        className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-dark-700 text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        <List className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Quick Access / Recent / Files */}
            <div className="flex-1">
                {filter === 'recent' && <h3 className="text-sm font-medium text-gray-400 mb-4">Recent</h3>}
                <FileList items={recentUploads} onDelete={deleteUpload} viewMode={viewMode} />
            </div>
        </div>
    );
};

export default UploadDashboard;
