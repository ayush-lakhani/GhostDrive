import { useRef, useEffect } from 'react';
import { Copy, Trash2, Link as LinkIcon, Download } from 'lucide-react';

const ContextMenu = ({ x, y, onClose, onAction, file }) => {
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose();
            }
        };

        const handleScroll = () => onClose();

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('scroll', handleScroll, true);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('scroll', handleScroll, true);
        };
    }, [onClose]);

    if (!file) return null;

    return (
        <div 
            ref={menuRef}
            style={{ top: y, left: x }}
            className="fixed z-50 bg-dark-800 border border-dark-600 rounded-lg shadow-xl w-48 py-1 overflow-hidden animate-fade-in"
        >
            <div className="px-4 py-2 border-b border-dark-700">
                <p className="text-xs text-gray-400 truncate">{file.originalName}</p>
            </div>

            <button 
                onClick={() => onAction('copy')}
                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-dark-700 hover:text-white flex items-center gap-2"
            >
                <Copy className="w-4 h-4" />
                <span>Copy Link</span>
            </button>

            <button 
                onClick={() => onAction('download')}
                className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-dark-700 hover:text-white flex items-center gap-2"
            >
                <Download className="w-4 h-4" />
                <span>Download</span>
            </button>

            <div className="h-px bg-dark-700 my-1"></div>

            <button 
                onClick={() => onAction('delete')}
                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-2"
            >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
            </button>
        </div>
    );
};

export default ContextMenu;
