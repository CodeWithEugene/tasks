import React from 'react';
import { LogoIcon } from './icons';

interface HeaderProps {
    onSignOut: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSignOut }) => {
    return (
        <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-3">
                        <LogoIcon className="h-8 w-8 text-[#D48A8A]" />
                        <span className="font-playfair text-2xl font-bold text-[#3D3D3D]">Tasks</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                            <img 
                                src="https://picsum.photos/id/237/100/100" 
                                alt="User Avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                         <button 
                            onClick={onSignOut}
                            className="text-sm font-medium text-gray-600 hover:text-gray-900"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;