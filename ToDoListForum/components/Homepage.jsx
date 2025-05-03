import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../src/firebase';

export const HomePage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is authenticated
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (!user) {
                navigate('/login');
            }
        });
        
        return () => unsubscribe();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-4xl mx-auto pt-16 pb-20 px-4">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Your Task Manager</h1>
                    <p className="text-xl text-gray-600">Organize your life, one task at a time.</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                    <div 
                        onClick={() => navigate('/todos')} 
                        className="bg-white rounded-lg shadow p-6 flex flex-col items-center cursor-pointer hover:shadow-lg transition"
                    >
                        <div className="bg-blue-100 text-blue-600 p-4 rounded-full mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">My Tasks</h2>
                        <p className="text-gray-600 text-center">View and manage your to-do list</p>
                    </div>
                    
                    <div 
                        onClick={() => navigate('/account')} 
                        className="bg-white rounded-lg shadow p-6 flex flex-col items-center cursor-pointer hover:shadow-lg transition"
                    >
                        <div className="bg-green-100 text-green-600 p-4 rounded-full mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">My Account</h2>
                        <p className="text-gray-600 text-center">Update your profile settings</p>
                    </div>
                </div>
                
                <div className="mt-8 text-center">
                    <button 
                        onClick={() => navigate('/todos')} 
                        className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    );
};