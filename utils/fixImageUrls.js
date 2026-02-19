// Script to fix image URLs in the database
// Converts full URLs to relative paths for local development

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

dotenv.config();

const fixImageUrls = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ Database connected');

    // Find all products with full URLs
    const products = await Product.find({});
    console.log(`Found ${products.length} products`);

    let updatedCount = 0;

    for (const product of products) {
      if (product.image && product.image.includes('http')) {
        // Extract the path from the full URL
        // Example: https://e-shop-ef1n.onrender.com/images/products/file.jpg -> /images/products/file.jpg
        const url = new URL(product.image);
        const relativePath = url.pathname;
        
        product.image = relativePath;
        await product.save();
        updatedCount++;
        console.log(`✅ Updated: ${product.name}`);
      }
    }

    console.log(`\n🎉 Fixed ${updatedCount} product image URLs!`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing image URLs:', error);
    process.exit(1);
  }
};

fixImageUrls();
