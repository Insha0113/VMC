import React from 'react';
import { getDoctors } from '@/lib/db';
import DoctorCard from '@/components/DoctorCard';
import BackButton from '@/components/BackButton';
import styles from './page.module.css';

export const unstable_instant = { prefetch: 'static' };

export default async function DoctorsPage() {
  const doctors = await getDoctors();

  return (
    <div>
      {/* Page Header */}
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
            backgroundImage: "url('/images/ourdoctors.jpg')",
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
          <h1 className={styles.title}>Our Specialists</h1>
          <p className={styles.subtitle}>
            Meet our team of board-certified clinical experts, consultants, and surgical specialists dedicated to your family&apos;s health and wellness.
          </p>
        </div>
      </section>

      {/* Doctors Grid Section */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.doctorsGrid}>
            {doctors.map((doc) => (
              <DoctorCard key={doc.id} doctor={doc} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
