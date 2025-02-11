import React, { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import ManageApplications from './ManageApplications';
import EditJobForm from './EditJobForm';

const EmployerDashboard = () => {
  const { userId } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('recent');
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [editJobData, setEditJobData] = useState(null);

  const fetchJobs = async () => {
    try {
        const response = await fetch(`http://localhost:4000/api/fetchjobs?userId=${encodeURIComponent(userId)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        console.log('data', data);
        if (response.ok) {
            setFilteredJobs(data);
        } else {
            console.error(data.message);
        }
    } catch (err) {
        console.error('Error fetching jobs:', err); 
    }
};

useEffect(() => {
    fetchJobs();
}, []);
  const toggleFavorite = (jobId) => {
    // Handle toggling favorite (important) status of the job
  };

  const handleEditSave = (applicantId, status) => {
    // Update applicant status in the backend
  };

  const deleteJob = async (jobId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/deletejob/${jobId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        console.log("Job deleted successfully");
        fetchJobs();
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const editJob =  (job) => {
    setEditJobData(job);
    setOpenEditModal(true);
  };
  const handleCloseEditModal =  () => {
    setEditJobData(null);
    setOpenEditModal(false);
  };
  

  const openManageApplications = (job) => {
    navigate(`/manageapplication/${job._id}`);
  }

  const closeManageApplications = () => {
    setSelectedJob(null);
  };
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto mb-4 flex justify-between">
        <input
          type="text"
          placeholder="Search job titles..."
          className="p-2 border rounded"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select className="p-2 border rounded" onChange={(e) => setSortOption(e.target.value)}>
          <option value="recent">Newest First</option>
          <option value="applications">Most Applications</option>
        </select>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="max-w-4xl mx-auto mt-6 flex justify-between text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Posted Jobs</h2>
        <Link
            to="/post-job"
            className=" py-2 px-4 max-w-full border border-transparent text-sm font-medium rounded-md text-white bg-[#000000] hover:shadow-lg focus:outline-none"
          >
             Add New Job
          </Link>
      </div>
        {filteredJobs.length > 0 ? (
          <ul className="space-y-4">
            {filteredJobs.map((job) => (
              <li key={job.id} className="p-4 bg-gray-50 rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-800">{job.title}</h3>
                  <button onClick={() => toggleFavorite(job.id)}>
                    {job.isFavorite ? '★' : '☆'}
                  </button>
                </div>
                <p className="text-gray-600">Location: {job.location}</p>
                <p className="text-gray-600">Posted on: {new Date(job.postedDate).toLocaleDateString()}</p>
                <p className="text-gray-600">Applications: {job.applications ? job.applications.length:0}</p>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-gray-600">Avg. Time to Apply: {job.avgApplyTime} days</p>
                  <button
                    className={`py-1 px-3 rounded ${!job.applications ? 'cursor-not-allowed text-gray-400 bg-gray-100' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                    onClick={() => openManageApplications(job)}
                    disabled={!job.applications}
                  >
                    Manage Applications
                  </button>
                  <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => editJob(job)}
                  >
                    Edit Job
                  </button>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => deleteJob(job._id)}
                  >
                    Delete Job
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">You have no posted jobs.</p>
        )}
        <div className="mt-4 flex justify-center">
          <button onClick={() => setPage(page - 1)} disabled={page === 1} className="px-4 py-2 text-gray-700">
            Previous
          </button>
          <span className="mx-2  px-4 py-2 text-gray-700">{page}</span>
          <button onClick={() => setPage(page + 1)} disabled={filteredJobs.length < 5} className="px-4 py-2 text-gray-700">
            Next
          </button>
        </div>
      </div>
      

       {/* {selectedJob && (
        <a href={`/manageapplication/${selectedJob._id}`} className="flex items-center px-4 py-2 hover:bg-gray-100">Manage Applications
    </a>)}
         <ManageApplications job={selectedJob} onClose={closeManageApplications} /> */}
      { (openEditModal &&
        <EditJobForm 
        job={editJobData}
        isOpen={openEditModal}
        onClose={handleCloseEditModal}
        onUpdate = {fetchJobs}
        />
      )}
    </div>
  );
};

export default EmployerDashboard;
