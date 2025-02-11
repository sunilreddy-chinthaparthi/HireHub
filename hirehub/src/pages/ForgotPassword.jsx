import React, { useState } from 'react';
import Loader from '../components/Loader';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            setIsLoading(true);
            const response = await fetch('http://localhost:4000/api/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message);
            } else {
                setError(data.message);
            }
            setIsLoading(false);
        } catch (err) {
            setError('An error occurred while sending the email.');
            console.error('Forgot password error:', err);
            setIsLoading(false);
        }
    };

    return (
        <>
        {isLoading && <Loader />}
        <div className="flex items-center justify-center py-6">
        
        <div className="w-full max-w-md p-8 space-y-8 bg-[#F4F4F4] rounded-lg shadow-lg border border-[#EAEAEA]">
        <div>
          <h3 className="text-xl font-bold text-center text-[#000000]">Forgot Password</h3>
        </div>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="email"
                        id="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='appearance-none rounded-md w-full px-4 py-3 bg-[#FFFFFF] text-[#2B2B2B] placeholder-[#A3A3A3] border border-[#EAEAEA] focus:outline-none focus:ring-2 focus:ring-[#000000] focus:ring-offset-2 sm:text-sm'
                        required
                    />
                </div>
                <button type="submit" className="group relative w-full py-4 px-4 my-5 border border-transparent text-sm font-medium rounded-md text-white bg-[#000000] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#000000]">Send Reset Link</button>
            </form>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
        </div>
        </>
    );
};

export default ForgotPassword;
