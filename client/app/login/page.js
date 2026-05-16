// LoginPage.js
"use client";

import "./loginpage.css";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiUrl } from "../../lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
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
    setIsLoading(true);
    setMessage("");

    try {
      const res = await fetch(apiUrl("/api/auth/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await res.json();

      if (res.ok) {
        if (formData.rememberMe) {
          localStorage.setItem("userToken", data.token);
        } else {
          sessionStorage.setItem("userToken", data.token);
        }
        setMessage("Login successful! Redirecting...");
        setTimeout(() => router.push("/home"), 1000);
      } else {
        setMessage(data.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      setMessage("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left Section - Same as Register Page */}
      <div className="login-left">
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

      {/* Right Section - Login Form */}
      <div className="login-right">
        <div className="login-card">
          <h3 className="form-title">Welcome Back</h3>
          <p className="form-subtitle">Sign in to access your account and manage your projects.</p>

          <form onSubmit={handleSubmit}>
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
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                Remember me
              </label>
              <a href="#" className="forgot-link">Forgot Password?</a>
            </div>

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In →"}
            </button>

            {message && <p className={`message ${message.includes("successful") ? "success" : "error"}`}>{message}</p>}

            <div className="divider">
              <span>or continue with</span>
            </div>

            <div className="social-buttons">
              <button type="button" className="social-btn google">
                <span>G</span> Google
              </button>
              <button type="button" className="social-btn linkedin">
                <span>in</span> LinkedIn
              </button>
            </div>

            <p className="register-link">
              Don't have an account?{" "}
              <span onClick={() => router.push("/register")}>Create Account</span>
            </p>

            <p className="homeowner-link">
              Join as a homeowner? <span onClick={() => router.push("/register")}>Register here</span>
            </p>
          </form>
        </div>
      </div>

      <footer className="login-footer">
        © 2024 GlobalTNA. Professional Services Marketplace.
      </footer>
    </div>
  );
}