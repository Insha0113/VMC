import React from 'react';
import Link from 'next/link';
import { Calendar, Award, GraduationCap, Clock } from 'lucide-react';
import { Doctor } from '@/lib/db';
import FallbackImage from './FallbackImage';
import styles from './DoctorCard.module.css';

interface DoctorCardProps {
  doctor: Doctor;
  compact?: boolean;
}

export default function DoctorCard({ doctor, compact = false }: DoctorCardProps) {
  return (
    <div className={`${styles.card} ${compact ? styles.compact : ''}`}>
      <span className={styles.deptBadge}>{doctor.department.toUpperCase()}</span>
      <Link href={`/doctors/${doctor.id}`} target="_blank" className={styles.avatarLink}>
        <div className={styles.avatarContainer}>
          <FallbackImage
            src={doctor.image}
            fallbackSrc="/images/doc1.jpg"
            alt={doctor.name}
            className={styles.avatarImg}
          />
        </div>
      </Link>

      <div className={styles.info}>
        <h3 className={styles.name}>
          <Link href={`/doctors/${doctor.id}`} target="_blank" className={styles.nameLink}>
            {doctor.name}
          </Link>
        </h3>
        <p className={styles.specialty}>{doctor.specialty}</p>
        
        {!compact && (
          <>
            <div className={styles.meta}>
              <div className={styles.metaItem}>
                <Award size={16} className={styles.icon} />
                <span><strong>Experience:</strong> {doctor.experience}</span>
              </div>
              <div className={styles.metaItem}>
                <GraduationCap size={16} className={styles.icon} />
                <span><strong>Education:</strong> {doctor.education}</span>
              </div>
              <div className={styles.metaItem}>
                <Clock size={16} className={styles.icon} />
                <span><strong>Availability:</strong> {doctor.availability.join(', ')}</span>
              </div>
            </div>
            <p className={styles.bio}>{doctor.bio}</p>
          </>
        )}

        <div className={styles.actions}>
          <Link href={`/book?doctor=${doctor.id}&dept=${doctor.department}`} className={styles.bookBtn}>
            <Calendar size={16} />
            Book Consult
          </Link>
        </div>
      </div>
    </div>
  );
}
