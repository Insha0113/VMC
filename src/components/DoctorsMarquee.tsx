'use client';

import React, { useRef, useEffect } from 'react';
import { Doctor } from '@/lib/db';
import DoctorCard from '@/components/DoctorCard';
import styles from '@/app/page.module.css';

interface DoctorsMarqueeProps {
  doctors: Doctor[];
}

export default function DoctorsMarquee({ doctors }: DoctorsMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isHovered = useRef(false);
  const userScrollActive = useRef(false);
  const userScrollTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // Mouse drag state
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  // Triple the doctors array to support seamless infinite loop in both directions
  const tripledDoctors = [...doctors, ...doctors, ...doctors];

  const resetUserScrollTimeout = () => {
    userScrollActive.current = true;
    if (userScrollTimeout.current) {
      clearTimeout(userScrollTimeout.current);
    }
    userScrollTimeout.current = setTimeout(() => {
      userScrollActive.current = false;
    }, 1500); // Resume autoplay 1.5 seconds after last interaction
  };

  const handleScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const scrollLeft = container.scrollLeft;
    const loopWidth = container.scrollWidth / 3;

    if (loopWidth === 0) return;

    // Boundary wrapping checks
    if (scrollLeft < 50) {
      // Near left end, jump forward by one full set width
      container.scrollLeft = scrollLeft + loopWidth;
    } else if (scrollLeft > 2 * loopWidth - 50) {
      // Near right end, jump backward by one full set width
      container.scrollLeft = scrollLeft - loopWidth;
    }
  };

  // Center scroll position on mount
  const initializeScroll = () => {
    const container = containerRef.current;
    if (!container) return;
    const loopWidth = container.scrollWidth / 3;
    if (loopWidth > 0) {
      container.scrollLeft = loopWidth;
    }
  };

  useEffect(() => {
    // Wait slightly to make sure rendering and styles are applied
    const timer = setTimeout(initializeScroll, 100);
    window.addEventListener('resize', initializeScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', initializeScroll);
      if (userScrollTimeout.current) {
        clearTimeout(userScrollTimeout.current);
      }
    };
  }, [doctors]);

  // Autoplay loop using requestAnimationFrame
  useEffect(() => {
    let animationFrameId: number;
    
    const tick = () => {
      const container = containerRef.current;
      if (container && !isDragging.current && !userScrollActive.current) {
        // Slow down significantly (0.1px per frame) on hover, else run at normal speed (0.8px per frame)
        const speed = isHovered.current ? 0.1 : 0.8;
        container.scrollLeft += speed;
      }
      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Event handlers to detect user direct scroll/swipe activity
  const handleWheel = () => {
    resetUserScrollTimeout();
  };

  const handleTouchStart = () => {
    resetUserScrollTimeout();
  };

  const handleTouchMove = () => {
    resetUserScrollTimeout();
  };

  // Drag to scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;
    isDragging.current = true;
    startX.current = e.pageX - container.offsetLeft;
    scrollLeftStart.current = container.scrollLeft;
    resetUserScrollTimeout();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const container = containerRef.current;
    if (!container) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX.current) * 1.5; // Drag sensitivity
    container.scrollLeft = scrollLeftStart.current - walk;
    resetUserScrollTimeout();
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
  };

  return (
    <div className={styles.docMarqueeContainerInteractive}>
      <div className={styles.docOverlayLeft}></div>
      <div className={styles.docOverlayRight}></div>
      <div
        ref={containerRef}
        className={styles.docMarqueeScrollContainer}
        onScroll={handleScroll}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseEnter={() => { isHovered.current = true; }}
        onMouseLeave={() => {
          isHovered.current = false;
          handleMouseUpOrLeave();
        }}
      >
        <div className={styles.docMarqueeTrackInteractive}>
          {tripledDoctors.map((doc, idx) => (
            <div key={`${doc.id}-${idx}`} className={styles.docMarqueeCard}>
              <DoctorCard doctor={doc} compact={true} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
