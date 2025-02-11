import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext'; 
import Loader from '../components/Loader';
import EmployerHomepage from './EmployerHomepage';

const PostJobPage = () => {
    const [title, setTitle] = useState('');
    const [company, setCompany] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false); // State to track success
    const navigate = useNavigate();
    const { user, logout} = useAuth();
    const [isLoading, setIsLoading] = useState(null);
   
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            const response = await fetch('http://localhost:4000/api/postjobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                },
                body: JSON.stringify({
                    title,
                    company,
                    location,
                    description,
                }),
            });

            const data = await response.json();
            console.log("data",data);
            if (response.ok) {
                setSuccess(true); 
                setTitle('');
                setCompany('');
                setLocation('');
                setDescription('');
                setIsLoading(false);
                setTimeout(() => {
                    navigate('/jobs');
                }, 2000); 
            } else {
                setIsLoading(false);
                setError(data.message);
            }
        } catch (err) {
            setIsLoading(false);
            setError('Something went wrong. Please try again.');
        }
    };

    return (<>
    {isLoading && <Loader />}
    {user && user.type=='Employer' ? (  <div className="flex items-center justify-center py-6">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg border border-[#EAEAEA]">
                <h2 className="text-4xl font-extrabold text-center text-[#000000]">Add Job</h2>
                {error && <p className="text-center text-red-500">{error}</p>}

                {/* AnimatePresence for the success message */}
                <AnimatePresence>
                    {success && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.5 }}
                            className="text-center text-green-500 mb-4"
                        >
                            Job successfully added! Redirecting...
                        </motion.div>
                    )}
                </AnimatePresence>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <input
                                type="text"
                                placeholder="Job Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="rounded-md w-full px-4 py-3 bg-[#FFFFFF] text-[#2B2B2B] border border-[#EAEAEA] focus:outline-none"
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Company"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                                required
                                className="rounded-md w-full px-4 py-3 bg-[#FFFFFF] text-[#2B2B2B] border border-[#EAEAEA] focus:outline-none"
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                required
                                className="rounded-md w-full px-4 py-3 bg-[#FFFFFF] text-[#2B2B2B] border border-[#EAEAEA] focus:outline-none"
                            />
                        </div>
                        <div>
                            <textarea
                                placeholder="Job Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                className="rounded-md w-full px-4 py-3 bg-[#FFFFFF] text-[#2B2B2B] border border-[#EAEAEA] focus:outline-none"
                                rows="5"
                            />
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#000000] hover:shadow-lg focus:outline-none"
                        >
                            Add Job
                        </button>
                    </div>
                </form>
            </div>
        </div>):<EmployerHomepage/>}
      
        </>
    );
};

export default PostJobPage;
