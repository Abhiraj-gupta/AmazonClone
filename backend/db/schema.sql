-- AmazonClone PostgreSQL schema
-- Run with: psql -d <db> -f backend/db/schema.sql

BEGIN;

CREATE TABLE IF NOT EXISTS categories (
  id            BIGSERIAL PRIMARY KEY,
  name          TEXT NOT NULL UNIQUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id            BIGSERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  description   TEXT,
  price         NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  category_id   BIGINT NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  stock         INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  rating        NUMERIC(2, 1) NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  review_count  INTEGER NOT NULL DEFAULT 0 CHECK (review_count >= 0),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);

CREATE TABLE IF NOT EXISTS product_images (
  id            BIGSERIAL PRIMARY KEY,
  product_id    BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url     TEXT NOT NULL,
  alt_text      TEXT,
  is_primary    BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);

-- Cart items are keyed by a cart identifier (client/session/user can map to this)
CREATE TABLE IF NOT EXISTS cart_items (
  id            BIGSERIAL PRIMARY KEY,
  cart_id       TEXT NOT NULL,
  product_id    BIGINT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity      INTEGER NOT NULL CHECK (quantity > 0),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (cart_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_id ON cart_items(product_id);

CREATE TABLE IF NOT EXISTS orders (
  id            BIGSERIAL PRIMARY KEY,
  status        TEXT NOT NULL DEFAULT 'pending',
  shipping_address JSONB NOT NULL DEFAULT '{}'::jsonb,
  total_amount  NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (total_amount >= 0),
  currency      CHAR(3) NOT NULL DEFAULT 'USD',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id            BIGSERIAL PRIMARY KEY,
  order_id      BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id    BIGINT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity      INTEGER NOT NULL CHECK (quantity > 0),
  unit_price    NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (order_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

COMMIT;

