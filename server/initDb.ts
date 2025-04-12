
import { db } from './db';
import { 
  users, salons, services
} from '@shared/schema';
import { sql } from 'drizzle-orm';
import { hashPassword } from './auth';

export async function initializeDatabase() {
  console.log("Checking if database needs initialization...");

  try {
    const result = await db.execute(sql`SELECT COUNT(*) FROM users`);
    const count = Number(result.rows[0]?.count || 0);
    
    if (count > 0) {
      console.log("Database already has users, skipping initialization.");
      return;
    }

    console.log("Initializing database with sample data...");

    // Create initial users
    const adminPassword = await hashPassword('admin123');
    const ownerPassword = await hashPassword('password123');
    const customerPassword = await hashPassword('password123');

    const adminResult = await db.execute(sql`
      INSERT INTO users (username, password, email, full_name, phone, role, preferred_language, created_at) 
      VALUES ('admin', ${adminPassword}, 'admin@jamaalaki.sa', 'Admin User', '+966501234567', 'admin', 'en', NOW())
      RETURNING id
    `);
    const adminId = adminResult.rows[0].id;

    const ownerResult = await db.execute(sql`
      INSERT INTO users (username, password, email, full_name, phone, role, preferred_language, created_at) 
      VALUES ('salonowner1', ${ownerPassword}, 'owner@elegancespa.sa', 'Sarah Al-Qahtani', '+966501234568', 'salon_owner', 'ar', NOW())
      RETURNING id
    `);
    const ownerId = ownerResult.rows[0].id;

    await db.execute(sql`
      INSERT INTO users (username, password, email, full_name, phone, role, preferred_language, created_at) 
      VALUES ('customer1', ${customerPassword}, 'customer@example.com', 'Fatima Abdullah', '+966501234569', 'customer', 'en', NOW())
    `);

    // Add salons with diverse services
    const salon1Result = await db.execute(sql`
      INSERT INTO salons (owner_id, name_en, name_ar, description_en, description_ar, address, city, email, phone, 
                         is_ladies_only, has_private_rooms, is_hijab_friendly, is_verified, rating, price_range, created_at, image_url) 
      VALUES (${ownerId}, 'Elegance Beauty Lounge', 'صالون الأناقة', 
              'Premium beauty services in an elegant atmosphere', 
              'خدمات تجميل راقية في أجواء أنيقة',
              'King Fahd Road, Riyadh', 'Riyadh', 'contact@elegance.sa', '+966512345678',
              true, true, true, true, 4.8, 'premium', NOW(),
              'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1350&q=80')
      RETURNING id
    `);
    const salon1Id = salon1Result.rows[0].id;

    const salon2Result = await db.execute(sql`
      INSERT INTO salons (owner_id, name_en, name_ar, description_en, description_ar, address, city, email, phone, 
                         is_ladies_only, has_private_rooms, is_hijab_friendly, is_verified, rating, price_range, created_at, image_url) 
      VALUES (${ownerId}, 'Serenity Spa & Beauty', 'سيرينيتي سبا وبيوتي', 
              'Luxury spa treatments and beauty services', 
              'علاجات سبا فاخرة وخدمات تجميل',
              'Tahlia Street, Jeddah', 'Jeddah', 'info@serenityspa.sa', '+966512345679',
              true, true, true, true, 4.7, 'luxury', NOW(),
              'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=1350&q=80')
      RETURNING id
    `);
    const salon2Id = salon2Result.rows[0].id;

    const salon3Result = await db.execute(sql`
      INSERT INTO salons (owner_id, name_en, name_ar, description_en, description_ar, address, city, email, phone, 
                         is_ladies_only, has_private_rooms, is_hijab_friendly, is_verified, rating, price_range, created_at, image_url) 
      VALUES (${ownerId}, 'Royal Nails & Spa', 'رويال نيلز آند سبا', 
              'Specialized nail care and spa services', 
              'خدمات متخصصة للعناية بالأظافر والسبا',
              'Prince Sultan Road, Al Khobar', 'Al Khobar', 'book@royalnails.sa', '+966512345680',
              true, false, true, true, 4.6, 'mid-range', NOW(),
              'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=1350&q=80')
      RETURNING id
    `);
    const salon3Id = salon3Result.rows[0].id;

    const salon4Result = await db.execute(sql`
      INSERT INTO salons (owner_id, name_en, name_ar, description_en, description_ar, address, city, email, phone, 
                         is_ladies_only, has_private_rooms, is_hijab_friendly, is_verified, rating, price_range, created_at, image_url) 
      VALUES (${ownerId}, 'Glow Beauty Center', 'مركز جلو للتجميل', 
              'Modern beauty treatments and skincare services', 
              'علاجات تجميل عصرية وخدمات العناية بالبشرة',
              'Al Olaya Street, Riyadh', 'Riyadh', 'info@glowbeauty.sa', '+966512345681',
              true, true, true, true, 4.9, 'premium', NOW(),
              'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1350&q=80')
      RETURNING id
    `);
    const salon4Id = salon4Result.rows[0].id;

    // Add Al Ahsa salons
    const alahsaSalons = [
      {
        name: 'Glamour Touch Salon',
        address: 'Hofuf, Al Ahsa',
        phone: '050-123-4567',
        services: 'Haircut, Makeup, Facial, Moroccan Bath, Hair Color, Nail Art',
        instagram: '@glamourtouch_ahsa'
      },
      {
        name: 'Al Jawhara Beauty Center',
        address: 'Al Mubarraz',
        phone: '053-987-6543',
        services: 'Bridal Makeup, Threading, Facial, Henna, Pedicure',
        instagram: '@aljawhara_beauty'
      },
      {
        name: 'Maison de Beauté',
        address: 'Al Hofuf Central',
        phone: '055-332-1144',
        services: 'Hair Styling, Keratin, Lash Extensions, Waxing, Microblading',
        instagram: '@maisondebeaute_ksa'
      },
      {
        name: 'Layali Zainab Salon',
        address: 'Al Khalidiyah',
        phone: '050-778-8899',
        services: 'Facial, Manicure, Bridal Packages, Hair Spa, Waxing',
        instagram: '@layali_zainab'
      },
      {
        name: 'Bloom Lounge',
        address: 'Al Uqair Road',
        phone: '057-119-2288',
        services: 'Organic Facials, Nail Extensions, Hair Color, Makeup',
        instagram: '@bloomlounge_ahsa'
      }
    ];

    for (const salon of alahsaSalons) {
      const result = await db.execute(sql`
        INSERT INTO salons (owner_id, name_en, name_ar, description_en, description_ar, address, city, phone, 
                           is_ladies_only, has_private_rooms, is_hijab_friendly, is_verified, rating, price_range, created_at, image_url) 
        VALUES (
          ${ownerId},
          ${salon.name},
          ${salon.name},
          ${salon.services},
          ${salon.services},
          ${salon.address},
          'Al Ahsa',
          ${salon.phone},
          true,
          true,
          true,
          true,
          4.5,
          'mid-range',
          NOW(),
          'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=1350&q=80'
        )
        RETURNING id
      `);
      
      // Add some basic services for each salon
      const servicesList = salon.services.split(', ');
      for (const service of servicesList) {
        await db.execute(sql`
          INSERT INTO services (salon_id, name_en, name_ar, description_en, description_ar, price, duration, category, image_url)
          VALUES (
            ${result.rows[0].id},
            ${service},
            ${service},
            'Professional ${service} service',
            'خدمة ${service} احترافية',
            ${Math.floor(Math.random() * (500 - 100) + 100)},
            ${Math.floor(Math.random() * (120 - 30) + 30)},
            'beauty',
            'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=1350&q=80'
          )
        `);
      }
    }

    // Add services for Elegance Beauty Lounge
    await db.execute(sql`
      INSERT INTO services (salon_id, name_en, name_ar, description_en, description_ar, price, duration, category, image_url)
      VALUES 
        (${salon1Id}, 'Premium Facial Treatment', 'جلسة تنظيف بشرة فاخرة', 
         'Luxurious facial treatment with premium products', 'علاج فاخر للوجه باستخدام منتجات متميزة',
         650, 90, 'facial', 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1350&q=80'),
        
        (${salon1Id}, 'Professional Hair Styling', 'تصفيف شعر احترافي',
         'Complete hair styling service', 'خدمة تصفيف شعر متكاملة',
         350, 60, 'hair', 'https://images.unsplash.com/photo-1522336572468-97b06e8ef143?auto=format&fit=crop&w=1350&q=80'),
        
        (${salon1Id}, 'Bridal Package', 'باقة العروس',
         'Complete bridal beauty package', 'باقة تجميل متكاملة للعروس',
         3000, 240, 'bridal', 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=1350&q=80')
    `);

    // Add services for Serenity Spa
    await db.execute(sql`
      INSERT INTO services (salon_id, name_en, name_ar, description_en, description_ar, price, duration, category, image_url)
      VALUES 
        (${salon2Id}, 'Aromatherapy Massage', 'مساج بالزيوت العطرية',
         'Relaxing massage with essential oils', 'مساج استرخائي بالزيوت الأساسية',
         400, 60, 'massage', 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1350&q=80'),
        
        (${salon2Id}, 'Anti-Aging Facial', 'جلسة نضارة ومكافحة الشيخوخة',
         'Advanced anti-aging facial treatment', 'علاج متقدم للوجه لمكافحة علامات التقدم في السن',
         800, 90, 'facial', 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1350&q=80'),
        
        (${salon2Id}, 'Body Scrub & Wrap', 'تقشير وتغليف الجسم',
         'Full body scrub and wrap treatment', 'علاج تقشير وتغليف كامل للجسم',
         500, 90, 'body', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1350&q=80')
    `);

    // Add services for Royal Nails
    await db.execute(sql`
      INSERT INTO services (salon_id, name_en, name_ar, description_en, description_ar, price, duration, category, image_url)
      VALUES 
        (${salon3Id}, 'Luxury Manicure', 'مانيكير فاخر',
         'Premium manicure with nail art', 'مانيكير فاخر مع رسومات أظافر',
         200, 60, 'nails', 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1350&q=80'),
        
        (${salon3Id}, 'Deluxe Pedicure', 'باديكير فاخر',
         'Deluxe pedicure with foot massage', 'باديكير فاخر مع مساج للقدمين',
         250, 75, 'nails', 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=1350&q=80'),
        
        (${salon3Id}, 'Gel Extensions', 'تركيب أظافر جل',
         'Professional gel nail extensions', 'تركيب أظافر جل احترافي',
         350, 90, 'nails', 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1350&q=80')
    `);

    // Add services for Glow Beauty Center
    await db.execute(sql`
      INSERT INTO services (salon_id, name_en, name_ar, description_en, description_ar, price, duration, category, image_url)
      VALUES 
        (${salon4Id}, 'Diamond Facial', 'فيشل الماس',
         'Premium diamond facial treatment', 'علاج الوجه بالماس الفاخر',
         900, 90, 'facial', 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1350&q=80'),
        
        (${salon4Id}, 'Keratin Treatment', 'علاج الكيراتين',
         'Professional keratin hair treatment', 'علاج الشعر بالكيراتين الاحترافي',
         800, 180, 'hair', 'https://images.unsplash.com/photo-1522336572468-97b06e8ef143?auto=format&fit=crop&w=1350&q=80'),
        
        (${salon4Id}, 'Micro-needling', 'ميكرونيدلنج',
         'Advanced skin rejuvenation treatment', 'علاج متقدم لتجديد البشرة',
         700, 60, 'skin', 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1350&q=80')
    `);

    console.log("Database successfully initialized with sample data.");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}
