const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');
const User = require('./models/User');

// Sample products data
const products = [
  {
    name: "iPhone 15 Pro",
    description: "The latest iPhone with A17 Pro chip, titanium design, and advanced camera system. Features 6.1-inch Super Retina XDR display and up to 1TB storage.",
    price: 999.99,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop",
    category: "smartphones",
    brand: "Apple",
    stock: 50,
    rating: 4.8,
    numReviews: 125,
    featured: true,
    specifications: {
      "Screen Size": "6.1 inches",
      "Storage": "128GB, 256GB, 512GB, 1TB",
      "Color": "Natural Titanium, Blue Titanium, White Titanium, Black Titanium",
      "Chip": "A17 Pro chip",
      "Camera": "48MP Main + 12MP Ultra Wide + 12MP Telephoto"
    }
  },
  {
    name: "MacBook Air M2",
    description: "Ultra-thin laptop with M2 chip, 13.6-inch Liquid Retina display, and up to 18 hours of battery life. Perfect for work and creativity.",
    price: 1199.99,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop",
    category: "laptops",
    brand: "Apple",
    stock: 30,
    rating: 4.9,
    numReviews: 89,
    featured: true,
    specifications: {
      "Screen Size": "13.6 inches",
      "Processor": "Apple M2 chip",
      "Memory": "8GB, 16GB, 24GB unified memory",
      "Storage": "256GB, 512GB, 1TB, 2TB SSD",
      "Battery": "Up to 18 hours"
    }
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    description: "Premium Android smartphone with S Pen, 200MP camera, and Snapdragon 8 Gen 3 processor. Features 6.8-inch Dynamic AMOLED display.",
    price: 1299.99,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop",
    category: "smartphones",
    brand: "Samsung",
    stock: 40,
    rating: 4.7,
    numReviews: 156,
    featured: true,
    specifications: {
      "Screen Size": "6.8 inches",
      "Storage": "256GB, 512GB, 1TB",
      "Color": "Titanium Gray, Titanium Black, Titanium Violet, Titanium Yellow",
      "Chip": "Snapdragon 8 Gen 3",
      "Camera": "200MP Main + 12MP Ultra Wide + 50MP Telephoto + 10MP Telephoto"
    }
  },
  {
    name: "Sony WH-1000XM5",
    description: "Industry-leading noise canceling headphones with 30-hour battery life and exceptional sound quality. Perfect for music lovers and travelers.",
    price: 399.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    category: "headphones",
    brand: "Sony",
    stock: 75,
    rating: 4.8,
    numReviews: 234,
    featured: false,
    specifications: {
      "Driver Size": "30mm",
      "Battery Life": "Up to 30 hours",
      "Connectivity": "Bluetooth 5.2, NFC",
      "Weight": "250g",
      "Noise Cancellation": "Industry-leading"
    }
  },
  {
    name: "iPad Pro 12.9-inch",
    description: "The most powerful iPad ever with M2 chip, 12.9-inch Liquid Retina XDR display, and Apple Pencil support. Ideal for creative professionals.",
    price: 1099.99,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop",
    category: "tablets",
    brand: "Apple",
    stock: 25,
    rating: 4.9,
    numReviews: 67,
    featured: true,
    specifications: {
      "Screen Size": "12.9 inches",
      "Processor": "Apple M2 chip",
      "Storage": "128GB, 256GB, 512GB, 1TB, 2TB",
      "Connectivity": "Wi-Fi + Cellular",
      "Apple Pencil": "2nd generation compatible"
    }
  },
  {
    name: "Apple Watch Series 9",
    description: "Advanced health monitoring smartwatch with S9 chip, always-on display, and comprehensive fitness tracking. Available in 41mm and 45mm sizes.",
    price: 399.99,
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500&h=500&fit=crop",
    category: "smartwatches",
    brand: "Apple",
    stock: 60,
    rating: 4.7,
    numReviews: 189,
    featured: false,
    specifications: {
      "Case Size": "41mm, 45mm",
      "Display": "Always-On Retina display",
      "Chip": "S9 chip",
      "Battery": "Up to 18 hours",
      "Water Resistance": "Water resistant to 50m"
    }
  },
  {
    name: "Canon EOS R6 Mark II",
    description: "Full-frame mirrorless camera with 24.2MP sensor, 4K video recording, and advanced autofocus system. Perfect for photography enthusiasts.",
    price: 2499.99,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&h=500&fit=crop",
    category: "cameras",
    brand: "Canon",
    stock: 20,
    rating: 4.8,
    numReviews: 45,
    featured: false,
    specifications: {
      "Sensor": "24.2MP Full-frame CMOS",
      "Video": "4K 60p",
      "Autofocus": "Dual Pixel CMOS AF II",
      "Burst Speed": "Up to 12 fps",
      "Connectivity": "Wi-Fi, Bluetooth"
    }
  },
  {
    name: "PlayStation 5",
    description: "Next-generation gaming console with lightning-fast loading, haptic feedback, and 4K graphics. Includes DualSense wireless controller.",
    price: 499.99,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&h=500&fit=crop",
    category: "gaming",
    brand: "Sony",
    stock: 35,
    rating: 4.9,
    numReviews: 312,
    featured: true,
    specifications: {
      "Storage": "825GB SSD",
      "Graphics": "Custom AMD RDNA 2",
      "Resolution": "Up to 8K",
      "Controller": "DualSense wireless controller",
      "Backward Compatibility": "PS4 games"
    }
  },
  {
    name: "AirPods Pro 2nd Generation",
    description: "Active noise cancellation wireless earbuds with spatial audio and sweat resistance. Features Adaptive Transparency and Personalized Spatial Audio.",
    price: 249.99,
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500&h=500&fit=crop",
    category: "accessories",
    brand: "Apple",
    stock: 100,
    rating: 4.6,
    numReviews: 445,
    featured: false,
    specifications: {
      "Battery Life": "Up to 6 hours",
      "Noise Cancellation": "Active",
      "Connectivity": "Bluetooth 5.0",
      "Water Resistance": "IPX4",
      "Case": "MagSafe Charging Case"
    }
  },
  {
    name: "Dell XPS 13 Plus",
    description: "Premium ultrabook with 13th Gen Intel processors, 13.4-inch InfinityEdge display, and sleek design. Perfect for professionals and students.",
    price: 1299.99,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&h=500&fit=crop",
    category: "laptops",
    brand: "Dell",
    stock: 28,
    rating: 4.7,
    numReviews: 78,
    featured: false,
    specifications: {
      "Screen Size": "13.4 inches",
      "Processor": "13th Gen Intel Core i5/i7/i9",
      "Memory": "8GB, 16GB, 32GB LPDDR5",
      "Storage": "512GB, 1TB, 2TB SSD",
      "Display": "FHD+ or 3.5K OLED"
    }
  },
  // 20 more products
  {
    name: "Google Pixel 8 Pro",
    description: "Flagship Android phone with Google Tensor G3 chip, 6.7-inch OLED display, and advanced AI camera features.",
    price: 999.99,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=500&h=500&fit=crop",
    category: "smartphones",
    brand: "Google",
    stock: 40,
    rating: 4.7,
    numReviews: 110,
    featured: true,
    specifications: {
      "Screen Size": "6.7 inches",
      "Storage": "128GB, 256GB, 512GB",
      "Color": "Obsidian, Porcelain, Bay",
      "Chip": "Google Tensor G3",
      "Camera": "50MP Main + 48MP Ultra Wide + 48MP Telephoto"
    }
  },
  {
    name: "HP Spectre x360 14",
    description: "Convertible laptop with 13th Gen Intel Core, 3:2 OLED touchscreen, and long battery life.",
    price: 1399.99,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop",
    category: "laptops",
    brand: "HP",
    stock: 22,
    rating: 4.8,
    numReviews: 60,
    featured: false,
    specifications: {
      "Screen Size": "13.5 inches",
      "Processor": "13th Gen Intel Core i7",
      "Memory": "16GB LPDDR4x",
      "Storage": "1TB SSD",
      "Battery": "Up to 17 hours"
    }
  },
  {
    name: "Bose QuietComfort Ultra",
    description: "Premium noise-cancelling headphones with immersive sound and 24-hour battery life.",
    price: 349.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    category: "headphones",
    brand: "Bose",
    stock: 60,
    rating: 4.7,
    numReviews: 210,
    featured: true,
    specifications: {
      "Driver Size": "40mm",
      "Battery Life": "Up to 24 hours",
      "Connectivity": "Bluetooth 5.3",
      "Weight": "240g",
      "Noise Cancellation": "Active"
    }
  },
  {
    name: "Microsoft Surface Pro 9",
    description: "2-in-1 tablet and laptop with 13-inch PixelSense display, 12th Gen Intel Core, and Windows 11.",
    price: 1099.99,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop",
    category: "tablets",
    brand: "Microsoft",
    stock: 18,
    rating: 4.6,
    numReviews: 55,
    featured: false,
    specifications: {
      "Screen Size": "13 inches",
      "Processor": "12th Gen Intel Core i5/i7",
      "Storage": "256GB, 512GB, 1TB",
      "Battery": "Up to 15.5 hours"
    }
  },
  {
    name: "Garmin Fenix 7X",
    description: "Rugged multisport GPS smartwatch with solar charging and advanced fitness tracking.",
    price: 899.99,
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500&h=500&fit=crop",
    category: "smartwatches",
    brand: "Garmin",
    stock: 30,
    rating: 4.8,
    numReviews: 80,
    featured: true,
    specifications: {
      "Case Size": "51mm",
      "Display": "1.4-inch sunlight-visible",
      "Battery": "Up to 37 days",
      "Water Resistance": "10 ATM"
    }
  },
  {
    name: "Nikon Z8",
    description: "Professional mirrorless camera with 45.7MP sensor, 8K video, and fast autofocus.",
    price: 3999.99,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&h=500&fit=crop",
    category: "cameras",
    brand: "Nikon",
    stock: 10,
    rating: 4.9,
    numReviews: 30,
    featured: false,
    specifications: {
      "Sensor": "45.7MP Full-frame CMOS",
      "Video": "8K 30p",
      "Autofocus": "493-point phase-detect",
      "Burst Speed": "Up to 20 fps"
    }
  },
  {
    name: "Xbox Series X",
    description: "Powerful gaming console with 1TB SSD, 4K gaming, and fast load times.",
    price: 499.99,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&h=500&fit=crop",
    category: "gaming",
    brand: "Microsoft",
    stock: 40,
    rating: 4.8,
    numReviews: 200,
    featured: true,
    specifications: {
      "Storage": "1TB SSD",
      "Graphics": "Custom AMD RDNA 2",
      "Resolution": "Up to 8K",
      "Controller": "Xbox Wireless Controller"
    }
  },
  {
    name: "JBL Flip 6",
    description: "Portable Bluetooth speaker with powerful sound, waterproof design, and 12-hour battery life.",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=500&h=500&fit=crop",
    category: "audio",
    brand: "JBL",
    stock: 70,
    rating: 4.6,
    numReviews: 150,
    featured: false,
    specifications: {
      "Battery Life": "Up to 12 hours",
      "Waterproof": "IP67",
      "Connectivity": "Bluetooth 5.1"
    }
  },
  {
    name: "GoPro HERO12 Black",
    description: "Action camera with 5.3K video, HyperSmooth stabilization, and waterproof up to 33ft.",
    price: 399.99,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&h=500&fit=crop",
    category: "cameras",
    brand: "GoPro",
    stock: 25,
    rating: 4.7,
    numReviews: 95,
    featured: true,
    specifications: {
      "Video": "5.3K60, 4K120",
      "Stabilization": "HyperSmooth 6.0",
      "Waterproof": "33ft (10m)"
    }
  },
  {
    name: "Lenovo Legion 7i",
    description: "High-performance gaming laptop with 13th Gen Intel Core, RTX 4080, and 16-inch WQXGA display.",
    price: 2499.99,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&h=500&fit=crop",
    category: "laptops",
    brand: "Lenovo",
    stock: 15,
    rating: 4.8,
    numReviews: 40,
    featured: false,
    specifications: {
      "Screen Size": "16 inches",
      "Processor": "13th Gen Intel Core i9",
      "Graphics": "NVIDIA RTX 4080",
      "Memory": "32GB DDR5",
      "Storage": "2TB SSD"
    }
  },
  {
    name: "Fitbit Charge 6",
    description: "Fitness tracker with heart rate, GPS, and up to 7 days battery life.",
    price: 159.99,
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500&h=500&fit=crop",
    category: "wearables",
    brand: "Fitbit",
    stock: 55,
    rating: 4.5,
    numReviews: 120,
    featured: true,
    specifications: {
      "Display": "AMOLED",
      "Battery": "Up to 7 days",
      "Water Resistance": "50m"
    }
  },
  {
    name: "DJI Mini 4 Pro",
    description: "Compact drone with 4K camera, 34-min flight time, and obstacle avoidance.",
    price: 799.99,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&h=500&fit=crop",
    category: "drones",
    brand: "DJI",
    stock: 20,
    rating: 4.8,
    numReviews: 50,
    featured: false,
    specifications: {
      "Camera": "4K/60fps",
      "Flight Time": "34 min",
      "Weight": "249g"
    }
  },
  {
    name: "Razer DeathAdder V3 Pro",
    description: "Wireless gaming mouse with Focus Pro 30K sensor and 90-hour battery life.",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=500&h=500&fit=crop",
    category: "accessories",
    brand: "Razer",
    stock: 80,
    rating: 4.7,
    numReviews: 70,
    featured: true,
    specifications: {
      "Sensor": "Focus Pro 30K",
      "Battery Life": "Up to 90 hours",
      "Weight": "63g"
    }
  },
  {
    name: "Samsung Galaxy Tab S9 Ultra",
    description: "14.6-inch Android tablet with AMOLED display, Snapdragon 8 Gen 2, and S Pen.",
    price: 1199.99,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop",
    category: "tablets",
    brand: "Samsung",
    stock: 18,
    rating: 4.7,
    numReviews: 45,
    featured: false,
    specifications: {
      "Screen Size": "14.6 inches",
      "Processor": "Snapdragon 8 Gen 2",
      "Storage": "256GB, 512GB, 1TB",
      "Battery": "11200mAh"
    }
  },
  {
    name: "OnePlus 12",
    description: "Flagship smartphone with Snapdragon 8 Gen 3, 120Hz AMOLED, and 100W fast charging.",
    price: 799.99,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&h=500&fit=crop",
    category: "smartphones",
    brand: "OnePlus",
    stock: 35,
    rating: 4.6,
    numReviews: 65,
    featured: true,
    specifications: {
      "Screen Size": "6.82 inches",
      "Storage": "256GB, 512GB",
      "Color": "Black, Green",
      "Chip": "Snapdragon 8 Gen 3",
      "Camera": "50MP Main + 48MP Ultra Wide + 64MP Telephoto"
    }
  },
  {
    name: "Sony PlayStation VR2",
    description: "Next-gen VR headset for PS5 with 4K HDR, eye tracking, and haptic feedback.",
    price: 549.99,
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&h=500&fit=crop",
    category: "gaming",
    brand: "Sony",
    stock: 25,
    rating: 4.7,
    numReviews: 35,
    featured: false,
    specifications: {
      "Display": "4K HDR OLED",
      "Tracking": "Inside-out, eye tracking",
      "Compatibility": "PlayStation 5"
    }
  },
  {
    name: "Apple Magic Keyboard",
    description: "Wireless keyboard with Touch ID for Mac computers with Apple silicon.",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=500&h=500&fit=crop",
    category: "accessories",
    brand: "Apple",
    stock: 60,
    rating: 4.8,
    numReviews: 90,
    featured: true,
    specifications: {
      "Connectivity": "Bluetooth, USB-C",
      "Battery Life": "Up to 1 month",
      "Compatibility": "Mac with Apple silicon"
    }
  },
  {
    name: "Amazon Echo Show 10",
    description: "Smart display with 10.1-inch HD screen, Alexa, and motion tracking.",
    price: 249.99,
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=500&h=500&fit=crop",
    category: "smart home",
    brand: "Amazon",
    stock: 45,
    rating: 4.6,
    numReviews: 75,
    featured: false,
    specifications: {
      "Display": "10.1-inch HD",
      "Camera": "13MP",
      "Voice Assistant": "Alexa"
    }
  },
  {
    name: "Anker PowerCore 20000",
    description: "High-capacity portable charger with 20,000mAh and fast charging.",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500&h=500&fit=crop",
    category: "accessories",
    brand: "Anker",
    stock: 120,
    rating: 4.8,
    numReviews: 180,
    featured: true,
    specifications: {
      "Capacity": "20,000mAh",
      "Output": "18W",
      "Ports": "2 USB-A, 1 USB-C"
    }
  },
  {
    name: "Logitech MX Master 3S",
    description: "Advanced wireless mouse with MagSpeed scroll and ergonomic design.",
    price: 99.99,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=500&h=500&fit=crop",
    category: "accessories",
    brand: "Logitech",
    stock: 90,
    rating: 4.9,
    numReviews: 130,
    featured: false,
    specifications: {
      "Sensor": "Darkfield 8000 DPI",
      "Battery Life": "Up to 70 days",
      "Connectivity": "Bluetooth, USB-C"
    }
  },
  // 10 new products
  {
    name: "Asus ROG Phone 7",
    description: "Gaming smartphone with Snapdragon 8 Gen 2, 165Hz AMOLED, and 6000mAh battery.",
    price: 1099.99,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=500&h=500&fit=crop",
    category: "smartphones",
    brand: "Asus",
    stock: 20,
    rating: 4.7,
    numReviews: 40,
    featured: true,
    specifications: {
      "Screen Size": "6.78 inches",
      "Storage": "256GB, 512GB",
      "Chip": "Snapdragon 8 Gen 2",
      "Battery": "6000mAh"
    }
  },
  {
    name: "Acer Predator Helios 16",
    description: "High-end gaming laptop with 13th Gen Intel Core, RTX 4080, and 16-inch Mini LED display.",
    price: 2799.99,
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&h=500&fit=crop",
    category: "laptops",
    brand: "Acer",
    stock: 10,
    rating: 4.8,
    numReviews: 25,
    featured: false,
    specifications: {
      "Screen Size": "16 inches",
      "Processor": "13th Gen Intel Core i9",
      "Graphics": "NVIDIA RTX 4080",
      "Memory": "32GB DDR5",
      "Storage": "2TB SSD"
    }
  },
  {
    name: "Beats Studio Buds+",
    description: "Wireless earbuds with active noise cancellation and up to 36 hours battery life.",
    price: 179.99,
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500&h=500&fit=crop",
    category: "audio",
    brand: "Beats",
    stock: 60,
    rating: 4.5,
    numReviews: 70,
    featured: false,
    specifications: {
      "Battery Life": "Up to 36 hours",
      "Noise Cancellation": "Active",
      "Water Resistance": "IPX4"
    }
  },
  {
    name: "Fujifilm X-T5",
    description: "Mirrorless camera with 40MP sensor, 6.2K video, and classic design.",
    price: 1699.99,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&h=500&fit=crop",
    category: "cameras",
    brand: "Fujifilm",
    stock: 15,
    rating: 4.8,
    numReviews: 32,
    featured: true,
    specifications: {
      "Sensor": "40MP APS-C",
      "Video": "6.2K/30p",
      "Stabilization": "In-body 7 stops"
    }
  },
  {
    name: "Garmin Venu 3",
    description: "Smartwatch with AMOLED display, GPS, and advanced health tracking.",
    price: 449.99,
    image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=500&h=500&fit=crop",
    category: "wearables",
    brand: "Garmin",
    stock: 25,
    rating: 4.7,
    numReviews: 55,
    featured: false,
    specifications: {
      "Display": "AMOLED",
      "Battery": "Up to 14 days",
      "Water Resistance": "5 ATM"
    }
  },
  {
    name: "DJI Air 3",
    description: "Foldable drone with dual cameras, 46-min flight time, and omnidirectional obstacle sensing.",
    price: 1099.99,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&h=500&fit=crop",
    category: "drones",
    brand: "DJI",
    stock: 12,
    rating: 4.9,
    numReviews: 20,
    featured: true,
    specifications: {
      "Camera": "Dual 48MP",
      "Flight Time": "46 min",
      "Weight": "720g"
    }
  },
  {
    name: "Samsung Odyssey G9",
    description: "49-inch curved gaming monitor with QHD resolution and 240Hz refresh rate.",
    price: 1499.99,
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=500&h=500&fit=crop",
    category: "monitors",
    brand: "Samsung",
    stock: 8,
    rating: 4.8,
    numReviews: 18,
    featured: false,
    specifications: {
      "Screen Size": "49 inches",
      "Resolution": "5120x1440",
      "Refresh Rate": "240Hz"
    }
  },
  {
    name: "Apple AirTag",
    description: "Bluetooth tracker for locating personal items with Find My network.",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500&h=500&fit=crop",
    category: "accessories",
    brand: "Apple",
    stock: 200,
    rating: 4.6,
    numReviews: 300,
    featured: false,
    specifications: {
      "Battery Life": "1 year",
      "Connectivity": "Bluetooth, Ultra Wideband"
    }
  },
  {
    name: "Sony SRS-XB43",
    description: "Portable Bluetooth speaker with extra bass, 24-hour battery, and waterproof design.",
    price: 249.99,
    image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=500&h=500&fit=crop",
    category: "audio",
    brand: "Sony",
    stock: 35,
    rating: 4.7,
    numReviews: 60,
    featured: false,
    specifications: {
      "Battery Life": "Up to 24 hours",
      "Waterproof": "IP67",
      "Connectivity": "Bluetooth 5.0"
    }
  },
  {
    name: "Logitech G Pro X Superlight 2",
    description: "Ultra-lightweight wireless gaming mouse with HERO 2 sensor and 95-hour battery life.",
    price: 159.99,
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=500&h=500&fit=crop",
    category: "accessories",
    brand: "Logitech",
    stock: 50,
    rating: 4.9,
    numReviews: 80,
    featured: true,
    specifications: {
      "Sensor": "HERO 2",
      "Battery Life": "Up to 95 hours",
      "Weight": "60g"
    }
  }
];

// Sample admin user
const adminUser = {
  name: "Admin User",
  email: "admin@example.com",
  password: "admin123",
  role: "admin"
};

// Connect to MongoDB and seed data
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({ email: adminUser.email });
    console.log('🗑️ Cleared existing data');

    // Create admin user
    const admin = await User.create(adminUser);
    console.log('👤 Created admin user:', admin.email);

    // Insert products
    const createdProducts = await Product.insertMany(products);
    console.log(`📦 Created ${createdProducts.length} products`);

    console.log('✅ Database seeded successfully!');
    console.log('\n📋 Sample Data:');
    console.log('- Admin Email: admin@example.com');
    console.log('- Admin Password: admin123');
    console.log(`- Products: ${createdProducts.length} electronic gadgets`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase(); 