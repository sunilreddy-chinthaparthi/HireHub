import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Loader from '../components/Loader';

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(null);
  const [selectedType, setSelectedType] = useState('Job Seeker');
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);
      const type = selectedType;
      const res = await fetch('http://localhost:4000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, type}),
      });

      const data = await res.json();

      if (res.ok) {
        // Store the JWT token in localStorage
        localStorage.setItem('token', data.token);
        setSuccess('Account created successfully!');
        setError('');
        setIsLoading(false);
        // Redirect to sign in page or dashboard
        navigate('/signin');
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
    <div className="flex items-center justify-center py-6">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg border border-[#EAEAEA] shadow-xl shadow-black/5">
        <div>
          <h2 className="text-4xl font-extrabold text-center text-[#000000]">Sign Up</h2>
          <p className="mt-2 text-center text-[#2B2B2B]">Create a new account</p>
        </div>

        {error && <p className="text-center text-red-500">{error}</p>}
        {success && <p className="text-center text-green-500">{success}</p>}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
          <div className="flex gap-8 justify-center">
          <div className="flex items-center">
        <input
          type="radio"
          id="Job Seeker"
          name="Job Seeker"
          value="Job Seeker"
          checked={selectedType === 'Job Seeker'}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
        />
        <label htmlFor="option1" className="ml-2 text-gray-700">
         JobSeeker
        </label>
          </div>

      <div className="flex items-center">
        <input
          type="radio"
          id="Employer"
          name="Employer"
          value="Employer"
          checked={selectedType === 'Employer'}
          onChange={(e) => setSelectedType(e.target.value)}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
        />
        <label htmlFor="option2" className="ml-2 text-gray-700">
          Employer
        </label>
      </div>
           </div>
            <div>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="appearance-none rounded-md w-full px-4 py-3 bg-[#FFFFFF] text-[#2B2B2B] placeholder-[#A3A3A3] border border-[#EAEAEA] focus:outline-none focus:ring-2 focus:ring-[#000000] focus:ring-offset-2 sm:text-sm"
                placeholder={selectedType == 'Job Seeker'? "Full Name" : 'Comapany Name'}
              />
            </div>
            <div>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="appearance-none rounded-md w-full px-4 py-3 bg-[#FFFFFF] text-[#2B2B2B] placeholder-[#A3A3A3] border border-[#EAEAEA] focus:outline-none focus:ring-2 focus:ring-[#000000] focus:ring-offset-2 sm:text-sm"
                placeholder={selectedType == 'Job Seeker'? "Email address" : 'Comapany Email address'}
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="appearance-none rounded-md w-full px-4 py-3 bg-[#FFFFFF] text-[#2B2B2B] placeholder-[#A3A3A3] border border-[#EAEAEA] focus:outline-none focus:ring-2 focus:ring-[#000000] focus:ring-offset-2 sm:text-sm"
                placeholder="Password"
              />
            </div>
            <div>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="appearance-none rounded-md w-full px-4 py-3 bg-[#FFFFFF] text-[#2B2B2B] placeholder-[#A3A3A3] border border-[#EAEAEA] focus:outline-none focus:ring-2 focus:ring-[#000000] focus:ring-offset-2 sm:text-sm"
                placeholder="Confirm Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-[#000000] focus:ring-[#000000] border-[#EAEAEA] rounded"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-[#2B2B2B]">
                I agree to the{' '}
                <a href="#" className="font-medium text-[#000000] hover:text-[#2B2B2B]">
                  Terms & Conditions
                </a>
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#000000] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#000000]"
            >
              Sign Up
            </button>
          </div>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-[#2B2B2B]">
            Already have an account?{' '}
            <a href="/signin" className="font-medium text-[#000000] hover:text-[#2B2B2B]">
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default SignUpPage;
