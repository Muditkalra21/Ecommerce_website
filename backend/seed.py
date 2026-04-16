"""
Database seeding script - Run this to populate the database with sample data.
Usage (from the backend/ directory):
    python seed.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal, engine, Base
from app import models  # noqa: F401 – ensures all models are registered

Base.metadata.create_all(bind=engine)

CATEGORIES = [
    {"name": "Electronics", "slug": "electronics", "icon": "📱", "description": "Latest gadgets and electronics"},
    {"name": "Fashion", "slug": "fashion", "icon": "👗", "description": "Trendy clothing and accessories"},
    {"name": "Home & Kitchen", "slug": "home-kitchen", "icon": "🏠", "description": "Home decor and kitchen essentials"},
    {"name": "Books", "slug": "books", "icon": "📚", "description": "Books across all genres"},
    {"name": "Sports & Fitness", "slug": "sports-fitness", "icon": "🏋️", "description": "Sports equipment and fitness gear"},
    {"name": "Beauty & Health", "slug": "beauty-health", "icon": "💄", "description": "Beauty products and health care"},
    {"name": "Toys & Games", "slug": "toys-games", "icon": "🎮", "description": "Toys, games and entertainment"},
    {"name": "Grocery", "slug": "grocery", "icon": "🛒", "description": "Fresh groceries and daily essentials"},
]

PRODUCTS = [
    # ─── Electronics ──────────────────────────────────────────────────────────
    {
        "name": "Samsung Galaxy S24 Ultra 5G",
        "description": "Latest Samsung flagship with 200MP camera, Snapdragon 8 Gen 3, 5000mAh battery, and S Pen included.",
        "price": 124999, "original_price": 134999, "discount_percent": 7,
        "brand": "Samsung", "stock": 45, "rating": 4.6, "rating_count": 12453,
        "image_url": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80",
        "category_slug": "electronics",
    },
    {
        "name": "Apple iPhone 15 Pro Max",
        "description": "Apple's most powerful iPhone with A17 Pro chip, titanium design, 48MP camera system, and Action button.",
        "price": 159900, "original_price": 164900, "discount_percent": 3,
        "brand": "Apple", "stock": 30, "rating": 4.8, "rating_count": 8921,
        "image_url": "https://images.unsplash.com/photo-1709178295038-acbeec786fcf?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=400&q=80",
        "category_slug": "electronics",
    },
    {
        "name": "OnePlus 12 5G",
        "description": "Snapdragon 8 Gen 3, Hasselblad camera system, 100W SuperVOOC charging, 120Hz LTPO AMOLED display.",
        "price": 64999, "original_price": 72999, "discount_percent": 11,
        "brand": "OnePlus", "stock": 60, "rating": 4.5, "rating_count": 6734,
        "image_url": "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400&q=80",
        "category_slug": "electronics",
    },
    {
        "name": "Sony WH-1000XM5 Wireless Headphones",
        "description": "Industry-leading noise cancellation, 30-hour battery, multipoint connection, speak-to-chat technology.",
        "price": 27990, "original_price": 34990, "discount_percent": 20,
        "brand": "Sony", "stock": 80, "rating": 4.7, "rating_count": 15230,
        "image_url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
        "category_slug": "electronics",
    },
    {
        "name": "Dell XPS 15 Laptop",
        "description": "15.6\" OLED display, Intel Core i9, 32GB RAM, 1TB SSD, NVIDIA RTX 4070. Perfect for creators.",
        "price": 189990, "original_price": 209990, "discount_percent": 10,
        "brand": "Dell", "stock": 20, "rating": 4.6, "rating_count": 3450,
        "image_url": "https://images.unsplash.com/photo-1593642702749-b7d2a804fbcf?w=400&q=80",
        "category_slug": "electronics",
    },
    {
        "name": "Apple iPad Pro 12.9 M2",
        "description": "M2 chip, Liquid Retina XDR display, 5G connectivity, ProMotion 120Hz, works with Apple Pencil.",
        "price": 109900, "original_price": 112900, "discount_percent": 3,
        "brand": "Apple", "stock": 35, "rating": 4.8, "rating_count": 5670,
        "image_url": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80",
        "category_slug": "electronics",
    },
    {
        "name": "boAt Airdopes 141 TWS Earbuds",
        "description": "42H playtime, BEAST mode, IPX4 water resistant, instant voice assistant, bluetooth 5.1.",
        "price": 1299, "original_price": 4490, "discount_percent": 71,
        "brand": "boAt", "stock": 500, "rating": 4.1, "rating_count": 234560,
        "image_url": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80",
        "category_slug": "electronics",
    },
    {
        "name": "Samsung 65\" 4K QLED Smart TV",
        "description": "Quantum Dot technology, 120Hz refresh, Tizen OS, built-in Alexa, OTS sound system.",
        "price": 89990, "original_price": 129990, "discount_percent": 31,
        "brand": "Samsung", "stock": 15, "rating": 4.5, "rating_count": 7823,
        "image_url": "https://images.unsplash.com/photo-1567690187548-f07b1d7bf5a9?q=80&w=736&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=400&q=80",
        "category_slug": "electronics",
    },
    {
        "name": "Canon EOS R50 Mirrorless Camera",
        "description": "24.2MP APS-C sensor, 4K video, Dual Pixel CMOS AF II, lightweight body, perfect for beginners.",
        "price": 68990, "original_price": 79990, "discount_percent": 14,
        "brand": "Canon", "stock": 25, "rating": 4.6, "rating_count": 2340,
        "image_url": "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&q=80",
        "category_slug": "electronics",
    },

    # ─── Fashion ────────────────────────────────────────────────────────────────
    {
        "name": "Levi's 511 Slim Fit Jeans",
        "description": "Classic slim fit jeans in premium stretch denim. 5-pocket styling, sits below waist.",
        "price": 2299, "original_price": 3999, "discount_percent": 43,
        "brand": "Levi's", "stock": 200, "rating": 4.3, "rating_count": 45670,
        "image_url": "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80",
        "category_slug": "fashion",
    },
    {
        "name": "Nike Air Max 270 Sneakers",
        "description": "Max Air unit for all-day cushioning, sleek design, breathable mesh upper, rubber outsole.",
        "price": 11995, "original_price": 14995, "discount_percent": 20,
        "brand": "Nike", "stock": 120, "rating": 4.5, "rating_count": 23450,
        "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80",
        "category_slug": "fashion",
    },
    {
        "name": "Allen Solly Men's Formal Shirt",
        "description": "Premium cotton formal shirt, regular fit, full sleeves, wrinkle resistant fabric.",
        "price": 899, "original_price": 1799, "discount_percent": 50,
        "brand": "Allen Solly", "stock": 350, "rating": 4.2, "rating_count": 18920,
        "image_url": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80",
        "category_slug": "fashion",
    },
    {
        "name": "Roadster Women's Midi Dress",
        "description": "Flowy midi dress with floral print, adjustable straps, suitable for casual and semi-formal occasions.",
        "price": 799, "original_price": 1799, "discount_percent": 56,
        "brand": "Roadster", "stock": 280, "rating": 4.1, "rating_count": 9870,
        "image_url": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80",
        "category_slug": "fashion",
    },
    {
        "name": "Fossil Gen 6 Smartwatch",
        "description": "Wear OS, 1.28\" AMOLED display, heart rate, SpO2, GPS, 3-day battery, premium leather strap.",
        "price": 19995, "original_price": 27995, "discount_percent": 29,
        "brand": "Fossil", "stock": 55, "rating": 4.3, "rating_count": 5640,
        "image_url": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
        "category_slug": "fashion",
    },
    {
        "name": "Peter England Men's Blazer",
        "description": "Single-breasted blazer in premium wool blend, two-button closure, perfect for office wear.",
        "price": 3499, "original_price": 5999, "discount_percent": 42,
        "brand": "Peter England", "stock": 90, "rating": 4.4, "rating_count": 7830,
        "image_url": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80",
        "category_slug": "fashion",
    },
    {
        "name": "Adidas Originals Backpack",
        "description": "Classic trefoil logo, 20L capacity, padded laptop sleeve, water-resistant fabric.",
        "price": 2799, "original_price": 3999, "discount_percent": 30,
        "brand": "Adidas", "stock": 175, "rating": 4.4, "rating_count": 12340,
        "image_url": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80",
        "category_slug": "fashion",
    },

    # ─── Home & Kitchen ─────────────────────────────────────────────────────────
    {
        "name": "Instant Pot Duo 7-in-1 Electric Pressure Cooker",
        "description": "Pressure cooker, slow cooker, rice cooker, steamer, sauté pan, yogurt maker, and warmer in one.",
        "price": 8999, "original_price": 12999, "discount_percent": 31,
        "brand": "Instant Pot", "stock": 70, "rating": 4.6, "rating_count": 34560,
        "image_url": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80",
        "category_slug": "home-kitchen",
    },
    {
        "name": "Dyson V15 Detect Cordless Vacuum",
        "description": "Laser technology detects microscopic dust, up to 60 minutes runtime, HEPA filtration, auto-adapts suction.",
        "price": 52900, "original_price": 62900, "discount_percent": 16,
        "brand": "Dyson", "stock": 25, "rating": 4.7, "rating_count": 8920,
        "image_url": "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&q=80",
        "category_slug": "home-kitchen",
    },
    {
        "name": "Philips Air Fryer XXL HD9650",
        "description": "2.65kg capacity, Rapid Air technology, 1700W, 7 preset cooking programs, dishwasher safe.",
        "price": 12995, "original_price": 18995, "discount_percent": 32,
        "brand": "Philips", "stock": 55, "rating": 4.5, "rating_count": 23780,
        "image_url": "https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&q=80",
        "category_slug": "home-kitchen",
    },
    {
        "name": "IKEA KALLAX Shelf Unit",
        "description": "Can also be used as room divider. Easy to assemble, durable particleboard, multiple color options.",
        "price": 7999, "original_price": 9999, "discount_percent": 20,
        "brand": "IKEA", "stock": 40, "rating": 4.4, "rating_count": 15670,
        "image_url": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",
        "category_slug": "home-kitchen",
    },
    {
        "name": "Prestige Induction Cooktop PIC 6.0",
        "description": "2000W power, feather touch controls, 7 cooking menus, auto shut-off, voltage protection.",
        "price": 2299, "original_price": 3999, "discount_percent": 43,
        "brand": "Prestige", "stock": 120, "rating": 4.3, "rating_count": 45230,
        "image_url": "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=400&q=80",
        "category_slug": "home-kitchen",
    },
    {
        "name": "Bombay Dyeing 400TC Cotton Bedsheet",
        "description": "Premium 100% cotton, double bed size, 2 pillow covers, wrinkle resistant, easy wash.",
        "price": 1299, "original_price": 2499, "discount_percent": 48,
        "brand": "Bombay Dyeing", "stock": 200, "rating": 4.2, "rating_count": 34560,
        "image_url": "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80",
        "category_slug": "home-kitchen",
    },

    # ─── Books ──────────────────────────────────────────────────────────────────
    {
        "name": "Atomic Habits by James Clear",
        "description": "An easy and proven way to build good habits and break bad ones. #1 New York Times bestseller.",
        "price": 459, "original_price": 799, "discount_percent": 43,
        "brand": "Penguin Books", "stock": 500, "rating": 4.8, "rating_count": 123450,
        "image_url": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80",
        "category_slug": "books",
    },
    {
        "name": "The Psychology of Money",
        "description": "Morgan Housel shares 19 short stories exploring the strange ways people think about money.",
        "price": 349, "original_price": 599, "discount_percent": 42,
        "brand": "Jaico Publishing", "stock": 450, "rating": 4.7, "rating_count": 98760,
        "image_url": "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80",
        "category_slug": "books",
    },
    {
        "name": "Rich Dad Poor Dad",
        "description": "Robert Kiyosaki's personal finance classic. What the rich teach their kids about money.",
        "price": 279, "original_price": 450, "discount_percent": 38,
        "brand": "Plata Publishing", "stock": 600, "rating": 4.6, "rating_count": 156780,
        "image_url": "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&q=80",
        "category_slug": "books",
    },
    {
        "name": "Think and Grow Rich",
        "description": "Napoleon Hill's timeless classic on achieving success and wealth through positive thoughts.",
        "price": 199, "original_price": 350, "discount_percent": 43,
        "brand": "Fingerprint", "stock": 400, "rating": 4.5, "rating_count": 89450,
        "image_url": "https://images.unsplash.com/photo-1671774637925-c11dd0051b60?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=400&q=80",
        "category_slug": "books",
    },
    {
        "name": "Harry Potter Complete 7 Books Box Set",
        "description": "All seven books in J.K. Rowling's magical series in a stunning hardcover box set.",
        "price": 3499, "original_price": 5600, "discount_percent": 38,
        "brand": "Bloomsbury", "stock": 150, "rating": 4.9, "rating_count": 234560,
        "image_url": "https://images.unsplash.com/photo-1606819717115-9159c900370b?w=400&q=80",
        "category_slug": "books",
    },
    {
        "name": "Deep Work by Cal Newport",
        "description": "Rules for focused success in a distracted world. Ability to perform deep work is becoming rare.",
        "price": 399, "original_price": 699, "discount_percent": 43,
        "brand": "Piaktus Books", "stock": 300, "rating": 4.7, "rating_count": 56780,
        "image_url": "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400&q=80",
        "category_slug": "books",
    },

    # ─── Sports & Fitness ───────────────────────────────────────────────────────
    {
        "name": "Fitbit Charge 6 Fitness Tracker",
        "description": "Built-in GPS, heart rate, sleep tracking, stress management score, YouTube Music controls.",
        "price": 14999, "original_price": 19999, "discount_percent": 25,
        "brand": "Fitbit", "stock": 65, "rating": 4.4, "rating_count": 12340,
        "image_url": "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&q=80",
        "category_slug": "sports-fitness",
    },
    {
        "name": "Decathlon Domyos Adjustable Dumbbell Set",
        "description": "2x 20kg adjustable dumbbells, quick-lock system, chrome steel, non-slip grip, perfect for home gym.",
        "price": 4999, "original_price": 7999, "discount_percent": 38,
        "brand": "Decathlon", "stock": 80, "rating": 4.5, "rating_count": 23450,
        "image_url": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
        "category_slug": "sports-fitness",
    },
    {
        "name": "Nivia Carbonite Basketball",
        "description": "Official size 7, rubber bladder, deep channel design for better grip, suitable for indoor/outdoor.",
        "price": 699, "original_price": 1299, "discount_percent": 46,
        "brand": "Nivia", "stock": 5, "rating": 4.2, "rating_count": 18920,
        "image_url": "https://plus.unsplash.com/premium_photo-1714573122704-51ae2abc3894?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=400&q=80",
        "category_slug": "sports-fitness",
    },
    {
        "name": "Lifelong Folding Treadmill",
        "description": "5HP motor, 12 preset programs, LCD display, foldable design, suitable for home use up to 100kg.",
        "price": 24999, "original_price": 39999, "discount_percent": 38,
        "brand": "Lifelong", "stock": 30, "rating": 4.1, "rating_count": 8760,
        "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
        "category_slug": "sports-fitness",
    },
    {
        "name": "Yoga Direct 6mm Premium Yoga Mat",
        "description": "Non-slip surface, extra thick 6mm cushioning, lightweight, comes with carrying strap.",
        "price": 1299, "original_price": 2199, "discount_percent": 41,
        "brand": "Yoga Direct", "stock": 250, "rating": 4.4, "rating_count": 45670,
        "image_url": "https://images.unsplash.com/photo-1763043778073-0174fbed4170?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=400&q=80",
        "category_slug": "sports-fitness",
    },

    # ─── Beauty & Health ────────────────────────────────────────────────────────
    {
        "name": "Neutrogena Hydro Boost Water Gel",
        "description": "Oil-free moisturizer with hyaluronic acid, instantly hydrates and smooths skin, non-comedogenic.",
        "price": 899, "original_price": 1299, "discount_percent": 31,
        "brand": "Neutrogena", "stock": 300, "rating": 4.5, "rating_count": 67890,
        "image_url": "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80",
        "category_slug": "beauty-health",
    },
    {
        "name": "Dyson Airwrap Styler",
        "description": "Uses Coanda effect to curl, wave, smooth and dry hair simultaneously without extreme heat.",
        "price": 44900, "original_price": 49900, "discount_percent": 10,
        "brand": "Dyson", "stock": 20, "rating": 4.6, "rating_count": 23450,
        "image_url": "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=400&q=80",
        "category_slug": "beauty-health",
    },
    {
        "name": "Himalaya Purifying Neem Face Wash",
        "description": "Mineral rich neem and turmeric, removes excess oil, fights bacteria, prevents pimples. 200ml.",
        "price": 119, "original_price": 175, "discount_percent": 32,
        "brand": "Himalaya", "stock": 800, "rating": 4.4, "rating_count": 234560,
        "image_url": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80",
        "category_slug": "beauty-health",
    },
    {
        "name": "Philips Beard Trimmer BT3231",
        "description": "12 length settings, self-sharpening blades, 60 min runtime, USB charging, washable.",
        "price": 1299, "original_price": 2295, "discount_percent": 43,
        "brand": "Philips", "stock": 18, "rating": 4.3, "rating_count": 89450,
        "image_url": "https://images.unsplash.com/photo-1508380702597-707c1b00695c?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=400&q=80",
        "category_slug": "beauty-health",
    },
    {
        "name": "L'Oreal Paris Revitalift Serum",
        "description": "1.5% pure hyaluronic acid, plumps and visibly fills wrinkles, suitable for all skin types.",
        "price": 1299, "original_price": 1799, "discount_percent": 28,
        "brand": "L'Oreal Paris", "stock": 220, "rating": 4.5, "rating_count": 45670,
        "image_url": "https://images.unsplash.com/photo-1710382984773-2c04ee8774ed?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=400&q=80",
        "category_slug": "beauty-health",
    },

    # ─── Toys & Games ───────────────────────────────────────────────────────────
    {
        "name": "LEGO Technic Bugatti Chiron 42083",
        "description": "3,599 pieces, 1:8 scale model, working W16 engine, bespoke leather seats, authentic aerodynamics.",
        "price": 29999, "original_price": 36999, "discount_percent": 19,
        "brand": "LEGO", "stock": 25, "rating": 4.8, "rating_count": 12340,
        "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
        "category_slug": "toys-games",
    },
    {
        "name": "PlayStation 5 DualSense Controller",
        "description": "Haptic feedback, adaptive triggers, built-in mic, USB-C charging, 3D audio, new Create button.",
        "price": 6990, "original_price": 7990, "discount_percent": 13,
        "brand": "Sony", "stock": 90, "rating": 4.7, "rating_count": 34560,
        "image_url": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&q=80",
        "category_slug": "toys-games",
    },
    {
        "name": "Hot Wheels Ultimate Garage",
        "description": "5-story garage with elevator, spiral racing ramp, parking for 140+ cars, includes 2 cars.",
        "price": 7999, "original_price": 11999, "discount_percent": 33,
        "brand": "Hot Wheels", "stock": 45, "rating": 4.5, "rating_count": 8760,
        "image_url": "https://images.unsplash.com/photo-1555448049-8affc0fd79f3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=400&q=80",
        "category_slug": "toys-games",
    },
    {
        "name": "Monopoly Deal Card Game",
        "description": "Beloved property trading game in a fast-paced card format. 2-5 players, 15 mins per game.",
        "price": 599, "original_price": 999, "discount_percent": 40,
        "brand": "Hasbro", "stock": 350, "rating": 4.6, "rating_count": 45670,
        "image_url": "https://images.unsplash.com/photo-1703925153100-43afda8b6506?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=400&q=80",
        "category_slug": "toys-games",
    },
    {
        "name": "Funskool Jenga Classic",
        "description": "54 precision-crafted hardwood blocks, skill and action game for 1+ players, ages 6+.",
        "price": 799, "original_price": 1299, "discount_percent": 38,
        "brand": "Funskool", "stock": 200, "rating": 4.4, "rating_count": 23450,
        "image_url": "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=400&q=80",
        "category_slug": "toys-games",
    },

    # ─── Grocery ────────────────────────────────────────────────────────────────
    {
        "name": "Tata Tea Gold Premium Blend 1kg",
        "description": "Premium Assam tea with long leaves and buds, rich taste, strong aroma, freshness guaranteed.",
        "price": 499, "original_price": 599, "discount_percent": 17,
        "brand": "Tata Tea", "stock": 600, "rating": 4.5, "rating_count": 123450,
        "image_url": "https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?w=400&q=80",
        "category_slug": "grocery",
    },
    {
        "name": "Amul Butter 500g",
        "description": "Made from fresh cream, pasteurized, salted butter. Perfect for cooking, baking and spreading.",
        "price": 275, "original_price": 300, "discount_percent": 8,
        "brand": "Amul", "stock": 1000, "rating": 4.7, "rating_count": 234560,
        "image_url": "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&q=80",
        "category_slug": "grocery",
    },
    {
        "name": "Fortune Sunlite Refined Sunflower Oil 5L",
        "description": "Light and healthy sunflower oil, rich in Vitamin E, zero trans fat, ideal for all cooking.",
        "price": 699, "original_price": 849, "discount_percent": 18,
        "brand": "Fortune", "stock": 400, "rating": 4.4, "rating_count": 89450,
        "image_url": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80",
        "category_slug": "grocery",
    },
    {
        "name": "MTR Ready To Eat Palak Paneer",
        "description": "Authentic recipe with fresh paneer and spinach gravy, no preservatives, ready in 3 minutes. 300g.",
        "price": 89, "original_price": 115, "discount_percent": 23,
        "brand": "MTR", "stock": 500, "rating": 4.0, "rating_count": 45670,
        "image_url": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=80",
        "category_slug": "grocery",
    },
    {
        "name": "Himalaya Honey Pure 500g",
        "description": "100% pure raw honey, rich in antioxidants, no added sugar, filtered not heated.",
        "price": 299, "original_price": 399, "discount_percent": 25,
        "brand": "Himalaya", "stock": 300, "rating": 4.3, "rating_count": 56780,
        "image_url": "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80",
        "category_slug": "grocery",
    },
]


def seed():
    from app.models import User, Category, Product  # local import after sys.path set
    db = SessionLocal()
    try:
        if db.query(User).count() > 0:
            print("Database already seeded!")
            return

        print("🌱 Starting database seed...")

        default_user = User(
            id=1,
            name="Mudit Kalra",
            email="mudit0660.be23@chitkara.edu.in",
            phone="+91 9876543210",
            address="Chitkara University",
        )
        db.add(default_user)
        db.flush()
        print("✅ Default user created")

        category_map = {}
        for cat_data in CATEGORIES:
            cat = Category(**cat_data)
            db.add(cat)
            db.flush()
            category_map[cat_data["slug"]] = cat.id
        print(f"✅ {len(CATEGORIES)} categories created")

        for prod_data in PRODUCTS:
            slug = prod_data.pop("category_slug")
            prod = Product(**prod_data, category_id=category_map[slug])
            db.add(prod)
        print(f"✅ {len(PRODUCTS)} products created")

        db.commit()
        print("\n🎉 Database seeded successfully!")
        print(f"   - 1 default user")
        print(f"   - {len(CATEGORIES)} categories")
        print(f"   - {len(PRODUCTS)} products")

    except Exception as e:
        db.rollback()
        print(f"❌ Seeding failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
