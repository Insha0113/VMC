import React from 'react';
export const unstable_instant = { prefetch: 'static' };
import Link from 'next/link';
import { getDepartments } from '@/lib/db';
import { CheckCircle2, ArrowRight, Calendar } from 'lucide-react';
import styles from './departments.module.css';

const deptImages: Record<string, string> = {
  pediatrics: '/images/pediatric.jpg',
  ent: '/images/ent.jpg',
  orthopedics: '/images/orthopedics image.jpg'
};

export default async function DepartmentsPage() {
  const departments = await getDepartments();

  return (
    <div>
      {/* Page Header */}
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
            backgroundImage: "url('/images/doctor interaction.jpg')",
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
          <h1 className={styles.title}>Medical Departments</h1>
          <p className={styles.subtitle}>
            Explore our specialized clinical centers, state-of-the-art diagnostics, and experienced medical team.
          </p>
        </div>
      </section>

      {/* Department Grid/List */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.deptListGrid}>
            {departments.map((dept) => (
              <div key={dept.id} className={styles.deptListItem}>
                {/* Visual Banner */}
                <div 
                  className={styles.deptVisual}
                  style={deptImages[dept.slug] ? {
                    backgroundImage: `linear-gradient(135deg, rgba(8, 113, 178, 0.7) 0%, rgba(149, 200, 62, 0.7) 100%), url('${deptImages[dept.slug]}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  } : undefined}
                >
                  <div className={styles.deptVisualText} style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>{dept.name}</div>
                </div>

                {/* Details */}
                <div className={styles.deptInfo}>
                  <h2 className={styles.deptName}>{dept.name}</h2>
                  <p className={styles.deptDesc}>{dept.description}</p>
                  
                  <div>
                    <h3 className={styles.servicesTitle}>Featured Services</h3>
                    <div className={styles.servicesGrid}>
                      {dept.services.map((service, index) => (
                        <div key={index} className={styles.serviceItem}>
                          <CheckCircle2 size={16} className={styles.serviceIcon} />
                          <span>{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className={styles.btnRow}>
                    <Link href={`/departments/${dept.slug}`} className={styles.btnExplore}>
                      Explore Department & Staff <ArrowRight size={16} />
                    </Link>
                    <Link href={`/book?dept=${dept.slug}`} className={styles.btnBook}>
                      <Calendar size={16} /> Book Appointment
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
