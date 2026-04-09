SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'invoice_items'
AND column_name = 'quantity';
