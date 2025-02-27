CREATE OR REPLACE PROCEDURE update_library_inventory()
language plpgsql
as $$
begin

with subquery as (
   with items_last_status as (
     select
		tis.item_id,
		max(tis.created_at) as created_at
from
		core.transaction_item_status tis
group by
		tis.item_id,
	tis.is_synced
having
	tis.is_synced = false
)
select
		ti.cpy as copy_id,
		case
			when tis.status = 'CHECK_OUT_SUCCESS'
			then case
			when bt.transaction_type = 'RENT' then 'BORROWED'
			else 'SOLD'
		end
		when tis.status = 'LOST' then 'LOST'
		when tis.status = 'SOLD' then 'SOLD'
		when tis.status = 'DAMAGED' then 'DAMAGED'
		else 'AVAILABLE'
	end
	     as status,
		case
			when tis.status = 'CHECK_IN_SUCCESS' then 1
		else 0
	end
        as usage_count_new
from
		core.transaction_item_status tis
join items_last_status ils on
	ils.created_at = tis.created_at
join core.transaction_items ti on
	ti.id = tis.item_id
join core.book_transactions bt on
	bt.id = ti.transaction_id
)
update
	core.library_inventories li
set
	usage_count = (usage_count + subquery.usage_count_new),
	status = subquery.status,
	is_synced = false
from
	subquery
where
	cpy = subquery.copy_id;

 UPDATE core.transaction_item_status SET is_synced=true where is_synced = false;
commit;
end;
$$;