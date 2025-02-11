import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useParams } from 'react-router-dom';

const JobDetailPage = ({ job }) => {
  const { user, logout } = useAuth();
  const [searchResults, setSearchResults] = useState({});
  const [isLoading, setIsLoading] = useState(null);
  const { jobId } = useParams();

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:4000/api/job/search?jobId=${encodeURIComponent(jobId)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setSearchResults(data.job);
      console.log('job', data, user);
      if (response.ok) {
        const isApplied = data.job.applications ? data.job.applications.some(job => job.userId == user.userId) : false;
        data.job['applied'] = isApplied;
        setSearchResults(data.job);
        setIsLoading(false);
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

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8 font-sans">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800 mb-1">{searchResults.title || 'Salesforce Developer'}</h1>
          <p className="text-sm text-gray-500">
            <strong className="font-medium">Company:</strong> {searchResults.company || 'Bajaj Finserv'}
          </p>
          <p className="text-sm text-gray-500">
            <strong className="font-medium">Location:</strong> {searchResults.location || 'Pune'}
          </p>
          <p className="text-sm text-gray-500">
            <strong className="font-medium">Posted:</strong> {new Date(searchResults.postedDate).toLocaleDateString() || 'Just now'}
          </p>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Job Description</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-4">
          {searchResults.description || 'Lead the design, development, and implementation of complex Salesforce solutions...'}
        </p>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Responsibilities</h2>
        <ul className="list-disc list-inside text-gray-700 text-sm leading-relaxed mb-4 space-y-2">
          {(searchResults.responsibilities || [
            'Lead the design, development, and implementation of complex Salesforce solutions.',
            'Customize Salesforce applications using Apex, Visualforce, and Lightning components.',
            'Collaborate with stakeholders to gather requirements.',
          ]).map((resp, index) => (
            <li key={index}>{resp}</li>
          ))}
        </ul>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Qualifications</h2>
        <ul className="list-disc list-inside text-gray-700 text-sm leading-relaxed mb-4 space-y-2">
          {(searchResults.qualifications || [
            '4 to 6 years of experience in Salesforce development.',
            'Expertise in Apex, Visualforce, Lightning, and Salesforce APIs.',
            'Salesforce certifications are highly desirable.',
          ]).map((qual, index) => (
            <li key={index}>{qual}</li>
          ))}
        </ul>
      </div>

      <div className="border-t border-gray-200 pt-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-1">Salary Insights</h2>
          <p className="text-sm text-gray-500">Avg. Salary: 7.5 LPA (Based on company data)</p>
        </div>
        {!searchResults.applied && <button className="bg-blue-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-600 text-sm">
          Apply Now
        </button>}
        
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Reviews</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          "Great organization to work for with good opportunities to learn and grow."
        </p>
      </div>
    </div>
  );
};

export default JobDetailPage;
