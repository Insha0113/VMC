'use client';

import React, { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';
import styles from './ReviewsMarquee.module.css';

interface Review {
  id: string | number;
  name: string;
  role: string;
  rating: number;
  text: string;
  avatarColor: string;
}

const REVIEWS: Review[] = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    role: 'Orthopedics Patient',
    rating: 5,
    text: 'The care and attention I received at VMC Medical Center was outstanding. The orthopedic team helped me get back on my feet after my knee surgery. Highly recommended!',
    avatarColor: '#0871B2',
  },
  {
    id: 2,
    name: 'Priya Sharma',
    role: 'Pediatrics (Mother of two)',
    rating: 5,
    text: 'Dr. Michael Chen is an exceptional pediatrician. He is so patient with my kids and always takes the time to explain everything. The virtual support chat also helped us schedule easily!',
    avatarColor: '#95C83E',
  },
  {
    id: 3,
    name: 'Amit Verma',
    role: 'ENT Patient',
    rating: 5,
    text: "I had a chronic sinus issue that other clinics couldn't resolve, but the ENT specialists at VMC diagnosed and treated it effectively. The facility is state-of-the-art.",
    avatarColor: '#f59e0b',
  },
  {
    id: 4,
    name: 'Thomas Mathew',
    role: 'Outpatient Clinic',
    rating: 5,
    text: 'Excellent customer service and very clean facility. The outpatient department was prompt, and the diagnostic reports were delivered on the same day. Very professional.',
    avatarColor: '#10b981',
  },
  {
    id: 5,
    name: 'Deepa Nair',
    role: 'Cardiology Consult',
    rating: 5,
    text: 'High quality treatment and extremely supportive nursing staff. The booking process was seamless, and the doctor took time to answer all my questions patiently.',
    avatarColor: '#3b82f6',
  },
];

export default function ReviewsMarquee() {
  const [reviews, setReviews] = useState<Review[]>(REVIEWS);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews');
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setReviews(data);
        }
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  useEffect(() => {
    fetchReviews();

    // Listen for custom event when a user submits a review
    window.addEventListener('review-submitted', fetchReviews);
    return () => {
      window.removeEventListener('review-submitted', fetchReviews);
    };
  }, []);

  // We duplicate the list to ensure seamless looping in the CSS animation marquee
  const duplicatedReviews = [...reviews, ...reviews];

  return (
    <section className={styles.reviewsSection}>
      <div className="container">
        <div className={styles.secHeader}>
          <span className={styles.badge}>Patient Testimonials</span>
          <h2 className={styles.secTitle}>What Our Patients Say</h2>
          <p className={styles.secDesc}>
            Real feedback from individuals and families who trust VMC Medical Center for their health journey.
          </p>
        </div>
      </div>

      <div className={styles.marqueeContainer}>
        {/* Left and right gradient overlays to fade reviews at the edge of screen */}
        <div className={styles.overlayLeft}></div>
        <div className={styles.overlayRight}></div>

        <div className={styles.marqueeTrack}>
          {duplicatedReviews.map((review, index) => {
            // Get initials for avatar
            const initials = review.name
              .split(' ')
              .map((n) => n[0])
              .join('');

            return (
              <div key={`${review.id}-${index}`} className={styles.reviewCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.stars}>
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="#FFC107" color="#FFC107" />
                    ))}
                  </div>
                  <Quote size={24} className={styles.quoteIcon} />
                </div>
                
                <p className={styles.reviewText}>"{review.text}"</p>

                <div className={styles.userInfo}>
                  <div 
                    className={styles.avatar}
                    style={{ backgroundColor: review.avatarColor }}
                  >
                    {initials}
                  </div>
                  <div className={styles.meta}>
                    <h4 className={styles.userName}>{review.name}</h4>
                    <span className={styles.userRole}>{review.role}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
