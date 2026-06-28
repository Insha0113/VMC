'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function BackButton() {
  const router = useRouter();

  useEffect(() => {
    // Force immediate scroll to top on component mount
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  return (
    <button
      onClick={() => router.back()}
      title="Go Back"
      className="back-button-responsive"
      style={{
        position: 'absolute',
        top: '1.5rem',
        left: '1.5rem',
        zIndex: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.25)',
        color: '#ffffff',
        cursor: 'pointer',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
        e.currentTarget.style.transform = 'scale(1.08)';
        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
      }}
    >
      <ArrowLeft size={20} />
    </button>
  );
}
