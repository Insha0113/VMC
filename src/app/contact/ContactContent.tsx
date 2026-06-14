'use client';

import React, { useState } from 'react';
import QuickContactForm from '@/components/QuickContactForm';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Navigation,
  Plus,
  Minus
} from 'lucide-react';
import styles from './page.module.css';

export default function ContactContent() {
  const [zoomLevel, setZoomLevel] = useState(15);

  const handleZoomIn = () => {
    if (zoomLevel < 18) setZoomLevel(zoomLevel + 1);
  };

  const handleZoomOut = () => {
    if (zoomLevel > 12) setZoomLevel(zoomLevel - 1);
  };

  return (
    <div>
      {/* Header Banner */}
      <section 
        className={styles.header}
        style={{
          minHeight: 'calc(100vh - 80px)',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: 'none',
          padding: 0,
          backgroundColor: '#043f65'
        }}
      >
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: "url('/images/doctor interaction2.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.75,
            zIndex: 1
          }}
        />
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(4, 63, 101, 0.8) 0%, rgba(8, 113, 178, 0.7) 100%)',
            zIndex: 2
          }}
        />
        <div className="container" style={{ position: 'relative', zIndex: 3 }}>
          <h1 className={styles.title}>Contact Us</h1>
          <p className={styles.subtitle}>
            Have a question or need emergency support? Reach out to our team at any time.
          </p>
        </div>
      </section>

      {/* Main Section */}
      <section className={styles.contactSection}>
        <div className="container">
          <div className={styles.grid}>
            {/* Contact Details & Social Links */}
            <div className={styles.infoCol}>
              <div className={styles.infoCard}>
                <h3 className={styles.cardTitle}>Hospital Coordinates</h3>
                <div className={styles.infoList}>
                  <div className={styles.infoRow}>
                    <div className={styles.iconBox}>
                      <MapPin size={20} />
                    </div>
                    <div className={styles.details}>
                      <h4>Our Address</h4>
                      <p>120 Healthcare Parkway, Medical Plaza Suite 400, NY 10001</p>
                    </div>
                  </div>

                  <div className={styles.infoRow}>
                    <div className={styles.iconBox}>
                      <Phone size={20} />
                    </div>
                    <div className={styles.details}>
                      <h4>Phone Number</h4>
                      <p>General Enquiry: +1 (555) 019-VMC1 (8621)</p>
                      <p>Emergency: +1 (555) 019-9111 (24/7 Hotline)</p>
                    </div>
                  </div>

                  <div className={styles.infoRow}>
                    <div className={styles.iconBox}>
                      <Mail size={20} />
                    </div>
                    <div className={styles.details}>
                      <h4>Email Support</h4>
                      <p>info@vmcmedicalcenter.com</p>
                      <p>appointments@vmcmedicalcenter.com</p>
                    </div>
                  </div>

                  <div className={styles.infoRow}>
                    <div className={styles.iconBox}>
                      <Clock size={20} />
                    </div>
                    <div className={styles.details}>
                      <h4>Hours of Operation</h4>
                      <p>Emergency Services: 24/7 Available</p>
                      <p>Outpatient Consultations: Mon - Fri, 8:00 AM - 8:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className={styles.socialBox}>
                <h3 className={styles.socialTitle}>Connect With Us</h3>
                <div className={styles.socialGrid}>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Facebook">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                    </svg>
                  </a>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Twitter">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Linkedin">
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Contact Form */}
            <QuickContactForm />
          </div>

          {/* Google Maps Mock Integration */}
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Hospital Map Location</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Find us easily in the center of the Healthcare Parkway square.</p>
            </div>
            
            <div className={styles.mapWrapper}>
              {/* Custom SVG city map canvas */}
              <div className={styles.mapCanvas}>
                <svg width="100%" height="100%" viewBox="0 0 800 450" preserveAspectRatio="none" style={{ display: 'block' }}>
                  {/* Background Land */}
                  <rect width="800" height="450" fill="#f4f3f0" />
                  
                  {/* Green Parks */}
                  <rect x="50" y="50" width="180" height="120" fill="#d1e7dd" rx="8" />
                  <rect x="520" y="240" width="220" height="150" fill="#d1e7dd" rx="8" />
                  
                  {/* River */}
                  <path d="M-50 400 C 200 380, 350 250, 500 220 C 650 190, 750 80, 850 50" stroke="#a5c9eb" strokeWidth="48" fill="none" opacity="0.8" />
                  
                  {/* City Grids - Secondary Roads */}
                  <path d="M 0 100 H 800 M 0 250 H 800 M 0 350 H 800" stroke="#ffffff" strokeWidth="8" />
                  <path d="M 150 0 V 450 M 350 0 V 450 M 600 0 V 450" stroke="#ffffff" strokeWidth="8" />

                  {/* Primary Road: Healthcare Parkway */}
                  <path d="M 0 180 H 800" stroke="#ffebc2" strokeWidth="18" />
                  <path d="M 450 0 V 450" stroke="#ffebc2" strokeWidth="18" />
                  
                  {/* Healthcare Parkway Labels */}
                  <text x="80" y="185" fill="#7f6336" fontSize="10" fontWeight="bold">HEALTHCARE PARKWAY</text>
                  <text x="460" y="80" fill="#7f6336" fontSize="10" fontWeight="bold" transform="rotate(90 460 80)">MEDICAL BOULEVARD</text>
                  
                  {/* Nearby Landmarks */}
                  <rect x="180" y="200" width="100" height="40" fill="#cbd5e1" rx="4" />
                  <text x="195" y="224" fill="#475569" fontSize="9" fontWeight="600">Central Metro</text>

                  <rect x="490" y="80" width="90" height="40" fill="#cbd5e1" rx="4" />
                  <text x="502" y="104" fill="#475569" fontSize="9" fontWeight="600">Pharmacy Hub</text>
                </svg>

                {/* Map Pin over the VMC Center */}
                <div 
                  className={styles.mapPin}
                  style={{ 
                    top: '40%', 
                    left: '56.25%', // matches x=450 (which is 56.25% of 800)
                    transform: `translate(-50%, -50%) scale(${1 + (zoomLevel - 15) * 0.1})` 
                  }}
                >
                  <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                </div>

                {/* Map Location Details Popup */}
                <div 
                  className={styles.mapPopup}
                  style={{ 
                    top: '38%', 
                    left: '56.25%',
                  }}
                >
                  <h4 className={styles.mapPopupTitle}>VMC Medical Center</h4>
                  <p className={styles.mapPopupText}>Suite 400, Medical Plaza (Level 4)</p>
                  <span style={{ fontSize: '0.7rem', color: 'var(--accent-dark)', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px', marginTop: '4px' }}>
                    <Navigation size={10} /> Zoom Level: {zoomLevel}x
                  </span>
                </div>

                {/* Map Control Buttons */}
                <div className={styles.mapControls}>
                  <button className={styles.mapBtn} onClick={handleZoomIn} aria-label="Zoom In">
                    <Plus size={18} />
                  </button>
                  <button className={styles.mapBtn} onClick={handleZoomOut} aria-label="Zoom Out">
                    <Minus size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
