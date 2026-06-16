import React, { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDoctors, getDepartments } from '@/lib/db';
import FallbackImage from '@/components/FallbackImage';
import ECGLoader from '@/components/ECGLoader';
import BackButton from '@/components/BackButton';
import { 
  ArrowLeft, 
  Calendar, 
  GraduationCap, 
  Award, 
  Mail, 
  Phone, 
  Clock,
  Briefcase
} from 'lucide-react';
import styles from './page.module.css';


export const unstable_instant = {
  prefetch: 'static',
  samples: [
    {
      params: { id: 'doc-1' }
    }
  ]
};

interface DoctorDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function DoctorDetailPage({ params }: DoctorDetailPageProps) {
  return (
    <Suspense fallback={
      <div className="container section text-center" style={{ marginTop: '5rem' }}>
        <ECGLoader message="Loading Doctor Profile..." />
      </div>
    }>
      {params.then(({ id }) => (
        <DoctorDetailContent id={id} />
      ))}
    </Suspense>
  );
}

async function DoctorDetailContent({ id }: { id: string }) {
  const doctors = await getDoctors();
  const departments = await getDepartments();

  const doctor = doctors.find(
    (d) => d.id === id
  );

  if (!doctor) {
    notFound();
  }

  const dept = departments.find(
    (d) => d.slug.toLowerCase() === doctor.department.toLowerCase()
  );

  return (
    <div>
      {/* Detail Header Banner with overlay landing image */}
      <section 
        className={styles.header}
        style={{
          minHeight: 'var(--header-min-height, 75vh)',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: 'none',
          padding: '2.5rem 0',
          backgroundColor: '#043f65'
        }}
      >
        <div 
          className="responsive-banner-bg"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: "url('/images/doctor interaction2.jpg')",
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
            background: 'linear-gradient(135deg, rgba(4, 63, 101, 0.8) 0%, rgba(8, 113, 178, 0.7) 60%, rgba(149, 200, 62, 0.25) 100%)',
            zIndex: 2
          }}
        />
        <div 
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '120px',
            background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(149, 200, 62, 0.08) 35%, rgba(149, 200, 62, 0.2) 70%, var(--background) 100%)',
            pointerEvents: 'none',
            zIndex: 3
          }}
        />
        <div className="container" style={{ position: 'relative', zIndex: 4, padding: '2rem 0' }}>
          <BackButton />
          <h1 className={styles.title}>{doctor.name}</h1>
          <p className={styles.subtitle}>{doctor.specialty} • {dept ? dept.name : doctor.department.toUpperCase()}</p>
        </div>
      </section>

      {/* Profile details */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.profileGrid}>
            
            {/* Left Column: Photo card and key details */}
            <div className={styles.leftCol}>
              <div className={styles.photoCard}>
                <div className={styles.imgWrapper}>
                  <FallbackImage
                    src={doctor.image}
                    fallbackSrc="/images/doc1.jpg"
                    alt={doctor.name}
                    className={styles.profileImg}
                  />
                </div>
                
                <div className={styles.quickContact}>
                  <h3 className={styles.cardSectionTitle}>Get in Touch</h3>
                  <div className={styles.contactItem}>
                    <Mail size={16} className={styles.contactIcon} />
                    <a href={`mailto:${doctor.email}`} className={styles.contactLink}>{doctor.email}</a>
                  </div>
                  <div className={styles.contactItem}>
                    <Phone size={16} className={styles.contactIcon} />
                    <span className={styles.contactText}>{doctor.phone}</span>
                  </div>
                </div>

                <div className={styles.availabilityBox}>
                  <h3 className={styles.cardSectionTitle}>Weekly Schedule</h3>
                  <div className={styles.availList}>
                    {doctor.availability.map((day) => (
                      <div key={day} className={styles.availDay}>
                        <Clock size={14} className={styles.clockIcon} />
                        <span>{day} (Consulting Hours)</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.bookCta}>
                  <Link href={`/book?doctor=${doctor.id}&dept=${doctor.department}`} className={styles.bookBtn}>
                    <Calendar size={18} /> Book Consultation
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column: Detailed info */}
            <div className={styles.rightCol}>
              <div className={styles.infoBlock}>
                <h2 className={styles.blockTitle}>Professional Summary</h2>
                <p className={styles.bioText}>{doctor.bio}</p>
              </div>

              <div className={styles.infoBlock} style={{ marginTop: '2.5rem' }}>
                <h2 className={styles.blockTitle}>Qualifications & Background</h2>
                <div className={styles.credentialList}>
                  
                  <div className={styles.credentialItem}>
                    <div className={styles.credentialIconBox}>
                      <GraduationCap size={24} />
                    </div>
                    <div className={styles.credentialDetails}>
                      <h4>Educational Background</h4>
                      <p>{doctor.education}</p>
                    </div>
                  </div>

                  <div className={styles.credentialItem}>
                    <div className={styles.credentialIconBox}>
                      <Award size={24} />
                    </div>
                    <div className={styles.credentialDetails}>
                      <h4>Clinical Experience</h4>
                      <p>Over {doctor.experience} of dedicated patient care in specialized fields.</p>
                    </div>
                  </div>

                  <div className={styles.credentialItem}>
                    <div className={styles.credentialIconBox}>
                      <Briefcase size={24} />
                    </div>
                    <div className={styles.credentialDetails}>
                      <h4>Medical Specialty Field</h4>
                      <p>Board Certified specialist in <strong>{dept ? dept.name : doctor.department.toUpperCase()}</strong> services.</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Department Info Box */}
              {dept && (
                <div className={styles.deptCard} style={{ marginTop: '3rem' }}>
                  <h3 className={styles.deptTitle}>{dept.name} Department</h3>
                  <p className={styles.deptDesc}>{dept.description}</p>
                  <Link href={`/departments/${dept.slug}`} className={styles.deptLink}>
                    Explore Department Services & Staff <ArrowLeft size={16} style={{ transform: 'rotate(180deg)', marginLeft: '6px' }} />
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
