import React from 'react';
import { Heart } from 'lucide-react';
import styles from './ECGLoader.module.css';

interface ECGLoaderProps {
  message?: string;
}

export default function ECGLoader({ message = 'Loading...' }: ECGLoaderProps) {
  return (
    <div className={styles.container}>
      <div className={styles.ecgWrapper}>
        <svg
          className={styles.ecgSvg}
          viewBox="0 0 300 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Grid Background */}
          <defs>
            <pattern id="ecg-grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(8, 113, 178, 0.08)" strokeWidth="0.5" />
            </pattern>
            <linearGradient id="ecg-glow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0871B2" />
              <stop offset="50%" stopColor="#95C83E" />
              <stop offset="100%" stopColor="#0871B2" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#ecg-grid)" />
          
          {/* Baseline/Reference lines */}
          <line x1="0" y1="50" x2="300" y2="50" stroke="rgba(8, 113, 178, 0.15)" strokeWidth="1" strokeDasharray="5,5" />
          
          {/* ECG Wavepath */}
          <path
            className={styles.ecgPath}
            d="M 0,50 L 50,50 L 60,50 L 70,45 L 75,55 L 80,50 L 95,50 L 105,20 L 115,85 L 125,50 L 135,50 L 145,40 L 155,50 L 300,50"
            fill="none"
            stroke="url(#ecg-glow)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {message && (
        <div className={styles.messageRow}>
          <Heart className={styles.heartIcon} size={18} fill="var(--accent)" stroke="var(--accent)" />
          <span className={styles.message}>{message}</span>
        </div>
      )}
    </div>
  );
}
