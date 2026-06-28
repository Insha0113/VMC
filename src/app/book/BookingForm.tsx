'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  CheckCircle, 
  ArrowRight, 
  Clock, 
  Info
} from 'lucide-react';
import { Doctor, Department, Booking } from '@/lib/db';
import styles from './page.module.css';
import ECGLoader from '@/components/ECGLoader';

const CLINICAL_SERVICES = [
  { id: 'home-visit', name: 'Home Visit', desc: 'Get professional medical consults and nursing support at home.' },
  { id: 'usg', name: 'USG', desc: 'Advanced Ultrasonography and diagnostic scan.' },
  { id: 'ecg', name: 'ECG', desc: 'Quick and precise Electrocardiogram heart screening.' },
  { id: 'x-ray', name: 'X-Ray', desc: 'High-resolution digital skeletal imaging.' },
  { id: 'pharmacy', name: 'Pharmacy', desc: 'In-house pharmacy for immediate prescription fulfillment.' },
  { id: 'diabetic-care', name: 'Diabetic Care', desc: 'Blood sugar check, diabetic profiling and guidance.' },
  { id: 'lab', name: 'Lab', desc: 'Comprehensive diagnostic blood and urine analysis.' }
];

export default function BookingForm() {
  const searchParams = useSearchParams();
  
  // Step tracker (1: Specialty/Staff, 2: Scheduling, 3: Patient Info, 4: Confirm)
  const [step, setStep] = useState(1);
  
  // Booking Type (consultation or service)
  const [bookingType, setBookingType] = useState<'consultation' | 'service'>('consultation');
  const [selectedService, setSelectedService] = useState<string>('');
  
  // Database lists loaded dynamically
  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  // Form selections
  const [selectedDept, setSelectedDept] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  
  // Patient Details
  const [patientData, setPatientData] = useState({
    name: '',
    email: '',
    phone: '',
    symptoms: ''
  });

  // Booking result
  const [bookingResult, setBookingResult] = useState<Booking | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch departments and doctors
  useEffect(() => {
    async function loadData() {
      try {
        const [deptsRes, docsRes] = await Promise.all([
          fetch('/api/departments'),
          fetch('/api/doctors')
        ]);
        
        const deptsData = await deptsRes.json();
        const docsData = await docsRes.json();
        
        setDepartments(deptsData);
        setDoctors(docsData);

        // Pre-fill parameters if present in URL
        const typeParam = searchParams.get('type');
        const serviceParam = searchParams.get('service');
        const deptParam = searchParams.get('dept');
        const docParam = searchParams.get('doctor');

        if (typeParam === 'service') {
          setBookingType('service');
          setSelectedDept('Clinical Services');
          if (serviceParam) {
            const matchedService = CLINICAL_SERVICES.find(
              s => s.name.toLowerCase() === serviceParam.toLowerCase() || s.id === serviceParam.toLowerCase()
            );
            if (matchedService) {
              setSelectedService(matchedService.name);
            } else {
              setSelectedService(serviceParam);
            }
          }
        } else {
          if (deptParam) {
            const lowerDept = deptParam.toLowerCase();
            setSelectedDept(lowerDept);
            // Auto-select doctor if only one in department
            const filtered = docsData.filter((d: Doctor) => d.department.toLowerCase() === lowerDept);
            if (filtered.length === 1) {
              setSelectedDoctor(filtered[0]);
            }
          }
          if (docParam && docsData.length > 0) {
            const doc = docsData.find((d: Doctor) => d.id === docParam);
            if (doc) {
              setSelectedDoctor(doc);
              setSelectedDept(doc.department.toLowerCase());
            }
          }
        }
      } catch (err) {
        console.error('Failed to load booking dependencies:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [searchParams]);

  // Handle department change
  const handleDeptSelect = (deptSlug: string) => {
    setSelectedDept(deptSlug);
    setSelectedSlot('');     // Reset slot
    
    // Auto-select doctor if exactly one doctor in this department
    const filtered = doctors.filter(
      (doc) => doc.department.toLowerCase() === deptSlug.toLowerCase()
    );
    if (filtered.length === 1) {
      setSelectedDoctor(filtered[0]);
    } else {
      setSelectedDoctor(null);
    }
  };

  // Filter doctors based on selected department
  const filteredDoctors = doctors.filter(
    (doc) => doc.department.toLowerCase() === selectedDept.toLowerCase()
  );

  // Available Time Slots Mock (can be filtered by doctor later)
  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
    '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM'
  ];

  // Helper: Verify if date matches doctor availability
  const getDayName = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  const isDoctorAvailableOnDate = () => {
    if (bookingType === 'service') {
      if (!selectedDate) return true;
      const day = getDayName(selectedDate);
      return day !== 'Sunday';
    }
    if (!selectedDoctor || !selectedDate) return true;
    const day = getDayName(selectedDate);
    
    return selectedDoctor.availability.some((avail) => {
      const availLower = avail.toLowerCase();
      const dayLower = day.toLowerCase();
      
      // Exact substring match (e.g., "Wednesday" in "Wednesday: 5.00 pm onwards")
      if (availLower.includes(dayLower)) {
        return true;
      }
      
      // Range check "Monday to Saturday" or "Monday - Saturday"
      if (availLower.includes('monday') && (availLower.includes('saturday') || availLower.includes('sat')) && (availLower.includes('-') || availLower.includes('to'))) {
        return dayLower !== 'sunday';
      }
      
      // Range check "Monday to Friday" or "Monday - Friday"
      if (availLower.includes('monday') && (availLower.includes('friday') || availLower.includes('fri')) && (availLower.includes('-') || availLower.includes('to'))) {
        return dayLower !== 'saturday' && dayLower !== 'sunday';
      }
      
      return false;
    });
  };

  // Helper: Parse slot time string to minutes from midnight
  const parseTimeToMinutes = (timeStr: string): number => {
    const cleaned = timeStr.toLowerCase().trim();
    const isPM = cleaned.includes('pm') || cleaned.includes('p.m.');
    const isAM = cleaned.includes('am') || cleaned.includes('a.m.');
    
    const match = cleaned.match(/(\d+)(?:[:.](\d+))?/);
    if (!match) return 0;
    
    let hours = parseInt(match[1], 10);
    const minutes = match[2] ? parseInt(match[2], 10) : 0;
    
    if (isPM && hours < 12) {
      hours += 12;
    } else if (isAM && hours === 12) {
      hours = 0;
    } else if (!isAM && !isPM && hours < 8) {
      hours += 12;
    }
    
    return hours * 60 + minutes;
  };

  // Helper: Determine if a specific slot is within the doctor's custom availability
  const isSlotAvailableForDoctor = (slot: string) => {
    if (!selectedDate || !selectedDoctor) return true;
    const day = getDayName(selectedDate);
    const dayLower = day.toLowerCase();
    
    const matchingAvail = selectedDoctor.availability.find(avail => {
      const aLower = avail.toLowerCase();
      if (aLower.includes(dayLower)) return true;
      if (aLower.includes('monday') && (aLower.includes('saturday') || aLower.includes('sat')) && (aLower.includes('-') || aLower.includes('to'))) {
        return dayLower !== 'sunday';
      }
      if (aLower.includes('monday') && (aLower.includes('friday') || aLower.includes('fri')) && (aLower.includes('-') || aLower.includes('to'))) {
        return dayLower !== 'saturday' && dayLower !== 'sunday';
      }
      return false;
    });
    
    if (!matchingAvail) return false;
    if (!matchingAvail.includes(':')) return true; // Available all day if no time constraint
    
    const parts = matchingAvail.split(':');
    const timePart = parts.slice(1).join(':').toLowerCase();
    
    let startMinutes = 0;
    let endMinutes = 24 * 60;
    
    if (timePart.includes('to') || timePart.includes('-')) {
      const timeSplit = timePart.includes('to') ? timePart.split('to') : timePart.split('-');
      startMinutes = parseTimeToMinutes(timeSplit[0]);
      endMinutes = parseTimeToMinutes(timeSplit[1]);
    } else if (timePart.includes('onwards')) {
      const timeSplit = timePart.split('onwards')[0];
      startMinutes = parseTimeToMinutes(timeSplit);
      endMinutes = 24 * 60;
    }
    
    const slotMinutes = parseTimeToMinutes(slot);
    return slotMinutes >= startMinutes && slotMinutes <= endMinutes;
  };

  // Smooth scroll step transition gliding
  useEffect(() => {
    const wrapper = document.querySelector(`.${styles.wrapper}`);
    if (wrapper) {
      wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [step]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPatientData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit Booking to API
  const handleConfirmBooking = async () => {
    if (bookingType === 'consultation' && (!selectedDoctor || !selectedDept)) return;
    if (bookingType === 'service' && !selectedService) return;
    if (!selectedDate || !selectedSlot) return;
    setSubmitting(true);
    setErrorMsg('');

    const payload = {
      patientName: patientData.name,
      patientEmail: patientData.email,
      patientPhone: patientData.phone,
      department: bookingType === 'service' ? 'Clinical Services' : selectedDept,
      doctorId: bookingType === 'service' ? 'service-generic' : (selectedDoctor?.id || ''),
      doctorName: bookingType === 'service' ? selectedService : (selectedDoctor?.name || ''),
      date: selectedDate,
      time: selectedSlot,
      symptoms: patientData.symptoms
    };

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit booking appointment.');
      }

      setBookingResult(data);
      setStep(5); // Success step
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'Server error, failed to create appointment.';
      setErrorMsg(message);
    } finally {
      setSubmitting(false);
    }
  };

  // Get tomorrow's date for date-picker min attribute
  const getTomorrowDateString = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <ECGLoader message="Loading appointment calendar dependencies..." />
    );
  }

  // 5. Success Screen
  if (step === 5 && bookingResult) {
    return (
      <div className={styles.stepCard} style={{ maxWidth: '600px', margin: '4rem auto' }}>
        <div className={styles.successCard}>
          <CheckCircle size={64} className={styles.successIcon} />
          <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Appointment Confirmed!</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Your booking request has been registered and approved by VMC. Please save your booking details.
          </p>

          <div className={styles.codeBox}>{bookingResult.id}</div>

          <div className={styles.confirmReceipt} style={{ width: '100%', borderStyle: 'solid', padding: '1.5rem' }}>
            <div className={styles.receiptRow}>
              <span className={styles.receiptLabel}>Patient</span>
              <span className={styles.receiptValue}>{bookingResult.patientName}</span>
            </div>
            <div className={styles.receiptRow}>
              <span className={styles.receiptLabel}>Specialist</span>
              <span className={styles.receiptValue}>{bookingResult.doctorName}</span>
            </div>
            <div className={styles.receiptRow}>
              <span className={styles.receiptLabel}>Department</span>
              <span className={styles.receiptValue}>{bookingResult.department.toUpperCase()}</span>
            </div>
            <div className={styles.receiptRow}>
              <span className={styles.receiptLabel}>Date</span>
              <span className={styles.receiptValue}>{bookingResult.date}</span>
            </div>
            <div className={styles.receiptRow} style={{ borderBottom: 'none', paddingBottom: 0 }}>
              <span className={styles.receiptLabel}>Time Slot</span>
              <span className={styles.receiptValue}>{bookingResult.time}</span>
            </div>
          </div>

          <div className={styles.guidelinesBox}>
            <h4>📋 Appointment Guidelines:</h4>
            <ul>
              <li>Please arrive 15 minutes prior to your scheduled slot.</li>
              <li>Bring a valid ID card and past medical history / scan reports if any.</li>
              <li>A confirmation notice has been sent to <strong>{bookingResult.patientEmail}</strong>.</li>
              <li>If you need to reschedule, call us at <a href="tel:9947653954" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'underline' }}>9947653954</a>.</li>
            </ul>
          </div>

          <button 
            className={styles.btnPrimary} 
            style={{ width: '100%', padding: '1rem', marginTop: '1rem' }}
            onClick={() => {
              setStep(1);
              const typeParam = searchParams.get('type');
              if (typeParam === 'service') {
                setBookingType('service');
                setSelectedDept('Clinical Services');
              } else {
                setBookingType('consultation');
                setSelectedDept('');
              }
              setSelectedDoctor(null);
              setSelectedService('');
              setSelectedDate('');
              setSelectedSlot('');
              setPatientData({ name: '', email: '', phone: '', symptoms: '' });
              setBookingResult(null);
            }}
          >
            Book Another Appointment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {/* Wizard Header Progress Bar */}
      <div className={styles.stepsHeader}>
        <div className={`${styles.stepDot} ${step >= 1 ? styles.stepDotActive : ''} ${step > 1 ? styles.stepDotDone : ''}`}>1</div>
        <div className={`${styles.stepDot} ${step >= 2 ? styles.stepDotActive : ''} ${step > 2 ? styles.stepDotDone : ''}`}>2</div>
        <div className={`${styles.stepDot} ${step >= 3 ? styles.stepDotActive : ''} ${step > 3 ? styles.stepDotDone : ''}`}>3</div>
        <div className={`${styles.stepDot} ${step >= 4 ? styles.stepDotActive : ''} ${step > 4 ? styles.stepDotDone : ''}`}>4</div>
      </div>

      {/* Step Contents */}
      {step === 1 && (
        <div className={styles.stepCard}>
          {bookingType === 'service' ? (
            <>
              <h2 className={styles.stepTitle}>Select Clinical Service</h2>
              <p className={styles.label} style={{ marginBottom: '0.75rem' }}>Choose Clinical Service *</p>
              <div className={styles.gridSelect}>
                {CLINICAL_SERVICES.map((srv) => (
                  <button
                    key={srv.id}
                    type="button"
                    className={`${styles.cardSelect} ${selectedService === srv.name ? styles.cardSelectActive : ''}`}
                    onClick={() => {
                      setSelectedService(srv.name);
                      setSelectedDept('Clinical Services');
                    }}
                  >
                    <div className={styles.cardSelectTitle}>{srv.name}</div>
                    <div className={styles.cardSelectDesc}>{srv.desc}</div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <h2 className={styles.stepTitle}>Select Department & Specialist</h2>
              
              <p className={styles.label} style={{ marginBottom: '0.75rem' }}>Select Specialty Department *</p>
              <div className={styles.gridSelect}>
                {departments.map((dept) => (
                  <button
                    key={dept.id}
                    type="button"
                    className={`${styles.cardSelect} ${selectedDept === dept.slug ? styles.cardSelectActive : ''}`}
                    onClick={() => handleDeptSelect(dept.slug)}
                  >
                    <div className={styles.cardSelectTitle}>{dept.name}</div>
                    <div className={styles.cardSelectDesc}>View clinical experts</div>
                  </button>
                ))}
              </div>

              {selectedDept && (
                <>
                  <p className={styles.label} style={{ marginBottom: '0.75rem', marginTop: '1.5rem' }}>Select Available Doctor *</p>
                  {filteredDoctors.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>No doctors available in this department right now.</p>
                  ) : (
                    <div className={styles.docGridSelect}>
                      {filteredDoctors.map((doc) => (
                        <button
                          key={doc.id}
                          type="button"
                          className={`${styles.docCardSelect} ${selectedDoctor?.id === doc.id ? styles.docCardSelectActive : ''}`}
                          onClick={() => {
                            setSelectedDoctor(doc);
                            setSelectedSlot(''); // Reset slot on doctor change
                          }}
                        >
                          <img
                            src={doc.image}
                            alt={doc.name}
                            className={styles.docAvatarImg}
                            onError={(e) => {
                              e.currentTarget.src = '/images/doc1.jpg';
                            }}
                          />
                          <div>
                            <div className={styles.docCardName}>{doc.name}</div>
                            <div className={styles.docCardSub}>{doc.specialty}</div>
                            <div className={styles.docCardSub} style={{ color: 'var(--accent-dark)', fontWeight: 'bold' }}>
                              Avail: {doc.availability.join(', ')}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}

          <div className={styles.actionBtns}>
            <div></div> {/* spacer */}
            <button
              type="button"
              className={styles.btnNext}
              disabled={bookingType === 'service' ? !selectedService : (!selectedDept || !selectedDoctor)}
              onClick={() => setStep(2)}
            >
              Continue to Scheduling <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (bookingType === 'service' || selectedDoctor) && (
        <div className={styles.stepCard}>
          <h2 className={styles.stepTitle}>Choose Date & Time Slot</h2>
          
          <div className={styles.dateTimeContainer}>
            {/* Left Col: Date Picker */}
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="booking-date">Select Appointment Date *</label>
              <input
                type="date"
                id="booking-date"
                className={styles.dateInput}
                min={getTomorrowDateString()}
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedSlot('');
                }}
              />
              
              {bookingType === 'service' ? (
                <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--background)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <h4 style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)' }}>
                    <Info size={16} /> Service Schedule
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Clinical services are available Monday through Saturday.
                  </p>
                  {selectedDate && (
                    <p style={{ fontSize: '0.8rem', marginTop: '6px', color: isDoctorAvailableOnDate() ? 'var(--success)' : 'var(--error)', fontWeight: 'bold' }}>
                      Selected day: {getDayName(selectedDate)} ({isDoctorAvailableOnDate() ? 'Available' : 'NOT Available'})
                    </p>
                  )}
                </div>
              ) : (
                selectedDoctor && (
                  <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'var(--background)', borderRadius: '8px', border: '1px solid var(--border)' }}>
                    <h4 style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)' }}>
                      <Info size={16} /> Specialist Schedule
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      <strong>{selectedDoctor.name}</strong> is available on: <br />
                      <span style={{ fontWeight: 'bold', color: 'var(--foreground)' }}>
                        {selectedDoctor.availability.join(', ')}
                      </span>
                    </p>
                    {selectedDate && (
                      <p style={{ fontSize: '0.8rem', marginTop: '6px', color: isDoctorAvailableOnDate() ? 'var(--success)' : 'var(--error)', fontWeight: 'bold' }}>
                        Selected date is a {getDayName(selectedDate)} ({isDoctorAvailableOnDate() ? 'Doctor Available' : 'Doctor NOT Available'})
                      </p>
                    )}
                  </div>
                )
              )}
            </div>

            {/* Right Col: Time Slots */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>Available Slots *</label>
              <div className={styles.slotsGrid}>
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    disabled={!selectedDate || !isDoctorAvailableOnDate() || !isSlotAvailableForDoctor(slot)}
                    className={`${styles.slotBtn} ${selectedSlot === slot ? styles.slotBtnActive : ''}`}
                    onClick={() => setSelectedSlot(slot)}
                  >
                    <Clock size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.actionBtns}>
            <button type="button" className={styles.btnBack} onClick={() => setStep(1)}>
              Back
            </button>
            <button
              type="button"
              className={styles.btnNext}
              disabled={!selectedDate || !selectedSlot || !isDoctorAvailableOnDate()}
              onClick={() => setStep(3)}
            >
              Patient Information <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className={styles.stepCard}>
          <h2 className={styles.stepTitle}>Patient Information</h2>
          
          <div className={styles.formRow}>
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="name">Patient Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className={styles.input}
                value={patientData.name}
                onChange={handleInputChange}
                placeholder="John Doe"
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className={styles.input}
                value={patientData.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className={styles.formRow} style={{ gridTemplateColumns: '1fr' }}>
            <div className={styles.inputGroup}>
              <label className={styles.label} htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                className={styles.input}
                value={patientData.phone}
                onChange={handleInputChange}
                placeholder="+91 99999 99999"
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="symptoms">{bookingType === 'service' ? 'Service Address & Additional Notes *' : 'Symptoms & Additional Notes *'}</label>
            <textarea
              id="symptoms"
              name="symptoms"
              required
              rows={4}
              className={styles.input}
              style={{ resize: 'vertical' }}
              value={patientData.symptoms}
              onChange={handleInputChange}
              placeholder={bookingType === 'service' ? "Enter home address for Home Visit, or list specific scan requirements and notes here." : "Describe symptoms briefly (e.g. chronic sore throat for 3 days)"}
            />
          </div>

          <div className={styles.actionBtns}>
            <button type="button" className={styles.btnBack} onClick={() => setStep(2)}>
              Back
            </button>
            <button
              type="button"
              className={styles.btnNext}
              disabled={!patientData.name || !patientData.email || !patientData.phone || !patientData.symptoms}
              onClick={() => setStep(4)}
            >
              Review Booking <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {step === 4 && (bookingType === 'service' || selectedDoctor) && (
        <div className={styles.stepCard}>
          <h2 className={styles.stepTitle}>Review & Confirm Appointment</h2>
          
          {errorMsg && (
            <div className={styles.errorBox} style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1.5px solid var(--error)', color: 'var(--error)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontWeight: 'bold' }}>
              {errorMsg}
            </div>
          )}

          <div className={styles.confirmReceipt}>
            <div className={styles.receiptRow}>
              <span className={styles.receiptLabel}>Patient Name</span>
              <span className={styles.receiptValue}>{patientData.name}</span>
            </div>
            <div className={styles.receiptRow}>
              <span className={styles.receiptLabel}>Contact Email</span>
              <span className={styles.receiptValue}>{patientData.email}</span>
            </div>
            <div className={styles.receiptRow}>
              <span className={styles.receiptLabel}>Contact Phone</span>
              <span className={styles.receiptValue}>{patientData.phone}</span>
            </div>
            {bookingType === 'service' ? (
              <>
                <div className={styles.receiptRow}>
                  <span className={styles.receiptLabel}>Booking Category</span>
                  <span className={styles.receiptValue}>Clinical Services</span>
                </div>
                <div className={styles.receiptRow}>
                  <span className={styles.receiptLabel}>Selected Service</span>
                  <span className={styles.receiptValue}>{selectedService}</span>
                </div>
              </>
            ) : (
              selectedDoctor && (
                <>
                  <div className={styles.receiptRow}>
                    <span className={styles.receiptLabel}>Medical Specialty</span>
                    <span className={styles.receiptValue}>{selectedDept.toUpperCase()}</span>
                  </div>
                  <div className={styles.receiptRow}>
                    <span className={styles.receiptLabel}>Consultant Specialist</span>
                    <span className={styles.receiptValue}>{selectedDoctor.name}</span>
                  </div>
                </>
              )
            )}
            <div className={styles.receiptRow}>
              <span className={styles.receiptLabel}>Date of Consult</span>
              <span className={styles.receiptValue}>{selectedDate}</span>
            </div>
            <div className={styles.receiptRow}>
              <span className={styles.receiptLabel}>Scheduled Slot</span>
              <span className={styles.receiptValue}>{selectedSlot}</span>
            </div>
            <div className={styles.receiptRow} style={{ borderBottom: 'none', paddingBottom: 0 }}>
              <span className={styles.receiptLabel}>{bookingType === 'service' ? 'Service Notes / Address' : 'Reported Symptoms'}</span>
              <span className={styles.receiptValue} style={{ maxWidth: '400px', wordBreak: 'break-word', textAlign: 'right' }}>{patientData.symptoms}</span>
            </div>
          </div>

          <div className={styles.actionBtns}>
            <button type="button" className={styles.btnBack} disabled={submitting} onClick={() => setStep(3)}>
              Back
            </button>
            <button
              type="button"
              className={styles.btnNext}
              disabled={submitting}
              onClick={handleConfirmBooking}
              style={{ backgroundColor: 'var(--success)' }}
            >
              {submitting ? 'Confirming...' : 'Confirm Appointment'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
