import React from 'react';
import { LogoIcon, LinkedinIcon, XIcon, GithubIcon } from './icons';

const Footer: React.FC = () => {
    return (
        <footer className="bg-[#F8F3ED] py-8 mt-12 border-t border-gray-200">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                    <div className="flex items-center space-x-3">
                         <LogoIcon className="h-8 w-8 text-[#D48A8A]" />
                        <span className="font-playfair text-2xl font-bold text-[#3D3D3D]">Tasks</span>
                    </div>
                    <p className="text-sm text-gray-600">
                        &copy; {new Date().getFullYear()} <a href="https://codewitheugene.top/" target="_blank" rel="noopener noreferrer" className="hover:underline">Eugenius</a>. All Rights Reserved.
                    </p>
                    <div className="flex items-center space-x-4">
                        <a href="https://www.linkedin.com/in/eugene-mutembei-476248243/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-800"><LinkedinIcon /></a>
                        <a href="https://x.com/codewitheugenee" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-800"><XIcon /></a>
                        <a href="https://github.com/CodeWithEugene" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-800"><GithubIcon /></a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;