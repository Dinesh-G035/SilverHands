import { User } from '../models/User.js';
import { Skill } from '../models/Skill.js';
import { Service } from '../models/Service.js';
import { Product } from '../models/Product.js';
import { Opportunity } from '../models/Opportunity.js';
import { Booking } from '../models/Booking.js';
import { Notification } from '../models/Notification.js';
import { Review } from '../models/Review.js';
import { logger } from '../utils/logger.js';
import { connectDB, disconnectDB } from '../config/db.js';

export async function seedDatabase(isStandalone = false) {
  try {
    if (isStandalone) {
      await connectDB();
      await User.deleteMany({});
      await Skill.deleteMany({});
      await Service.deleteMany({});
      await Product.deleteMany({});
      await Opportunity.deleteMany({});
      await Booking.deleteMany({});
      await Notification.deleteMany({});
      await Review.deleteMany({});
      logger.info('Cleared existing database records.');
    }

    const existingCount = await User.countDocuments();
    if (existingCount > 0 && !isStandalone) {
      logger.info(`Database already populated with ${existingCount} users. Auto-seed skipped.`);
      return;
    }

    logger.info('Seeding dynamic SilverHands database records...');

    // 1. Create Skills
    const skills = await Skill.create([
      {
        name: 'Traditional Tamil Cooking',
        category: 'Cooking',
        description: 'Authentic South Indian home meals, tiffin, and festival dishes.',
        suggestedPriceRange: { min: 300, max: 600, unit: 'hour' },
        icon: '🍲',
      },
      {
        name: 'Primary School Tutoring',
        category: 'Tutoring',
        description: 'Patient after-school teaching in Science, Math, and English.',
        suggestedPriceRange: { min: 250, max: 500, unit: 'hour' },
        icon: '📚',
      },
      {
        name: 'Blouse & Dress Stitching',
        category: 'Tailoring',
        description: 'Custom blouse tailoring, saree fall picco, and alterations.',
        suggestedPriceRange: { min: 350, max: 800, unit: 'item' },
        icon: '🧵',
      },
      {
        name: 'Home Gardening & Balcony Setup',
        category: 'Gardening',
        description: 'Organic kitchen gardening, plant care, and composting.',
        suggestedPriceRange: { min: 300, max: 700, unit: 'visit' },
        icon: '🌱',
      },
    ]);

    // 2. Create Users (Providers, Customers, Admin)
    const providerCook = await User.create({
      mobile: '9876543210',
      name: 'Lakshmi Ammal',
      role: 'provider',
      preferredLanguage: 'ta',
      profileImage: '',
      city: 'Chennai',
      locality: 'Mylapore',
      location: { type: 'Point', coordinates: [80.2676, 13.0339] },
      seniorMode: true,
      verificationStatus: { mobileVerified: true, identityVerified: true, experienceVerified: true },
      bio: '62-year-old home chef with 25 years of experience making traditional Tamil food and snacks.',
      yearsOfExperience: 25,
      availability: [
        { dayOfWeek: 'Monday', startTime: '09:00', endTime: '14:00' },
        { dayOfWeek: 'Wednesday', startTime: '09:00', endTime: '14:00' },
        { dayOfWeek: 'Saturday', startTime: '10:00', endTime: '16:00' },
      ],
    });

    const providerTailor = await User.create({
      mobile: '9876543211',
      name: 'Meenakshi Sundaram',
      role: 'provider',
      preferredLanguage: 'ta',
      profileImage: '',
      city: 'Chennai',
      locality: 'T. Nagar',
      location: { type: 'Point', coordinates: [80.2337, 13.0418] },
      seniorMode: false,
      verificationStatus: { mobileVerified: true, identityVerified: true, experienceVerified: true },
      bio: 'Master homemaker skilled in hand embroidery and custom blouse tailoring.',
      yearsOfExperience: 18,
    });

    const providerTutor = await User.create({
      mobile: '9876543212',
      name: 'Professor R. Krishnan',
      role: 'provider',
      preferredLanguage: 'en',
      profileImage: '',
      city: 'Bengaluru',
      locality: 'Jayanagar',
      location: { type: 'Point', coordinates: [77.5828, 12.9250] },
      seniorMode: true,
      verificationStatus: { mobileVerified: true, identityVerified: true, experienceVerified: true },
      bio: 'Retired college lecturer passionate about tutoring primary and middle school children.',
      yearsOfExperience: 35,
    });

    const customer1 = await User.create({
      mobile: '9123456789',
      name: 'Priya Sharma',
      role: 'customer',
      preferredLanguage: 'en',
      city: 'Chennai',
      locality: 'Adyar',
      location: { type: 'Point', coordinates: [80.2570, 13.0012] },
      verificationStatus: { mobileVerified: true, identityVerified: false, experienceVerified: false },
    });

    const adminUser = await User.create({
      mobile: '9999988888',
      name: 'Rajesh Kumar (Admin)',
      role: 'admin',
      preferredLanguage: 'en',
      city: 'Chennai',
      locality: 'Nungambakkam',
      location: { type: 'Point', coordinates: [80.2425, 13.0604] },
      verificationStatus: { mobileVerified: true, identityVerified: true, experienceVerified: true },
      bio: 'Platform Administrator & Trust & Safety Lead for SilverHands platform.',
    });

    // 3. Create Services
    const service1 = await Service.create({
      providerId: providerCook._id,
      title: 'Traditional Tamil Home Cooking & Catering',
      description: 'Authentic South Indian vegetarian home cooking classes and small batch event catering. Learn secrets of sambar powders and traditional tiffin items.',
      category: 'Cooking',
      skills: ['Traditional Tamil Cooking', 'Meal Prep'],
      priceType: 'hourly',
      price: 400,
      mode: 'offline',
      availability: providerCook.availability,
      images: [],
      language: 'ta',
      city: providerCook.city,
      locality: providerCook.locality,
      location: providerCook.location,
      yearsOfExperience: 25,
      status: 'published',
      moderationStatus: 'approved',
      rating: 4.9,
      reviewCount: 18,
    });

    const service2 = await Service.create({
      providerId: providerTailor._id,
      title: 'Custom Blouse Tailoring & Saree Alterations',
      description: 'Expert saree blouse stitching with lining, neck design piping, and saree fall picco at home.',
      category: 'Tailoring',
      skills: ['Blouse & Dress Stitching'],
      priceType: 'fixed',
      price: 550,
      mode: 'offline',
      images: [],
      language: 'ta',
      city: providerTailor.city,
      locality: providerTailor.locality,
      location: providerTailor.location,
      yearsOfExperience: 18,
      status: 'published',
      moderationStatus: 'approved',
      rating: 4.8,
      reviewCount: 12,
    });

    const service3 = await Service.create({
      providerId: providerTutor._id,
      title: 'Primary & Middle School Science & Math Tutoring',
      description: 'Patient after-school tutoring for CBSE and ICSE students. Online or home visits in Jayanagar.',
      category: 'Tutoring',
      skills: ['Primary School Tutoring'],
      priceType: 'hourly',
      price: 450,
      mode: 'both',
      images: [],
      language: 'en',
      city: providerTutor.city,
      locality: providerTutor.locality,
      location: providerTutor.location,
      yearsOfExperience: 35,
      status: 'published',
      moderationStatus: 'approved',
      rating: 5.0,
      reviewCount: 24,
    });

    // 4. Create Products
    await Product.create([
      {
        sellerId: providerCook._id,
        title: 'Homemade Authentic Avakai Mango Pickle (500g)',
        description: 'Made with traditional sesame oil, freshly ground spices, and sun-dried raw mangoes.',
        category: 'Food',
        price: 280,
        stock: 15,
        images: [],
        deliveryOptions: ['pickup', 'delivery'],
        rating: 4.9,
        reviewCount: 14,
        status: 'active',
        moderationStatus: 'approved',
      },
      {
        sellerId: providerTailor._id,
        title: 'Hand-embroidered Cotton Cushion Covers (Set of 2)',
        description: 'Pure cotton fabric featuring hand embroidery designs.',
        category: 'Handicrafts',
        price: 499,
        stock: 8,
        images: [],
        deliveryOptions: ['delivery'],
        rating: 4.7,
        reviewCount: 9,
        status: 'active',
        moderationStatus: 'approved',
      },
    ]);

    // 5. Create Opportunities
    await Opportunity.create([
      {
        title: 'Homemade Weekend Lunch Orders',
        description: 'High local demand for home-cooked traditional meals during weekends.',
        category: 'Cooking',
        demandLevel: 'high',
        estimatedEarningsRange: { min: 4000, max: 9000, unit: 'month' },
        requiredSkills: ['Traditional Tamil Cooking'],
        targetCities: ['Chennai', 'Bengaluru'],
        icon: '🍲',
        seniorFriendlyNote: 'Flexibility to accept only preferred batch numbers.',
      },
      {
        title: 'After-School Primary Tutoring Batches',
        description: 'Parents searching for reliable mentors in your neighborhood.',
        category: 'Tutoring',
        demandLevel: 'high',
        estimatedEarningsRange: { min: 5000, max: 12000, unit: 'month' },
        requiredSkills: ['Primary School Tutoring'],
        targetCities: ['Chennai', 'Bengaluru', 'Hyderabad'],
        icon: '📚',
        seniorFriendlyNote: 'Teach from your own living room.',
      },
    ]);

    // 6. Create Reviews
    await Review.create([
      {
        reviewerId: customer1._id,
        revieweeId: providerCook._id,
        serviceId: service1._id,
        targetType: 'service',
        rating: 5,
        comment: 'Ammal’s cooking lessons are authentic and heartwarming. Learned traditional rasam and avial perfectly!',
        moderationStatus: 'approved',
      },
      {
        reviewerId: customer1._id,
        revieweeId: providerTutor._id,
        serviceId: service3._id,
        targetType: 'service',
        rating: 5,
        comment: 'Very patient educator! My daughter’s confidence in Vedic mathematics and algebra doubled in just one month.',
        moderationStatus: 'approved',
      },
    ]);

    // 7. Create Booking & Notification
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const sampleBooking = await Booking.create({
      serviceId: service1._id,
      customerId: customer1._id,
      providerId: providerCook._id,
      bookingDate: tomorrow,
      timeSlot: '10:00 - 11:00',
      durationHours: 2,
      location: 'Adyar, Chennai',
      mode: 'offline',
      estimatedPrice: 800,
      notes: 'Please bring traditional sambar powder recipe notes.',
      status: 'accepted',
    });

    await Notification.create({
      userId: providerCook._id,
      title: 'Booking Confirmed!',
      message: `Booking for ${service1.title} confirmed for tomorrow 10:00 AM.`,
      type: 'booking_update',
      link: `/bookings/${sampleBooking._id}`,
    });

    logger.info('🎉 Live database populated with real records!');
    if (isStandalone) {
      await disconnectDB();
    }
  } catch (error) {
    logger.error(`Error seeding database: ${error.message}`);
    if (isStandalone) process.exit(1);
  }
}

// Auto-run if executed directly via CLI
if (process.argv[1] && process.argv[1].endsWith('seed.js')) {
  seedDatabase(true);
}
