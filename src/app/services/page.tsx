import React from 'react';
import Link from 'next/link';
import { 
  Home, 
  Activity, 
  Heart, 
  Dna, 
  Layers, 
  Clock, 
  BookOpen, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import BackButton from '@/components/BackButton';
import styles from './page.module.css';

export const unstable_instant = { prefetch: 'static' };

interface ServiceItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  icon: React.ReactNode;
  info: string;
}

export default function ServicesPage() {
  const services: ServiceItem[] = [
    {
      id: 'home-visit',
      title: 'Home Visit',
      category: 'Community Care',
      description: 'Get professional medical consultations, primary health screenings, and nursing support in the comfort and privacy of your home.',
      image: '/images/home visit.jpg',
      icon: <Home size={16} />,
      info: 'Available Daily'
    },
    {
      id: 'usg',
      title: 'USG (Ultrasonography)',
      category: 'Diagnostics',
      description: 'High-precision obstetric, pelvic, and abdominal ultrasound scans conducted by certified sonographers for clear internal diagnostics.',
      image: '/images/USG.jpg',
      icon: <Activity size={16} />,
      info: 'Certified Reports'
    },
    {
      id: 'ecg',
      title: 'ECG (Electrocardiogram)',
      category: 'Cardiology',
      description: 'Rapid, highly accurate electrical activity recordings of the heart to help evaluate rhythms and check cardiovascular wellness.',
      image: '/images/ECG.jpg',
      icon: <Heart size={16} />,
      info: 'Instant Analysis'
    },
    {
      id: 'x-ray',
      title: 'Digital X-Ray',
      category: 'Radiology',
      description: 'Advanced, low-radiation digital radiography for quick skeletal imaging, bone fracture identification, and chest diagnostic scans.',
      image: '/images/xray.jpg',
      icon: <Layers size={16} />,
      info: 'Immediate Dispatch'
    },
    {
      id: 'pharmacy',
      title: 'In-House Pharmacy',
      category: 'Support Services',
      description: 'Fully certified and stocked pharmacy outlet offering essential prescription drugs, OTC formulations, and professional dosage counseling.',
      image: '/images/pharmacy.jpg',
      icon: <Dna size={16} />,
      info: 'Open 24/7'
    },
    {
      id: 'laboratory',
      title: 'Diagnostic Laboratory',
      category: 'Diagnostics',
      description: 'State-of-the-art clinical pathology lab analyzing blood chemistry, hematology, and urine panels with rapid, precise turnarounds.',
      image: '/images/lab.jpg',
      icon: <ShieldAlert size={16} />,
      info: 'ISO Accredited'
    },
    {
      id: 'diabetic-care',
      title: 'Diabetic Care Unit',
      category: 'Preventative Care',
      description: 'Comprehensive blood sugar diagnostics, customized diet mapping, insulin guidelines, and proactive counseling for diabetic management.',
      image: '/images/diabetic care.jpg',
      icon: <BookOpen size={16} />,
      info: 'Specialized Consult'
    }
  ];

  return (
    <div>
      {/* Header Banner */}
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
            backgroundImage: "url('/images/hospital front.jpg')",
            opacity: 0.7,
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
            background: 'linear-gradient(135deg, rgba(4, 63, 101, 0.85) 0%, rgba(8, 113, 178, 0.7) 60%, rgba(149, 200, 62, 0.25) 100%)',
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
        <div className="container" style={{ position: 'relative', zIndex: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <BackButton />
          <h1 className={styles.title}>Our Services</h1>
          <p className={styles.subtitle}>
            Beyond our clinical departments, VMC offers specialized diagnostic support, round-the-clock emergency assistance, and personalized home healthcare.
          </p>
        </div>
      </section>

      {/* Services Listing Section */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.grid}>
            {services.map((item) => (
              <article key={item.id} id={item.id} className={styles.card}>
                <div className={styles.imageWrapper}>
                  <img src={item.image} alt={item.title} className={styles.image} />
                  <div className={styles.badge}>
                    {item.icon}
                    <span>{item.category}</span>
                  </div>
                </div>
                
                <div className={styles.content}>
                  <h2 className={styles.serviceTitle}>{item.title}</h2>
                  <p className={styles.desc}>{item.description}</p>
                  
                  <div className={styles.footer}>
                    <div className={styles.priceInfo}>
                      <span className={styles.priceLabel}>Availability</span>
                      <span className={styles.priceValue}>{item.info}</span>
                    </div>
                    <Link href={`/book?service=${item.id}`} className={styles.btn}>
                      Book Now <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
