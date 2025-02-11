import React, { useState } from 'react';
import { FaUser, FaBookmark, FaStar, FaCog, FaQuestionCircle, FaLock } from 'react-icons/fa';
import { MdSubscriptions } from "react-icons/md";

const ProfileDropdown = ({ user, logout }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="relative">
            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                    <div className="p-4 border-b">
                        <p className="font-semibold text-gray-800">{user.name}</p>
                    </div>

                    <div className="py-2">
                        <a href="/profile" className="flex items-center px-4 py-2 hover:bg-gray-100">
                            <FaUser className="mr-3 text-gray-600" /> Profile
                        </a>
                       
                        {user && user.type == 'Employer' ? <a href={`/posted-jobs/${user.userId}`} className="flex items-center px-4 py-2 hover:bg-gray-100">
                            <FaStar className="mr-3 text-gray-600" /> Posted Jobs
                        </a> :  <><a href={`/my-jobs/${user.userId}`} className="flex items-center px-4 py-2 hover:bg-gray-100">
                            <FaStar className="mr-3 text-gray-600" /> My Jobs
                        </a>
                        <a href={`/saved-jobs/${user.userId}`} className="flex items-center px-4 py-2 hover:bg-gray-100">
                            <FaBookmark className="mr-3 text-gray-600" /> Saved Jobs
                        </a></>}
                       
                        
                        <a href="/settings" className="flex items-center px-4 py-2 hover:bg-gray-100">
                            <FaCog className="mr-3 text-gray-600" /> Settings
                        </a>
                        {user && user.type == 'Employer' &&  <a href="/subscribe" className="flex items-center px-4 py-2 hover:bg-gray-100">
                            <MdSubscriptions className="mr-3 text-gray-600" /> Manage Subscription
                        </a> }
                       
                        <a href="/help-center" className="flex items-center px-4 py-2 hover:bg-gray-100">
                            <FaQuestionCircle className="mr-3 text-gray-600" /> Help Center
                        </a>
                    </div>

                    {/* Footer with Sign Out */}
                    <div className="border-t">
                        <a className="block text-center py-3 text-Black-600 font-semibold hover:bg-gray-100" onClick={logout}>
                            Sign Out
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;
