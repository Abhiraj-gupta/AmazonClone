-- Seed data for AmazonClone
-- Run AFTER schema.sql: psql -d <db> -f backend/db/seed.sql

BEGIN;

-- ─── Categories ───
INSERT INTO categories (id, name) VALUES
  (1, 'Men'),
  (2, 'Women'),
  (3, 'Electronics'),
  (4, 'House Essentials'),
  (5, 'Car Accessories')
ON CONFLICT (name) DO NOTHING;

SELECT setval('categories_id_seq', 5, true);

-- ─── Men (category_id = 1) ───
INSERT INTO products (id, name, description, price, category_id, stock, rating, review_count) VALUES
(1,  'Classic Fit Cotton Crew T-Shirt',          'Soft 100% ring-spun cotton tee in a classic relaxed fit. Pre-shrunk to maintain shape wash after wash.', 24.99, 1, 50, 4.3, 1284),
(2,  'Slim Fit Stretch Chino Pants',             'Modern slim-fit chinos with 2% elastane for all-day comfort. Flat-front design with zip fly.', 39.99, 1, 35, 4.1, 876),
(3,  'Leather Bifold Wallet',                    'Genuine full-grain leather wallet with RFID blocking. 8 card slots, 2 bill compartments, and ID window.', 29.99, 1, 80, 4.5, 2103),
(4,  'Running Shoes - Lightweight Mesh',         'Breathable mesh upper with EVA cushioned sole. Ideal for daily runs and gym workouts.', 59.99, 1, 25, 4.4, 1547),
(5,  'Stainless Steel Chronograph Watch',        'Water-resistant to 50m with luminous hands and date display. Japanese quartz movement.', 89.99, 1, 15, 4.6, 932)
ON CONFLICT DO NOTHING;

-- ─── Women (category_id = 2) ───
INSERT INTO products (id, name, description, price, category_id, stock, rating, review_count) VALUES
(6,  'Floral Print Wrap Dress',                  'Lightweight V-neck wrap dress with adjustable tie waist. Perfect for casual outings and brunch.', 34.99, 2, 40, 4.4, 1890),
(7,  'High-Waist Yoga Leggings',                 'Squat-proof 4-way stretch leggings with hidden waistband pocket. Moisture-wicking fabric.', 28.99, 2, 60, 4.7, 3201),
(8,  'Crossbody Shoulder Bag',                   'Vegan leather crossbody with adjustable strap and multiple compartments. Fits phones up to 6.7 inches.', 22.99, 2, 45, 4.2, 1456),
(9,  'Sterling Silver Hoop Earrings',            'Hypoallergenic 925 sterling silver hoops. Lightweight click-top closure. Diameter: 30mm.', 19.99, 2, 100, 4.6, 2780),
(10, 'Oversized Knit Cardigan',                  'Chunky knit open-front cardigan with side pockets. One size fits most. Machine washable.', 44.99, 2, 30, 4.3, 1123)
ON CONFLICT DO NOTHING;

-- ─── Electronics (category_id = 3) ───
INSERT INTO products (id, name, description, price, category_id, stock, rating, review_count) VALUES
(11, 'Wireless Bluetooth Earbuds',               'Active noise cancellation with 30-hour total battery life. IPX5 sweat resistant. Touch controls.', 49.99, 3, 70, 4.5, 4523),
(12, '10000mAh Portable Power Bank',             'Fast charging 20W USB-C powerbank. Charge 2 devices simultaneously. LED battery indicator.', 24.99, 3, 90, 4.3, 3102),
(13, 'Mechanical Gaming Keyboard',               'RGB backlit hot-swappable switches. Full anti-ghosting with N-key rollover. Detachable USB-C cable.', 69.99, 3, 20, 4.6, 1876),
(14, '4K Webcam with Ring Light',                '8MP autofocus camera with built-in adjustable ring light. Plug and play USB. Noise-cancelling mic.', 39.99, 3, 35, 4.2, 987),
(15, 'Smart LED Desk Lamp',                      'Eye-care desk lamp with 5 color temperatures and 10 brightness levels. USB charging port. Touch control.', 34.99, 3, 55, 4.4, 2234)
ON CONFLICT DO NOTHING;

-- ─── House Essentials (category_id = 4) ───
INSERT INTO products (id, name, description, price, category_id, stock, rating, review_count) VALUES
(16, 'Bamboo Cutting Board Set (3-Pack)',        'Organic bamboo boards in 3 sizes with juice grooves. BPA-free and knife-friendly surface.', 27.99, 4, 65, 4.5, 1678),
(17, 'Memory Foam Bath Mat',                     'Non-slip absorbent bath mat with velvet surface. Quick-dry technology. Machine washable.', 19.99, 4, 80, 4.3, 2345),
(18, 'Stainless Steel Vacuum Insulated Bottle',  'Double-wall insulation keeps drinks hot 12h or cold 24h. Leak-proof lid. BPA-free. 750ml.', 22.99, 4, 50, 4.7, 3890),
(19, 'LED Motion Sensor Night Light (2-Pack)',   'Auto on/off with motion detection. Warm white glow. Stick-on magnetic mount. Battery operated.', 14.99, 4, 120, 4.4, 4102),
(20, '100% Cotton Bed Sheet Set - Queen',        '400 thread count sateen weave. Deep pocket fitted sheet. Includes flat sheet and 2 pillowcases.', 49.99, 4, 40, 4.6, 2567)
ON CONFLICT DO NOTHING;

-- ─── Car Accessories (category_id = 5) ───
INSERT INTO products (id, name, description, price, category_id, stock, rating, review_count) VALUES
(21, 'Magnetic Phone Mount for Dashboard',       '360° rotation with strong N52 magnets. Universal fit. One-hand operation. No adhesive residue.', 15.99, 5, 100, 4.4, 3456),
(22, 'Dual USB Car Charger - 36W Fast Charge',   'QC 3.0 + USB-C PD fast charging. Aluminum alloy body with LED voltage display.', 12.99, 5, 150, 4.5, 5210),
(23, 'Leather Steering Wheel Cover',             'Genuine microfiber leather with anti-slip design. Universal 14.5-15 inch fit. Breathable and odorless.', 18.99, 5, 55, 4.2, 1890),
(24, 'Trunk Organizer - Foldable',               'Heavy-duty collapsible organizer with 3 compartments and side pockets. Waterproof base. Non-slip bottom.', 25.99, 5, 45, 4.3, 2134),
(25, 'Dash Cam - 1080p Full HD',                 '170° wide-angle lens with night vision. Loop recording, G-sensor, and parking monitor. 32GB card included.', 44.99, 5, 30, 4.6, 3678)
ON CONFLICT DO NOTHING;

SELECT setval('products_id_seq', 25, true);

-- ─── Product Images (real product photos via Unsplash) ───
INSERT INTO product_images (product_id, image_url, alt_text, is_primary, sort_order) VALUES
-- Men
(1,  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop',    'Classic Fit Cotton Crew T-Shirt',   true, 0),
(2,  'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=600&fit=crop',     'Slim Fit Stretch Chino Pants',      true, 0),
(3,  'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=600&fit=crop',     'Leather Bifold Wallet',             true, 0),
(4,  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop',       'Running Shoes',                     true, 0),
(5,  'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=600&fit=crop',     'Stainless Steel Chronograph Watch', true, 0),
-- Women
(6,  'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=600&fit=crop',     'Floral Print Wrap Dress',           true, 0),
(7,  'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&h=600&fit=crop',     'High-Waist Yoga Leggings',          true, 0),
(8,  'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=600&fit=crop',     'Crossbody Shoulder Bag',            true, 0),
(9,  'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop',     'Sterling Silver Hoop Earrings',     true, 0),
(10, 'https://images.unsplash.com/photo-1434389677669-e08b4cda3a0a?w=600&h=600&fit=crop',     'Oversized Knit Cardigan',           true, 0),
-- Electronics
(11, 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=600&h=600&fit=crop',     'Wireless Bluetooth Earbuds',        true, 0),
(12, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600&h=600&fit=crop',     'Portable Power Bank',               true, 0),
(13, 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&h=600&fit=crop',     'Mechanical Gaming Keyboard',        true, 0),
(14, 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=600&fit=crop',     '4K Webcam with Ring Light',         true, 0),
(15, 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=600&h=600&fit=crop',     'Smart LED Desk Lamp',               true, 0),
-- House Essentials
(16, 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=600&h=600&fit=crop',     'Bamboo Cutting Board Set',          true, 0),
(17, 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=600&h=600&fit=crop',     'Memory Foam Bath Mat',              true, 0),
(18, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop',     'Vacuum Insulated Bottle',           true, 0),
(19, 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&h=600&fit=crop',     'LED Motion Sensor Night Light',     true, 0),
(20, 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=600&h=600&fit=crop',     'Cotton Bed Sheet Set',              true, 0),
-- Car Accessories
(21, 'https://source.unsplash.com/600x600/?magnetic,phone,mount,car,dashboard',                'Magnetic Phone Mount',              true, 0),
(22, 'https://source.unsplash.com/600x600/?dual,usb,car,charger',                               'Dual USB Car Charger',              true, 0),
(23, 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&h=600&fit=crop',       'Leather Steering Wheel Cover',      true, 0),
(24, 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=600&h=600&fit=crop',       'Trunk Organizer',                   true, 0),
(25, 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=600&h=600&fit=crop',     'Dash Cam 1080p',                    true, 0)
ON CONFLICT DO NOTHING;

COMMIT;
