import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import { useAuth } from '../context/AuthContext'; 
import Loader from '../components/Loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaBookmark, FaRegBookmark} from 'react-icons/fa';
import EmployerHomepage from './EmployerHomepage';
import EmployerDashboard from '../components/EmployerDashBoard';
import CandidateSearchBar from '../components/CandidateSearchBar';
import { MessageCircle } from 'lucide-react';
import MessageComponent from '../components/MessageComponent';


const HomePage = () => { 
    const { user, logout } = useAuth();
    const [searchResults, setSearchResults] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [isLoading, setIsLoading] = useState(null);
    const [searched, setSearched] = useState(null);
    const [candidateSearched, setCandidateSearched] = useState(null);
    const [reciever, setReciever] = useState(null);
    const [senderId, setSenderId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(null);
    const openModal = () => setIsModalOpen(!isModalOpen);
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const toggleMessages = () => setIsMessageModalOpen(!isMessageModalOpen); 
    const closeModal = () =>{

    }
    const openMessageModal = (userId, candidate) =>{
        console.log('candidate',candidate,'userId',userId);
        setIsMessageModalOpen(true);
        setReciever(candidate);
        setSenderId(userId);
    }
    const handleCandidateSearch = async (query, location) =>{
        console.log('clicked',query,location);
        setCandidateSearched(true);
        try{
            setIsLoading(true);
          const response = await fetch(`http://localhost:4000/api/candidates/search?query=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`, {
              method: 'GET',
          });
  
          const data = await response.json();
          if (data.success) {
            setCandidates(data.candidates);
          } else {
            console.error("Error:", data.message);
          }
          setIsLoading(false);
          console.log(data);
        }catch (err){
            setIsLoading(false);
console.error(err)
        }
    }
    const handleSearch = async (jobTitle, location) => {
      try {
          setIsLoading(true);
          const response = await fetch(`http://localhost:4000/api/jobs/search?title=${encodeURIComponent(jobTitle)}&location=${encodeURIComponent(location)}`, {
              method: 'GET',
              
          });
  
          const data = await response.json();
  
          if (response.ok) {
            const updatedJobs = data.jobs.map(job => {
                const isApplied = job.applications ? job.applications.some(job => job.userId == user.userId) : false;
                const isSaved = job.saves ? job.saves.some(job => job.userId == user.userId) : false;
                return {
                    ...job,
                    applied: isApplied ,
                    saved : isSaved
                };
            });
              console.log(updatedJobs)
              setSearchResults(updatedJobs); 
              setIsLoading(false);
              setSearched(true)
          } else {
              setIsLoading(false);
              setSearchResults([]); 
              console.error(data.message);
          }
      } catch (err) {
           setIsLoading(false);
          console.error('Error fetching jobs:', err); 
          setSearchResults([]);
      }
  };
  const handleApplyJob = async (e, jobId) => {
    e.preventDefault();
    const userId = user.userId;
    try {
        setIsLoading(true);
        const response = await fetch('http://localhost:4000/api/apply', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, jobId }),
        });

        const data = await response.json();
        console.log('data',data)
        if (response.ok) {
            const result = searchResults.map((item)=>{
                const isApplied = item._id == jobId || (item.applications && item.applications.some(job => job.userId == user.userId));
                const isSaved = item._id == jobId || (item.saves && item.saves.some(job => job.userId == user.userId));
                    return {
                        ...item,
                        applied: isApplied ,
                        saved: isSaved 
                    };
            })
            setSearchResults(result);
            toast.success("Applied for job successfully!!");
        } else {
            console.error(data.message);
        }
        setIsLoading(false);
    } catch (error) {
        setIsLoading(false);
        console.error('Error applying for job:', error);
    }
  };
  const handleSaveJob = async (e, jobId) => {
    e.preventDefault();
    const userId = user.userId;
    try {
        setIsLoading(true);
        const response = await fetch('http://localhost:4000/api/savejob', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, jobId }),
        });

        const data = await response.json();
        console.log('data',data)
        if (response.ok) {
            const result = searchResults.map((item)=>{
                const isSaved = item._id == jobId || (item.saves && item.saves.some(job => job.userId == user.userId));
                const isApplied = item.applications ? item.applications.some(job => job.userId == user.userId) : false;
                    return {
                        ...item,
                        applied: isApplied ,
                        saved: isSaved 
                    };
            })
            setSearchResults(result);
            toast.success("Job saved successfully!!");
        } else {
            console.error(data.message);
        }
        setIsLoading(false);
    } catch (error) {
        setIsLoading(false);
        console.error('Error applying for job:', error);
    }
  };
    return (
        <>
         {isLoading && <Loader />}
         <ToastContainer
    	position="top-center"
    	/> 
        <div className="">
        {user && user.type == 'Employer'?<CandidateSearchBar onSearch={handleCandidateSearch}/> : <SearchBar onSearch={handleSearch} />}
        
        {user && ( 
            <div className="text-center mt-4">
                <h2 className="text-lg font-bold">Welcome back, {user.name}!</h2>
            </div>
        )}
        <div className="max-w-8xl mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mx-6">
{searchResults.length > 0 ? (
searchResults.map(job => (
  <div key={job._id} className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl">
    <div className="p-6">
    <div className="flex justify-between mb-2" >
    <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
        {!job.saved?(<button className="ml-2" onClick={(e) => handleSaveJob(e, job._id)}>
         <FaRegBookmark/>
        </button>):<FaBookmark/>}
      </div>
      <p className="text-gray-700 text-sm mb-1">{job.company}</p>
      <p className="text-gray-500 text-sm mb-4">{job.location}</p>
      <p className="text-gray-600 mb-4 line-clamp-3">{job.description}</p>
      <div className="flex items-center mt-4">
            <a 
             href={`/jobs/${job._id}`} 
                    className="bg-black text-white px-6 py-2 rounded-md  mt-4 ml-2 mr-2 hover:bg-[#E9E9E9] text-sm font-bold transition-all border-black-all"
                >
                    View job details
                </a>
          
        {!job.applied ? (
          <button onClick={(e) => handleApplyJob(e, job._id)}
            className="text-white px-5 py-2 rounded-md ml-2 mt-4 bg-black transition-all border border-black font-sm text-sm"
          >
            Apply
          </button>
        ) : (
          <button 
            className="text-black px-5 py-2 rounded-md ml-2 mt-4 bg-white transition-all border border-black font-sm text-sm"
          >
            Applied
          </button>
        )}
      </div>
    </div>
  </div>
))
) : (searched && 
<p className="text-center text-black-300">No jobs found. Please adjust your search.</p>
)}
</div>
<div className="max-w-8xl mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mx-6">
    {candidates.length > 0 ? (
        candidates.map((candidate, index) => (
            <div
                key={index}
                className="p-4 bg-white shadow-md rounded-lg mb-4 border border-gray-200"
            >
                 <div className="mt-4 grid grid-cols-2 gap-4">
                    <h4 className="text-md font-semibold">{candidate.name}</h4>
                </div>
                
                <p className="text-gray-600">{candidate.jobTitle}</p>
                <p className="text-gray-500">{candidate.skills}</p>
                <p className="text-gray-500">{candidate.location}</p>
                <div className="mt-4 flex gap-2">
          <a href={`/candidates/${candidate._id}`} className="text-white text-center bg-black ml-2 mr-2 py-2 px-4 shadow-md rounded-md hover:bg-gray-700 transition-all text-sm font-semibold">
          View Profile
          </a>
          <button
            onClick={() => openMessageModal(user.userId || user._id, candidate)}
            className="px-4 py-2 border border-black text-black rounded-md hover:bg-blue-50 transition-colors"
          > <MessageCircle className="h-5 w-5" />
            </button>
          </div>
            </div>
        ))
    ) : (
        candidateSearched && (
            <p className="text-center text-black-300">No candidates found.</p>
        )
    )}
</div>


        <div className="text-center mt-10">
            {user && user.type != 'Employer' &&<> <a 
                href="/profile" 
                className="mt-2 text-center text-[#2B2B2B]"
            >
                Post your resume
            </a>
            <span className="text-[#B3B4BD]"> - It only takes a few seconds</span></>}
           
            
            <p className="mt-2">
                <a 
                    href="/post-job" 
                    className="mt-2 text-center text-[#2B2B2B]"
                >
                    Post a job on HireHub
                </a>
            </p>
            
            <p className="mt-2 text-sm text-[#B3B4BD]">
                What's trending on HireHub
            </p>
        </div>
    </div>
    {isMessageModalOpen && <MessageComponent reciever = {reciever} senderId ={senderId} isOpen={isMessageModalOpen} onClose={toggleMessages} />}
        </>
    );
};

export default HomePage;
