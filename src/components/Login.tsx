import React, { useEffect, useRef } from 'react';
import { LogoIcon } from './icons';

interface LoginProps {
    onSignIn: (userData: { name: string; picture: string; email: string }) => void;
}

const decodeJwtResponse = (token: string) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Error decoding JWT", e);
        return null;
    }
}

const Login: React.FC<LoginProps> = ({ onSignIn }) => {
    const googleButtonRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window.google === 'undefined' || !window.google.accounts) {
            console.error("Google Identity Services script not loaded.");
            return;
        }

        window.google.accounts.id.initialize({
            client_id: "747734163255-nfalk29n5oepib3egbighspdtlusb0p7.apps.googleusercontent.com",
            callback: (response: any) => {
                const userData = decodeJwtResponse(response.credential);
                if (userData) {
                    onSignIn({
                        name: userData.name,
                        picture: userData.picture,
                        email: userData.email
                    });
                }
            }
        });

        if (googleButtonRef.current) {
            window.google.accounts.id.renderButton(
                googleButtonRef.current,
                { theme: "outline", size: "large", type: 'standard', text: 'signin_with', shape: 'pill' }
            );
        }

    }, [onSignIn]);


    return (
        <div className="min-h-screen bg-[#FBF9F6] flex flex-col items-center justify-center p-4">
            <div className="text-center p-8 max-w-md w-full">
                <div className="flex items-center justify-center space-x-4 mb-8">
                    <LogoIcon className="h-12 w-12 text-[#D48A8A]" />
                    <h1 className="font-playfair text-5xl sm:text-6xl font-bold text-[#3D3D3D]">Tasks</h1>
                </div>
                <p className="text-lg text-gray-600 mb-10">Start planning today.</p>
                <div ref={googleButtonRef} className="flex justify-center"></div>
            </div>
        </div>
    );
};

export default Login;