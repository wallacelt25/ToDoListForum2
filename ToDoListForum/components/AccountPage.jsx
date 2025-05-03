import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, getCurrentUser } from '../src/services/api';

export const Account = () => {
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [profilePic, setProfilePic] = useState(null);
    const [photoURL, setPhotoURL] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Get current user from local storage
                const currentUser = getCurrentUser();
                
                if (!currentUser) {
                    navigate('/login');
                    return;
                }
                
                setUser(currentUser);
                setName(currentUser.name || '');
                setPhotoURL(currentUser.photoURL || '');
                
                // Fetch fresh user data from API
                const userData = await authService.getProfile();
                
                if (userData) {
                    setUser(userData);
                    setName(userData.name || '');
                    setPhotoURL(userData.photoURL || '');
                }
            } catch (error) {
                console.error("Error fetching user data: ", error);
                setError('Failed to load user data');
            }
        };
        
        fetchUserData();
    }, [navigate]);

    const handlePhotoChange = (e) => {
        if (e.target.files[0]) {
            setProfilePic(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);
        
        try {
            if (!user) {
                setError('User not authenticated');
                return;
            }
            
            // For simplicity, we're not handling file uploads in this example
            // In a real application, you would upload the file to your server or a cloud storage service
            // and then update the user profile with the photo URL
            
            // Update user profile
            await authService.updateProfile({
                name,
                photoURL: photoURL, // In a real app, this would be the URL returned from file upload
            });
            
            setSuccess('Profile updated successfully!');
        } catch (error) {
            console.error("Error updating profile: ", error);
            setError('Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-md mx-auto pt-10 pb-16 px-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Account Settings</h1>
                    <button 
                        onClick={() => navigate('/')} 
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                        Back to Todos
                    </button>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}
                    
                    {success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                            {success}
                        </div>
                    )}
                    
                    {user && (
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col items-center mb-6">
                                <div className="w-24 h-24 mb-4 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                                    {photoURL ? (
                                        <img 
                                            src={photoURL} 
                                            alt="Profile" 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-4xl text-gray-400">
                                            {name.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                
                                <label className="cursor-pointer text-blue-500 hover:text-blue-700">
                                    Change Profile Picture
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handlePhotoChange} 
                                        className="hidden"
                                    />
                                </label>
                                <p className="text-xs text-gray-500 mt-1">
                                    (Note: Image upload functionality would require additional backend setup)
                                </p>
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="name">
                                    Display Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-semibold mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={user.email}
                                    disabled
                                    className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-100"
                                />
                                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                            </div>
                            
                            <div className="flex flex-col space-y-3">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full px-4 py-2 text-white font-semibold rounded ${
                                        loading ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-600'
                                    } transition`}
                                >
                                    {loading ? 'Updating...' : 'Update Profile'}
                                </button>
                                
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="w-full px-4 py-2 text-white font-semibold rounded bg-red-500 hover:bg-red-600 transition"
                                >
                                    Logout
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};