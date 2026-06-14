'use client';

import React, { useState } from 'react';

const VIDEOS = [
  '/videos/landing page video.mp4',
  '/videos/video1.mp4',
  '/videos/video2.mp4'
];

export default function HeroVideo() {
  const [videoIndex, setVideoIndex] = useState(0);

  const handleVideoEnded = () => {
    setVideoIndex((prev) => (prev + 1) % VIDEOS.length);
  };

  return (
    <video
      key={VIDEOS[videoIndex]}
      src={VIDEOS[videoIndex]}
      autoPlay
      muted
      playsInline
      onEnded={handleVideoEnded}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        zIndex: 0,
        opacity: 0.45, // More transparent
        pointerEvents: 'none'
      }}
    />
  );
}
