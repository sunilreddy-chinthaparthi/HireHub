import React from 'react';
import { Link } from 'react-router-dom';

const JobCard = ({ job }) => (
<div className="bg-white p-4 shadow-md">
  <h3 className="text-xl font-bold">{job.title}</h3>
  <p>{job.company}</p>
  <p>{job.location}</p>
  <Link to={`/jobs/${job.id}`} className="text-blue-500">View Details</Link>
</div>

);

export default JobCard;
