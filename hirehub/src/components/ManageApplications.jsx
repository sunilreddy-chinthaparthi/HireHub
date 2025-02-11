import React, { useState } from 'react';

const ManageApplications = ({ job, onClose }) => {
  const [applications, setApplications] = useState(job.applications);

  const handleStatusChange = (applicantId, newStatus) => {
    setApplications((prevApplications) =>
      prevApplications.map((applicant) =>
        applicant.id === applicantId ? { ...applicant, status: newStatus } : applicant
      )
    );

    fetch(`/api/applications/${applicantId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Status updated successfully:', data);
      })
      .catch(error => {
        console.error('Error updating status:', error);
      });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold mb-4">Manage Applications for {job.title}</h3>
        
        <div className="space-y-4">
          {applications.map((applicant) => (
            <div key={applicant.id} className="p-4 bg-gray-50 rounded-md shadow-sm">
              <div className="flex justify-between">
                <div>
                  <h4 className="text-xl font-semibold">{applicant.name}</h4>
                  <p className="text-gray-600">Email: {applicant.email}</p>
                  <p className="text-gray-600">Status: <span className="font-semibold">{applicant.status}</span></p>
                </div>
                <div className="flex flex-col items-end">
                  <label className="block text-gray-600 mb-1">Update Status:</label>
                  <select
                    value={applicant.status}
                    onChange={(e) => handleStatusChange(applicant.id, e.target.value)}
                    className="p-2 border rounded"
                  >
                    <option value="applied">Applied</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="interview_scheduled">Interview Scheduled</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-6 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ManageApplications;
