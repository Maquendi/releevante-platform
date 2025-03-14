-- Create function
CREATE OR REPLACE FUNCTION update_library_inventory_on_new_transaction_item_status()
RETURNS trigger AS $$
DECLARE
   current_record RECORD;
BEGIN
    IF NEW.status IN ('CHECK_OUT_SUCCESS', 'CHECK_IN_SUCCESS') THEN
       SELECT
          tr.transaction_type,
          ti.cpy
       INTO current_record
       FROM core.transaction_items ti
       LEFT JOIN core.book_transactions tr
            ON tr.id = ti.transaction_id
       WHERE ti.id = NEW.item_id;

       IF NEW.status = 'CHECK_OUT_SUCCESS' THEN
           IF current_record.transaction_type = 'RENT' THEN
               UPDATE core.library_inventories
               SET status = 'BORROWED'
               WHERE cpy = current_record.cpy;
           ELSE
               UPDATE core.library_inventories
               SET status = 'SOLD'
               WHERE cpy = current_record.cpy;
           END IF;
       ELSE -- This corresponds to CHECK_IN_SUCCESS
           UPDATE core.library_inventories
           SET usage_count = usage_count + 1, status = 'AVAILABLE'
           WHERE cpy = current_record.cpy;
       END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


DROP TRIGGER transaction_item_status_insert_trigger ON core.transaction_item_status;
CREATE TRIGGER transaction_item_status_insert_trigger
AFTER INSERT
ON core.transaction_item_status
FOR EACH ROW
EXECUTE FUNCTION update_library_inventory_on_new_transaction_item_status();