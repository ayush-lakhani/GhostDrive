import { useState, useRef } from 'react';
import { Upload, X, Copy, CheckCircle, FileText, Clock } from 'lucide-react';
import axios from 'axios';
import ExpirySelector from '../ExpirySelector';

const UploadModal = ({ isOpen, onClose, onUploadComplete }) => {
    const [file, setFile] = useState(null);
    const [duration, setDuration] = useState(5);
    const [uploading, setUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState(null);
    const [error, setError] = useState('');
    
    // New Pro Features State
    const [password, setPassword] = useState('');
    const [burnOnRead, setBurnOnRead] = useState(false);
    const [showSecurity, setShowSecurity] = useState(false); // Toggle to show options

    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
            setError('');
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError('');

        const formData = new FormData();
        formData.append('file', file);
        // Default to 5 minutes if empty or invalid
        formData.append('duration', duration || 5);
        if (password) formData.append('password', password);
        formData.append('burnOnRead', burnOnRead);

        const apiBase = `http://${window.location.hostname}:5000`;

        try {
            const res = await axios.post(`${apiBase}/api/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const newFile = res.data.file;
            setUploadResult(newFile);
            setFile(null);
            
            // Notify parent to update list
            if (onUploadComplete) {
                onUploadComplete({ ...newFile, originalName: file.name });
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const copyLink = async () => {
        if (uploadResult) {
            // Google Drive Style Link
            const link = `${window.location.origin}/file/d/${uploadResult.safeName}`;
            
            try {
                await navigator.clipboard.writeText(link);
                alert('Link copied!');
            } catch (err) {
                const textArea = document.createElement("textarea");
                textArea.value = link;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    alert('Link copied!');
                } catch (e) {
                    alert('Manual copy required: ' + link);
                }
                document.body.removeChild(textArea);
            }
        }
    };

    const reset = () => {
        setFile(null);
        setUploadResult(null);
        setError('');
        setPassword('');
        setBurnOnRead(false);
        setShowSecurity(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-dark-900 border border-dark-700 rounded-xl shadow-2xl w-full max-w-md overflow-hidden relative">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-dark-700">
                    <h3 className="text-lg font-semibold text-white">Ghost Upload</h3>
                    <button onClick={reset} className="text-gray-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {uploadResult ? (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-green-500" />
                            </div>
                            <h4 className="text-xl font-bold text-white mb-2">Ready to vanish!</h4>
                            <p className="text-sm text-gray-400 mb-6">Link generated successfully</p>
                            
                            <div className="flex items-center gap-2 bg-dark-800 p-2 rounded-lg border border-dark-700 mb-6">
                                <code className="flex-1 text-xs text-gray-300 truncate font-mono text-left">
                                    {window.location.origin}/file/d/{uploadResult.safeName}
                                </code>
                                <button onClick={copyLink} className="p-2 bg-ghost-accent rounded hover:bg-ghost-hover text-white transition-colors">
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>
                            
                            <button onClick={() => setUploadResult(null)} className="text-sm text-ghost-accent hover:underline">
                                Upload another file
                            </button>
                        </div>
                    ) : (
                        <>
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors mb-6 ${file ? 'border-ghost-accent/50 bg-ghost-accent/5' : 'border-dark-700 hover:border-dark-600 hover:bg-dark-800'}`}
                            >
                                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                                {file ? (
                                    <div>
                                        <FileText className="w-10 h-10 text-ghost-accent mx-auto mb-2" />
                                        <p className="text-sm font-medium text-white truncate">{file.name}</p>
                                        <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                ) : (
                                    <div>
                                        <Upload className="w-10 h-10 text-gray-500 mx-auto mb-2" />
                                        <p className="text-sm text-gray-300">Click to select file</p>
                                    </div>
                                )}
                            </div>

                            <div className="mb-6">
                                <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Time to Live</label>
                                <ExpirySelector duration={duration} setDuration={setDuration} />
                            </div>

                            {/* Security Toggle */}
                            <div className="mb-6">
                                <button 
                                    onClick={() => setShowSecurity(!showSecurity)}
                                    className="flex items-center gap-2 text-sm text-ghost-accent hover:text-white transition-colors"
                                >
                                    <span className="font-semibold">{showSecurity ? 'Hide' : 'Show'} Security Options</span>
                                </button>
                                
                                {showSecurity && (
                                    <div className="mt-3 p-4 bg-dark-800/50 rounded-xl border border-white/5 space-y-4 animate-fade-in">
                                        {/* Password */}
                                        <div>
                                            <label className="block text-xs text-gray-400 mb-1">Protection Password (Optional)</label>
                                            <input 
                                                type="text" 
                                                placeholder="e.g. secret123"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full bg-dark-900 border border-dark-700 rounded-lg px-3 py-2 text-sm text-white focus:border-ghost-accent focus:outline-none"
                                            />
                                        </div>

                                        {/* Burn on Read */}
                                        <div className="flex items-center gap-3">
                                            <div 
                                                onClick={() => setBurnOnRead(!burnOnRead)}
                                                className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors ${burnOnRead ? 'bg-red-500' : 'bg-dark-700'}`}
                                            >
                                                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${burnOnRead ? 'translate-x-4' : ''}`}></div>
                                            </div>
                                            <span className="text-sm text-gray-300">
                                                Burn on Read <span className="text-xs text-gray-500">(Delete after 1 download)</span>
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}

                            <div className="flex justify-end gap-3">
                                <button onClick={reset} className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleUpload}
                                    disabled={!file || uploading}
                                    className="px-6 py-2 bg-ghost-accent hover:bg-ghost-hover text-white text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {uploading ? 'Ghosting...' : 'Upload'}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UploadModal;
