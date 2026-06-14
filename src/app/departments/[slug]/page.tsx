import React, { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDepartments, getDoctors } from '@/lib/db';
import DoctorCard from '@/components/DoctorCard';
import ECGLoader from '@/components/ECGLoader';
import { CheckSquare, ArrowLeft, Calendar } from 'lucide-react';
import styles from '../departments.module.css';

const deptImages: Record<string, string> = {
  pediatrics: '/images/pediatric.jpg',
  ent: '/images/ent.jpg',
  orthopedics: '/images/orthopedics image.jpg'
};

export const unstable_instant = {
  prefetch: 'static',
  samples: [
    {
      params: { slug: 'orthopedics' }
    }
  ]
};

interface DepartmentDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function DepartmentDetailPage({ params }: DepartmentDetailPageProps) {
  return (
    <Suspense fallback={
      <div className="container section text-center" style={{ marginTop: '5rem' }}>
        <ECGLoader message="Loading Department Details..." />
      </div>
    }>
      {params.then(({ slug }) => (
        <DepartmentDetailContent slug={slug} />
      ))}
    </Suspense>
  );
}

async function DepartmentDetailContent({ slug }: { slug: string }) {
  // Fetch data
  const departments = await getDepartments();
  const doctors = await getDoctors();

  // Find target department
  const department = departments.find(
    (d) => d.slug.toLowerCase() === slug.toLowerCase()
  );

  if (!department) {
    notFound();
  }

  // Find doctors in this department
  const departmentDoctors = doctors.filter(
    (doc) => doc.department.toLowerCase() === slug.toLowerCase()
  );

  // Mock service explanations for premium UI look
  const serviceDetails: Record<string, string> = {
    'Joint Replacement Surgery (Hip & Knee)': 'Advanced arthroplasty techniques using custom prosthetics to restore full mobility and eliminate chronic pain.',
    'Arthroscopic Surgery & Sports Medicine': 'Minimally invasive joint surgery for ligament reconstructions, meniscus repairs, and athletic trauma recovery.',
    'Fracture and Trauma Management': 'Rapid stabilization, splinting, and surgical fixation of acute skeletal fractures and muscular injuries.',
    'Spine Care & Rehabilitation': 'Non-surgical and surgical intervention for herniated discs, spinal stenosis, scoliosis, and chronic back pain.',
    'Pediatric Orthopedics': 'Specialized orthopedic treatment for congenital skeletal anomalies, growth plate issues, and pediatric trauma.',
    'Well-child Checks & Immunizations': 'Routine wellness visits, developmental tracking, and vaccination scheduling according to national guidelines.',
    'Developmental Screening': 'Structured screening of behavioral milestone progressions, speech, motor skills, and social development.',
    'Pediatric Acute Care': 'Immediate diagnostics and treatments for fever, infections, respiratory distress, and childhood illnesses.',
    'Childhood Asthma & Allergy Management': 'Pulmonary testing, rescue plan mapping, and long-term allergy management pathways for infants and youth.',
    'Nutritional Counseling': 'Pediatric diet assessments, obesity therapy, picky-eater consultations, and custom nutrition sheets.',
    'Hearing Loss & Tinnitus Evaluation': 'Comprehensive audiometry, tympanometry, and specialist consulting for hearing aids or surgery options.',
    'Sinusitis & Allergy Management': 'Medical management, allergy shots, or endoscopic sinus surgery (FESS) to relieve chronic sinus blockages.',
    'Tonsillectomy & Adenoidectomy': 'Surgical removal of chronic tonsil and adenoid infections to resolve sleep apnea and chronic sore throats.',
    'Voice & Swallowing Disorders': 'Video stroboscopy evaluation and voice therapy guidance for dysphagia, hoarseness, and throat trauma.',
    'Sleep Apnea & Snoring Treatment': 'Airway obstruction analysis, CPAP fitting guidance, and surgical structural revisions.'
  };

  return (
    <div>
      {/* Detail Header */}
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
            backgroundImage: `url('${deptImages[slug.toLowerCase()] || '/images/doctor interaction.jpg'}')`,
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
        <div className="container" style={{ position: 'relative', zIndex: 3, padding: '4rem 0' }}>
          <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
            <Link href="/departments" className={styles.btnBook} style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ArrowLeft size={16} /> Back to Departments
              </span>
            </Link>
          </div>
          <h1 className={styles.title}>{department.name} Department</h1>
          <p className={styles.subtitle}>
            State-of-the-art diagnostic facilities, advanced therapies, and dedicated clinical consultants.
          </p>
        </div>
      </section>

      {/* Main Details Section */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.detailGrid}>
            {/* Doctor Listings (Left Side) */}
            <div>
              <h2 className={styles.overviewTitle}>Our Specialists</h2>
              {departmentDoctors.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No doctors listed currently in this department.</p>
              ) : (
                <div className={styles.doctorsGrid}>
                  {departmentDoctors.map((doc) => (
                    <DoctorCard key={doc.id} doctor={doc} />
                  ))}
                </div>
              )}
            </div>

            {/* Overview and Services (Right Side Sidebar) */}
            <div>
              <div className={styles.overviewSidebar}>
                <h3 className={styles.sidebarSectionTitle}>Department Overview</h3>
                <p className={styles.overviewText}>{department.description}</p>

                <h3 className={styles.sidebarSectionTitle} style={{ marginTop: '2rem' }}>Available Services</h3>
                <div className={styles.serviceCardList}>
                  {department.services.map((service, index) => (
                    <div key={index} className={styles.serviceCardItem}>
                      <CheckSquare size={18} className={styles.serviceCardIcon} />
                      <div>
                        <h4 className={styles.serviceCardName}>{service}</h4>
                        <p className={styles.serviceCardDesc}>
                          {serviceDetails[service] || 'Comprehensive clinical consultation, scan, and care.'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div style={{ marginTop: '2rem' }}>
                  <Link href={`/book?dept=${department.slug}`} className={styles.btnExplore} style={{ width: '100%', justifyContent: 'center' }}>
                    <Calendar size={18} /> Book Department Consult
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
