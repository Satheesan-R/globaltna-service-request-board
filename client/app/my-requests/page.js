"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import './JobDetils.css';

const JobDetails = () => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Job data state
  const [jobData, setJobData] = useState({
    id: "#G-88291",
    title: "Modern Kitchen Lighting Installation and Rewiring",
    category: "Electrical",
    subcategory: "Electrical & Lighting",
    serviceType: "Home Renovation",
    location: "San Francisco, CA",
    budget: "$1,200 - $1,500",
    status: "New Request",
    description: "We are looking for a certified electrician to handle a full lighting redesign in our primary kitchen. The project includes the removal of existing fluorescent fixtures and the installation of 8 recessed LED cans, 3 pendant lights over the kitchen island, and under-cabinet accent lighting.\n\nThe project also requires a circuit upgrade to ensure the new induction stovetop and high-powered appliances are properly supported. All work must be completed to current city code standards and include professional finishing around the mounting points.",
    internalNotes: "High priority request. Client has requested completion before Thanksgiving. Ensure crew carries specialized pendant mounting hardware.",
    client: {
      name: "Robert Chen",
      email: "r.chen@example.com",
      phone: "+1 (415) 555-0192",
      verified: true
    }
  });

  const [editForm, setEditForm] = useState({ ...jobData });

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = () => {
    setJobData(editForm);
    setIsEditing(false);
    // Show success message
    alert('Changes saved successfully!');
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

              {/* Internal Notes - Only visible to admin/service provider */}
              <div className="info-card internal-notes">
                <h3>📝 INTERNAL NOTES</h3>
                {isEditing ? (
                  <textarea
                    name="internalNotes"
                    value={editForm.internalNotes}
                    onChange={handleEditChange}
                    rows="4"
                    className="edit-textarea"
                  />
                ) : (
                  <p className="notes-text">{jobData.internalNotes}</p>
                )}
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
                <h3>Service Location</h3>
                <div className="location-info">
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
                {!isEditing ? (
                  <>
                    <button className="btn-edit" onClick={() => setIsEditing(true)}>
                      ✏️ Save Changes
                    </button>
                    <button className="btn-delete" onClick={handleDeleteRequest}>
                      🗑️ Delete Request
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn-save" onClick={handleSaveChanges}>
                      💾 Save Changes
                    </button>
                    <button className="btn-cancel" onClick={() => {
                      setIsEditing(false);
                      setEditForm(jobData);
                    }}>
                      ❌ Cancel
                    </button>
                  </>
                )}
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