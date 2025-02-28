create or replace function update_book_review(book_isbn varchar(36), new_rating numeric) RETURNS VOID AS $$
BEGIN
    UPDATE core.books
     SET rating = ((rating * votes) + new_rating) / (votes + 1),
     votes = votes + 1
    WHERE isbn = book_isbn;

    UPDATE core.library_inventories SET is_synced= false
    WHERE isbn=book_isbn;
END;
$$ LANGUAGE plpgsql;




-- Create trigger function
create or replace
function trigger_update_book_review_on_insert()
returns trigger as $$
begin
   perform update_book_review(NEW.isbn, NEW.rating);
return new;
end;
$$ language plpgsql;


--DROP TRIGGER book_rating_insert_trigger ON core.book_ratings;
-- Create trigger
create trigger book_rating_insert_trigger
after
insert
	on
	core.book_ratings
for each row
execute function trigger_update_book_review_on_insert();