CREATE OR REPLACE PROCEDURE update_book_ratings()
language plpgsql
as $$
begin
with subquery as (
  with book_new_ratings as (
select
		br.isbn as book_id,
		avg(br.rating) as rating,
		count(*) votes
from
	core.book_ratings br
group by
		br.isbn,
		br.is_synced
having
		br.is_synced = false
)
select
		b.isbn as book_id,
		case
			when b.rating > 0
	 then (b.rating + bnr.rating)/ 2
		else bnr.rating
	end
	 as rating,
		(b.votes + bnr.votes) as votes
from
		core.books b
join book_new_ratings bnr
on
		bnr.book_id = b.isbn
)
update
	core.books
set
	rating = subquery.rating,
	votes = subquery.votes
from
	subquery
where
	isbn = subquery.book_id;

update
	core.book_ratings
set
	is_synced = true
where
	is_synced = false;

commit;
end;
$$;