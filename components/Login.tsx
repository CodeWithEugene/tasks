import React from 'react';
import { GoogleIcon, LogoIcon } from './icons';

interface LoginProps {
    onSignIn: () => void;
}

const Login: React.FC<LoginProps> = ({ onSignIn }) => {
    return (
        <div className="min-h-screen bg-[#FBF9F6] flex flex-col items-center justify-center p-4">
            <div className="text-center p-8 max-w-md w-full">
                <div className="flex items-center justify-center space-x-4 mb-8">
                    <LogoIcon className="h-12 w-12 text-[#D48A8A]" />
                    <h1 className="font-playfair text-5xl sm:text-6xl font-bold text-[#3D3D3D]">Tasks</h1>
                </div>
                <p className="text-lg text-gray-600 mb-10">Start planning today.</p>
                <button
                    onClick={onSignIn}
                    className="flex items-center justify-center w-full max-w-xs mx-auto bg-white text-gray-700 font-semibold py-3 px-4 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                    aria-label="Sign in with Google"
                >
                    <GoogleIcon />
                    Sign in with Google
                </button>
            </div>
        </div>
    );
};

export default Login;