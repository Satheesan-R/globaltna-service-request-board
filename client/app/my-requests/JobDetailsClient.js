"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import './JobDetils.css';
import { apiUrl } from '../../lib/api';

const sampleJobs = {
  'sample-1': {
    id: 'sample-1',
    title: 'Emergency Pipe Repair',
    category: 'Plumbing',
    subcategory: 'Plumbing & Repairs',
    serviceType: 'Home Repair',
    location: 'Colombo west end',
    budget: 'Not specified',
    status: 'Open',
    description: 'Urgent leak in master bathroom requires immediate attention. Sink pipe has burst and needs immediate repair to prevent water damage.',
    internalNotes: 'Sample request for homepage demo.',
    client: { name: 'Sarah Johnson', email: 'sarah@gmail.com', phone: '0718596846', verified: true }
  },
  'sample-2': {
    id: 'sample-2',
    title: 'Full Living Room Refresh',
    category: 'Painting',
    subcategory: 'Interior Painting',
    serviceType: 'Home Improvement',
    location: 'Colombo Bambalapitiya',
    budget: 'Not specified',
    status: 'Open',
    description: 'High ceiling living room requires painting and light sanding. Neutral palette preferred. Materials provided by homeowner.',
    internalNotes: 'Sample request for homepage demo.',
    client: { name: 'Michael Smith', email: 'michael@gmail.com', phone: '0778437599', verified: true }
  },
  'sample-3': {
    id: 'sample-3',
    title: 'EV Charger Installation',
    category: 'Electrical',
    subcategory: 'Electrical & Lighting',
    serviceType: 'Installation',
    location: 'Colombo Wellawatte',
    budget: 'Not specified',
    status: 'In Progress',
    description: 'Certified electrician needed to install a new home charging station in a detached garage with new circuit.',
    internalNotes: 'Sample request for homepage demo.',
    client: { name: 'Emma Davis', email: 'emma@gmail.com', phone: '0769854128', verified: true }
  },
  'sample-4': {
    id: 'sample-4',
    title: 'Bespoke Fitted Wardrobe',
    category: 'Colombo Dehiwala',
    subcategory: 'Custom Joinery',
    serviceType: 'Furniture Installation',
    location: 'Colombo Dehiwala',
    budget: 'Not specified',
    status: 'Open',
    description: 'Custom oak wardrobe for a master bedroom. Design is ready, seeking a craftsman for execution and installation.',
    internalNotes: 'Sample request for homepage demo.',
    client: { name: 'James Wilson', email: 'james@gmail.com', phone: '0718596321', verified: true }
  }
};

const fallbackJobData = {
  id: "#G-88291",
  title: "Modern Kitchen Lighting Installation and Rewiring",
  category: "Electrical",
  subcategory: "Electrical & Lighting",
  serviceType: "Home Renovation",
  location: "Colombo ,Moratuwa",
  budget: "$1,200 - $1,500",
  status: "New Request",
  description: "We are looking for a certified electrician to handle a full lighting redesign in our primary kitchen. The project includes the removal of existing fluorescent fixtures and the installation of 8 recessed LED cans, 3 pendant lights over the kitchen island, and under-cabinet accent lighting.\n\nThe project also requires a circuit upgrade to ensure the new induction stovetop and high-powered appliances are properly supported. All work must be completed to current city code standards and include professional finishing around the mounting points.",
  internalNotes: "High priority request. Client has requested completion before Thanksgiving. Ensure crew carries specialized pendant mounting hardware.",
  client: {
    name: "Robert Chen",
    email: "r.chen@gmail.com",
    phone: "0718596846",
    verified: true
  }
};

const JobDetails = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestId = searchParams.get('id');
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savingStatus, setSavingStatus] = useState(false);
  
  const [jobData, setJobData] = useState(fallbackJobData);
  const [editForm, setEditForm] = useState({ ...jobData });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        if (requestId && sampleJobs[requestId]) {
          const sampleJob = sampleJobs[requestId];
          setJobData(sampleJob);
          setEditForm(sampleJob);
          setError(null);
          setLoading(false);
          return;
        }

        const response = await fetch(apiUrl('/api/jobs'));
        if (!response.ok) {
          throw new Error('Failed to fetch requests');
        }

        const jobs = await response.json();

        const selectedJob = requestId ? jobs.find((job) => job._id === requestId) : jobs[0];

        if (selectedJob) {
          const mappedJob = {
            id: selectedJob._id,
            title: selectedJob.title || 'Untitled Request',
            category: selectedJob.category || 'Other',
            subcategory: selectedJob.category || 'Service Request',
            serviceType: 'Home Service',
            location: selectedJob.location || 'Unknown location',
            budget: 'Not specified',
            status: selectedJob.status || 'Open',
            description: selectedJob.description || '',
            internalNotes: 'Loaded from backend jobs collection.',
            client: {
              name: selectedJob.contactName || 'Unknown Client',
              email: selectedJob.contactEmail || 'no-email@example.com',
              phone: selectedJob.phonenumber || 'Not provided',
              verified: true
            }
          };

          setJobData(mappedJob);
          setEditForm(mappedJob);
        } else {
          setJobData(fallbackJobData);
          setEditForm(fallbackJobData);
        }

        setError(null);
      } catch (fetchError) {
        console.error('Error loading request:', fetchError);
        setError(fetchError.message);
        setJobData(fallbackJobData);
        setEditForm(fallbackJobData);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [requestId]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const updateStatus = async (e) => {
    const newStatus = e.target.value;
    if (!jobData || !jobData.id || String(jobData.id).startsWith('sample') || String(jobData.id).startsWith('#')) {
      alert('This request cannot be updated (sample or fallback).');
      setEditForm(prev => ({ ...prev, status: jobData.status }));
      return;
    }

    const prevStatus = jobData.status;
    setJobData(prev => ({ ...prev, status: newStatus }));
    setSavingStatus(true);

    try {
      const res = await fetch(apiUrl(`/api/jobs/${jobData.id}`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) {
        throw new Error('Failed to update status');
      }

      const updated = await res.json();
      setJobData(prev => ({ ...prev, status: updated.status }));
    } catch (err) {
      console.error('Status update failed', err);
      alert('Could not update status: ' + err.message);
      setJobData(prev => ({ ...prev, status: prevStatus }));
    } finally {
      setSavingStatus(false);
    }
  };

  const handleDeleteRequest = () => setShowDeleteModal(true);
  const confirmDelete = () => { setShowDeleteModal(false); router.push('/jobForm'); };
  const cancelDelete = () => setShowDeleteModal(false);

  const getCategoryIcon = (category) => {
    switch(category.toLowerCase()) {
      case 'plumbing': return '🔧';
      case 'electrical': return '⚡';
      case 'painting': return '🎨';
      case 'joinery': return '🪵';
      default: return '🔨';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Plumbing': '#e74c3c',
      'Electrical': '#f39c12',
      'Painting': '#2ecc71',
      'Joinery': '#3498db'
    };
    return colors[category] || '#7f8c8d';
  };

  return (
    <div className="job-details-page">
      {loading && (<div className="loading-banner">Loading your request from the backend...</div>)}
      {error && !loading && (<div className="loading-banner error-banner">Backend unavailable, showing sample request instead.</div>)}

      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">GlobalTNA</div>
        </div>
      </nav>

      <main className="container">
        <section className="job-header">
          <h1>{jobData.title}</h1>
          <div className="meta">
            <span className="category" style={{background:getCategoryColor(jobData.category)}}>{getCategoryIcon(jobData.category)} {jobData.category}</span>
            <span className="location">{jobData.location}</span>
          </div>
        </section>

        <section className="job-body">
          <h2>Description</h2>
          <p>{jobData.description}</p>
        </section>

      </main>
    </div>
  );
};

export default JobDetails;
