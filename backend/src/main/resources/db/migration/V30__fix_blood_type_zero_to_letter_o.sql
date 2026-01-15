-- Fix blood types: Convert '0+' and '0-' to 'O+' and 'O-'
UPDATE blood_type SET type = 'O+' WHERE type = '0+';
UPDATE blood_type SET type = 'O-' WHERE type = '0-';
