import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
            {/* Tooltip / Label - Appear on hover */}
            <span className="mb-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-white px-4 py-2 rounded-xl text-sm font-bold shadow-xl border border-gray-100 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0 pointer-events-none origin-bottom-right">
                Precisa de ajuda? Fale conosco! 👋
            </span>

            <a
                href="https://wa.me/258878491000"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-[#25D366] hover:bg-[#128C7E] text-white p-4 rounded-full shadow-2xl hover:shadow-[#25D366]/50 transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
                aria-label="Fale conosco no WhatsApp"
            >
                {/* Ping Effect Ring */}
                <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-75 animate-ping group-hover:animate-none"></span>

                <MessageCircle className="w-8 h-8 relative z-10" />

                {/* Notification Badge */}
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-gray-900 z-20 shadow-sm animate-bounce">
                    1
                </span>
            </a>
        </div>
    );
};

export default WhatsAppButton;
