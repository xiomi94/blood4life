-- 1. Delete relationships in blood_type_campaign
DELETE FROM blood_type_campaign 
WHERE campaign IN (SELECT id FROM campaign WHERE name NOT LIKE '%navideña%' AND name NOT LIKE '%navidena%');

-- 2. Delete linked appointments
DELETE FROM appointment
WHERE campaign_id IN (SELECT id FROM campaign WHERE name NOT LIKE '%navideña%' AND name NOT LIKE '%navidena%');

-- 3. Delete campaigns
DELETE FROM campaign 
WHERE name NOT LIKE '%navideña%' AND name NOT LIKE '%navidena%';
