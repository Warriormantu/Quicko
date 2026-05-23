require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
  console.log('MongoDB connected for seeding...');
};

const categories = [
  'Fruits & Vegetables',
  'Dairy & Eggs',
  'Snacks',
  'Beverages',
  'Bakery',
  'Personal Care',
  'Instant Foods',
];

const UNSPLASH = {
  'Fruits & Vegetables': [
    'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400',
    'https://images.unsplash.com/photo-1518843875459-f738682238a6?w=400',
    'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400',
    'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400',
    'https://images.unsplash.com/photo-1471194402529-8e0f5a675de6?w=400',
    'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=400',
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400',
    'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400',
  ],
  'Dairy & Eggs': [
    'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400',
    'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400',
    'https://images.unsplash.com/photo-1559598467-f8b76c8155d0?w=400',
    'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
    'https://images.unsplash.com/photo-1638803040283-7a5ffd48dad5?w=400',
    'https://images.unsplash.com/photo-1587302186428-d15f964bbf53?w=400',
    'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400',
    'https://images.unsplash.com/photo-1571167530149-c1105da4b37d?w=400',
  ],
  'Snacks': [
    'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400',
    'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400',
    'https://images.unsplash.com/photo-1575467678930-c7acd65d6470?w=400',
    'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400',
    'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400',
    'https://images.unsplash.com/photo-1628689469838-524a4a973b8e?w=400',
    'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=400',
    'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=400',
  ],
  'Beverages': [
    'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400',
    'https://images.unsplash.com/photo-1543253687-c931c8e01820?w=400',
    'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?w=400',
    'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=400',
    'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400',
    'https://images.unsplash.com/photo-1589733955941-5eeaf752f6dd?w=400',
    'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400',
    'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400',
  ],
  'Bakery': [
    'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
    'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=400',
    'https://images.unsplash.com/photo-1571197825842-af1cf7eca9be?w=400',
    'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400',
    'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400',
    'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400',
    'https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?w=400',
  ],
  'Personal Care': [
    'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400',
    'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400',
    'https://images.unsplash.com/photo-1607748862156-7c548e7e98f4?w=400',
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400',
    'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400',
    'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400',
    'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400',
    'https://images.unsplash.com/photo-1526758097130-bab247274f58?w=400',
  ],
  'Instant Foods': [
    'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400',
    'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=400',
    'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400',
    'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
    'https://images.unsplash.com/photo-1600335895229-6e75511892c8?w=400',
    'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400',
    'https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=400',
    'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400',
  ],
};

const productData = [
  // Fruits & Vegetables
  { title: 'Organic Alphonso Mangoes', category: 'Fruits & Vegetables', price: 299, discountPrice: 249, stock: 50, unit: '1 kg', featured: true, trending: true, tags: ['mango', 'fruit', 'organic'], deliveryTime: '10-15 mins' },
  { title: 'Fresh Avocado', category: 'Fruits & Vegetables', price: 189, discountPrice: 159, stock: 30, unit: '2 pcs', featured: false, trending: true, tags: ['avocado', 'healthy'], deliveryTime: '10-15 mins' },
  { title: 'Cherry Tomatoes', category: 'Fruits & Vegetables', price: 79, discountPrice: 65, stock: 80, unit: '500 g', featured: false, trending: false, tags: ['tomato', 'salad'], deliveryTime: '10-15 mins' },
  { title: 'Baby Spinach', category: 'Fruits & Vegetables', price: 59, discountPrice: 0, stock: 40, unit: '200 g', featured: false, trending: false, tags: ['spinach', 'greens'], deliveryTime: '10-15 mins' },
  { title: 'Broccoli Crown', category: 'Fruits & Vegetables', price: 89, discountPrice: 75, stock: 25, unit: '500 g', featured: true, trending: false, tags: ['broccoli', 'vegetable'], deliveryTime: '10-15 mins' },
  { title: 'Dragon Fruit', category: 'Fruits & Vegetables', price: 199, discountPrice: 169, stock: 20, unit: '1 pc', featured: true, trending: true, tags: ['dragon fruit', 'exotic'], deliveryTime: '10-15 mins' },
  { title: 'Sweet Corn', category: 'Fruits & Vegetables', price: 39, discountPrice: 0, stock: 100, unit: '2 pcs', featured: false, trending: false, tags: ['corn', 'vegetable'], deliveryTime: '10-15 mins' },
  { title: 'Red Bell Peppers', category: 'Fruits & Vegetables', price: 69, discountPrice: 59, stock: 60, unit: '3 pcs', featured: false, trending: false, tags: ['pepper', 'capsicum'], deliveryTime: '10-15 mins' },
  // Dairy & Eggs
  { title: 'Greek Yogurt Premium', category: 'Dairy & Eggs', price: 129, discountPrice: 109, stock: 45, unit: '400 g', featured: true, trending: true, tags: ['yogurt', 'dairy', 'protein'], deliveryTime: '10-15 mins' },
  { title: 'Farm Fresh Eggs', category: 'Dairy & Eggs', price: 89, discountPrice: 0, stock: 200, unit: '12 pcs', featured: false, trending: true, tags: ['eggs', 'breakfast'], deliveryTime: '10-15 mins' },
  { title: 'Amul Gold Full Cream Milk', category: 'Dairy & Eggs', price: 32, discountPrice: 0, stock: 300, unit: '500 ml', featured: false, trending: false, tags: ['milk', 'dairy'], deliveryTime: '10-15 mins' },
  { title: 'Artisan Cheddar Cheese', category: 'Dairy & Eggs', price: 249, discountPrice: 219, stock: 35, unit: '200 g', featured: true, trending: false, tags: ['cheese', 'dairy'], deliveryTime: '10-15 mins' },
  { title: 'Salted Butter Block', category: 'Dairy & Eggs', price: 59, discountPrice: 0, stock: 150, unit: '100 g', featured: false, trending: false, tags: ['butter', 'dairy'], deliveryTime: '10-15 mins' },
  { title: 'Paneer Fresh', category: 'Dairy & Eggs', price: 99, discountPrice: 85, stock: 80, unit: '250 g', featured: false, trending: true, tags: ['paneer', 'dairy', 'indian'], deliveryTime: '10-15 mins' },
  { title: 'Mozzarella Ball', category: 'Dairy & Eggs', price: 179, discountPrice: 155, stock: 25, unit: '125 g', featured: true, trending: false, tags: ['mozzarella', 'cheese'], deliveryTime: '10-15 mins' },
  { title: 'Dahi (Curd) Premium', category: 'Dairy & Eggs', price: 45, discountPrice: 0, stock: 120, unit: '400 g', featured: false, trending: false, tags: ['curd', 'dahi', 'dairy'], deliveryTime: '10-15 mins' },
  // Snacks
  { title: 'Truffle Kettle Chips', category: 'Snacks', price: 149, discountPrice: 129, stock: 60, unit: '150 g', featured: true, trending: true, tags: ['chips', 'snacks', 'truffle'], deliveryTime: '10-15 mins' },
  { title: 'Dark Chocolate 70%', category: 'Snacks', price: 199, discountPrice: 169, stock: 80, unit: '100 g', featured: true, trending: true, tags: ['chocolate', 'dark', 'premium'], deliveryTime: '10-15 mins' },
  { title: 'Roasted Almonds Salted', category: 'Snacks', price: 299, discountPrice: 259, stock: 50, unit: '200 g', featured: false, trending: false, tags: ['almonds', 'nuts', 'healthy'], deliveryTime: '10-15 mins' },
  { title: 'Quinoa Puffs', category: 'Snacks', price: 119, discountPrice: 99, stock: 40, unit: '80 g', featured: false, trending: false, tags: ['quinoa', 'healthy snack'], deliveryTime: '10-15 mins' },
  { title: 'Gourmet Popcorn Mix', category: 'Snacks', price: 89, discountPrice: 75, stock: 70, unit: '100 g', featured: false, trending: true, tags: ['popcorn', 'snack'], deliveryTime: '10-15 mins' },
  { title: 'Premium Cashews', category: 'Snacks', price: 349, discountPrice: 299, stock: 45, unit: '200 g', featured: true, trending: false, tags: ['cashew', 'nuts'], deliveryTime: '10-15 mins' },
  { title: 'Biscotti Italian Style', category: 'Snacks', price: 159, discountPrice: 0, stock: 30, unit: '150 g', featured: false, trending: false, tags: ['biscotti', 'cookies'], deliveryTime: '10-15 mins' },
  { title: 'Protein Bar Chocolate', category: 'Snacks', price: 99, discountPrice: 85, stock: 100, unit: '1 bar', featured: false, trending: true, tags: ['protein', 'fitness', 'bar'], deliveryTime: '10-15 mins' },
  // Beverages
  { title: 'Cold Brew Coffee', category: 'Beverages', price: 179, discountPrice: 149, stock: 40, unit: '330 ml', featured: true, trending: true, tags: ['coffee', 'cold brew'], deliveryTime: '10-15 mins' },
  { title: 'Matcha Green Tea', category: 'Beverages', price: 299, discountPrice: 259, stock: 35, unit: '50 g tin', featured: true, trending: false, tags: ['matcha', 'tea', 'japanese'], deliveryTime: '10-15 mins' },
  { title: 'Fresh Orange Juice', category: 'Beverages', price: 99, discountPrice: 0, stock: 60, unit: '1 L', featured: false, trending: false, tags: ['juice', 'orange', 'fresh'], deliveryTime: '10-15 mins' },
  { title: 'Kombucha Ginger Lemon', category: 'Beverages', price: 149, discountPrice: 129, stock: 30, unit: '330 ml', featured: false, trending: true, tags: ['kombucha', 'probiotic'], deliveryTime: '10-15 mins' },
  { title: 'Sparkling Water San Pellegrino', category: 'Beverages', price: 129, discountPrice: 0, stock: 80, unit: '750 ml', featured: true, trending: false, tags: ['sparkling', 'water', 'premium'], deliveryTime: '10-15 mins' },
  { title: 'Almond Milk Unsweetened', category: 'Beverages', price: 179, discountPrice: 159, stock: 50, unit: '1 L', featured: false, trending: true, tags: ['almond milk', 'vegan'], deliveryTime: '10-15 mins' },
  { title: 'Iced Hibiscus Tea', category: 'Beverages', price: 119, discountPrice: 99, stock: 45, unit: '500 ml', featured: false, trending: false, tags: ['hibiscus', 'tea', 'floral'], deliveryTime: '10-15 mins' },
  { title: 'Espresso Blend Coffee Beans', category: 'Beverages', price: 499, discountPrice: 429, stock: 25, unit: '250 g', featured: true, trending: true, tags: ['coffee', 'espresso', 'beans'], deliveryTime: '10-15 mins' },
  // Bakery
  { title: 'Sourdough Bread Artisan', category: 'Bakery', price: 189, discountPrice: 159, stock: 30, unit: '500 g', featured: true, trending: true, tags: ['bread', 'sourdough', 'artisan'], deliveryTime: '10-15 mins' },
  { title: 'Croissants Butter', category: 'Bakery', price: 129, discountPrice: 109, stock: 20, unit: '4 pcs', featured: true, trending: false, tags: ['croissant', 'french', 'breakfast'], deliveryTime: '10-15 mins' },
  { title: 'Whole Wheat Pita', category: 'Bakery', price: 59, discountPrice: 0, stock: 60, unit: '6 pcs', featured: false, trending: false, tags: ['pita', 'whole wheat'], deliveryTime: '10-15 mins' },
  { title: 'Blueberry Muffins', category: 'Bakery', price: 149, discountPrice: 129, stock: 25, unit: '4 pcs', featured: false, trending: true, tags: ['muffin', 'blueberry'], deliveryTime: '10-15 mins' },
  { title: 'Cinnamon Rolls', category: 'Bakery', price: 179, discountPrice: 0, stock: 20, unit: '2 pcs', featured: true, trending: true, tags: ['cinnamon', 'rolls', 'sweet'], deliveryTime: '10-15 mins' },
  { title: 'Focaccia with Herbs', category: 'Bakery', price: 169, discountPrice: 149, stock: 15, unit: '300 g', featured: false, trending: false, tags: ['focaccia', 'italian', 'herbs'], deliveryTime: '10-15 mins' },
  { title: 'Multigrain Loaf', category: 'Bakery', price: 99, discountPrice: 0, stock: 40, unit: '400 g', featured: false, trending: false, tags: ['multigrain', 'healthy', 'bread'], deliveryTime: '10-15 mins' },
  { title: 'Almond Biscotti', category: 'Bakery', price: 199, discountPrice: 169, stock: 30, unit: '200 g', featured: false, trending: false, tags: ['biscotti', 'almond', 'italian'], deliveryTime: '10-15 mins' },
  // Personal Care
  { title: 'Luxury Rose Body Wash', category: 'Personal Care', price: 349, discountPrice: 299, stock: 40, unit: '250 ml', featured: true, trending: true, tags: ['body wash', 'rose', 'luxury'], deliveryTime: '10-15 mins' },
  { title: 'Vitamin C Sunscreen SPF50', category: 'Personal Care', price: 499, discountPrice: 429, stock: 35, unit: '50 ml', featured: true, trending: true, tags: ['sunscreen', 'vitamin c', 'SPF50'], deliveryTime: '10-15 mins' },
  { title: 'Bamboo Charcoal Toothbrush', category: 'Personal Care', price: 199, discountPrice: 0, stock: 80, unit: '1 pc', featured: false, trending: false, tags: ['toothbrush', 'bamboo', 'eco'], deliveryTime: '10-15 mins' },
  { title: 'Argan Oil Hair Serum', category: 'Personal Care', price: 599, discountPrice: 499, stock: 25, unit: '50 ml', featured: true, trending: false, tags: ['hair serum', 'argan', 'luxury'], deliveryTime: '10-15 mins' },
  { title: 'Charcoal Face Mask', category: 'Personal Care', price: 299, discountPrice: 249, stock: 50, unit: '75 g', featured: false, trending: true, tags: ['face mask', 'charcoal', 'skincare'], deliveryTime: '10-15 mins' },
  { title: 'Lavender Hand Cream', category: 'Personal Care', price: 179, discountPrice: 0, stock: 60, unit: '75 ml', featured: false, trending: false, tags: ['hand cream', 'lavender'], deliveryTime: '10-15 mins' },
  { title: 'Micellar Water Cleanser', category: 'Personal Care', price: 249, discountPrice: 219, stock: 45, unit: '200 ml', featured: false, trending: false, tags: ['cleanser', 'micellar', 'skincare'], deliveryTime: '10-15 mins' },
  { title: 'Niacinamide 10% Serum', category: 'Personal Care', price: 449, discountPrice: 379, stock: 30, unit: '30 ml', featured: true, trending: true, tags: ['niacinamide', 'serum', 'skincare'], deliveryTime: '10-15 mins' },
  // Instant Foods
  { title: 'Gourmet Ramen Kit', category: 'Instant Foods', price: 249, discountPrice: 219, stock: 50, unit: '2 servings', featured: true, trending: true, tags: ['ramen', 'noodles', 'japanese'], deliveryTime: '10-15 mins' },
  { title: 'Pesto Pasta Sauce', category: 'Instant Foods', price: 179, discountPrice: 0, stock: 60, unit: '190 g', featured: false, trending: false, tags: ['pasta', 'pesto', 'sauce', 'italian'], deliveryTime: '10-15 mins' },
  { title: 'Ready to Eat Dal Makhani', category: 'Instant Foods', price: 89, discountPrice: 75, stock: 100, unit: '300 g', featured: false, trending: true, tags: ['dal makhani', 'ready to eat', 'indian'], deliveryTime: '10-15 mins' },
  { title: 'Organic Oatmeal Cups', category: 'Instant Foods', price: 119, discountPrice: 99, stock: 80, unit: '3 cups', featured: false, trending: false, tags: ['oatmeal', 'breakfast', 'organic'], deliveryTime: '10-15 mins' },
  { title: 'Mulligatawny Soup', category: 'Instant Foods', price: 149, discountPrice: 129, stock: 40, unit: '400 g', featured: false, trending: false, tags: ['soup', 'ready to eat'], deliveryTime: '10-15 mins' },
  { title: 'Thai Green Curry Kit', category: 'Instant Foods', price: 299, discountPrice: 259, stock: 35, unit: '2 servings', featured: true, trending: true, tags: ['thai', 'curry', 'premium'], deliveryTime: '10-15 mins' },
  { title: 'Whole Wheat Pasta', category: 'Instant Foods', price: 99, discountPrice: 0, stock: 90, unit: '500 g', featured: false, trending: false, tags: ['pasta', 'whole wheat'], deliveryTime: '10-15 mins' },
  { title: 'Instant Masala Oats', category: 'Instant Foods', price: 69, discountPrice: 59, stock: 120, unit: '200 g', featured: false, trending: false, tags: ['oats', 'masala', 'breakfast'], deliveryTime: '10-15 mins' },
];

const descriptions = {
  'Fruits & Vegetables': 'Fresh, hand-picked, and farm-to-door. Our premium produce is sourced directly from certified organic farms, ensuring maximum nutrition and freshness delivered to your doorstep.',
  'Dairy & Eggs': 'Cold-chain maintained, farm-fresh dairy products. Rich in nutrients and quality-checked at every step from farm to your refrigerator.',
  'Snacks': 'Indulge in premium, artisanal snacks crafted from high-quality ingredients. Perfect for every craving, from healthy munching to gourmet treats.',
  'Beverages': 'Quench your thirst with our curated selection of premium beverages. From artisan coffees to exotic teas and natural juices.',
  'Bakery': 'Freshly baked every morning by our partner artisan bakeries. Delivered warm and fresh, making every bite a luxury experience.',
  'Personal Care': 'Premium grooming and skincare products from trusted brands. Elevate your self-care routine with our carefully curated collection.',
  'Instant Foods': 'Gourmet meals ready in minutes. Our instant foods never compromise on taste or quality — chef-crafted recipes, just add heat.',
};

const seedDB = async () => {
  try {
    await connectDB();
    await Product.deleteMany();
    await User.deleteMany();
    console.log('📝 Cleared existing data...');

    const users = await User.create([
      {
        name: 'Admin Quicko',
        email: 'admin@quicko.com',
        password: 'admin123',
        role: 'admin',
        phone: '9876543210',
      },
      {
        name: 'Priya Sharma',
        email: 'user@quicko.com',
        password: 'user1234',
        role: 'user',
        phone: '9123456789',
      },
    ]);
    console.log(`✅ Created ${users.length} users`);

    const products = productData.map((p, i) => {
      const catImages = UNSPLASH[p.category] || [];
      const imgIndex = Math.floor(i / (productData.length / categories.length)) % catImages.length;
      const img = catImages[imgIndex] || catImages[0];
      return {
        ...p,
        description: descriptions[p.category],
        images: [img],
        avgRating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
        numReviews: Math.floor(Math.random() * 200 + 10),
        sold: Math.floor(Math.random() * 500),
      };
    });

    await Product.insertMany(products);
    console.log(`✅ Seeded ${products.length} products`);
    console.log('\n🎉 Database seeded successfully!');
    console.log('📧 Admin: admin@quicko.com | Password: admin123');
    console.log('📧 User:  user@quicko.com  | Password: user1234');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDB();
