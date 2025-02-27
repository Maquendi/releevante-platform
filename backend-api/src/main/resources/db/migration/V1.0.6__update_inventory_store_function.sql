CREATE OR REPLACE FUNCTION update_library_inventory_on_transaction_items_status_changed(item_status_id_list TEXT[])
RETURNS INTEGER AS $$
DECLARE
    status_id varchar(36);
    current_record RECORD;
    updated_count INTEGER := array_length(item_status_id_list, 1);
BEGIN
    FOREACH status_id IN ARRAY item_status_id_list LOOP
        SELECT
            tis.item_id,
            tis.status,
            tr.transaction_type,
            ti.cpy
        INTO current_record
        FROM core.transaction_item_status tis
        LEFT JOIN core.transaction_items ti
            ON ti.id = tis.item_id
        LEFT JOIN core.book_transactions tr
            ON tr.id = ti.transaction_id
        WHERE tis.id = status_id;

        IF current_record.status = 'CHECKOUT_SUCCESS' THEN
            IF current_record.transaction_type = 'RENT' THEN
                UPDATE core.library_inventories
                SET is_synced = false,
                    status = 'BORROWED'
                WHERE cpy = current_record.cpy;
            ELSE
                UPDATE core.library_inventories
                SET is_synced = false,
                    status = 'SOLD'
                WHERE cpy = current_record.cpy;
            END IF;
        ELSIF current_record.status = 'CHECKIN_SUCCESS' THEN
            -- increase usage_count by 1
            UPDATE core.library_inventories
            SET is_synced = false,
                usage_count = usage_count + 1,
                status = 'AVAILABLE'
            WHERE cpy = current_record.cpy;
        END IF;

    END LOOP;
    RETURN updated_count;
END;
$$ LANGUAGE plpgsql;





CREATE OR REPLACE FUNCTION update_library_inventory_on_transaction_status_changed(transaction_status_id varchar(36))
RETURNS INTEGER AS $$
DECLARE
    current_record RECORD;
    updated_count INTEGER := 0;
BEGIN
    FOR current_record IN
        SELECT
            tis.item_id,
            tis.status,
            tr.transaction_type,
            ti.cpy
        FROM core.transaction_status ts
        LEFT JOIN core.transaction_items ti
            ON ti.id = tis.item_id
        LEFT JOIN core.transaction_item_status tis
            ON tis.item_id = ti.id
        LEFT JOIN core.book_transactions tr
            ON tr.id = ti.transaction_id
        WHERE ts.id = transaction_status_id
    LOOP
        -- Process each record individually
        IF current_record.status = 'CHECKOUT_SUCCESS' THEN
            IF current_record.transaction_type = 'RENT' THEN
                UPDATE core.library_inventories
                SET is_synced = false,
                    status = 'BORROWED'
                WHERE cpy = current_record.cpy;
            ELSE
                UPDATE core.library_inventories
                SET is_synced = false,
                    status = 'SOLD'
                WHERE cpy = current_record.cpy;
            END IF;
        ELSIF current_record.status = 'CHECKIN_SUCCESS' THEN
            -- Increase usage_count by 1
            UPDATE core.library_inventories
            SET is_synced = false,
                usage_count = usage_count + 1,
                status = 'AVAILABLE'
            WHERE cpy = current_record.cpy;
        END IF;

        -- Track the number of records updated
        updated_count := updated_count + 1;
    END LOOP;

    RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- Create trigger function
create or replace
function trigger_update_library_inventory_on_insert()
returns trigger as $$
begin
    if NEW.status in ('RETURNED', 'CURRENT', 'PARTIAL') then
        perform update_library_inventory_on_transaction_status_changed(NEW.transaction_id);
end if;

return new;
end;

$$ language plpgsql;


DROP TRIGGER transaction_status_insert_trigger ON core.transaction_status;
-- Create trigger
create trigger transaction_status_insert_trigger
after
insert
	on
	core.transaction_status
for each row
execute function trigger_update_library_inventory_on_insert();