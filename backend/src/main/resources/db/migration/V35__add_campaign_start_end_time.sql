-- Add start_time and end_time columns to campaign table
ALTER TABLE campaign
ADD COLUMN start_time TIME DEFAULT '08:00:00',
ADD COLUMN end_time TIME DEFAULT '18:00:00';

-- Update existing campaigns to have default times
UPDATE campaign SET start_time = '08:00:00', end_time = '18:00:00' WHERE start_time IS NULL OR end_time IS NULL;

-- Make columns NOT NULL after setting defaults
ALTER TABLE campaign
MODIFY COLUMN start_time TIME NOT NULL,
MODIFY COLUMN end_time TIME NOT NULL;
