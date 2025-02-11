import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; 
import Loader from '../components/Loader';

const ResetPassword = () => {
    const { token } = useParams(); 
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            setIsLoading(true);
            const response = await fetch(`http://localhost:4000/api/reset-password/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password: newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
                setIsLoading(false);
                navigate('/signin');
            } else {
                setIsLoading(false);
                setError(data.message);
            }
        } catch (err) {
            setIsLoading(false)
            setError('An error occurred while resetting the password.');
            console.error('Reset password error:', err);
        }
    };

    return (<>
         {isLoading && <Loader />}
        <div className="flex items-center justify-center py-6">
        <div className="w-full max-w-md p-8 space-y-8 bg-[#F4F4F4] rounded-lg shadow-lg border border-[#EAEAEA]">
        <div>
          <h3 className="text-xl font-bold text-center text-[#000000]">Create New Password</h3>
        </div>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className='appearance-none rounded-md w-full px-4 py-3 bg-[#FFFFFF] text-[#2B2B2B] placeholder-[#A3A3A3] border border-[#EAEAEA] focus:outline-none focus:ring-2 focus:ring-[#000000] focus:ring-offset-2 sm:text-sm'
                        required
                    />
                </div>
                <button type="submit" className="group relative w-full py-4 px-4 my-5 border border-transparent text-sm font-medium rounded-md text-white bg-[#000000] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#000000]">Reset Password</button>
            </form>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
        </div>
        </>
    );
};

export default ResetPassword;
