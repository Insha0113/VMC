import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

// Types Definition
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  department: string; // orthopedics, pediatrics, ent
  email: string;
  phone: string;
  image: string; // SVG code or avatar description
  experience: string;
  education: string;
  availability: string[]; // ['Monday', 'Wednesday', 'Friday']
  bio: string;
}

export interface Department {
  id: string;
  slug: string;
  name: string;
  description: string;
  services: string[];
  icon: string;
}

export interface Booking {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  department: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  symptoms: string;
  status: 'pending' | 'approved' | 'cancelled' | 'completed';
  createdAt: string;
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface Review {
  id: string;
  name: string;
  role: string;
  rating: number;
  text: string;
  avatarColor: string;
  createdAt: string;
}

// Initial Seed Data
const DEFAULT_DEPARTMENTS: Department[] = [
  {
    id: 'dept-1',
    slug: 'orthopedics',
    name: 'Orthopedics',
    description: 'Comprehensive care for bones, joints, ligaments, tendons, and muscles. Our experts utilize state-of-the-art diagnostic and surgical techniques to restore your mobility.',
    services: [
      'Joint Replacement Surgery (Hip & Knee)',
      'Arthroscopic Surgery & Sports Medicine',
      'Fracture and Trauma Management',
      'Spine Care & Rehabilitation',
      'Pediatric Orthopedics'
    ],
    icon: 'Bone'
  },
  {
    id: 'dept-2',
    slug: 'pediatrics',
    name: 'Pediatrics',
    description: 'Dedicated to the physical, emotional, and social health of infants, children, adolescents, and young adults. We provide a warm, child-friendly environment.',
    services: [
      'Well-child Checks & Immunizations',
      'Developmental Screening',
      'Pediatric Acute Care',
      'Childhood Asthma & Allergy Management',
      'Nutritional Counseling'
    ],
    icon: 'Baby'
  },
  {
    id: 'dept-3',
    slug: 'ent',
    name: 'ENT (Otolaryngology)',
    description: 'Expert medical and surgical evaluation and treatment of ear, nose, throat, and head & neck disorders for both adults and children.',
    services: [
      'Hearing Loss & Tinnitus Evaluation',
      'Sinusitis & Allergy Management',
      'Tonsillectomy & Adenoidectomy',
      'Voice & Swallowing Disorders',
      'Sleep Apnea & Snoring Treatment'
    ],
    icon: 'Activity'
  },
  {
    id: 'dept-4',
    slug: 'dermatology',
    name: 'Dermatology',
    description: 'Advanced skin care diagnostics, laser therapies, acne care, and cosmetic treatments. Our board-certified dermatologists help you achieve healthy skin.',
    services: [
      'Acne & Scar Treatment',
      'Skin Cancer Screening',
      'Laser Skin Resurfacing',
      'Eczema & Psoriasis Care',
      'Cosmetic Dermatology'
    ],
    icon: 'Sparkles'
  },
  {
    id: 'dept-5',
    slug: 'diabetic-care',
    name: 'Diabetic Care',
    description: 'Comprehensive blood sugar diagnostics, customized diet mapping, insulin guidelines, and proactive counseling for diabetic management.',
    services: [
      'Blood Sugar Profiling',
      'Dietary Consultation',
      'Insulin Counseling',
      'Continuous Glucose Monitoring'
    ],
    icon: 'Activity'
  },
  {
    id: 'dept-6',
    slug: 'gastroenterology',
    name: 'Gastroenterology',
    description: 'Advanced treatment for digestive tract disorders, stomach issues, liver diseases, and colorectal diagnostics.',
    services: [
      'Acidity & Reflux Management',
      'Liver Function Consults',
      'Digestive Health Screenings'
    ],
    icon: 'HeartHandshake'
  },
  {
    id: 'dept-7',
    slug: 'gynaecology',
    name: 'Gynaecology & Obstetrics',
    description: 'Dedicated women\'s health services, prenatal care, obstetric screenings, and advanced minimally invasive laparoscopic procedures.',
    services: [
      'Prenatal & Antenatal Care',
      'Laparoscopic Gynaecologic Surgery',
      'Infertility Consultations'
    ],
    icon: 'Sparkles'
  },
  {
    id: 'dept-8',
    slug: 'radiology',
    name: 'Radiology & General Practice',
    description: 'Primary health consults, general diagnostic support, ultrasound scans, and digital X-ray processing.',
    services: [
      'General Health Consults',
      'Diagnostic Ultrasound (USG)',
      'Digital X-Ray Scans'
    ],
    icon: 'Layers'
  }
];

const DEFAULT_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr Abid Babu',
    specialty: 'Consultant Medical Gastroenterology',
    department: 'gastroenterology',
    email: 'abid.babu@vmc.com',
    phone: '9633248480',
    image: '/images/Dr Abid Babu Medical Gastroenterology.jpg',
    experience: '10+ Years',
    education: 'MBBS, MD(General Medicine), DrNB(Medical Gastroenterology)',
    availability: [
      'Wednesday: 5.00 pm onwards'
    ],
    bio: 'Dr. Abid Babu specializes in general medicine and medical gastroenterology. He has extensive expertise in treating stomach, liver, and intestinal disorders.'
  },
  {
    id: 'doc-2',
    name: 'Dr Aswanikumari S',
    specialty: 'Senior Diabetologist',
    department: 'diabetic-care',
    email: 'aswanikumari@vmc.com',
    phone: '9633248480',
    image: '/images/Dr Aswanikumari S Senior Diabetologist.jpg',
    experience: '15+ Years',
    education: 'MBBS, MD(Diabetology)',
    availability: [
      'Thursday: 3.00 pm to 6.00 pm'
    ],
    bio: 'Dr. Aswanikumari S is a senior diabetologist with over 15 years of experience in managing complex diabetes cases, lifestyle modification, and preventative care.'
  },
  {
    id: 'doc-3',
    name: 'Dr Bididha Biswas',
    specialty: 'Consultant Gynaecologist & Obstetrician',
    department: 'gynaecology',
    email: 'bididha.biswas@vmc.com',
    phone: '9633248480',
    image: '/images/Dr Bididha Biswas gynaecologist andobstetrician and laproscopy surgeon.jpg',
    experience: '12+ Years',
    education: 'MBBS, MS, DNB, MRCOG',
    availability: [
      'Monday: 5.00 pm onwards',
      'Wednesday: 5.00 pm onwards',
      'Friday: 5.00 pm onwards'
    ],
    bio: 'Dr. Bididha Biswas is a highly qualified consultant gynaecologist, obstetrician, and laparoscopic surgeon specializing in women\'s health and minimally invasive surgeries.'
  },
  {
    id: 'doc-4',
    name: 'Dr Namitha Raj',
    specialty: 'General Practitioner & Dept of Radiology',
    department: 'radiology',
    email: 'namitha.raj@vmc.com',
    phone: '9633248480',
    image: '/images/Dr Namitha Raj Dept of Radiology Genral Practitioner.jpg',
    experience: '8+ Years',
    education: 'MBBS',
    availability: [
      'Monday to Saturday: 5.00 pm onwards'
    ],
    bio: 'Dr. Namitha Raj serves as a general practitioner with specialized experience in the department of radiology, providing core diagnostic support and primary care.'
  },
  {
    id: 'doc-5',
    name: 'Dr Sahiba Rafi',
    specialty: 'Skin Specialist',
    department: 'dermatology',
    email: 'sahiba.rafi@vmc.com',
    phone: '9633248480',
    image: '/images/Dr Sahiba Rafi Skin Soecialist.jpg',
    experience: '10+ Years',
    education: 'MBBS, MD Dermatology (AIIMS)',
    availability: [
      'Monday to Saturday: 4.00 pm to 6.00 pm'
    ],
    bio: 'Dr. Sahiba Rafi is a board-certified dermatologist from AIIMS, specializing in clinical and aesthetic dermatology, acne therapy, and advanced skin care treatments.'
  },
  {
    id: 'doc-6',
    name: 'Dr Sonak P',
    specialty: 'Orthopedic Specialist',
    department: 'orthopedics',
    email: 'sonak.p@vmc.com',
    phone: '9633248480',
    image: '/images/Dr Sonak P Orthopedics.jpg',
    experience: '12+ Years',
    education: 'MBBS, MS(ORTHOPEDICS)',
    availability: [
      'Monday: 5.30 pm onwards',
      'Wednesday: 5.30 pm onwards',
      'Friday: 5.30 pm onwards'
    ],
    bio: 'Dr. Sonak P is an expert orthopedic surgeon specializing in bone and joint treatments, fracture management, and outpatient orthopedic consults.'
  },
  {
    id: 'doc-7',
    name: 'Dr Nimisha Sidharth',
    specialty: 'Pediatric Specialist',
    department: 'pediatrics',
    email: 'nimisha.sidharth@vmc.com',
    phone: '9633248480',
    image: '/images/Dr Nimisha Sidharth pediatrics.jpg',
    experience: '9+ Years',
    education: 'MBBS, MD(PEDIATRICS)',
    availability: [
      'Monday to Saturday: 5.00 pm onwards'
    ],
    bio: 'Dr. Nimisha Sidharth is a dedicated pediatrician providing comprehensive pediatric care, immunizations, and developmental tracking for infants and children.'
  }
];

const DEFAULT_BOOKINGS: Booking[] = [
  {
    id: 'book-1',
    patientName: 'Jane Smith',
    patientEmail: 'jane.smith@example.com',
    patientPhone: '+1 (555) 012-3456',
    department: 'orthopedics',
    doctorId: 'doc-1',
    doctorName: 'Dr. Sarah Jenkins',
    date: '2026-06-16',
    time: '10:00 AM',
    symptoms: 'Knee pain after running last week.',
    status: 'approved',
    createdAt: new Date().toISOString()
  },
  {
    id: 'book-2',
    patientName: 'Tommy Brown',
    patientEmail: 'parent.brown@example.com',
    patientPhone: '+1 (555) 098-7654',
    department: 'pediatrics',
    doctorId: 'doc-2',
    doctorName: 'Dr. Michael Chen',
    date: '2026-06-17',
    time: '02:30 PM',
    symptoms: 'Annual well-child checkup and school vaccinations.',
    status: 'pending',
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_ENQUIRIES: Enquiry[] = [
  {
    id: 'enq-1',
    name: 'Alice Johnson',
    email: 'alice.j@example.com',
    phone: '+1 (555) 234-5678',
    subject: 'Insurance Coverage Question',
    message: 'Hello, I would like to know if you accept Blue Cross Blue Shield insurance for outpatient orthopedic checkups. Thank you.',
    createdAt: new Date().toISOString()
  }
];

const DEFAULT_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    name: 'Rajesh Kumar',
    role: 'Orthopedics Patient',
    rating: 5,
    text: 'The care and attention I received at VMC Medical Center was outstanding. The orthopedic team helped me get back on my feet after my knee surgery. Highly recommended!',
    avatarColor: '#0871B2',
    createdAt: new Date().toISOString()
  },
  {
    id: 'rev-2',
    name: 'Priya Sharma',
    role: 'Pediatrics (Mother of two)',
    rating: 5,
    text: 'Dr. Michael Chen is an exceptional pediatrician. He is so patient with my kids and always takes the time to explain everything. The virtual support chat also helped us schedule easily!',
    avatarColor: '#95C83E',
    createdAt: new Date().toISOString()
  },
  {
    id: 'rev-3',
    name: 'Amit Verma',
    role: 'ENT Patient',
    rating: 5,
    text: "I had a chronic sinus issue that other clinics couldn't resolve, but the ENT specialists at VMC diagnosed and treated it effectively. The facility is state-of-the-art.",
    avatarColor: '#f59e0b',
    createdAt: new Date().toISOString()
  },
  {
    id: 'rev-4',
    name: 'Thomas Mathew',
    role: 'Outpatient Clinic',
    rating: 5,
    text: 'Excellent customer service and very clean facility. The outpatient department was prompt, and the diagnostic reports were delivered on the same day. Very professional.',
    avatarColor: '#10b981',
    createdAt: new Date().toISOString()
  },
  {
    id: 'rev-5',
    name: 'Deepa Nair',
    role: 'Cardiology Consult',
    rating: 5,
    text: 'High quality treatment and extremely supportive nursing staff. The booking process was seamless, and the doctor took time to answer all my questions patiently.',
    avatarColor: '#3b82f6',
    createdAt: new Date().toISOString()
  }
];

// File-based Mock DB Setup
const MOCK_DB_PATH = path.join(process.cwd(), 'src/data/db.json');

function initializeLocalDB() {
  const dir = path.dirname(MOCK_DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  if (!fs.existsSync(MOCK_DB_PATH)) {
    const initialData = {
      doctors: DEFAULT_DOCTORS,
      departments: DEFAULT_DEPARTMENTS,
      bookings: DEFAULT_BOOKINGS,
      enquiries: DEFAULT_ENQUIRIES
    };
    fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
  }
}

interface LocalDBData {
  doctors: Doctor[];
  departments: Department[];
  bookings: Booking[];
  enquiries: Enquiry[];
  reviews?: Review[];
}

function readLocalDB(): LocalDBData {
  initializeLocalDB();
  try {
    const fileContent = fs.readFileSync(MOCK_DB_PATH, 'utf-8');
    return JSON.parse(fileContent) as LocalDBData;
  } catch (error) {
    console.error('Error reading local mock DB:', error);
    return { doctors: [], departments: [], bookings: [], enquiries: [] };
  }
}

function writeLocalDB(data: LocalDBData) {
  initializeLocalDB();
  try {
    fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing local mock DB:', error);
  }
}

// Database Connection Helper
let isConnected = false;
const MONGO_URI = process.env.MONGODB_URI || '';

export async function connectDB() {
  if (MONGO_URI) {
    if (isConnected) return true;
    try {
      await mongoose.connect(MONGO_URI);
      isConnected = true;
      console.log('Successfully connected to MongoDB Atlas.');
      return true;
    } catch (err) {
      console.error('Failed to connect to MongoDB Atlas, falling back to local storage:', err);
      return false;
    }
  }
  return false;
}

// Mongoose Schemas (used only if MongoDB is connected)
const DoctorSchema = new mongoose.Schema<Doctor>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  department: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  image: { type: String, required: true },
  experience: { type: String, required: true },
  education: { type: String, required: true },
  availability: [String],
  bio: { type: String, required: true }
});

const DepartmentSchema = new mongoose.Schema<Department>({
  id: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  services: [String],
  icon: { type: String, required: true }
});

const BookingSchema = new mongoose.Schema<Booking>({
  id: { type: String, required: true, unique: true },
  patientName: { type: String, required: true },
  patientEmail: { type: String, required: true },
  patientPhone: { type: String, required: true },
  department: { type: String, required: true },
  doctorId: { type: String, required: true },
  doctorName: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  symptoms: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'cancelled', 'completed'], default: 'pending' },
  createdAt: { type: String, default: () => new Date().toISOString() }
});

const EnquirySchema = new mongoose.Schema<Enquiry>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: String, default: () => new Date().toISOString() }
});

const ReviewSchema = new mongoose.Schema<Review>({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  rating: { type: Number, required: true },
  text: { type: String, required: true },
  avatarColor: { type: String, required: true },
  createdAt: { type: String, default: () => new Date().toISOString() }
});

const MongoDoctor = mongoose.models.Doctor || mongoose.model('Doctor', DoctorSchema);
const MongoDepartment = mongoose.models.Department || mongoose.model('Department', DepartmentSchema);
const MongoBooking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
const MongoEnquiry = mongoose.models.Enquiry || mongoose.model('Enquiry', EnquirySchema);
const MongoReview = mongoose.models.Review || mongoose.model('Review', ReviewSchema);

// Data Access Layer Methods
export async function getDoctors(): Promise<Doctor[]> {
  const isMongo = await connectDB();
  if (isMongo) {
    const docs = await MongoDoctor.find({});
    if (docs.length === 0) {
      // Seed initial data
      await MongoDoctor.insertMany(DEFAULT_DOCTORS);
      return DEFAULT_DOCTORS;
    }
    return docs.map(d => d.toObject());
  } else {
    const db = readLocalDB();
    return db.doctors;
  }
}

export async function saveDoctor(doctor: Doctor): Promise<Doctor> {
  const isMongo = await connectDB();
  if (isMongo) {
    await MongoDoctor.findOneAndUpdate({ id: doctor.id }, doctor, { upsert: true });
    return doctor;
  } else {
    const db = readLocalDB();
    const index = db.doctors.findIndex((d) => d.id === doctor.id);
    if (index >= 0) {
      db.doctors[index] = doctor;
    } else {
      db.doctors.push(doctor);
    }
    writeLocalDB(db);
    return doctor;
  }
}

export async function deleteDoctor(id: string): Promise<boolean> {
  const isMongo = await connectDB();
  if (isMongo) {
    const result = await MongoDoctor.deleteOne({ id });
    return result.deletedCount > 0;
  } else {
    const db = readLocalDB();
    const filtered = db.doctors.filter((d) => d.id !== id);
    if (filtered.length !== db.doctors.length) {
      db.doctors = filtered;
      writeLocalDB(db);
      return true;
    }
    return false;
  }
}

export async function getDepartments(): Promise<Department[]> {
  const isMongo = await connectDB();
  if (isMongo) {
    const depts = await MongoDepartment.find({});
    if (depts.length === 0) {
      await MongoDepartment.insertMany(DEFAULT_DEPARTMENTS);
      return DEFAULT_DEPARTMENTS;
    }
    return depts.map(d => d.toObject());
  } else {
    const db = readLocalDB();
    return db.departments;
  }
}

export async function saveDepartment(dept: Department): Promise<Department> {
  const isMongo = await connectDB();
  if (isMongo) {
    await MongoDepartment.findOneAndUpdate({ id: dept.id }, dept, { upsert: true });
    return dept;
  } else {
    const db = readLocalDB();
    const index = db.departments.findIndex((d) => d.id === dept.id);
    if (index >= 0) {
      db.departments[index] = dept;
    } else {
      db.departments.push(dept);
    }
    writeLocalDB(db);
    return dept;
  }
}

export async function getBookings(): Promise<Booking[]> {
  const isMongo = await connectDB();
  if (isMongo) {
    const bookings = await MongoBooking.find({}).sort({ createdAt: -1 });
    return bookings.map(b => b.toObject());
  } else {
    const db = readLocalDB();
    // Sort by createdAt desc
    return [...db.bookings].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

export async function saveBooking(booking: Booking): Promise<Booking> {
  const isMongo = await connectDB();
  if (isMongo) {
    await MongoBooking.findOneAndUpdate({ id: booking.id }, booking, { upsert: true });
    return booking;
  } else {
    const db = readLocalDB();
    const index = db.bookings.findIndex((b) => b.id === booking.id);
    if (index >= 0) {
      db.bookings[index] = booking;
    } else {
      db.bookings.push(booking);
    }
    writeLocalDB(db);
    return booking;
  }
}

export async function updateBookingStatus(id: string, status: Booking['status']): Promise<boolean> {
  const isMongo = await connectDB();
  if (isMongo) {
    const result = await MongoBooking.updateOne({ id }, { status });
    return result.modifiedCount > 0;
  } else {
    const db = readLocalDB();
    const index = db.bookings.findIndex((b) => b.id === id);
    if (index >= 0) {
      db.bookings[index].status = status;
      writeLocalDB(db);
      return true;
    }
    return false;
  }
}

export async function deleteBooking(id: string): Promise<boolean> {
  const isMongo = await connectDB();
  if (isMongo) {
    const result = await MongoBooking.deleteOne({ id });
    return result.deletedCount > 0;
  } else {
    const db = readLocalDB();
    const filtered = db.bookings.filter((b) => b.id !== id);
    if (filtered.length !== db.bookings.length) {
      db.bookings = filtered;
      writeLocalDB(db);
      return true;
    }
    return false;
  }
}

export async function getEnquiries(): Promise<Enquiry[]> {
  const isMongo = await connectDB();
  if (isMongo) {
    const enqs = await MongoEnquiry.find({}).sort({ createdAt: -1 });
    return enqs.map(e => e.toObject());
  } else {
    const db = readLocalDB();
    return [...db.enquiries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

export async function saveEnquiry(enquiry: Enquiry): Promise<Enquiry> {
  const isMongo = await connectDB();
  if (isMongo) {
    await MongoEnquiry.findOneAndUpdate({ id: enquiry.id }, enquiry, { upsert: true });
    return enquiry;
  } else {
    const db = readLocalDB();
    const index = db.enquiries.findIndex((e) => e.id === enquiry.id);
    if (index >= 0) {
      db.enquiries[index] = enquiry;
    } else {
      db.enquiries.push(enquiry);
    }
    writeLocalDB(db);
    return enquiry;
  }
}

export async function getReviews(): Promise<Review[]> {
  const isMongo = await connectDB();
  if (isMongo) {
    const reviews = await MongoReview.find({}).sort({ createdAt: -1 });
    if (reviews.length === 0) {
      await MongoReview.insertMany(DEFAULT_REVIEWS);
      return DEFAULT_REVIEWS;
    }
    return reviews.map(r => r.toObject());
  } else {
    const db = readLocalDB();
    if (!db.reviews || db.reviews.length === 0) {
      db.reviews = DEFAULT_REVIEWS;
      writeLocalDB(db);
    }
    return [...db.reviews].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

export async function saveReview(review: Review): Promise<Review> {
  const isMongo = await connectDB();
  if (isMongo) {
    await MongoReview.findOneAndUpdate({ id: review.id }, review, { upsert: true });
    return review;
  } else {
    const db = readLocalDB();
    if (!db.reviews) {
      db.reviews = [];
    }
    const index = db.reviews.findIndex((r) => r.id === review.id);
    if (index >= 0) {
      db.reviews[index] = review;
    } else {
      db.reviews.push(review);
    }
    writeLocalDB(db);
    return review;
  }
}
