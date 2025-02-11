import React from 'react';
import { Link } from 'react-router-dom';

const EmployerHomepage = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-10 font-sans">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="bg-[#1e293b] text-white p-10 rounded-lg shadow-lg flex flex-col lg:flex-row items-center justify-between">
          <div className="mb-6 lg:mb-0 lg:w-1/2">
            <h1 className="text-4xl font-bold mb-4">Find Top Talent Faster</h1>
            <p className="text-lg mb-6">
              Post jobs, search for candidates, and streamline your recruitment process. Our platform is designed to help you attract the best candidates efficiently.
            </p>
            <Link
              to="/signup"
              className="bg-white text-black font-semibold py-2 px-6 rounded-lg hover:bg-gray-100 transition"
            >
              Get Started for Free
            </Link>
          </div>
          <div className="lg:w-1/2 mt-8 lg:mt-0">
            <img src="/images/employer-hero.jpg" alt="Find Top Talent" className="rounded-lg shadow-md" />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8 mt-12">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">Why Choose Our Platform?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-black mb-4">Post Jobs with Ease</h3>
            <p className="text-gray-600">Create job listings quickly and reach thousands of qualified candidates instantly.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-black mb-4">Advanced Candidate Search</h3>
            <p className="text-gray-600">Find the right candidates by filtering profiles based on skills, experience, and location.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-black mb-4">Efficient Application Management</h3>
            <p className="text-gray-600">Organize and review applications, track applicant status, and make hiring decisions faster.</p>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gray-100 py-12 mt-12">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">Benefits for Employers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <img src="/images/time-saving.svg" alt="Time-Saving" className="w-20 h-20 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800">Time-Saving</h3>
              <p className="text-gray-600 mt-2">Automate repetitive tasks and save valuable time during the recruitment process.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <img src="/images/cost-effective.svg" alt="Cost-Effective" className="w-20 h-20 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800">Cost-Effective</h3>
              <p className="text-gray-600 mt-2">Post jobs at competitive rates and hire faster, reducing recruitment costs.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <img src="/images/quality-talent.svg" alt="Quality Talent" className="w-20 h-20 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800">Access Quality Talent</h3>
              <p className="text-gray-600 mt-2">Connect with top talent from a wide range of industries and experience levels.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">What Employers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600 italic mb-4">"This platform has streamlined our hiring process. We've hired top talent in record time!"</p>
            <p className="text-gray-800 font-semibold">— John Doe, HR Manager</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600 italic mb-4">"The candidate search tool is incredibly powerful. It saved us hours of work."</p>
            <p className="text-gray-800 font-semibold">— Sarah Lee, Recruitment Specialist</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600 italic mb-4">"We found highly skilled developers through this platform and improved our team quality."</p>
            <p className="text-gray-800 font-semibold">— Mark Evans, CTO</p>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="bg-[#1e293b] py-10">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Hire the Best?</h2>
          <p className="text-lg text-gray-100 mb-6">Join thousands of employers who trust our platform for recruitment.</p>
          <Link
            to="/signup"
            className="bg-white text-blue-600 font-semibold py-2 px-6 rounded-lg hover:bg-gray-100 transition"
          >
            Start Recruiting Today
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EmployerHomepage;
