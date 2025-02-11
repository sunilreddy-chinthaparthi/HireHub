import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext'; 
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader';

const SavedJobs = () => {
    const { user, logout } = useAuth();
    const { userId } = useParams();
    const [jobs, setJobs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    
    const fetchJobs = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`http://localhost:4000/api/savedjobs?userId=${encodeURIComponent(userId)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            const data = await response.json();
            console.log('data', data);
            if (response.ok) {
                setSearchResults(data);
                setIsLoading(false);
            } else {
                setIsLoading(false);
                console.error(data.message);
            }
        } catch (err) {
            setIsLoading(false);
            console.error('Error fetching jobs:', err); 
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    if (isLoading) {
        return <div className="flex items-center justify-center h-screen">{<Loader />}</div>;
    }

    if (error) {
        return <div className="flex items-center justify-center h-screen text-red-500">{error}</div>;
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Saved Jobs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((job) => (
                    <div key={job._id} className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl">
                        <div className="p-6">
                            <h3 className="text-xl font-semibold mb-2 text-gray-900">{job.title}</h3>
                            <p className="text-gray-700 text-sm mb-1">{job.company}</p>
                            <p className="text-gray-500 text-sm mb-4">{job.location}</p>
                            <p className="text-gray-600 mb-4 line-clamp-3">{job.description}</p>
            
                           
                            
                            <a 
                 href={`/jobs/${job._id}`} 
                        className="bg-black text-white px-6 py-2 rounded-md  mt-4 ml-2 mr-2 hover:bg-[#E9E9E9] text-sm font-bold transition-all border-black-all"
                    >
                        View job details
                    </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const getStatusStyle = (status) => {
    switch (status) {
        case 'Applied':
            return 'bg-yellow-100 text-yellow-800';
        case 'Interviewing':
            return 'bg-blue-100 text-blue-800';
        case 'Offered':
            return 'bg-green-100 text-green-800';
        case 'Rejected':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

export default SavedJobs;
