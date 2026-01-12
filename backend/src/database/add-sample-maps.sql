-- Add sample floor map images to existing floors
-- These are placeholder images - replace with actual floor map URLs from Cloudinary or your storage

-- Update Floor 1 with a sample map
UPDATE floors 
SET map_image_url = 'https://res.cloudinary.com/demo/image/upload/sample.jpg'
WHERE id = '10000000-0000-0000-0000-000000000001';

-- Update Floor 2 with a sample map
UPDATE floors 
SET map_image_url = 'https://res.cloudinary.com/demo/image/upload/sample.jpg'
WHERE id = '10000000-0000-0000-0000-000000000002';

-- Update Floor 3 with a sample map
UPDATE floors 
SET map_image_url = 'https://res.cloudinary.com/demo/image/upload/sample.jpg'
WHERE id = '10000000-0000-0000-0000-000000000003';

-- Verify the updates
SELECT id, floor_number, floor_name, map_image_url FROM floors;

-- Note: To upload actual floor maps:
-- 1. Use the admin panel at http://localhost:3000/admin-panel.html
-- 2. Navigate to the "Floors" section
-- 3. Click "Edit" on a floor
-- 4. Upload your floor map image (PNG, JPG, or SVG)
-- 5. The image will be automatically uploaded to Cloudinary and the URL will be saved
