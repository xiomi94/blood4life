USE railway;

-- Delete relationships first
DELETE FROM blood_type_campaign 
WHERE campaign IN (SELECT id FROM campaign WHERE name != 'Campaña navideña' AND name != 'Campana navidena');

-- Delete campaigns
DELETE FROM campaign 
WHERE name != 'Campaña navideña' AND name != 'Campana navidena';
