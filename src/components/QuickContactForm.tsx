'use client';

import React, { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import styles from './QuickContactForm.module.css';

export default function QuickContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      setStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      console.error(err);
      setStatus('error');
      const message = err instanceof Error ? err.message : 'Failed to submit enquiry. Please check your internet connection.';
      setErrorMsg(message);
    }
  };

  if (status === 'success') {
    return (
      <div className={styles.successBox}>
        <CheckCircle size={48} color="var(--primary)" />
        <h3 className={styles.successTitle}>Enquiry Submitted!</h3>
        <p>
          Thank you for reaching out to VMC Medical Center. Your message has been successfully sent. A representative from our hospital relations team will contact you within 24 hours.
        </p>
        <button className={styles.submitBtn} style={{ marginTop: '0.5rem' }} onClick={() => setStatus('idle')}>
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      <div>
        <h3 className={styles.title}>Send a Message</h3>
        <p className={styles.subtitle}>Have a question? Complete this form and we will get back to you shortly.</p>
      </div>

      {status === 'error' && (
        <div className={styles.errorBox}>
          {errorMsg}
        </div>
      )}

      <div className={styles.row}>
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="name">Full Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className={styles.input}
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="email">Email Address *</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className={styles.input}
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className={styles.input}
            value={formData.phone}
            onChange={handleChange}
            placeholder="+91 99999 99999"
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label} htmlFor="subject">Subject *</label>
          <input
            type="text"
            id="subject"
            name="subject"
            required
            className={styles.input}
            value={formData.subject}
            onChange={handleChange}
            placeholder="Consultation query, insurance, etc."
          />
        </div>
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label} htmlFor="message">Message *</label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          className={styles.input}
          style={{ resize: 'vertical' }}
          value={formData.message}
          onChange={handleChange}
          placeholder="How can we help you?"
        />
      </div>

      <button type="submit" disabled={status === 'submitting'} className={styles.submitBtn}>
        <Send size={18} />
        {status === 'submitting' ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
