import React, { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';

export const SplashScreen: React.FC = () => {
    const [isVisible, setIsVisible] = useState(true);
    const [isFading, setIsFading] = useState(false);

    useEffect(() => {
        // Show splash screen for 2.5 seconds, then fade out
        const timer1 = setTimeout(() => {
            setIsFading(true);
        }, 2000);

        const timer2 = setTimeout(() => {
            setIsVisible(false);
        }, 2500);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <div
            className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gray-900 transition-opacity duration-500 ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'}`}
        >
            {/* Background elements (similar to the premium Portal Login) */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-500 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="relative z-10 flex flex-col items-center">
                {/* Logo Container with Animation */}
                <div className="w-32 h-32 bg-white rounded-3xl p-3 flex items-center justify-center shadow-[0_0_50px_rgba(245,158,11,0.3)] animate-bounce mb-8">
                    <img
                        src="/logo.jpg"
                        alt="Aster Logo"
                        className="w-full h-full object-contain mix-blend-multiply"
                        onError={(e) => {
                            // Fallback if logo.jpg is not found
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerHTML = '<div class="text-amber-500"><svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 14 4-4"/><path d="M3.3 7H6"/><path d="m8 10 4-4"/><path d="M3.3 11H6"/><path d="m12 18 4-4"/><path d="M3.3 15H6"/><path d="M16 21V5a2 2 0 0 0-2-2h-4v18m0-18H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4"/></svg></div>';
                        }}
                    />
                </div>

                {/* Text Elements */}
                <h1 className="text-4xl font-black text-white tracking-widest mb-3" style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
                    ASTER
                </h1>

                <div className="flex items-center gap-2 text-amber-400 font-medium tracking-widest text-sm uppercase">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Multiseat System</span>
                </div>

                {/* Loading indicator */}
                <div className="mt-12 flex gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-3 h-3 bg-amber-500 rounded-full animate-ping" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping" style={{ animationDelay: '300ms' }}></div>
                </div>
            </div>
        </div>
    );
};

export default SplashScreen;
