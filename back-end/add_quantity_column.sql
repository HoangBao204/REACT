-- Add quantity column to products table
ALTER TABLE products ADD COLUMN quantity INT DEFAULT 0;

-- Set default quantity for existing products (you can adjust this value)
UPDATE products SET quantity = 50 WHERE quantity IS NULL OR quantity = 0;

-- Add index for better performance on inventory queries
CREATE INDEX idx_products_quantity ON products(quantity); 