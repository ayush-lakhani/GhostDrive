import { useState } from 'react';
import { FileText, Copy, Trash2, Clock, MoreVertical, Download } from 'lucide-react';

const FileList = ({ items, onDelete, viewMode = 'grid' }) => {
    const copyLink = async (safeName) => {
        const link = `${window.location.origin}/file/d/${safeName}`;
        try {
            await navigator.clipboard.writeText(link);
        } catch (err) {
            const textArea = document.createElement("textarea");
            textArea.value = link;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
        // Optional: Add a toast notification here if you had one
    };

    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-gray-500 border border-dashed border-dark-700 rounded-xl bg-dark-800/30">
                <div className="w-16 h-16 rounded-full bg-dark-800 flex items-center justify-center mb-4">
                    <FileText className="w-8 h-8 opacity-20" />
                </div>
                <p>No active ghosts</p>
            </div>
        );
    }

    if (viewMode === 'list') {
        return (
            <div className="overflow-hidden rounded-xl border border-dark-700 bg-dark-800/30 backdrop-blur-sm">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-dark-800/50 text-xs uppercase font-medium text-gray-500">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Expires</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-700/50">
                        {items.map((item) => {
                             const isExpired = new Date(item.expiryDate) < new Date();
                             const minutesLeft = Math.ceil((new Date(item.expiryDate) - new Date()) / 60000);
                             
                             return (
                                <tr key={item.safeName} className="hover:bg-dark-700/30 transition-colors group">
                                    <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                                        <div className="p-2 rounded bg-dark-800 text-ghost-accent">
                                            <FileText className="w-4 h-4" />
                                        </div>
                                        <span className="truncate max-w-[200px]" title={item.originalName}>{item.originalName}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`ghost-badge ${isExpired ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                                            {isExpired ? 'Expired' : 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-mono">{minutesLeft}m</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => copyLink(item.safeName)} className="p-2 hover:text-white hover:bg-white/5 rounded-lg transition-colors" title="Copy Link">
                                                <Copy className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => onDelete(item.safeName)} className="p-2 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                             );
                        })}
                    </tbody>
                </table>
            </div>
        );
    }

    // Grid View
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => {
                const isExpired = new Date(item.expiryDate) < new Date();
                
                return (
                    <div key={item.safeName} className="group ghost-card !p-5 hover:bg-dark-700/40 transition-all flex flex-col justify-between h-44 relative overflow-hidden border-dark-700">
                        <div className="absolute top-0 left-0 w-0.5 h-full bg-ghost-accent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-lg bg-dark-800 flex items-center justify-center text-ghost-accent shadow-sm">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div className={`ghost-badge ${isExpired ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                                {isExpired ? 'EXP' : 'LIVE'}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-medium text-white truncate mb-1" title={item.originalName}>
                                {item.originalName}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                                <Clock className="w-3 h-3" />
                                <span>
                                    {isExpired ? 'Expired' : `Ends in ${Math.ceil((new Date(item.expiryDate) - new Date()) / 60000)}m`}
                                </span>
                            </div>
                        </div>

                        <div className="mt-4 flex gap-2 pt-4 border-t border-dark-700/50 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                            <button 
                                onClick={() => copyLink(item.safeName)}
                                className="flex-1 bg-dark-800 hover:bg-dark-700 py-2 rounded-md text-xs font-medium text-gray-300 flex items-center justify-center gap-2 transition-colors border border-dark-700"
                            >
                                <Copy className="w-3 h-3" /> Copy Link
                            </button>
                            <button 
                                onClick={() => onDelete(item.safeName)}
                                className="p-2 rounded-md bg-red-500/5 hover:bg-red-500/10 text-red-400 border border-red-500/10 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default FileList;
