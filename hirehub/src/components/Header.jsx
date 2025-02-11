import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; 
import logo from '../images/logo.jpg';
import { FaUser, FaEnvelope } from 'react-icons/fa'; 
import ProfileDropdown from './ProfileDropDown';
import MessageThreadDropdown from './MessageThreadDropdown';

const Header = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isMessageOpen, setIsMessageOpen] = useState(false); 
    const [userData, setUserData] = useState([]);

    const toggleDropdown = () => setIsOpen(!isOpen);
    const toggleMessages = () => setIsMessageOpen(!isMessageOpen); 

    useEffect(() => {
        if (user) {
            fetchUserData();
        }
    }, [user]);

    const fetchUserData = async () => {
        const userId = user.userId || user._id;
        const response = await fetch(`http://localhost:4000/api/fetchuserdata?userId=${encodeURIComponent(userId)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        setUserData(data.data);
    };

    return (
        <header className="flex justify-between items-center py-2 px-8 bg-white shadow-md border-b border-[#EAEAEA]">
            <div className="flex items-center">
                <img 
                    src={logo} 
                    alt="HireHub Logo" 
                    className="h-14 mr-8 mix-blend-darken opacity-100 filter contrast-125" 
                />
                <nav className="space-x-6">
                    <a href="/" className="text-sm font-medium text-[#2B2B2B] hover:text-[#000000] border-b-2 border-transparent hover:border-black transition duration-200">Home</a>
                    <a href="/career" className="text-sm font-medium text-[#2B2B2B] hover:text-[#000000] border-b-2 border-transparent hover:border-black transition duration-200">Career Resources</a>
                    <a href="/salaries" className="text-sm font-medium text-[#2B2B2B] hover:text-[#000000] border-b-2 border-transparent hover:border-black transition duration-200">Salary Guide</a>
                </nav>
            </div>
            <div className="flex items-center">
                {userData && userData.type === 'Employer' && userData.subscriptionDetails?.status === 'active' && (
                    <a className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-md ml-2 mr-2 py-2 px-4 shadow-md">
                        {userData.subscriptionDetails.plan}
                    </a>
                )}
                {user ? (
                    <>
                        <button onClick={toggleMessages} className="focus:outline-none px-4 py-2 hover:bg-[#E9E9E9] rounded-md relative">
                            <FaEnvelope className="text-xl text-gray-700" />
                            
                        </button>
                        {isMessageOpen && <MessageThreadDropdown userId={user.userId || user._id} />}
                        <button onClick={toggleDropdown} className="focus:outline-none px-6 py-4 border-r hover:bg-[#E9E9E9] rounded-md">
                            <FaUser className="text-xl text-gray-700" />
                            {isOpen && <ProfileDropdown user={user} logout={logout} />}
                        </button>
                    </>
                ) : (
                    <a 
                        href="/signin" 
                        className="bg-white text-black px-6 py-2 rounded-md ml-2 mr-2 hover:bg-[#E9E9E9] text-sm font-bold transition-all border border-black"
                    >
                        Sign In
                    </a>
                )}
                <a 
                    href="/post-job" 
                    className="text-sm font-medium ml-2 text-[#000000] hover:text-[#2B2B2B] border-b-2 border-transparent hover:border-black transition duration-200"
                >
                    Employers / Post Job
                </a>
            </div>
        </header>
    );
};

export default Header;
