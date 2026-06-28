'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from '@/app/page.module.css';

const TOTAL_FRAMES = 240;
const FPS = 50; // Plays 240 frames in exactly 4.8 seconds
const FRAME_INTERVAL = 1000 / FPS;

export default function TrustCounterAnimation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [useCanvas, setUseCanvas] = useState(false);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [animationStarted, setAnimationStarted] = useState(false);

  // Function to get the path of a WebP frame (optimized for high speed loading)
  const getFramePath = (index: number) => {
    return `/trust counter webp/ezgif-frame-${String(index).padStart(3, '0')}.webp`;
  };

  // Preload all images in the background on mount
  useEffect(() => {
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      img.onload = () => {
        loadedCount++;
        // Start animation once a safe buffer of frames is fully loaded (e.g. first 60 frames)
        if (loadedCount === 60) {
          setUseCanvas(true);
          setAnimationStarted(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
      };
      images.push(img);
    }
    imagesRef.current = images;
  }, []);

  // Animation controller
  useEffect(() => {
    if (!animationStarted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let lastTime = performance.now();
    let frame = 1;

    // Draw the first frame immediately on the canvas to prevent a blank flash
    const initialImg = imagesRef.current[frame - 1];
    if (initialImg && initialImg.complete) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(initialImg, 0, 0, canvas.width, canvas.height);
    }

    const animate = (time: number) => {
      const delta = time - lastTime;
      if (delta >= FRAME_INTERVAL) {
        const framesToAdvance = Math.floor(delta / FRAME_INTERVAL);
        const nextFrame = Math.min(TOTAL_FRAMES, frame + framesToAdvance);

        const img = imagesRef.current[nextFrame - 1];
        if (img && img.complete) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          frame = nextFrame;
          lastTime = time - (delta % FRAME_INTERVAL);
        }
        // If image is not complete yet, we wait on the current frame
      }

      if (frame < TOTAL_FRAMES) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [animationStarted]);

  return (
    <div className={styles.trustCounterContainer}>
      {/* Static placeholder image that is visible immediately on home page load */}
      {!useCanvas && (
        <img
          src={getFramePath(1)}
          alt="VMC Patient Recovery Dashboard"
          className={styles.trustCounterImage}
          draggable={false}
        />
      )}

      {/* Canvas that plays the high-speed memory-cached animation */}
      <canvas
        ref={canvasRef}
        width={480}
        height={270} // 16:9 Aspect Ratio
        className={styles.trustCounterImage}
        style={{ display: useCanvas ? 'block' : 'none' }}
      />
    </div>
  );
}
