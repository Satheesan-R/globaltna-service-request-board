"use client";

import "./registerpage.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiUrl } from "../../lib/api";


export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    agreeTerms: false
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.agreeTerms) {
      setMessage("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const res = await fetch(apiUrl("/api/auth/register"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Registration successful! Redirecting...");
        setTimeout(() => router.push("/login"), 1000);
      } else {
        setMessage(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      setMessage("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <h1 className="brand">GlobalTNA</h1>
        <h2 className="title">Scale your services with GlobalTNA.</h2>
        <p className="description">
          Join thousands of professionals finding high-quality requests and building 
          lasting client relationships on the world's most reliable trade marketplace.
        </p>
        <ul className="features">
          <li>Verified professional community</li>
          <li>Secure payments and ironclad contracts</li>
          <li>Advanced growth and analytics tools</li>
        </ul>
      </div>

      {/* Right Section - Registration Form */}
      <div className="register-right">
        <div className="register-card">
          <h3 className="form-title">Create Account</h3>
          <p className="form-subtitle">Start your journey as a GlobalTNA partner today.</p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@company.com"
                required
              />
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                required
              />
            </div>

            <div className="input-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="********"
                required
              />
            </div>

            <div className="input-group">
              <label>Role</label>
              <select name="role" value={formData.role} onChange={handleChange} required>
                <option value="">Select your role</option>
                <option value="homeowner">Homeowner</option>
                <option value="tradesperson">Tradesperson</option>
              </select>
            </div>

            <label className="checkbox-label">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
              />
              I agree to the Terms of Service and Privacy Policy.
            </label>

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account →"}
            </button>

            {message && <p className={`message ${message.includes("successful") ? "success" : "error"}`}>{message}</p>}

            <p className="login-link">
              Already have an account?{" "}
              <span onClick={() => router.push("/login")}>Login</span>
            </p>

            <p className="homeowner-link">
              Join as a homeowner? <span onClick={() => router.push("/register")}>Register here</span>
            </p>
          </form>
        </div>
      </div>

      <footer className="register-footer">
        © 2024 GlobalTNA. Professional Services Marketplace.
      </footer>
    </div>
  );
}