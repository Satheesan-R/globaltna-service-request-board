"use client";

// App.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './App.css';

const App = () => {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceRequests, setServiceRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = ['All', 'Plumbing', 'Electrical', 'Painting', 'Joinery'];

  // Hardcoded sample data
  const sampleData = [
    {
      _id: 'sample-1',
      category: 'Plumbing',
      title: 'Emergency Pipe Repair',
      description: 'Urgent leak in master bathroom requires immediate attention. Sink pipe has burst and needs immediate repair to prevent water damage.',
      location: 'Glasgow West End',
      status: 'Open',
      contactName: 'Sarah Johnson',
    },
    {
      _id: 'sample-2',
      category: 'Painting',
      title: 'Full Living Room Refresh',
      description: 'High ceiling living room requires painting and light sanding. Neutral palette preferred. Materials provided by homeowner.',
      location: 'Edinburgh City Centre',
      status: 'Open',
      contactName: 'Michael Smith',
    },
    {
      _id: 'sample-3',
      category: 'Electrical',
      title: 'EV Charger Installation',
      description: 'Certified electrician needed to install a new home charging station in a detached garage with new circuit.',
      location: 'Stirling',
      status: 'In Progress',
      contactName: 'Emma Davis',
    },
    {
      _id: 'sample-4',
      category: 'Joinery',
      title: 'Bespoke Fitted Wardrobe',
      description: 'Custom oak wardrobe for a master bedroom. Design is ready, seeking a craftsman for execution and installation.',
      location: 'Bearden',
      status: 'Open',
      contactName: 'James Wilson',
    },
  ];

  // Fetch jobs from backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/jobs');
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        const data = await response.json();
        // Combine sample data with fetched data
        setServiceRequests([...sampleData, ...data]);
        setError(null);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError(err.message);
        // Show only sample data if fetch fails
        setServiceRequests(sampleData);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredRequests = serviceRequests.filter(request => {
    const matchesCategory = activeCategory === 'all' || 
      request.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category) => {
    switch(category.toLowerCase()) {
      case 'plumbing': return '🔧';
      case 'electrical': return '⚡';
      case 'painting': return '🎨';
      case 'joinery': return '🪵';
      default: return '🔨';
    }
  };

  const getCategoryImage = (category) => {
    switch(category.toLowerCase()) {
      case 'plumbing': return '/images/plumbing.svg';
      case 'electrical': return '/images/electrical.svg';
      case 'painting': return '/images/painting.svg';
      case 'joinery': return '/images/joinery.svg';
      default: return '/images/default.svg';
    }
  };

  return (
    <div className="homepage">
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
      <section className="hero">
        <div className="hero-container">
          <h1>Find Skilled Pros for <span className="highlight">Your Next Project</span></h1>
          <p>Connecting homeowners in Glasgow and beyond with verified specialists in plumbing, electrical, painting, and joinery.</p>
          <div className="hero-buttons">
            <button className="btn-large btn-primary" onClick={() => router.push("/jobForm")}>
              Post Your Job
            </button>
            <button className="btn-large btn-outline" onClick={() => router.push("/my-requests")}>
              Browse Marketplace
            </button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2>What service do you need?</h2>
          <div className="categories-grid">
            {categories.map(category => (
              <button
                key={category}
                className={`category-card ${activeCategory === category.toLowerCase() ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.toLowerCase())}
              >
                <span className="category-icon">{getCategoryIcon(category)}</span>
                <span className="category-name">{category}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Active Requests Section */}
      <section className="requests-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2>Active Service Requests</h2>
              <p>Real-time board of available jobs in your area</p>
            </div>
            <div className="search-box">
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading && (
            <div className="loading-state">
              <p>Loading service requests...</p>
            </div>
          )}

          {error && (
            <div className="error-state">
              <p>Error loading requests: {error}</p>
            </div>
          )}

          {!loading && !error && (
            <>
              <div className="requests-grid">
                {filteredRequests.map(request => (
                  <div key={request._id} className="request-card">
                    <div className="card-category" 
                      style={{
                        backgroundColor: getCategoryColor(request.category),
                       backgroundImage: `url(${getCategoryImage(request.category)})`,
                       backgroundSize: 'cover',
                       backgroundPosition: 'center',
                      backgroundBlendMode: 'overlay'
                              }}
                          >
                      {getCategoryIcon(request.category)} {request.category}
                    </div>
                    <h3 className="card-title">{request.title}</h3>
                    <p className="card-description">{request.description}</p>
                    <div className="card-footer">
                      <div className="card-location">📍 {request.location}</div>
                      <div className="card-status">{request.status}</div>
                    </div>
                    <div className="card-contact">
                      <small>By: {request.contactName}</small>
                    </div>
                    <button
                      className="card-view-details"
                      onClick={() => router.push(`/my-requests?id=${request._id}`)}
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>

              {filteredRequests.length === 0 && (
                <div className="no-results">
                  <p>No service requests found. Try a different category or search term.</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

     

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">GlobalTNA</div>
            <p>© 2026 GlobalTNA. Professional Services Marketplace.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

function getCategoryColor(category) {
  const colors = {
    'Plumbing': '#e74c3c',
    'Electrical': '#f39c12',
    'Painting': '#2ecc71',
    'Joinery': '#3498db'
  };
  return colors[category] || '#7f8c8d';
}

export default App;