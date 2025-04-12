import { db } from './db';
import { 
  users, salons, services, 
  bookingStatusEnum, userRoleEnum
} from '@shared/schema';
import { eq } from 'drizzle-orm';

export async function initializeDatabase() {
  console.log("Checking if database needs initialization...");

  // Check if we already have users
  const existingUsers = await db.select({ count: { expression: 'count(*)' } }).from(users);
  if (existingUsers && existingUsers.length > 0 && Number(existingUsers[0].count) > 0) {
    console.log("Database already has users, skipping initialization.");
    return;
  }

  console.log("Initializing database with sample data...");

  // Add users
  const [adminUser] = await db.insert(users).values({
    username: 'admin',
    password: 'admin123', // In a real app, this would be hashed
    email: 'admin@glamhaven.sa',
    fullName: 'Admin User',
    phone: '+966501234567',
    role: 'admin',
    loyaltyPoints: 0,
    preferredLanguage: 'en',
  }).returning();

  const [salonOwner1] = await db.insert(users).values({
    username: 'salonowner1',
    password: 'password123', // In a real app, this would be hashed
    email: 'owner@elegancespa.sa',
    fullName: 'Sarah Al-Qahtani',
    phone: '+966501234568',
    role: 'salon_owner',
    loyaltyPoints: 0,
    preferredLanguage: 'ar',
  }).returning();

  const [customer1] = await db.insert(users).values({
    username: 'customer1',
    password: 'password123', // In a real app, this would be hashed
    email: 'customer@example.com',
    fullName: 'Fatima Abdullah',
    phone: '+966501234569',
    role: 'customer',
    loyaltyPoints: 150,
    preferredLanguage: 'en',
  }).returning();

  // Add salons
  const [salon1] = await db.insert(salons).values({
    ownerId: salonOwner1.id,
    nameEn: 'Elegance Spa & Beauty',
    nameAr: 'إيليغانس سبا وبيوتي',
    descriptionEn: 'Luxury spa and beauty salon with a focus on personalized care.',
    descriptionAr: 'صالون سبا وتجميل فاخر مع التركيز على العناية الشخصية.',
    address: 'King Fahd Road, Riyadh',
    city: 'Riyadh',
    email: 'contact@elegancespa.sa',
    phone: '+966512345678',
    isLadiesOnly: true,
    hasPrivateRooms: true,
    isHijabFriendly: true,
    openingHours: '09:00-21:00',
    rating: 4.8,
    priceRange: 'premium',
    isVerified: true,
  }).returning();

  const [salon2] = await db.insert(salons).values({
    ownerId: salonOwner1.id,
    nameEn: 'Modern Beauty Lounge',
    nameAr: 'صالون الجمال العصري',
    descriptionEn: 'Contemporary beauty treatments in a stylish environment.',
    descriptionAr: 'علاجات تجميل معاصرة في بيئة أنيقة.',
    address: 'Tahlia Street, Jeddah',
    city: 'Jeddah',
    email: 'info@modernbeauty.sa',
    phone: '+966512345679',
    isLadiesOnly: true,
    hasPrivateRooms: true,
    isHijabFriendly: true,
    openingHours: '10:00-22:00',
    rating: 4.5,
    priceRange: 'mid-range',
    isVerified: true,
  }).returning();

  // Add services for Salon 1
  await db.insert(services).values([
    {
      salonId: salon1.id,
      nameEn: 'Luxury Facial Treatment',
      nameAr: 'علاج الوجه الفاخر',
      descriptionEn: 'Complete facial treatment with premium products',
      descriptionAr: 'علاج كامل للوجه باستخدام منتجات ممتازة',
      price: 450,
      duration: 60,
      category: 'facial',
      imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    },
    {
      salonId: salon1.id,
      nameEn: 'Hair Cut & Styling',
      nameAr: 'قص وتصفيف الشعر',
      descriptionEn: 'Professional haircut and styling',
      descriptionAr: 'قص وتصفيف الشعر الاحترافي',
      price: 200,
      duration: 45,
      category: 'haircuts',
      imageUrl: 'https://images.unsplash.com/photo-1560869713-ba92fec5b462?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    },
    {
      salonId: salon1.id,
      nameEn: 'Manicure & Pedicure',
      nameAr: 'مانيكير وباديكير',
      descriptionEn: 'Complete nail care for hands and feet',
      descriptionAr: 'عناية كاملة بالأظافر لليدين والقدمين',
      price: 180,
      duration: 60,
      category: 'nails',
      imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    },
    {
      salonId: salon1.id,
      nameEn: 'Bridal Makeup',
      nameAr: 'مكياج العروس',
      descriptionEn: 'Complete bridal makeup with trial session',
      descriptionAr: 'مكياج عروس كامل مع جلسة تجريبية',
      price: 1200,
      duration: 120,
      category: 'makeup',
      imageUrl: 'https://images.unsplash.com/photo-1579187707643-35646d22b596?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    },
  ]);

  // Add services for Salon 2
  await db.insert(services).values([
    {
      salonId: salon2.id,
      nameEn: 'Color & Highlights',
      nameAr: 'صبغ وهايلايت',
      descriptionEn: 'Professional hair coloring and highlights',
      descriptionAr: 'صبغ الشعر واضافة هايلايت محترف',
      price: 350,
      duration: 90,
      category: 'coloring',
      imageUrl: 'https://images.unsplash.com/photo-1635623225803-cfc1aee8f57b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    },
    {
      salonId: salon2.id,
      nameEn: 'Relaxing Massage',
      nameAr: 'مساج استرخاء',
      descriptionEn: 'Full body relaxing massage with essential oils',
      descriptionAr: 'مساج استرخاء للجسم كامل مع زيوت أساسية',
      price: 300,
      duration: 60,
      category: 'massage',
      imageUrl: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    },
    {
      salonId: salon2.id,
      nameEn: 'Eyebrow Threading',
      nameAr: 'رسم الحواجب بالخيط',
      descriptionEn: 'Precise eyebrow shaping using the threading technique',
      descriptionAr: 'تشكيل دقيق للحواجب باستخدام تقنية الخيط',
      price: 60,
      duration: 15,
      category: 'facial',
      imageUrl: 'https://images.unsplash.com/photo-1560342599-d8b4752d9161?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    },
  ]);

  console.log("Database successfully initialized with sample data.");
}