import { db } from './db';
import { 
  users, salons, services
} from '@shared/schema';
import { sql } from 'drizzle-orm';
import { hashPassword } from './auth';

export async function initializeDatabase() {
  console.log("Checking if database needs initialization...");

  try {
    // Check if we already have users using SQL directly
    const result = await db.execute(sql`SELECT COUNT(*) FROM users`);
    const count = Number(result.rows[0]?.count || 0);
    
    if (count > 0) {
      console.log("Database already has users, skipping initialization.");
      return;
    }

    console.log("Initializing database with sample data...");

    // Hash passwords for security
    const adminPassword = await hashPassword('admin123');
    const ownerPassword = await hashPassword('password123');
    const customerPassword = await hashPassword('password123');

    // Add admin user
    const adminResult = await db.execute(sql`
      INSERT INTO users (username, password, email, full_name, phone, role, preferred_language, created_at) 
      VALUES ('admin', ${adminPassword}, 'admin@jamaalaki.sa', 'Admin User', '+966501234567', 'admin', 'en', NOW())
      RETURNING id
    `);
    const adminId = adminResult.rows[0].id;

    // Add salon owner
    const ownerResult = await db.execute(sql`
      INSERT INTO users (username, password, email, full_name, phone, role, preferred_language, created_at) 
      VALUES ('salonowner1', ${ownerPassword}, 'owner@elegancespa.sa', 'Sarah Al-Qahtani', '+966501234568', 'salon_owner', 'ar', NOW())
      RETURNING id
    `);
    const ownerId = ownerResult.rows[0].id;

    // Add customer
    await db.execute(sql`
      INSERT INTO users (username, password, email, full_name, phone, role, preferred_language, created_at) 
      VALUES ('customer1', ${customerPassword}, 'customer@example.com', 'Fatima Abdullah', '+966501234569', 'customer', 'en', NOW())
    `);

    // Add first salon
    const salon1Result = await db.execute(sql`
      INSERT INTO salons (owner_id, name_en, name_ar, description_en, description_ar, address, city, email, phone, 
                         is_ladies_only, has_private_rooms, is_hijab_friendly, is_verified, rating, price_range, created_at, image_url) 
      VALUES (${ownerId}, 'The Beauty Elegance Spa', 'ذا بيوتي للسبا الفاخر', 
              'Luxury spa and beauty salon with a focus on personalized care.', 
              'صالون سبا وتجميل فاخر مع التركيز على العناية الشخصية.',
              'King Fahd Road, Riyadh', 'Riyadh', 'contact@thebeauty.sa', '+966512345678',
              true, true, true, true, 4.8, 'premium', NOW(),
              'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=800&q=80')
      RETURNING id
    `);
    const salon1Id = salon1Result.rows[0].id;

    // Add second salon
    const salon2Result = await db.execute(sql`
      INSERT INTO salons (owner_id, name_en, name_ar, description_en, description_ar, address, city, email, phone, 
                         is_ladies_only, has_private_rooms, is_hijab_friendly, is_verified, rating, price_range, created_at) 
      VALUES (${ownerId}, 'The Beauty Lounge', 'ذا بيوتي لاونج', 
              'Contemporary beauty treatments in a stylish environment.', 
              'علاجات تجميل معاصرة في بيئة أنيقة.',
              'Tahlia Street, Jeddah', 'Jeddah', 'info@thebeauty.sa', '+966512345679',
              true, true, true, true, 4.6, 'premium', NOW(),
              'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80')
      RETURNING id
    `);
    const salon2Id = salon2Result.rows[0].id;

    // Add services for first salon
    await db.execute(sql`
      INSERT INTO services (salon_id, name_en, name_ar, description_en, description_ar, price, duration, category, image_url)
      VALUES 
        (${salon1Id}, 'Luxury Facial Treatment', 'علاج الوجه الفاخر', 
         'Complete facial treatment with premium products', 'علاج كامل للوجه باستخدام منتجات ممتازة',
         450, 60, 'facial', 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'),
        
        (${salon1Id}, 'Hair Cut & Styling', 'قص وتصفيف الشعر',
         'Professional haircut and styling', 'قص وتصفيف الشعر الاحترافي',
         200, 45, 'haircuts', 'https://images.unsplash.com/photo-1560869713-ba92fec5b462?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'),
        
        (${salon1Id}, 'Manicure & Pedicure', 'مانيكير وباديكير',
         'Complete nail care for hands and feet', 'عناية كاملة بالأظافر لليدين والقدمين',
         180, 60, 'nails', 'https://images.unsplash.com/photo-1604654894610-df63bc536371?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'),
        
        (${salon1Id}, 'Bridal Makeup', 'مكياج العروس',
         'Complete bridal makeup with trial session', 'مكياج عروس كامل مع جلسة تجريبية',
         1200, 120, 'makeup', 'https://images.unsplash.com/photo-1579187707643-35646d22b596?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')
    `);

    // Add services for second salon
    await db.execute(sql`
      INSERT INTO services (salon_id, name_en, name_ar, description_en, description_ar, price, duration, category, image_url)
      VALUES 
        (${salon2Id}, 'Color & Highlights', 'صبغ وهايلايت',
         'Professional hair coloring and highlights', 'صبغ الشعر واضافة هايلايت محترف',
         350, 90, 'coloring', 'https://images.unsplash.com/photo-1635623225803-cfc1aee8f57b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'),
        
        (${salon2Id}, 'Relaxing Massage', 'مساج استرخاء',
         'Full body relaxing massage with essential oils', 'مساج استرخاء للجسم كامل مع زيوت أساسية',
         300, 60, 'massage', 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'),
        
        (${salon2Id}, 'Eyebrow Threading', 'رسم الحواجب بالخيط',
         'Precise eyebrow shaping using the threading technique', 'تشكيل دقيق للحواجب باستخدام تقنية الخيط',
         60, 15, 'facial', 'https://images.unsplash.com/photo-1560342599-d8b4752d9161?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')
    `);

    console.log("Database successfully initialized with sample data.");
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}