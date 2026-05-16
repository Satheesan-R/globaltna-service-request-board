"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import './JobDetils.css';

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
  
  // Job data state
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

        const response = await fetch('http://localhost:5000/api/jobs');
        if (!response.ok) {
          throw new Error('Failed to fetch requests');
        }

        const jobs = await response.json();

        const selectedJob = requestId
          ? jobs.find((job) => job._id === requestId)
          : jobs[0];

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
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Update only status on change and persist to backend immediately
  const updateStatus = async (e) => {
    const newStatus = e.target.value;

    // Do not attempt to update sample or fallback items
    if (!jobData || !jobData.id || String(jobData.id).startsWith('sample') || String(jobData.id).startsWith('#')) {
      alert('This request cannot be updated (sample or fallback).');
      // revert editForm value
      setEditForm(prev => ({ ...prev, status: jobData.status }));
      return;
    }

    const prevStatus = jobData.status;
    // optimistic update
    setJobData(prev => ({ ...prev, status: newStatus }));
    setSavingStatus(true);

    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${jobData.id}`, {
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
      // revert
      setJobData(prev => ({ ...prev, status: prevStatus }));
    } finally {
      setSavingStatus(false);
    }
  };

  const handleDeleteRequest = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // Handle delete logic here
    console.log('Deleting request:', jobData.id);
    setShowDeleteModal(false);
    // Redirect to jobs board
    router.push('/jobForm');
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

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
      {loading && (
        <div className="loading-banner">
          Loading your request from the backend...
        </div>
      )}

      {error && !loading && (
        <div className="loading-banner error-banner">
          Backend unavailable, showing sample request instead.
        </div>
      )}

      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">GlobalTNA</div>
          <div className="nav-links">
            <a href="/home">Home</a>
            <a href="/jobForm" className="active">Jobs</a>
            <a href="/my-requests">My Requests</a>
          </div>
          
          <div className="nav-buttons">
            <button className="btn-outline" onClick={() => router.push("/login")}>
              Sign In
            </button>
            <button className="btn-primary" onClick={() => router.push("/jobForm")}>
              Post Your Job
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="main-container">
        <div className="container">
          {/* Back Button */}
          <button className="back-button" onClick={() => router.back()}>
            ← Back to job board
          </button>

          <div className="details-grid">
            {/* Left Column - Job Information */}
            <div className="left-column">
              {/* Job Header */}
              <div className="job-header">
                <div className="job-title-section">
                  <h1>{jobData.title}</h1>
                  <div className="job-meta">
                    <span className="category-badge" style={{ backgroundColor: getCategoryColor(jobData.category) }}>
                      {getCategoryIcon(jobData.category)} {jobData.category}
                    </span>
                    <span className="job-id">ID: {jobData.id}</span>
                    <span className="status-badge status-new">{jobData.status}</span>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="info-card">
                <h3>Job Description</h3>
                {isEditing ? (
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleEditChange}
                    rows="10"
                    className="edit-textarea"
                  />
                ) : (
                  <p className="description-text">{jobData.description}</p>
                )}
              </div>

              {/* Service Details */}
              <div className="info-card">
                <h3>Service Details</h3>
                <div className="details-list">
                  <div className="detail-item">
                    <span className="detail-label">Category:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        name="subcategory"
                        value={editForm.subcategory}
                        onChange={handleEditChange}
                        className="edit-input"
                      />
                    ) : (
                      <span className="detail-value">{jobData.subcategory}</span>
                    )}
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Service Type:</span>
                    {isEditing ? (
                      <input
                        type="text"
                        name="serviceType"
                        value={editForm.serviceType}
                        onChange={handleEditChange}
                        className="edit-input"
                      />
                    ) : (
                      <span className="detail-value">{jobData.serviceType}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Service Location Map */}
              <div className="info-card location-map-card">
                <h3>Service Location</h3>
                <div className="location-map-wrap">
                  <img
                    src="/map_location.jpg"
                    alt="Service location map"
                    className="location-map-image"
                  />
                </div>
                <div className="location-map-details">
                  <div className="location-icon">📍</div>
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={editForm.location}
                      onChange={handleEditChange}
                      className="edit-input"
                    />
                  ) : (
                    <span className="location-text">{jobData.location}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Client & Location Info */}
            <div className="right-column">
              {/* Client Information */}
              <div className="info-card">
                <h3>Client Information</h3>
                <div className="client-info">
                  <div className="client-name">
                    <strong>{jobData.client.name}</strong>
                    {jobData.client.verified && (
                      <span className="verified-badge">✓ Verified Homeowner</span>
                    )}
                  </div>
                  <div className="client-contact">
                    <div className="contact-item">
                      <span className="contact-icon">📧</span>
                      {isEditing ? (
                        <input
                          type="email"
                          name="clientEmail"
                          value={editForm.client.email}
                          onChange={(e) => setEditForm(prev => ({
                            ...prev,
                            client: { ...prev.client, email: e.target.value }
                          }))}
                          className="edit-input"
                        />
                      ) : (
                        <a href={`mailto:${jobData.client.email}`}>{jobData.client.email}</a>
                      )}
                    </div>
                    <div className="contact-item">
                      <span className="contact-icon">📞</span>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="clientPhone"
                          value={editForm.client.phone}
                          onChange={(e) => setEditForm(prev => ({
                            ...prev,
                            client: { ...prev.client, phone: e.target.value }
                          }))}
                          className="edit-input"
                        />
                      ) : (
                        <a href={`tel:${jobData.client.phone}`}>{jobData.client.phone}</a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Location & Budget */}
              <div className="info-card">
                <h3>Budget</h3>
                <div className="budget-info">
                  <h4>Estimated Budget</h4>
                  {isEditing ? (
                    <input
                      type="text"
                      name="budget"
                      value={editForm.budget}
                      onChange={handleEditChange}
                      className="edit-input budget-input"
                    />
                  ) : (
                    <p className="budget-amount">{jobData.budget}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <h2>Manage Request</h2>
                <p>Change status to notify client; updates save automatically.</p>
                <div className='choose'>
                  <select
                    name="status"
                    value={jobData.status}
                    onChange={updateStatus}
                    className="status-select"
                    disabled={savingStatus}
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button className="btn-delete" onClick={handleDeleteRequest}>
                    Delete Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Delete Service Request</h3>
            <p>Are you sure you want to delete this service request?</p>
            <p className="modal-warning">This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn-cancel-modal" onClick={cancelDelete}>
                Cancel
              </button>
              <button className="btn-confirm-delete" onClick={confirmDelete}>
                Delete Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">GlobalTNA</div>
            <p className="copyright">© 2026 GlobalTNA Service Solutions. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default JobDetails;