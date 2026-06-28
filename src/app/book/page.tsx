import React, { Suspense } from 'react';
import ECGLoader from '@/components/ECGLoader';
import BookingForm from './BookingForm';
import styles from './page.module.css';
import BackButton from '@/components/BackButton';

export const unstable_instant = { prefetch: 'static' };

export default function BookingPage() {
  return (
    <div>
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
          <h1 className={styles.title}>Online Booking System</h1>
          <p className={styles.subtitle}>
            Book a clinical slot in seconds. Select a specialty, specialist, date, and confirm.
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <Suspense fallback={
            <div className="container section text-center">
              <ECGLoader message="Loading appointment calendar dependencies..." />
            </div>
          }>
            <BookingForm />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
