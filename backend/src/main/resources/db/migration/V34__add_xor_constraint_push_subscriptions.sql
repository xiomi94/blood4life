-- Add XOR constraint to ensure a push subscription belongs to exactly one owner:
-- Either a donor OR a hospital, but not both and not neither.
ALTER TABLE push_subscriptions
ADD CONSTRAINT check_xor_owner 
CHECK (
    (donor_id IS NOT NULL AND hospital_id IS NULL) OR 
    (donor_id IS NULL AND hospital_id IS NOT NULL)
);
