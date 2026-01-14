import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Ghost, Lock, Download, AlertTriangle } from 'lucide-react';
import CountdownTimer from './CountdownTimer';

const GhostPage = () => {
    const { safeName } = useParams();
    const [status, setStatus] = useState('loading'); 

    const [expiryTime, setExpiryTime] = useState(null);
    const [meta, setMeta] = useState(null); // Full meta including hasPassword
    const [passwordInput, setPasswordInput] = useState('');
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        // Fetch Metadata for countdown
        const fetchMeta = async () => {
             try {
                const apiBase = `http://${window.location.hostname}:5000`;
                const res = await axios.get(`${apiBase}/api/meta/${safeName}`);
                setMeta(res.data);
                setExpiryTime(new Date(res.data.expiryDate));
                setStatus('ready');
             } catch (err) {
                 if (err.response && (err.response.status === 410 || err.response.status === 404)) {
                     setStatus('expired');
                 } else {
                     setStatus('error');
                 }
             }
        };

        fetchMeta();
    }, [safeName]);

    const handleDownload = async () => {
        const apiBase = `http://${window.location.hostname}:5000`;
        try {
            const config = { responseType: 'blob' };
            
            // If password protected/required, pass it in headers
            if (meta?.hasPassword) {
                if (!passwordInput) {
                    setPasswordError('Please enter password');
                    return;
                }
                config.headers = { 'x-ghost-password': passwordInput };
            }

            const response = await axios.get(`${apiBase}/api/download/${safeName}`, config);
            
            // Success! Clear error
            setPasswordError('');
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            
            // Try to extract filename from headers
            const contentDisposition = response.headers['content-disposition'];
            let filename = 'ghost-file';
            
            if (contentDisposition) {
                const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                const matches = filenameRegex.exec(contentDisposition);
                if (matches != null && matches[1]) {
                    filename = matches[1].replace(/['"]/g, '');
                }
            }

            // FALLBACK: If filename has no extension (e.g. "ghost-file"), try to guess from Content-Type
            if (!filename.includes('.')) {
                const contentType = response.headers['content-type'];
                const mimeMap = {
                    'image/jpeg': '.jpg',
                    'image/png': '.png',
                    'image/gif': '.gif',
                    'application/pdf': '.pdf',
                    'application/zip': '.zip',
                    'text/plain': '.txt'
                };
                if (mimeMap[contentType]) {
                    filename += mimeMap[contentType];
                }
            }
            
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error(err);
            if (err.response) {
                if (err.response.status === 403) {
                     setPasswordError('Incorrect password');
                } else if (err.response.status === 410 || err.response.status === 404) {
                    setStatus('expired');
                } else {
                    setStatus('error');
                }
            } else {
                setStatus('error');
            }
        }
    };

    if (status === 'expired') {
        return (
            <div className="ghost-card max-w-md w-full mx-auto text-center animate-fade-in border-red-500/20 bg-red-900/10">
                <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-red-500/20 animate-pulse">
                    <Ghost className="w-12 h-12 text-red-500" />
                </div>
                <h2 className="text-3xl font-bold mb-3 text-white">Ghosted.</h2>
                <div className="space-y-2 mb-8">
                    <p className="text-gray-400">This file has been permanently purged.</p>
                    <p className="text-xs text-red-400/70 uppercase tracking-widest font-mono">Status: 410 Gone</p>
                </div>
                <a href="/" className="inline-block w-full py-4 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 transition-all text-sm font-medium">
                    Upload New File
                </a>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="ghost-card max-w-md w-full mx-auto text-center animate-fade-in">
                <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">System Error</h2>
                <p className="text-gray-400 mb-6">Something went wrong. The file might be corrupted.</p>
                <a href="/" className="text-ghost-accent hover:underline">Return Home</a>
            </div>
        );
    }

    return (
        <div className="ghost-card max-w-md w-full mx-auto text-center animate-fade-in relative overflow-hidden group">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-ghost-accent to-transparent animate-pulse-slow"></div>
            
            <div className="mb-8 relative">
                <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto ring-1 ring-indigo-500/30">
                    <Lock className="w-10 h-10 text-indigo-400" />
                </div>
            </div>
            
            {/* Burn on Read Warning */}
            {meta?.burnOnRead && (
                <div className="mb-6 flex items-center justify-center gap-2 text-red-400 bg-red-500/10 py-2 px-4 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-red-500 block"></span>
                    Burn ON: Deletes after 1 Download
                </div>
            )}
            
            <h2 className="text-2xl font-bold mb-2 text-white">
                {meta?.hasPassword ? 'Encrypted File' : 'Secure Transfer'}
            </h2>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                {meta?.hasPassword 
                    ? 'Enter the password to decrypt and download this file.' 
                    : 'You have received a protected file. Download it before the timer runs out.'}
            </p>

            {/* Simple Countdown Display for Downloader */}
            {!meta?.hasPassword && (
                <div className="mb-8 p-3 bg-dark-800/50 rounded-lg border border-white/5 inline-block min-w-[200px]">
                    <p className="text-xs text-ghost-accent font-mono uppercase tracking-widest mb-1">Time Remaining</p>
                    <div className="text-xl font-bold text-white font-mono">
                         {expiryTime ? (
                            <CountdownTimer targetDate={expiryTime} />
                         ) : (
                            <span className="animate-pulse">Loading...</span>
                         )}
                    </div>
                </div>
            )}

            {/* Password Input */}
            {meta?.hasPassword && (
                <div className="mb-6 max-w-xs mx-auto">
                    <input 
                        type="password" 
                        placeholder="Enter Password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="w-full bg-dark-900 border border-dark-700/50 rounded-lg px-4 py-3 text-white text-center text-lg placeholder-gray-600 focus:border-ghost-accent focus:outline-none transition-colors"
                    />
                    {passwordError && (
                        <p className="text-red-400 text-sm mt-2">{passwordError}</p>
                    )}
                </div>
            )}

            <button 
                onClick={handleDownload}
                className="ghost-btn flex items-center justify-center gap-3 relative overflow-hidden group"
            >
                <span className="relative z-10 font-bold tracking-wide">
                    {meta?.hasPassword ? 'UNLOCK & DOWNLOAD' : 'DOWNLOAD NOW'}
                </span>
                {meta?.hasPassword ? (
                    <Lock className="w-5 h-5 relative z-10 group-hover:unlock-anim" /> 
                ) : (
                    <Download className="w-5 h-5 relative z-10" />
                )}
            </button>
        </div>
    );
};

export default GhostPage;
