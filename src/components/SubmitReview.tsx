'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Star, Send, CheckCircle2 } from 'lucide-react';
import styles from './SubmitReview.module.css';

export default function SubmitReview() {
  const pathname = usePathname();
  
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Hide on admin panel
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) {
      setErrorMsg('Please fill in all required fields (Name and Review).');
      return;
    }
    
    setIsSubmitting(true);
    setErrorMsg('');
    
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          role: role.trim() || 'Visitor',
          rating,
          text: text.trim(),
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to submit review');
      }

      setIsSuccess(true);
      setName('');
      setRole('');
      setRating(5);
      setText('');
      
      // Dispatch event to refresh the marquee in real-time
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('review-submitted'));
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.reviewSection} id="submit-review-section">
      <div className="container">
        <div className={styles.card}>
          {isSuccess ? (
            <div className={styles.successState}>
              <CheckCircle2 size={56} className={styles.successIcon} />
              <h3 className={styles.successTitle}>Thank You!</h3>
              <p className={styles.successText}>
                Your review has been successfully submitted and helps other patients in our community.
              </p>
              <button 
                className={styles.resetBtn}
                onClick={() => setIsSuccess(false)}
              >
                Write Another Review
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.header}>
                <h2 className={styles.title}>Share Your Experience</h2>
                <p className={styles.subtitle}>
                  We value your feedback. Let us know how VMC Medical Center supported your health journey.
                </p>
              </div>

              {errorMsg && <div className={styles.errorBanner}>{errorMsg}</div>}

              <div className={styles.grid}>
                {/* Inputs */}
                <div className={styles.inputGroup}>
                  <label htmlFor="review-name" className={styles.label}>
                    Your Name <span className={styles.required}>*</span>
                  </label>
                  <input
                    id="review-name"
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    className={styles.input}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="review-role" className={styles.label}>
                    Role or Department Visited
                  </label>
                  <input
                    id="review-role"
                    type="text"
                    placeholder="e.g. ENT Patient, Parent, General Consultation"
                    className={styles.input}
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                </div>
              </div>

              {/* Rating */}
              <div className={styles.ratingGroup}>
                <span className={styles.label}>Rating <span className={styles.required}>*</span></span>
                <div className={styles.starsContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={styles.starBtn}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      aria-label={`Rate ${star} out of 5 stars`}
                    >
                      <Star
                        size={32}
                        className={styles.starIcon}
                        fill={(hoverRating || rating) >= star ? '#FFC107' : 'none'}
                        color={(hoverRating || rating) >= star ? '#FFC107' : '#cbd5e1'}
                      />
                    </button>
                  ))}
                  <span className={styles.ratingLabel}>
                    {rating} out of 5
                  </span>
                </div>
              </div>

              {/* Message */}
              <div className={styles.inputGroup}>
                <label htmlFor="review-text" className={styles.label}>
                  Your Review <span className={styles.required}>*</span>
                </label>
                <textarea
                  id="review-text"
                  required
                  rows={4}
                  placeholder="Tell us about your doctor visit, the staff, or facility environment..."
                  className={styles.textarea}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>

              {/* Submit Button */}
              <div className={styles.footerRow}>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={styles.submitBtn}
                >
                  {isSubmitting ? (
                    'Submitting...'
                  ) : (
                    <>
                      Submit Review <Send size={16} className={styles.sendIcon} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
