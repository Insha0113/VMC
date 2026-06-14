import React from 'react';
import ECGLoader from '@/components/ECGLoader';

export default function Loading() {
  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '70vh', 
      width: '100%', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <ECGLoader message="Loading VMC Medical Center..." />
    </div>
  );
}
