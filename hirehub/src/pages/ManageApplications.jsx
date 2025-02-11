import React, {useState, useEffect} from "react";
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader';

const ManageApplications = () => {
    const { jobId } = useParams();
    const [applications, setApplications] = useState([]);
    const [resumeUrl, setResumeUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        if (jobId) {
            getApplications();
        }
    }, []);
    if (isLoading) {
        return <div className="flex items-center justify-center h-screen"> {<Loader />}</div>;
    }
   const getApplications = async ()=>{
    try {
        setIsLoading(true)
        console.log('jobId',jobId)
        const response = await fetch(`http://localhost:4000/api/applications/users/?jobId=${encodeURIComponent(jobId)}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
        },
      });
        const applicants = await response.json();
        console.log(applicants); 
        const applicationsWithStatus = applicants.map((applicant) => {
            const matchingApplication = applicant.applications.find(
              (app) => app.userId === applicant.applicants._id
            );
            return {
              ...applicant.applicants, 
              status: matchingApplication ? matchingApplication.status : "Not Applied", 
              appliedOn: matchingApplication ? matchingApplication.appliedOn.split('T')[0]: "", 
              jobId: applicant._id
            };
          });
          setApplications(applicationsWithStatus);
          console.log('applicationsWithStatus:', applicationsWithStatus);
          
      } catch (error) {
        console.error('Error fetching applicants:', error);
      }
      setIsLoading(false)
    };
    const handleApproveReject = async(e,application)=>{
        setIsLoading(true)
    const userId = application._id;
    const jobId = application.jobId;
    const status = e.target.name == 'approve'? 'Shortlisted' : 'Rejected';
    console.log('jobId',jobId,userId,status);
    try {
        const response = await fetch("http://localhost:4000/api/application/update-status", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ jobId, userId, status }),
        });
    
        const data = await response.json();
        if (response.ok) {
            setApplications((applications) =>
            applications.map((application) =>
              application._id === userId
                ? { ...application, status } 
                : application
            )
          );
          console.log(data.message);
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error("Error updating application status:", error);
      }
      setIsLoading(false)
    }
    const viewResume = (resumeBase64) => {
        const byteCharacters = atob(resumeBase64);
        const byteArrays = [];
    
        for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
          const slice = byteCharacters.slice(offset, offset + 1024);
          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }
          byteArrays.push(new Uint8Array(byteNumbers));
        }
    
        const blob = new Blob(byteArrays, { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        setResumeUrl(url);
        setShowModal(true);
      };
      const closeModal = () => {
        setShowModal(false);
        setResumeUrl(null);
      };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-700">
          Manage Applications
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-blue-100 text-blue-800">
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Applied On</th>
                <th className="px-4 py-2 text-left">Resume</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app, index) => (
                <tr
                  key={app.id}
                  className="odd:bg-white even:bg-blue-50 hover:bg-blue-100"
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2"><a className="text-blue-600 hover:underline" href={`/candidates/${app._id}`}>{app.name}</a></td>
                  <td className="px-4 py-2">{app.email}</td>
                  <td className="px-4 py-2">{app.appliedOn}</td>
                  <td className="px-4 py-2">
                          <button
                              className={`text-blue-600 hover:underline ${!app.resume ? 'cursor-not-allowed text-gray-400' : ''}`}
                              onClick={() => viewResume(app.resume)}
                              disabled={!app.resume}
                          >
                              View Resume
                          </button>
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        app.status === "Applied"
                          ? "bg-yellow-100 text-yellow-800"
                          :  (app.status === "Shortlisted" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800")
                      }`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
  {app.status === "Shortlisted" ? (
    <button
      className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md text-sm"
      name="reject"
      onClick={(e) => handleApproveReject(e, app)}
    >
      Reject
    </button>
  ) : app.status === "Rejected" ? (
    <button
      className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-md text-sm"
      name="approve"
      onClick={(e) => handleApproveReject(e, app)}
    >
      Approve
    </button>
  ) : (
    <>
      <button
        className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-md text-sm"
        name="approve"
        onClick={(e) => handleApproveReject(e, app)}
      >
        Approve
      </button>{" "}
      <button
        className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md text-sm"
        name="reject"
        onClick={(e) => handleApproveReject(e, app)}
      >
        Reject
      </button>
    </>
  )}
</td>

                </tr>
              ))}
            </tbody>
          </table>
          {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="relative bg-white w-4/5 h-4/5 rounded-lg p-4 shadow-xl">
            <button onClick={closeModal} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 w-8 h-8 flex items-center justify-center">
              X
            </button>
            <iframe
              src={resumeUrl}
              width="100%"
              height="100%"
              title="Resume"
              className="border-none"
            />
          </div>
        </div>
      )}
        </div>

        <div className="mt-6">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
            onClick={() => window.history.back()}
          >
            Back to Job Postings
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageApplications;
