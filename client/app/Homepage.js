// App.js
import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', 'Plumbing', 'Electrical', 'Painting', 'Joinery'];

  const serviceRequests = [
    {
      id: 1,
      category: 'Plumbing',
      title: 'Emergency Pipe Repair',
      description: 'Urgent leak in master bathroom requires immediate attention. Sink pipe has burst and needs...',
      location: 'Glasgow West End',
      price: '£80 - £120',
      urgent: true,
    },
    {
      id: 2,
      category: 'Painting',
      title: 'Full Living Room Refresh',
      description: 'High ceiling living room requires painting and light sanding. Neutral palette preferred. Materials...',
      location: 'Edinburgh City Centre',
      price: '£450 - £600',
      urgent: false,
    },
    {
      id: 3,
      category: 'Electrical',
      title: 'EV Charger Installation',
      description: 'Certified electrician needed to install a new home charging station in a detached garage.',
      location: 'Stirling',
      price: '£300 - £450',
      urgent: false,
    },
    {
      id: 4,
      category: 'Joinery',
      title: 'Bespoke Fitted Wardrobe',
      description: 'Custom oak wardrobe for a master bedroom. Design is ready, seeking a craftsman for execution.',
      location: 'Bearden',
      price: '£1,200+',
      urgent: false,
    },
    {
      id: 5,
      category: 'Plumbing',
      title: 'Shower Valve Replacement',
      description: 'Replacement of an old thermostat shower valve in a rental property. Completed successfully.',
      location: 'Paisley',
      price: '£150',
      urgent: false,
    },
    {
      id: 6,
      category: 'Plumbing',
      title: 'Kitchen Tap Replacement',
      description: 'Replacement of a leaking kitchen tap with a new modern mixer tap. All fittings provided.',
      location: 'Govan',
      price: '£60 - £90',
      urgent: false,
    },
    {
      id: 7,
      category: 'Joinery',
      title: 'Garden Fence Repair',
      description: 'Repairing several storm-damaged panels of a perimeter garden fence. Timber to be matched with',
      location: 'West End',
      price: '£200 - £350',
      urgent: false,
    },
    {
      id: 8,
      category: 'Electrical',
      title: 'Electrical Safety Check',
      description: 'Full inspection and testing of domestic electrical installation for a landlord certificate (EICR).',
      location: 'City Centre',
      price: '£210 - £180',
      urgent: false,
    },
  ];

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

  return (
    <div className="homepage">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="logo">GlobalTNA</div>
          <div className="nav-links">
            <a href="#" className="active">Jobs</a>
            <a href="#">My Requests</a>
          </div>
          <div className="nav-buttons">
            <button className="btn-outline">Sign In</button>
            <button className="btn-primary">Post Your Job</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <h1>Find Skilled Pros for <span className="highlight">Your Next Project</span></h1>
          <p>Connecting homeowners in Glasgow and beyond with verified specialists in plumbing, electrical, painting, and joinery.</p>
          <div className="hero-buttons">
            <button className="btn-large btn-primary">Post Your Job</button>
            <button className="btn-large btn-outline">Browse Marketplace</button>
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

          <div className="requests-grid">
            {filteredRequests.map(request => (
              <div key={request.id} className="request-card">
                <div className="card-category" style={{ backgroundColor: getCategoryColor(request.category) }}>
                  {getCategoryIcon(request.category)} {request.category}
                </div>
                <h3 className="card-title">{request.title}</h3>
                <p className="card-description">{request.description}</p>
                <div className="card-footer">
                  <div className="card-location">📍 {request.location}</div>
                  <div className="card-price">{request.price}</div>
                </div>
                {request.urgent && <span className="urgent-badge">URGENT</span>}
              </div>
            ))}
          </div>

          {filteredRequests.length === 0 && (
            <div className="no-results">
              <p>No service requests found. Try a different category or search term.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Have a project?</h2>
            <p>Join hundreds of homeowners and post your request to our skilled professional network.</p>
            <button className="btn-large btn-white">Post a Job Now</button>
          </div>
        </div>
      </section>

      {/* Footer */}
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