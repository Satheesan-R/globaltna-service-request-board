"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import './JobDetils.css';
import { apiUrl } from '../../lib/api';

const sampleJobs = {
  'sample-1': {
    _id: 'sample-1',
    title: 'Emergency Pipe Repair',
    category: 'Plumbing',
    location: 'Colombo West',
    Address: '12 Lake View Road, Colombo',
    description: 'Urgent leak in master bathroom requires immediate attention. Sink pipe has burst and needs immediate repair to prevent water damage.',
    contactName: 'Sarah Johnson',
    contactEmail: 'sarah@example.com',
    phonenumber: '0718596846',
    status: 'Open',
    createdAt: new Date().toISOString()
  },
  'sample-2': {
    _id: 'sample-2',
    title: 'Electrical Rewiring',
    category: 'Electrical',
    location: 'Jaffna',
    Address: '45 Market St, Jaffna',
    description: 'Minor rewiring needed in kitchen and living area. Some outlets are loose and breakers trip occasionally.',
    contactName: 'Kumar Fernando',
    contactEmail: 'kumar@example.com',
    phonenumber: '0771234567',
    status: 'In Progress',
    createdAt: new Date().toISOString()
  }
};

const JobDetails = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestId = searchParams ? searchParams.get('id') : null;
  // only status is editable by client
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savingStatus, setSavingStatus] = useState(false);
  
  // Job data state (mapped from DB)
  const [jobData, setJobData] = useState({
    id: '',
    title: '',
    category: '',
    subcategory: '',
    serviceType: '',
    location: '',
    Address: '',
    budget: '',
    status: '',
    description: '',
    internalNotes: '',
    client: { name: '', email: '', phone: '', verified: false },
    createdAt: null
  });

  const [editForm, setEditForm] = useState({ ...jobData });

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = async () => {
    // Update local fields immediately
    setJobData(prev => ({ ...prev, ...editForm }));

    const newStatus = editForm.status;

    // If this is a sample or fallback item, do not call the backend
    if (!jobData.id || String(jobData.id).startsWith('sample') || String(jobData.id).startsWith('#')) {
      alert('Changes saved locally (sample or fallback item).');
      return;
    }

    setSavingStatus(true);
    try {
      const res = await fetch(apiUrl(`/api/jobs/${jobData.id}`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Failed to update status');
      }

      const updated = await res.json();
      // Apply server return to local state
      setJobData(prev => ({ ...prev, status: updated.status }));
      setEditForm(prev => ({ ...prev, status: updated.status }));
      alert('Changes saved successfully!');
    } catch (err) {
      console.error('Save failed', err);
      alert('Save failed: ' + (err.message || 'Unknown error'));
      // revert local status to previous
      setJobData(prev => ({ ...prev, status: jobData.status }));
      setEditForm(prev => ({ ...prev, status: jobData.status }));
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

  useEffect(() => {
    const fetchJob = async () => {
      if (!requestId) return;
      // handle sample ids locally
      if (requestId.startsWith('sample') && sampleJobs[requestId]) {
        const job = sampleJobs[requestId];
        const mapped = {
          id: job._id,
          title: job.title,
          category: job.category,
          subcategory: job.category,
          serviceType: '',
          location: job.location,
          Address: job.Address || '',
          budget: '',
          status: job.status || '',
          description: job.description || '',
          internalNotes: '',
          client: {
            name: job.contactName || '',
            email: job.contactEmail || '',
            phone: job.phonenumber || '',
            verified: true
          },
          createdAt: job.createdAt || null
        };
        setJobData(mapped);
        setEditForm(mapped);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(apiUrl(`/api/jobs/${requestId}`));
        if (!res.ok) throw new Error('Failed to load request from server');
        const job = await res.json();
        // Map server fields to UI shape
        const mapped = {
          id: job._id || job.id || '',
          title: job.title || '',
          category: job.category || '',
          subcategory: job.category || '',
          serviceType: '',
          location: job.location || '',
          Address: job.Address || job.address || '',
          budget: '',
          status: job.status || '',
          description: job.description || '',
          internalNotes: '',
          client: {
            name: job.contactName || '',
            email: job.contactEmail || '',
            phone: job.phonenumber || '',
            verified: true
          },
          createdAt: job.createdAt || null
        };

        setJobData(mapped);
        setEditForm(mapped);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [requestId]);

  return (
    <div className="job-details-page">
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
            <button className="btn-primary" onClick={() => router.push("/post-job")}>
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
          {!requestId && (
            <section className="job-list">
              <h2>Sample Requests</h2>
              <div className="job-list-grid">
                {Object.values(sampleJobs).map((job) => (
                  <div key={job._id} className="job-card" onClick={() => router.push(`/my-requests?id=${job._id}`)}>
                    <h3>{job.title}</h3>
                    <div className="meta">
                      <span className="category" style={{background:getCategoryColor(job.category)}}>{getCategoryIcon(job.category)} {job.category}</span>
                      <span className="location">{job.location}</span>
                    </div>
                    <p>{job.description.length > 140 ? job.description.slice(0,140) + '...' : job.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
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
                    <p className="description-text">{jobData.description}</p>
              </div>

              {/* Service Details */}
              <div className="info-card">
                <h3>Service Details</h3>
                <div className="details-list">
                  <div className="detail-item">
                    <span className="detail-label">Category:</span>
                    <span className="detail-value">{jobData.subcategory}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Service Type:</span>
                    <span className="detail-value">{jobData.serviceType}</span>
                  </div>
                </div>
              </div>

              {/* Internal Notes - Only visible to admin/service provider */}
              <div className="info-card location-map-card">
                <h3> Location Map</h3>
                <div className="map-image-wrap">
                  <img src="/map_location.jpg" alt="Location map" className="location-map" />
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
                  {jobData.createdAt && (
                    <div className="posted-date">Posted: {new Date(jobData.createdAt).toLocaleString()}</div>
                  )}
                  <div className="client-contact">
                    <div className="contact-item">
                      <span className="contact-icon">📧</span>
                      <a href={`mailto:${jobData.client.email}`}>{jobData.client.email}</a>
                    </div>
                    <div className="contact-item">
                      <span className="contact-icon">📞</span>
                      <a href={`tel:${jobData.client.phone}`}>{jobData.client.phone}</a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location & Budget */}
              <div className="info-card">
                <h3>Service Location</h3>
                <div className="location-info">
                  <div className="location-icon">📍</div>
                  <span className="location-text">{jobData.location}</span>
                </div>
                {jobData.Address && (
                  <div className="address-line">Address: {jobData.Address}</div>
                )}
                
                <div className="budget-info">
                  <h4>Estimated Budget</h4>
                  <p className="budget-amount">{jobData.budget}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <div className="status-control">
                  <label htmlFor="status-select">Status</label>
                  <select id="status-select" name="status" value={editForm.status || jobData.status || ''} onChange={handleEditChange} className="status-select">
                    <option value="">-- Select status --</option>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
                <button className="btn-save" onClick={handleSaveChanges} disabled={savingStatus}>
                  {savingStatus ? 'Saving...' : '💾 Save Status'}
                </button>
                <button className="btn-delete" onClick={handleDeleteRequest}>
                  🗑️ Delete Request
                </button>
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
            <p className="copyright">© 2024 GlobalTNA Service Solutions. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default JobDetails;