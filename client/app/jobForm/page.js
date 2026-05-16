"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import './formpage.css';
import { apiUrl } from '../../lib/api';

const SubmitRequest = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    jobTitle: '',
    category: '',
    location: '',
    address: '',
    description: '',
    contactName: '',
    contactEmail: '',
    phonenumber: '',
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const categories = ['Plumbing', 'Electrical', 'Painting', 'Joinery', 'Carpentry', 'HVAC', 'Landscaping', 'Other'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = 'Job title is required';
    } else if (formData.jobTitle.length < 5) {
      newErrors.jobTitle = 'Job title must be at least 5 characters';
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Please provide at least 20 characters describing your job';
    }
    
    if (!formData.contactName.trim()) {
      newErrors.contactName = 'Contact name is required';
    }
    
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        const response = await fetch(apiUrl('/api/jobs'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: formData.jobTitle,
            category: formData.category,
            location: formData.location,
            address: formData.address,
            description: formData.description,
            contactName: formData.contactName,
            contactEmail: formData.contactEmail,
            phonenumber: formData.phonenumber
          })
        });

        const data = await response.json();

        if (response.ok) {
          setSuccess(true);
          setTimeout(() => router.push('/home'), 2500);
        } else {
          alert(data.message || 'Failed to submit request. Please try again.');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('Network error. Please check your connection and try again.');
      }
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (success) {
    return (
      <div className="submit-request-page">
        <nav className="navbar">
          <div className="nav-container">
            <div className="logo">GlobalTNA</div>
          </div>
        </nav>
        <section className="success-section">
          <div className="success-container">
            <div className="success-icon">✅</div>
            <h1>Success!</h1>
            <p className="success-message">Your service request has been submitted successfully!</p>
            <p className="success-details">We've received your request and will notify qualified professionals in your area. You'll receive updates via email at <strong>{formData.contactEmail}</strong>.</p>
            <div className="success-next-steps">
              <h3>What happens next?</h3>
              <ol>
                <li>Professionals in your area review your request</li>
                <li>You'll receive competitive bids within 24-48 hours</li>
                <li>Choose the best professional and hire securely</li>
              </ol>
            </div>
            <p className="redirecting-text">Redirecting you to home in a moment...</p>
          </div>
        </section>
        <footer className="footer">
          <div className="container">
            <div className="footer-content">
              <div className="footer-logo">GlobalTNA</div>
              <p>© 2024 GlobalTNA. Professional Services Marketplace.</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="submit-request-page">
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

      {/* Hero Section */}
      <section className="hero-submit">
        <div className="hero-container">
          <h1>Submit a <span className="highlight">Service Request</span></h1>
          <p>Connect with certified professionals for your home maintenance and repair needs. Provide as much detail as possible to get accurate quotes.</p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <h2>HOW IT WORKS</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Describe the Task</h3>
              <p>Fill out the details of the job you need help with.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Get Competitive Bids</h3>
              <p>Qualified tradespeople will review and send estimates.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Hire & Review</h3>
              <p>Choose the best professional and pay securely through GlobalTNA.</p>
            </div>
          </div>
         
        </div>
      </section>

      {/* Form Section */}
      <section className="form-section">
        <div className="container">
          <div className="form-container">
            <form onSubmit={handleSubmit}>
              {/* Job Details Section */}
              <div className="form-group-section">
                <h3 className="section-title">Job Details</h3>
                
                <div className="form-group">
                  <label htmlFor="jobTitle">
                    Job Title <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="jobTitle"
                    name="jobTitle"
                    placeholder="e.g., Fix leaking faucet in master bathroom"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    className={errors.jobTitle ? 'error' : ''}
                  />
                  {errors.jobTitle && <span className="error-message">{errors.jobTitle}</span>}
                  <small className="helper-text">Use a clear, concise title to attract the right specialists.</small>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="category">
                      Category <span className="required">*</span>
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={errors.category ? 'error' : ''}
                    >
                      <option value="">Select a service type</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    {errors.category && <span className="error-message">{errors.category}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="address">
                      Address / Zip Code
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      placeholder="Street address, unit #"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="location">
                    Location <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    placeholder="City, State"
                    value={formData.location}
                    onChange={handleChange}
                    className={errors.location ? 'error' : ''}
                  />
                  {errors.location && <span className="error-message">{errors.location}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="description">
                    Description <span className="required">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="6"
                    placeholder="Describe the scope of work, any specific problems, and if you have the materials ready..."
                    value={formData.description}
                    onChange={handleChange}
                    className={errors.description ? 'error' : ''}
                  ></textarea>
                  {errors.description && <span className="error-message">{errors.description}</span>}
                  <small className="helper-text">{formData.description.length}/20+ characters</small>
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="form-group-section">
                <h3 className="section-title">Contact Information</h3>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="contactName">
                      Contact Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="contactName"
                      name="contactName"
                      placeholder="Your full name"
                      value={formData.contactName}
                      onChange={handleChange}
                      className={errors.contactName ? 'error' : ''}
                    />
                    {errors.contactName && <span className="error-message">{errors.contactName}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="contactEmail">
                      Contact Email <span className="required">*</span>
                    </label>
                    <input
                      type="email"
                      id="contactEmail"
                      name="contactEmail"
                      placeholder="email@example.com"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      className={errors.contactEmail ? 'error' : ''}
                    />
                    {errors.contactEmail && <span className="error-message">{errors.contactEmail}</span>}
                  </div>

                   <div className="form-group">
                    <label htmlFor="phonenumber">
                      Phone number <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="phonenumber"
                      name="phonenumber"
                      placeholder="Your phone number"
                      value={formData.phonenumber}
                      onChange={handleChange}
                      className={errors.phonenumber ? 'error' : ''}
                    />
                    {errors.phonenumber && <span className="error-message">{errors.phonenumber}</span>}
                  </div>

                </div>

                <div className="security-note">
                  <span className="lock-icon">🔒</span>
                  <p>Your data is secured and encrypted.</p>
                </div>
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">GlobalTNA</div>
            <p className="footer-text">GlobalTNA Service Solutions</p>
            <p className="copyright">© 2024 GlobalTNA Service Solutions. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SubmitRequest;