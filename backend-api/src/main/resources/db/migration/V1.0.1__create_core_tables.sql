CREATE SCHEMA core AUTHORIZATION coex;


CREATE TABLE core.clients (
	id varchar(36) NOT NULL,
	external_id varchar(36) NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT clients_pk PRIMARY KEY (id)
);

CREATE TABLE core.books (
  isbn varchar(36) NOT NULL,
  title varchar(250) NULL,
  qty numeric NOT NULL,
  price numeric NOT NULL,
  author varchar(120) NOT NULL,
  description varchar(1080) NULL,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT books_pk PRIMARY KEY(isbn)
);

CREATE TABLE core.carts (
	id varchar(36) NOT NULL,
	client_id varchar(36) NULL,
	state varchar(50) NOT NULL,
	created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT carts_pk PRIMARY KEY (id)
);

CREATE TABLE core.cart_items (
	id varchar(36) NOT NULL,
	isbn varchar(36) NULL,
	qty numeric NOT NULL,
	cart_id varchar(36) NOT NULL,
	CONSTRAINT cart_items_pk PRIMARY KEY (id),
	FOREIGN KEY(cart_id) REFERENCES core.carts(id),
	FOREIGN KEY(isbn) REFERENCES core.books(isbn)
);

CREATE TABLE core.book_reservations (
	id varchar(36) NOT NULL,
	client_id varchar(36) NOT NULL,
	start_time timestamp NOT NULL,
    end_time timestamp NOT NULL,
	created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT book_reservations_pk PRIMARY KEY (id),
	FOREIGN KEY(client_id) REFERENCES core.clients(id)
);

CREATE TABLE core.book_reservation_items (
	id varchar(36) NOT NULL,
	qty numeric NOT NULL,
	isbn varchar(36) NOT NULL,
	reservation_id varchar(36) NOT NULL,
	CONSTRAINT book_reservation_items_pk PRIMARY KEY (id),
	FOREIGN KEY (isbn) REFERENCES core.books(isbn),
	FOREIGN KEY (isbn) REFERENCES core.book_reservations(id)
);


CREATE TABLE core.org (
	id varchar(36) NOT NULL,
	name varchar(100) NOT NULL,
	created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT org_pk PRIMARY KEY (id)
);


CREATE TABLE core.smart_libraries (
	slid varchar(36) NOT NULL,
	org_id varchar(36) NOT NULL,
	created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT slid_pk PRIMARY KEY (slid),
	FOREIGN KEY (org_id) REFERENCES core.org(id)
);

CREATE TABLE core.library_inventories (
	cpy varchar(36) NOT NULL,
	isbn varchar(36) NOT NULL,
	slid varchar(36) NOT NULL,
	is_sync BOOLEAN NOT NULL DEFAULT false,
	price numeric NOT NULL,
	status varchar(30) NOT NULL,
	created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT book_copy_pk PRIMARY KEY (cpy),
	FOREIGN KEY (isbn) REFERENCES core.books(isbn),
	FOREIGN KEY (slid) REFERENCES core.smart_libraries(slid)
);

CREATE TABLE core.library_settings (
	id varchar(36) NOT NULL,
	slid varchar(36) NOT NULL,
	max_books_per_loan numeric NOT NULL,
	book_price_discount_percentage numeric NOT NULL DEFAULT 0,
	book_price_surcharge_percentage numeric NOT NULL DEFAULT 0,
	book_price_reduction_threshold numeric NOT NULL DEFAULT 3,
	book_price_reduction_rate_on_threshold_reached numeric NOT NULL,
	created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_sync BOOLEAN NOT NULL DEFAULT false,
	CONSTRAINT setting_id_pk PRIMARY KEY (id),
	FOREIGN KEY (slid) REFERENCES core.smart_libraries(slid)
);

CREATE TABLE core.library_events (
	id varchar(36) NOT NULL,
	type varchar(36) NOT NULL,
	slid varchar(36) NOT NULL,
	created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT library_events_pk PRIMARY KEY (id),
	FOREIGN KEY (slid) REFERENCES core.smart_libraries(slid)
);

CREATE TABLE core.service_ratings (
	client_id varchar(36) NOT NULL,
	org_id varchar(36) NOT NULL,
	rating numeric NOT NULL,
	created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT service_ratings_pk PRIMARY KEY (client_id),
	FOREIGN KEY (org_id) REFERENCES core.org(id),
	FOREIGN KEY (client_id) REFERENCES core.clients(id)
);

CREATE TABLE core.book_ratings (
	id varchar(36) NOT NULL,
	client_id varchar(36) NOT NULL,
	org_id varchar(36) NOT NULL,
	isbn varchar(36) NOT NULL,
	rating numeric NOT NULL,
	created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT book_rating_pk PRIMARY KEY (id),
	FOREIGN KEY (org_id) REFERENCES core.org(id),
	FOREIGN KEY (isbn) REFERENCES core.books(isbn),
	FOREIGN KEY (client_id) REFERENCES core.clients(id)
);

CREATE TABLE core.book_image (
	id varchar(36) NOT NULL,
	isbn varchar(36) NOT NULL,
	url varchar(250) NOT NULL,
	source_url varchar(1080) NOT NULL,
	created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT book_image_pk PRIMARY KEY (id),
	FOREIGN KEY (isbn) REFERENCES core.books(isbn)
);

CREATE TABLE core.book_loans (
	id varchar(36) NOT NULL,
	external_id varchar(36) NOT NULL,
	slid varchar(36) NOT NULL,
	client_id varchar(36) NOT NULL,
	returns_at timestamp NOT NULL,
	returned_at timestamp NULL,
	created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT book_loans_pk PRIMARY KEY (id),
	FOREIGN KEY (slid) REFERENCES core.smart_libraries(slid),
	FOREIGN KEY (client_id) REFERENCES core.clients(id)
);

CREATE TABLE core.loan_items (
	id varchar(36) NOT NULL,
	cpy varchar(36) NOT NULL,
	loan_id varchar(36) NOT NULL,
	CONSTRAINT loan_items_pk PRIMARY KEY (id),
	FOREIGN KEY (cpy) REFERENCES core.library_inventories(cpy),
	FOREIGN KEY (loan_id) REFERENCES core.book_loans(id)
);

CREATE TABLE core.loan_status (
	id varchar(36) NOT NULL,
	loan_id varchar(36) NOT NULL,
	status varchar(50),
	created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT loan_status_pk PRIMARY KEY (id),
	FOREIGN KEY (loan_id) REFERENCES core.book_loans(id)
);

CREATE TABLE core.book_sales (
	id varchar(36) NOT NULL,
	client_id varchar(36) NOT NULL,
	total numeric NOT NULL,
	created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT book_sales_pk PRIMARY KEY (id),
	FOREIGN KEY (client_id) REFERENCES core.clients(id)
);

CREATE TABLE core.sale_items (
	id varchar(36) NOT NULL,
	isbn varchar(36) NOT NULL,
	sale_id varchar(36) NOT NULL,
	cpy varchar(36) NULL,
	price numeric NOT NULL,
	CONSTRAINT sale_items_pk PRIMARY KEY (id),
	FOREIGN KEY (cpy) REFERENCES core.library_inventories(cpy),
	FOREIGN KEY (sale_id) REFERENCES core.book_sales(id),
	FOREIGN KEY (isbn) REFERENCES core.books(isbn)
);
