import React, { Suspense } from 'react';
import ECGLoader from '@/components/ECGLoader';
import BookingForm from './BookingForm';
import styles from './page.module.css';

export const unstable_instant = { prefetch: 'static' };

export default function BookingPage() {
  return (
    <div>
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
