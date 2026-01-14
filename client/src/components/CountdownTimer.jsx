import { useState, useEffect } from 'react';

const CountdownTimer = ({ expiryDate }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const expiry = new Date(expiryDate).getTime();
            const distance = expiry - now;

            if (distance < 0) {
                clearInterval(interval);
                setTimeLeft('EXPIRED');
            } else {
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                
                setTimeLeft(
                    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
                );
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [expiryDate]);

    return (
        <div className="flex items-center justify-center space-x-2">
            <span className="animate-pulse-slow w-2 h-2 rounded-full bg-red-500"></span>
            <span className="text-2xl font-mono font-bold tracking-widest text-white">
                {timeLeft}
            </span>
        </div>
    );
};

export default CountdownTimer;
