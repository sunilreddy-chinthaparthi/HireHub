import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import Loader from '../components/Loader';

const EditProfile = () => {
  const { user, setUser } = useAuth();
  const [message, setMessage] = useState('No changes were made to your account');
  const [enableSave, setEnableSave] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resume, setResume] = useState(null);
  const [resumeUrl, setResumeUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [profile, setProfile] = useState({
    type: '',
    name: '',
    email: '',
    jobTitle: '',
    location: '',
    phone: '',
    aboutMe: '',
    skills: '',
    experience: '',
    education: '',
  });
  const [profileChanges, setProfileChanges] = useState({
    nameChange: false,
    emailChange: false,
    jobTitleChange: false,
    locationChange: false,
    phoneChange: false,
    aboutMeChange: false,
    skillsChange: false,
    experienceChange: false,
    educationChange: false,
  });

  useEffect(() => {
    if (user) {
      const { name, email, jobTitle,type,subscriptionStatus, location, phone, aboutMe, skills, experience, education, resume } = user;
     console.log('user',user);
      setProfile({
        subscriptionStatus: subscriptionStatus || '',
        type: type || '',
        name: name || '',
        email: email || '',
        jobTitle: jobTitle || '',
        location: location || '',
        phone: phone || '',
        aboutMe: aboutMe || '',
        skills: skills || '',
        experience: experience || '',
        education: education || '',
        resume: resume || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleClick = (e, fieldName) => {
    setEnableSave(true);
    e.preventDefault();
    setProfileChanges((prevProfileChanges) => ({
      ...prevProfileChanges,
      [`${fieldName}Change`]: true,
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      console.log('profile', profile);
      const res = await fetch('http://localhost:4000/api/edit-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      });
      setMessage('Changes saved successfully.');
      setProfileChanges(false);
      const data = await res.json();
      localStorage.setItem('token', data.token);
      console.log('Response:', res);
    } catch (err) {
      console.log('Something went wrong. Please try again.');
    }
    setIsLoading(false);
    setEnableSave(false);
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfile((prevProfile) => ({
            ...prevProfile,
            resume: reader.result.split(',')[1],
          }));
        };
        reader.readAsDataURL(file);
        setResume(e.target.files[0]);
        setEnableSave(true);
      } else {
        toast.error('Only pdf files are supported!!');
        setResume(null);
      }
    }
  };

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  const renderEditableField = (label, name, multiline = false) => {
    return (
      <div className="py-4 border-t border-b border-[#EAEAEA]">
        <label className="block text-gray-700 font-bold mb-1">{label}:</label>
        {profileChanges[`${name}Change`] ? (
          multiline ? (
            <textarea
              id={name}
              name={name}
              value={profile[name]}
              onChange={handleChange}
              rows={3}
              className="rounded-md w-full px-4 py-3 bg-[#FFFFFF] text-[#2B2B2B] border border-[#EAEAEA] focus:outline-none"
            />
          ) : (
            <input
              type="text"
              id={name}
              name={name}
              value={profile[name]}
              onChange={handleChange}
              className="rounded-md w-full px-4 py-3 bg-[#FFFFFF] text-[#2B2B2B] border border-[#EAEAEA] focus:outline-none"
            />
          )
        ) : (
          <div className="flex justify-between">
            <span className="text-gray-900">{profile[name]}</span>
            <button
              onClick={(e) => handleClick(e, name)}
              className="text-gray-600 font-medium hover:underline"
            >
              Change {label}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center py-6">
      <ToastContainer position="top-center" />
      <div className="w-full max-w-xl p-8 space-y-8 bg-white rounded-lg shadow-lg border border-[#EAEAEA]">
        <h2 className="text-4xl font-extrabold text-center text-[#000000]">Edit Profile</h2>

        {message && (
          <div className="mb-6 p-4 bg-blue-50 text-blue-700 rounded border border-blue-200">
            <p>{message}</p>
          </div>
        )}

        <form>
        <form>
          {renderEditableField('Name', 'name')}
          {renderEditableField('Phone', 'phone')}
          {renderEditableField('Email', 'email')}
          {renderEditableField('Location', 'location')}
          {renderEditableField(user && user.type == 'Employer' ? 'About Company' : 'About Me', 'aboutMe', true)}
          {user && user.type != 'Employer' && renderEditableField('Job Title', 'jobTitle')}
          {user && user.type != 'Employer' && renderEditableField('Skills', 'skills')}
          {user && user.type != 'Employer' && renderEditableField('Experience', 'experience', true)}
          {user && user.type != 'Employer' && renderEditableField('Education', 'education', true)}
        </form>

          {user && user.type != 'Employer' && <div className="py-4 border-t border-b border-[#EAEAEA]">
            <label className="block text-gray-700 font-semibold mb-2 text-lg">
              {profile.resume ? "Update Resume:" : "Upload Resume:"}
            </label>

            {profile.resume ? (
              <div className="flex items-center justify-between bg-gray-50 border border-gray-300 rounded-lg p-3 mb-3">
                <div className="truncate">
                  <p className="text-gray-700 font-medium">Current Resume:</p>
                  <p className="text-gray-600 text-sm truncate">
                    {profile.resume.name || "resume.pdf"}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    type='button'
                    className="text-blue-600 hover:underline text-sm"
                    onClick={() => viewResume(profile.resume)}
                  >
                    View
                  </button>
                  <button
                    className="text-red-500 hover:underline text-sm"
                    onClick={() => setProfile((prev) => ({ ...prev, resume: null }))}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : null}

            <div className="relative">
              <input
                type="file"
                accept=".pdf"
                onChange={handleResumeChange}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
              />
              {!profile.resume && (
                <p className="mt-1 text-sm text-gray-500">
                  Please upload a PDF file for your resume.
                </p>
              )}
            </div>
          </div>}

          {enableSave && (
            <button
              type="button"
              onClick={handleSave}
              className="w-full py-3 px-4 mt-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#000000] hover:shadow-lg focus:outline-none"
            >
              Save
            </button>
          )}
        </form>
      </div>
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
  );
};

export default EditProfile;
