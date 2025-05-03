import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../src/firebase';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setName(currentUser.displayName || '');
                setPhotoURL(currentUser.photoURL || '');
                
                // Get additional user data from Firestore
                try {
                    const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        // You can set additional user data here if needed
                    }
                } catch (error) {
                    console.error("Error fetching user data: ", error);
                }
            } else {
                navigate('/login');
            }
        });
        
        return () => unsubscribe();
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
            
            // Update profile picture if a new one is selected
            let updatedPhotoURL = photoURL;
            if (profilePic) {
                const storageRef = ref(storage, `profile-pics/${user.uid}`);
                await uploadBytes(storageRef, profilePic);
                updatedPhotoURL = await getDownloadURL(storageRef);
            }
            
            // Update user profile in Authentication
            await updateProfile(user, {
                displayName: name,
                photoURL: updatedPhotoURL
            });
            
            // Update user document in Firestore
            await updateDoc(doc(db, 'users', user.uid), {
                name,
                photoURL: updatedPhotoURL,
                updatedAt: new Date()
            });
            
            setPhotoURL(updatedPhotoURL);
            setSuccess('Profile updated successfully!');
        } catch (error) {
            console.error("Error updating profile: ", error);
            setError('Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
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
                            
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full px-4 py-2 text-white font-semibold rounded ${
                                    loading ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-600'
                                } transition`}
                            >
                                {loading ? 'Updating...' : 'Update Profile'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};