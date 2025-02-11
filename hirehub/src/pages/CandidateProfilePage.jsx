import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import MessageComponent from '../components/MessageComponent'; 
import { useAuth } from '../context/AuthContext'; 

const CandidateProfilePage = () => {
    const { candidateId } = useParams(); 
    const { user } = useAuth();
    const [candidate, setCandidate] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isMessagingOpen, setIsMessagingOpen] = useState(false); 


    useEffect(() => {
        const fetchCandidateDetails = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`http://localhost:4000/api/candidates?userId=${encodeURIComponent(candidateId)}`);
                const data = await response.json();
                console.log('candidate', data);
                if (response.ok) {
                    setCandidate(data.data);
                } else {
                    console.error(data.message);
                }
                setIsLoading(false);
            } catch (err) {
                console.error('Error fetching candidate details:', err);
                setIsLoading(false);
            }
        };

        fetchCandidateDetails();
    }, [candidateId]);

    if (isLoading) return <Loader />;
    if (!candidate) return <p className="text-center mt-4 text-gray-500">Candidate details not found.</p>;

    const toggleMessaging = () => {
        setIsMessagingOpen(!isMessagingOpen);
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Candidate Profile</h2>
            <div className="border-b border-gray-300 pb-4 mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{candidate.name}</h3>
                <p className="text-gray-600">{candidate.jobTitle}</p>
                <p className="text-gray-500">{candidate.location}</p>
            </div>
            <div className="mb-4">
                <h4 className="font-semibold text-gray-900">About Me</h4>
                <p className="text-gray-700 mt-2">{candidate.aboutMe || 'No description provided.'}</p>
            </div>
            <div className="mb-4">
                <h4 className="font-semibold text-gray-900">Skills</h4>
                <ul className="list-disc list-inside text-gray-700 mt-2">
                    {candidate.skills && candidate.skills !== null ? (
                        candidate.skills.split(',').map((skill, index) => <li key={index}>{skill}</li>)
                    ) : (
                        <p>No skills listed.</p>
                    )}
                </ul>
            </div>
            <div className="mb-4">
                <h4 className="font-semibold text-gray-900">Experience</h4>
                <p className="text-gray-700 mt-2">
                    {candidate.experience || 'No experience provided.'}
                </p>
            </div>
            <div className="mb-4">
                <h4 className="font-semibold text-gray-900">Education</h4>
                <p className="text-gray-700 mt-2">{candidate.education || 'No education details provided.'}</p>
            </div>
            <div className="flex items-center justify-between mt-6">
                <button 
                    onClick={toggleMessaging} 
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                    Message Candidate
                </button>
                <button
                    onClick={() => alert('Feature under development')}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
                >
                    Save Profile
                </button>
            </div>
            {isMessagingOpen && <MessageComponent isOpen={isMessagingOpen} candidate={candidate._id} userId={user._id} onClose={toggleMessaging} />}
        </div>
    );
};

export default CandidateProfilePage;
