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
  }
];

const DEFAULT_DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Sarah Jenkins',
    specialty: 'Senior Orthopedic Surgeon',
    department: 'orthopedics',
    email: 'sarah.jenkins@vmc.com',
    phone: '+1 (555) 019-2834',
    image: '/images/doc1.jpg',
    experience: '14+ Years',
    education: 'MD, FACS - Johns Hopkins University',
    availability: ['Monday', 'Wednesday', 'Thursday'],
    bio: 'Dr. Jenkins specializes in joint reconstruction and minimally invasive arthroscopic surgeries. She is dedicated to helping patients return to their active lifestyles.'
  },
  {
    id: 'doc-2',
    name: 'Dr. Michael Chen',
    specialty: 'Pediatric Specialist',
    department: 'pediatrics',
    email: 'michael.chen@vmc.com',
    phone: '+1 (555) 019-3982',
    image: '/images/doc2.jpg',
    experience: '10+ Years',
    education: 'MD - Harvard Medical School',
    availability: ['Tuesday', 'Wednesday', 'Friday'],
    bio: 'Dr. Chen is passionate about early childhood development and preventive care. He strives to make every clinic visit comfortable and stress-free for kids.'
  },
  {
    id: 'doc-3',
    name: 'Dr. Emily Watson',
    specialty: 'ENT Consultant',
    department: 'ent',
    email: 'emily.watson@vmc.com',
    phone: '+1 (555) 019-4721',
    image: '/images/doc3.jpg',
    experience: '12+ Years',
    education: 'MD - University of California, San Francisco',
    availability: ['Monday', 'Tuesday', 'Friday'],
    bio: 'Dr. Watson has extensive expertise in endoscopic sinus surgery and pediatric otolaryngology. She is committed to providing evidence-based, compassionate care.'
  },
  {
    id: 'doc-4',
    name: 'Dr. Robert Carter',
    specialty: 'Sports Medicine & Joint Care',
    department: 'orthopedics',
    email: 'robert.carter@vmc.com',
    phone: '+1 (555) 019-5831',
    image: '/images/doc4.jpg',
    experience: '8+ Years',
    education: 'MD - Stanford Medical School',
    availability: ['Tuesday', 'Thursday', 'Friday'],
    bio: 'Dr. Carter treats a wide range of athletic injuries, specializing in shoulder, hip, and knee reconstruction. He works closely with physical therapists to design personalized recovery programs.'
  },
  {
    id: 'doc-5',
    name: 'Dr. Jessica Taylor',
    specialty: 'Pediatric Cardiologist',
    department: 'pediatrics',
    email: 'jessica.taylor@vmc.com',
    phone: '+1 (555) 019-6294',
    image: '/images/doc5.jpg',
    experience: '15+ Years',
    education: 'MD - Yale School of Medicine',
    availability: ['Monday', 'Thursday'],
    bio: 'Dr. Taylor specializes in pediatric heart conditions and congenital cardiac care, bringing advanced therapeutic solutions with a gentle touch.'
  },
  {
    id: 'doc-6',
    name: 'Dr. David Kim',
    specialty: 'Otology & Ear Specialist',
    department: 'ent',
    email: 'david.kim@vmc.com',
    phone: '+1 (555) 019-7235',
    image: '/images/doc6.jpg',
    experience: '9+ Years',
    education: 'MD - Columbia University',
    availability: ['Wednesday', 'Friday'],
    bio: 'Dr. Kim is focused on hearing preservation, chronic ear infections, cochlear implants, and balance disorders. He utilizes precision micro-surgery techniques.'
  },
  {
    id: 'doc-7',
    name: 'Dr. Lisa Anderson',
    specialty: 'Spine Surgeon',
    department: 'orthopedics',
    email: 'lisa.anderson@vmc.com',
    phone: '+1 (555) 019-8239',
    image: '/images/doc7.jpg',
    experience: '16+ Years',
    education: 'MD - University of Pennsylvania',
    availability: ['Wednesday', 'Thursday'],
    bio: 'Dr. Anderson is a world-renowned expert in spinal deformity correction, herniated discs, spinal fusion, and motion-preserving spine surgeries.'
  },
  {
    id: 'doc-8',
    name: 'Dr. James Wilson',
    specialty: 'General Pediatrician',
    department: 'pediatrics',
    email: 'james.wilson@vmc.com',
    phone: '+1 (555) 019-9284',
    image: '/images/doc8.jpg',
    experience: '11+ Years',
    education: 'MD - Duke University School of Medicine',
    availability: ['Tuesday', 'Thursday'],
    bio: 'Dr. Wilson provides comprehensive care for infants, children, and teens. He has a special interest in asthma management and childhood nutrition counseling.'
  },
  {
    id: 'doc-9',
    name: 'Dr. Olivia Martinez',
    specialty: 'Rhinology & Sinus Expert',
    department: 'ent',
    email: 'olivia.martinez@vmc.com',
    phone: '+1 (555) 019-1038',
    image: '/images/doc9.jpg',
    experience: '13+ Years',
    education: 'MD - Northwestern University',
    availability: ['Monday', 'Wednesday'],
    bio: 'Dr. Martinez specializes in complex sinus disorders, nasal airway obstruction, allergy treatments, and advanced endoscopic skull base surgeries.'
  },
  {
    id: 'doc-10',
    name: 'Dr. William Thomas',
    specialty: 'Orthopedic Trauma Specialist',
    department: 'orthopedics',
    email: 'william.thomas@vmc.com',
    phone: '+1 (555) 019-2047',
    image: '/images/doc10.jpg',
    experience: '12+ Years',
    education: 'MD - University of Chicago',
    availability: ['Monday', 'Friday'],
    bio: 'Dr. Thomas treats complex fractures, non-unions, and bone infections. He is dedicated to helping patients recover optimal function after severe traumatic injuries.'
  },
  {
    id: 'doc-11',
    name: 'Dr. Sophia Patel',
    specialty: 'Pediatric Allergist & Immunologist',
    department: 'pediatrics',
    email: 'sophia.patel@vmc.com',
    phone: '+1 (555) 019-3058',
    image: '/images/doc11.jpg',
    experience: '7+ Years',
    education: 'MD - Cornell University',
    availability: ['Tuesday', 'Friday'],
    bio: 'Dr. Patel helps kids manage eczema, food allergies, environmental allergies, and immune disorders. She is dedicated to improving quality of life for families.'
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
