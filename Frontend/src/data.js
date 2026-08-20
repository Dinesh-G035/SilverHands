// Mock Data for SilverHands Platform

export const mockUser = {
  id: 'u1',
  name: 'Lakshmi Iyer',
  role: 'provider',
  type: 'senior',
  phone: '+91 98765 43210',
  location: 'Chennai',
  languages: ['Tamil', 'English', 'Hindi'],
  avatar: '',
  bio: 'Retired mathematics teacher with 30 years of experience. Passionate about helping students excel in mathematics and developing strong foundations.',
  skills: [
    { id: 's1', name: 'Mathematics', icon: '📐', confidence: 95, verified: true },
    { id: 's2', name: 'Tutoring', icon: '📚', confidence: 92, verified: true },
    { id: 's3', name: 'Vedic Maths', icon: '🧮', confidence: 88, verified: false },
    { id: 's4', name: 'Competitive Exam Prep', icon: '🎯', confidence: 85, verified: false },
  ],
  experience: '30+ years',
  rating: 4.8,
  reviewCount: 32,
  verified: true,
  joinedDate: '2024-01-15',
};

export const mockAdmin = {
  id: 'adm1',
  name: 'Rajesh Kumar (Admin)',
  role: 'admin',
  type: 'admin',
  phone: '+91 99999 88888',
  location: 'Chennai HQ',
  languages: ['English', 'Tamil', 'Hindi'],
  avatar: '',
  bio: 'Platform Administrator & Trust & Safety Lead for SilverHands platform.',
  skills: [
    { id: 'sa1', name: 'Platform Operations', icon: '🛡️', confidence: 100, verified: true },
    { id: 'sa2', name: 'Community Verification', icon: '✅', confidence: 100, verified: true },
  ],
  experience: 'Admin',
  rating: 5.0,
  reviewCount: 0,
  verified: true,
  joinedDate: '2023-11-01',
};

export const mockProviders = [
  mockUser,
  {
    id: 'u2', name: 'Meena Krishnan', role: 'provider', type: 'homemaker', phone: '+91 98765 43211',
    location: 'Chennai', languages: ['Tamil', 'English'], avatar: '',
    bio: 'Home cook specializing in traditional South Indian cuisine. Known for authentic chettinad flavors and homemade pickles.',
    skills: [
      { id: 's5', name: 'Cooking', icon: '🍳', confidence: 95, verified: true },
      { id: 's6', name: 'Traditional Recipes', icon: '📖', confidence: 92, verified: true },
      { id: 's7', name: 'Food Preservation', icon: '🫙', confidence: 88, verified: false },
    ],
    experience: '20+ years', rating: 4.9, reviewCount: 48, verified: true, joinedDate: '2024-02-20',
  },
  {
    id: 'u3', name: 'Radha Devi', role: 'provider', type: 'homemaker', phone: '+91 98765 43212',
    location: 'Coimbatore', languages: ['Tamil', 'English'], avatar: '',
    bio: 'Expert tailor specializing in traditional blouse designs, alterations, and embroidery work.',
    skills: [
      { id: 's8', name: 'Tailoring', icon: '🧵', confidence: 96, verified: true },
      { id: 's9', name: 'Embroidery', icon: '🪡', confidence: 90, verified: true },
      { id: 's10', name: 'Blouse Design', icon: '👗', confidence: 94, verified: true },
    ],
    experience: '23+ years', rating: 4.7, reviewCount: 56, verified: true, joinedDate: '2024-01-08',
  },
  {
    id: 'u4', name: 'Sangeetha Mani', role: 'provider', type: 'senior', phone: '+91 98765 43213',
    location: 'Bengaluru', languages: ['Tamil', 'Kannada', 'English'], avatar: '',
    bio: 'Tamil language expert and literature enthusiast. Teaches Tamil reading, writing, and appreciation of classical Tamil literature.',
    skills: [
      { id: 's11', name: 'Tamil Language', icon: '🗣️', confidence: 97, verified: true },
      { id: 's12', name: 'Tamil Literature', icon: '📜', confidence: 93, verified: true },
    ],
    experience: '18+ years', rating: 4.9, reviewCount: 41, verified: true, joinedDate: '2024-03-12',
  },
  {
    id: 'u5', name: 'Kamala Sundaram', role: 'provider', type: 'senior', phone: '+91 98765 43214',
    location: 'Madurai', languages: ['Tamil', 'English'], avatar: '',
    bio: 'Classical Carnatic music teacher with decades of performing and teaching experience.',
    skills: [
      { id: 's14', name: 'Carnatic Music', icon: '🎵', confidence: 96, verified: true },
      { id: 's15', name: 'Veena', icon: '🎶', confidence: 92, verified: true },
    ],
    experience: '25+ years', rating: 4.8, reviewCount: 37, verified: true, joinedDate: '2024-04-05',
  },
  {
    id: 'u6', name: 'Padma Rao', role: 'provider', type: 'homemaker', phone: '+91 98765 43215',
    location: 'Hyderabad', languages: ['Telugu', 'Hindi', 'English'], avatar: '',
    bio: 'Expert in Pochampally ikat weaving and traditional Telangana embroidery. Preserving traditional textile arts.',
    skills: [
      { id: 's17', name: 'Weaving', icon: '🧶', confidence: 94, verified: true },
      { id: 's18', name: 'Embroidery', icon: '🪡', confidence: 91, verified: true },
    ],
    experience: '20+ years', rating: 4.6, reviewCount: 29, verified: true, joinedDate: '2024-02-28',
  },
  {
    id: 'u7', name: 'Savitri Nair', role: 'provider', type: 'homemaker', phone: '+91 98765 43216',
    location: 'Kochi', languages: ['Malayalam', 'English'], avatar: '',
    bio: 'Passionate gardener specializing in organic kitchen gardens, medicinal herbs, and traditional Ayurvedic plant knowledge.',
    skills: [
      { id: 's19', name: 'Gardening', icon: '🌿', confidence: 93, verified: true },
      { id: 's20', name: 'Ayurvedic Herbs', icon: '🌱', confidence: 89, verified: false },
    ],
    experience: '15+ years', rating: 4.7, reviewCount: 22, verified: true, joinedDate: '2024-05-10',
  },
  {
    id: 'u8', name: 'Aruna Sharma', role: 'provider', type: 'senior', phone: '+91 98765 43217',
    location: 'Delhi', languages: ['Hindi', 'English'], avatar: '',
    bio: 'Retired management consultant offering business mentoring and career guidance to young professionals.',
    skills: [
      { id: 's21', name: 'Business Consulting', icon: '💼', confidence: 95, verified: true },
      { id: 's22', name: 'Career Mentoring', icon: '🎓', confidence: 92, verified: true },
    ],
    experience: '28+ years', rating: 4.9, reviewCount: 19, verified: true, joinedDate: '2024-06-01',
  },
];

export const mockServices = [
  {
    id: 'svc1', providerId: 'u1', providerName: 'Lakshmi Iyer', providerAvatar: '',
    title: 'Mathematics Tuition', category: 'Tutoring',
    description: 'Expert maths tuition for classes 8-12 and competitive exam preparation. Specializing in Vedic Maths techniques.',
    experience: '30+ years', rating: 4.8, reviewCount: 32, price: 400, priceUnit: 'hour',
    distance: 2.5, location: 'Chennai', availability: 'Mon-Sat, 9 AM - 6 PM', mode: 'both', verified: true,
  },
  {
    id: 'svc2', providerId: 'u2', providerName: 'Meena Krishnan', providerAvatar: '',
    title: 'Traditional Tamil Cooking Classes', category: 'Cooking',
    description: 'Learn authentic South Indian recipes including chettinad cuisine, festival specials, and homemade pickles.',
    experience: '20+ years', rating: 4.9, reviewCount: 48, price: 500, priceUnit: 'session',
    distance: 3.2, location: 'Chennai', availability: 'Mon-Fri, 10 AM - 4 PM', mode: 'both', verified: true,
  },
  {
    id: 'svc3', providerId: 'u3', providerName: 'Radha Devi', providerAvatar: '',
    title: 'Custom Blouse Stitching & Embroidery', category: 'Tailoring',
    description: 'Expert blouse stitching with designer patterns, hand embroidery, and alteration services.',
    experience: '23+ years', rating: 4.7, reviewCount: 56, price: 350, priceUnit: 'piece',
    distance: 5.1, location: 'Coimbatore', availability: 'Mon-Sat, 9 AM - 7 PM', mode: 'offline', verified: true,
  },
  {
    id: 'svc4', providerId: 'u4', providerName: 'Sangeetha Mani', providerAvatar: '',
    title: 'Tamil Language Tutoring', category: 'Language',
    description: 'Tamil language classes for all ages. Reading, writing, speaking, and Tamil literature appreciation.',
    experience: '18+ years', rating: 4.9, reviewCount: 41, price: 350, priceUnit: 'hour',
    distance: 2.1, location: 'Bengaluru', availability: 'Mon-Sat, 10 AM - 5 PM', mode: 'online', verified: true,
  },
  {
    id: 'svc5', providerId: 'u5', providerName: 'Kamala Sundaram', providerAvatar: '',
    title: 'Carnatic Music Lessons', category: 'Music',
    description: 'Classical Carnatic vocal and Veena lessons for beginners to advanced students.',
    experience: '25+ years', rating: 4.8, reviewCount: 37, price: 600, priceUnit: 'hour',
    distance: 4.8, location: 'Madurai', availability: 'Tue-Sun, 8 AM - 12 PM', mode: 'both', verified: true,
  },
  {
    id: 'svc6', providerId: 'u7', providerName: 'Savitri Nair', providerAvatar: '',
    title: 'Organic Kitchen Garden Setup', category: 'Gardening',
    description: 'Complete kitchen garden setup with organic methods, composting, and medicinal herb cultivation guidance.',
    experience: '15+ years', rating: 4.7, reviewCount: 22, price: 800, priceUnit: 'visit',
    distance: 3.5, location: 'Kochi', availability: 'Mon-Fri, 7 AM - 11 AM', mode: 'offline', verified: true,
  },
  {
    id: 'svc7', providerId: 'u8', providerName: 'Aruna Sharma', providerAvatar: '',
    title: 'Business Mentoring & Career Guidance', category: 'Mentoring',
    description: 'One-on-one mentoring sessions for entrepreneurs and professionals. Strategic business advice.',
    experience: '28+ years', rating: 4.9, reviewCount: 19, price: 1000, priceUnit: 'hour',
    distance: 6.2, location: 'Delhi', availability: 'Mon-Fri, 2 PM - 6 PM', mode: 'online', verified: true,
  },
  {
    id: 'svc8', providerId: 'u6', providerName: 'Padma Rao', providerAvatar: '',
    title: 'Traditional Weaving Workshop', category: 'Traditional Arts',
    description: 'Learn traditional Pochampally ikat weaving techniques. Hands-on workshops with authentic materials.',
    experience: '20+ years', rating: 4.6, reviewCount: 29, price: 450, priceUnit: 'session',
    distance: 4.0, location: 'Hyderabad', availability: 'Sat-Sun, 10 AM - 4 PM', mode: 'offline', verified: true,
  },
];

export const mockProducts = [
  { id: 'p1', sellerId: 'u2', sellerName: 'Meena Krishnan', name: 'Traditional Mango Pickle', category: 'Food', description: 'Authentic homemade mango pickle made with traditional South Indian recipe. No preservatives.', price: 250, rating: 4.8, reviewCount: 45, image: '', inStock: true },
  { id: 'p2', sellerId: 'u6', sellerName: 'Padma Rao', name: 'Hand Embroidery Wall Hanging', category: 'Handicrafts', description: 'Beautiful handmade embroidery wall hanging with traditional Telangana motifs.', price: 650, rating: 4.9, reviewCount: 23, image: '', inStock: true },
  { id: 'p3', sellerId: 'u3', sellerName: 'Radha Devi', name: 'Knitted Woolen Shawl', category: 'Clothing', description: 'Soft, warm hand-knitted woolen shawl with intricate patterns. Perfect for winter.', price: 850, rating: 4.7, reviewCount: 18, image: '', inStock: true },
  { id: 'p4', sellerId: 'u2', sellerName: 'Meena Krishnan', name: 'Homemade Murukku Pack', category: 'Food', description: 'Crispy traditional murukku made fresh. Pack of 500g. Perfect tea-time snack.', price: 180, rating: 4.9, reviewCount: 62, image: '', inStock: true },
  { id: 'p5', sellerId: 'u6', sellerName: 'Padma Rao', name: 'Pochampally Ikat Dupatta', category: 'Clothing', description: 'Handwoven Pochampally ikat dupatta in vibrant colors. Traditional Telangana craft.', price: 1200, rating: 4.8, reviewCount: 31, image: '', inStock: true },
  { id: 'p6', sellerId: 'u7', sellerName: 'Savitri Nair', name: 'Organic Herbal Tea Collection', category: 'Food', description: 'Collection of 5 handcrafted herbal teas from home-grown organic herbs. Natural wellness.', price: 350, rating: 4.6, reviewCount: 15, image: '', inStock: true },
  { id: 'p7', sellerId: 'u3', sellerName: 'Radha Devi', name: 'Handmade Fabric Bags Set', category: 'Handicrafts', description: 'Set of 3 eco-friendly handmade fabric bags with beautiful embroidery designs.', price: 450, rating: 4.7, reviewCount: 27, image: '', inStock: true },
  { id: 'p8', sellerId: 'u2', sellerName: 'Meena Krishnan', name: 'Festival Sweet Box', category: 'Food', description: 'Assorted traditional sweets box. Perfect for festivals and gifts. Made with pure ghee.', price: 500, rating: 4.9, reviewCount: 38, image: '', inStock: true },
];

export const mockOpportunities = [
  { id: 'opp1', title: 'Homemade Food Orders', description: 'Sell homemade meals, snacks, and tiffin services in your local area.', demand: 'High', earningRange: '₹8,000 – ₹25,000/month', category: 'Cooking', icon: '🍱' },
  { id: 'opp2', title: 'Cooking Classes', description: 'Teach cooking online or offline. Share your traditional recipes.', demand: 'High', earningRange: '₹10,000 – ₹30,000/month', category: 'Cooking', icon: '👩‍🍳' },
  { id: 'opp3', title: 'Festival Food Packages', description: 'Create special food packages for festivals like Diwali, Pongal, Onam.', demand: 'Medium', earningRange: '₹15,000 – ₹50,000/season', category: 'Cooking', icon: '🎉' },
  { id: 'opp4', title: 'Online Cooking Workshops', description: 'Host live cooking workshops from home. Teach multiple students.', demand: 'Medium', earningRange: '₹5,000 – ₹20,000/month', category: 'Cooking', icon: '💻' },
  { id: 'opp5', title: 'Private Tutoring', description: 'Offer one-on-one tutoring sessions for school students.', demand: 'High', earningRange: '₹12,000 – ₹35,000/month', category: 'Tutoring', icon: '📚' },
  { id: 'opp6', title: 'Handcraft Marketplace', description: 'Sell your handmade crafts, embroidery, and traditional art products.', demand: 'High', earningRange: '₹5,000 – ₹30,000/month', category: 'Handicrafts', icon: '🎨' },
];

export const mockCategories = [
  { id: 'cat1', name: 'Tutoring', icon: '📚', count: 156 },
  { id: 'cat2', name: 'Cooking', icon: '🍳', count: 234 },
  { id: 'cat3', name: 'Tailoring', icon: '🧵', count: 89 },
  { id: 'cat4', name: 'Handicrafts', icon: '🎨', count: 145 },
  { id: 'cat5', name: 'Gardening', icon: '🌿', count: 67 },
  { id: 'cat6', name: 'Music', icon: '🎵', count: 78 },
  { id: 'cat7', name: 'Language', icon: '🗣️', count: 112 },
  { id: 'cat8', name: 'Mentoring', icon: '🎓', count: 45 },
  { id: 'cat9', name: 'Traditional Arts', icon: '🏺', count: 93 },
];

export const mockMessages = [
  { id: 'm1', senderId: 'c1', senderName: 'Priya Ramesh', content: 'Hi, I would like to book a maths tuition session for my daughter. Is Saturday available?', timestamp: '10:30 AM', unread: true },
  { id: 'm2', senderId: 'c2', senderName: 'Karthik Venkat', content: 'Thank you for the excellent class yesterday! My son really enjoyed the Vedic Maths session.', timestamp: '9:15 AM', unread: true },
  { id: 'm3', senderId: 'c3', senderName: 'Anjali Nair', content: 'Can you provide tuition for competitive exam preparation? Looking for JEE Maths coaching.', timestamp: 'Yesterday', unread: false },
  { id: 'm4', senderId: 'c4', senderName: 'Suresh Kumar', content: 'Payment of ₹800 sent for last week\'s sessions. Thank you!', timestamp: 'Yesterday', unread: false },
];

export const mockReviews = [
  { id: 'r1', userName: 'Priya Ramesh', rating: 5, comment: 'Excellent teacher! My daughter\'s maths scores improved significantly.', date: '2 days ago' },
  { id: 'r2', userName: 'Karthik Venkat', rating: 5, comment: 'Amazing Vedic Maths techniques! Highly recommended.', date: '1 week ago' },
  { id: 'r3', userName: 'Deepa Subramaniam', rating: 4, comment: 'Very knowledgeable and experienced. Simple and effective teaching.', date: '2 weeks ago' },
];

export const avatarColors = ['bg-primary-500', 'bg-pink-500', 'bg-teal-500', 'bg-amber-500', 'bg-indigo-500', 'bg-rose-500', 'bg-emerald-500', 'bg-sky-500'];

export const getAvatarColor = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
};

export const getInitials = (name) => {
  return (name || 'User').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};
