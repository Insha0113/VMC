import React from 'react';
import BackButton from '@/components/BackButton';

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--background)', padding: '6rem 0 3rem 0' }}>
      <div className="container" style={{ position: 'relative' }}>
        <BackButton />
        <div style={{ marginTop: '2rem', textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>Privacy Policy</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Official Privacy Policy Document for VMC Medical Center</p>
        </div>
        <div style={{ width: '100%', height: '80vh', borderRadius: '16px', overflow: 'hidden', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border)', backgroundColor: '#ffffff' }}>
          <iframe 
            src="/documents/Privacy Policy.pdf" 
            width="100%" 
            height="100%" 
            style={{ border: 'none' }}
            title="Privacy Policy"
          />
        </div>
      </div>
    </div>
  );
}
