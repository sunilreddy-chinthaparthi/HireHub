import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext'; 
import Loader from '../components/Loader';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:4000/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log('data', data);
        localStorage.setItem('token', data.token);
        login(data.user);
        navigate('/');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <>
    {isLoading && <Loader />}
      
    <div className="flex items-center justify-center py-6">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg border border-[#EAEAEA]">
        <div>
          <h2 className="text-4xl font-extrabold text-center text-[#000000]">Sign In</h2>
          <p className="mt-2 text-center text-[#2B2B2B]">Access your account</p>
        </div>
        {error && <p className="text-center text-red-500">{error}</p>}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="appearance-none rounded-md w-full px-4 py-3 bg-[#FFFFFF] text-[#2B2B2B] placeholder-[#A3A3A3] border border-[#EAEAEA] focus:outline-none focus:ring-2 focus:ring-[#000000] focus:ring-offset-2 sm:text-sm"
                placeholder="Email address"
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
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember_me"
                name="remember_me"
                type="checkbox"
                className="h-4 w-4 text-[#000000] focus:ring-[#000000] border-[#EAEAEA] rounded"
              />
              <label htmlFor="remember_me" className="ml-2 block text-sm text-[#2B2B2B]">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a href="/forgot-password" className="font-medium text-[#000000] hover:text-[#2B2B2B]">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full py-3 px-4 border border-transparent text-sm font-medium rounded-md text-sm font-semibold bg-slate-900 text-white hover:bg-slate-700 "
            >
              Sign In
            </button>
          </div>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-[#2B2B2B]">
            Don’t have an account?{' '}
            <a href="/signup" className="font-medium text-[#000000] hover:text-[#2B2B2B]">
              Sign up here
            </a>
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default SignInPage;
