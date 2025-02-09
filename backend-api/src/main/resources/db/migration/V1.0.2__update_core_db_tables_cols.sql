alter table core.transaction_item_status
add column is_synced boolean NOT NULL DEFAULT false;

alter table core.transaction_status
add column is_synced boolean NOT NULL DEFAULT false;

alter table core.books drop column qty_for_sale;