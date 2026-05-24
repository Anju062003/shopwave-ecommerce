import React, { useState } from 'react';
import './Contact.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    // Simulate sending
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="page">
        <div className="container">
          <div className="contact-success">
            <div className="success-icon">✓</div>
            <h2>Message Sent!</h2>
            <p>Thanks for reaching out. We'll get back to you within 24 hours.</p>
            <button className="btn btn-primary" onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}>
              Send Another Message
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Contact Us</h1>
        <p className="page-subtitle">Have a question? We'd love to hear from you.</p>

        <div className="contact-layout">

          {/* Left - Info Cards */}
          <div className="contact-info">
            <div className="info-card card">
              <div className="info-icon">📍</div>
              <div>
                <h4>Address</h4>
                <p>123 ShopWave Street<br />Coimbatore, Tamil Nadu<br />India - 641001</p>
              </div>
            </div>
            <div className="info-card card">
              <div className="info-icon">📧</div>
              <div>
                <h4>Email</h4>
                <p>support@shopwave.com<br />hello@shopwave.com</p>
              </div>
            </div>
            <div className="info-card card">
              <div className="info-icon">📞</div>
              <div>
                <h4>Phone</h4>
                <p>+91 98765 43210<br />Mon - Sat, 9am - 6pm</p>
              </div>
            </div>
            <div className="info-card card">
              <div className="info-icon">🕐</div>
              <div>
                <h4>Working Hours</h4>
                <p>Monday - Friday: 9am - 6pm<br />Saturday: 10am - 4pm</p>
              </div>
            </div>
          </div>

          {/* Right - Contact Form */}
          <div className="contact-form card">
            <h3 className="form-title">Send a Message</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input
                    className="form-input"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    className="form-input"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <input
                  className="form-input"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea
                  className="form-input form-textarea"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  required
                  rows={6}
                />
              </div>
              <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}