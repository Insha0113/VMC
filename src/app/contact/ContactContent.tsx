'use client';

import React, { useState } from 'react';
import QuickContactForm from '@/components/QuickContactForm';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Navigation
} from 'lucide-react';
import styles from './page.module.css';
import BackButton from '@/components/BackButton';

export default function ContactContent() {

  return (
    <div>
      {/* Header Banner */}
      <section 
        className={styles.header}
        style={{
          minHeight: 'var(--header-min-height, 75vh)',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: 'none',
          padding: '2.5rem 0',
          backgroundColor: '#043f65'
        }}
      >
        <div 
          className="responsive-banner-bg"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: "url('/images/doctor interaction2.jpg')",
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
            background: 'linear-gradient(135deg, rgba(4, 63, 101, 0.8) 0%, rgba(8, 113, 178, 0.7) 60%, rgba(149, 200, 62, 0.25) 100%)',
            zIndex: 2
          }}
        />
        <div 
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '120px',
            background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(149, 200, 62, 0.08) 35%, rgba(149, 200, 62, 0.2) 70%, var(--background) 100%)',
            pointerEvents: 'none',
            zIndex: 3
          }}
        />
        <div className="container" style={{ position: 'relative', zIndex: 4 }}>
          <BackButton />
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
                      <p>Karumalloor, Paravoor, Aluva</p>
                    </div>
                  </div>

                  <div className={styles.infoRow}>
                    <div className={styles.iconBox}>
                      <Phone size={20} />
                    </div>
                    <div className={styles.details}>
                      <h4>Phone Number</h4>
                      <p>General Enquiry: <a href="tel:9633248480" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>9633248480</a></p>
                      <p>Emergency Hotline: <a href="tel:9633248480" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>9633248480</a> (24/7)</p>
                    </div>
                  </div>

                  <div className={styles.infoRow}>
                    <div className={styles.iconBox}>
                      <Mail size={20} />
                    </div>
                    <div className={styles.details}>
                      <h4>Email Support</h4>
                      <p><a href="mailto:mail.vmcmedical@gmail.com" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>mail.vmcmedical@gmail.com</a></p>
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
                  <a href="https://www.instagram.com/vmcmedicalcenter/" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram">
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

          {/* Google Maps Integration */}
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Hospital Map Location</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Find us easily in Karumalloor, Paravur, Aluva.</p>
            </div>
            
            <div className={styles.mapWrapper}>
              <div className={styles.mapCanvas}>
                <iframe 
                  src="https://maps.google.com/maps?q=Karumalloor,+Paravur,+Aluva&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                />
                
                {/* Google Maps External Overlay Button */}
                <a 
                  href="https://www.google.com/maps?q=Karumalloor,+Paravur,+Aluva" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={styles.mapOverlayBtn}
                >
                  <Navigation size={16} /> Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
