CREATE SCHEMA core AUTHORIZATION coex;


CREATE TABLE core.clients (
	id varchar(36) NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT clients_pk PRIMARY KEY (id)
);

CREATE TABLE core.books (
  isbn varchar(36) NOT NULL,
  correlation_id varchar(36) NOT NULL,
  translation_id varchar(36) NOT NULL,
  title varchar(250) NULL,
  qty numeric NOT NULL,
  price numeric NOT NULL,
  author varchar(120) NOT NULL,
  description varchar(1080) NOT NULL,
  description_fr varchar(1080) NOT NULL,
  description_es varchar(1080) NOT NULL,
  lang varchar(50) NOT NULL,
  publisher varchar(120) NOT NULL,
  publish_date timestamp NOT NULL,
  print_length numeric NOT NULL,
  dimensions varchar(60) NOT NULL,
  public_isbn varchar(50) NULL,
  binding_type varchar(30) NULL,
  rating numeric NOT NULL,
  votes numeric NOT NULL,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT books_pk PRIMARY KEY(isbn)
);

CREATE TABLE core.carts (
	id varchar(36) NOT NULL,
	user_id varchar(36) NULL,
	slid varchar(36) NULL,
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
	for_purchase boolean NOT NULL DEFAULT false,
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
  name varchar(250) NULL,
  type varchar(50) NOT NULL,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_active boolean NOT NULL DEFAULT false,
  CONSTRAINT org_pk PRIMARY KEY(id)
);

CREATE TABLE core.smart_libraries (
	slid varchar(36) NOT NULL,
	model_name varchar(100) NOT NULL,
	created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modules numeric NOT NULL DEFAULT 4,
    module_capacity numeric NOT NULL DEFAULT 80,
	CONSTRAINT slid_pk PRIMARY KEY (slid)
);

CREATE TABLE core.library_inventories (
	cpy varchar(36) NOT NULL,
	isbn varchar(36) NOT NULL,
	slid varchar(36) NOT NULL,
	is_sync BOOLEAN NOT NULL DEFAULT false,
	status varchar(30) NOT NULL,
	usage_count numeric NOT NULL DEFAULT 0,
	allocation varchar(20) NOT NULL,
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
	book_price_discount_percentage numeric NOT NULL,
	book_price_surcharge_percentage numeric NOT NULL,
	session_duration_minutes numeric NOT NULL,
	book_price_reduction_threshold numeric NOT NULL,
	book_price_reduction_rate_on_threshold_reached numeric NOT NULL,
	book_usage_count_before_enabling_sale numeric NOT NULL,
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
    is_synced boolean NOT NULL DEFAULT false,
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

CREATE TABLE core.authorized_origins (
	id varchar(36) NOT NULL,
	type varchar(36) NULL,
	org_id varchar(36) NOT NULL,
    is_active boolean NOT NULL DEFAULT false,
	created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT authorized_origin_pk PRIMARY KEY (id)
);

CREATE TABLE core.book_transactions (
	id varchar(36) NOT NULL,
	external_id varchar(36) NOT NULL,
	client_id varchar(36) NOT NULL,
	transaction_type varchar(30) NOT NULL,
	audit varchar(36) NOT NULL,
	origin varchar(36) NOT NULL,
	created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT book_transactions_pk PRIMARY KEY (id),
	FOREIGN KEY (origin) REFERENCES core.authorized_origins(id),
	FOREIGN KEY (client_id) REFERENCES core.clients(id)
);

CREATE TABLE core.transaction_status (
	id varchar(36) NOT NULL,
	transaction_id varchar(36) NOT NULL,
	status varchar(50),
	audit varchar(36) NOT NULL,
    origin varchar(36) NOT NULL,
	created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	is_synced boolean NOT NULL DEFAULT false,
	CONSTRAINT transaction_status_pk PRIMARY KEY (id),
	FOREIGN KEY (transaction_id) REFERENCES core.book_transactions(id)
);

CREATE TABLE core.transaction_items (
	id varchar(36) NOT NULL,
	cpy varchar(36) NOT NULL,
	price numeric NULL,
	transaction_id varchar(36) NOT NULL,
	CONSTRAINT transaction_items_pk PRIMARY KEY (id),
	FOREIGN KEY (cpy) REFERENCES core.library_inventories(cpy),
	FOREIGN KEY (transaction_id) REFERENCES core.book_transactions(id)
);


CREATE TABLE core.transaction_item_status (
	id varchar(36) NOT NULL,
	item_id varchar(36) NOT NULL,
	status varchar(50) NOT NULL,
	created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	audit varchar(36) NOT NULL,
    origin varchar(36) NOT NULL,
    is_synced boolean NOT NULL DEFAULT false,
	CONSTRAINT transaction_item_status_pk PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS transaction_external_id_idx ON core.book_transactions USING btree(external_id);

-- identity

CREATE TABLE core.accounts (
	id varchar(36) NOT NULL,
	user_name varchar(100) NOT NULL,
	password_hash varchar(250) NOT NULL,
	email varchar(100) NOT NULL,
	org_id varchar(36) NOT NULL,
	roles text[] NOT NULL,
	is_active BOOLEAN NOT NULL DEFAULT false,
	created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT accounts_p_key PRIMARY KEY (id),
	CONSTRAINT user_name_unique UNIQUE (user_name),
	FOREIGN KEY(org_id) REFERENCES core.org(id)
);

CREATE INDEX account_user_name_index ON core.accounts USING btree (user_name);

CREATE TABLE core.users (
	id varchar(36) NOT NULL,
	account_id varchar(36) NOT NULL,
	full_name varchar(250) NULL,
	email varchar NULL,
	phone_number varchar NULL,
	created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT id_pk PRIMARY KEY (id),
	FOREIGN KEY (account_id) REFERENCES core.accounts(id)
);

CREATE INDEX user_account_id_index ON core.users USING btree (account_id);

CREATE TABLE core.roles (
    id varchar(36) NOT NULL,
	role varchar(50) NOT NULL,
	privilege varchar(100) NOT NULL,
	created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT role_p_k PRIMARY KEY (id)
);

CREATE TABLE core.smart_library_access_ctrl (
	id varchar(36) NOT NULL,
	org_id varchar(36) NOT NULL,
	slid varchar(36) NOT NULL,
	credential varchar(100) NULL,
	credential_type varchar(100) NULL,
	user_id varchar(36) NOT NULL,
	access_due_days numeric NULL,
	expires_at timestamp NOT NULL,
	is_sync BOOLEAN NOT NULL DEFAULT false,
	is_active BOOLEAN NOT NULL DEFAULT false,
	created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT slid_acc_id PRIMARY KEY (id),
	FOREIGN KEY (org_id) REFERENCES core.org(id)
);

CREATE TABLE core.tasks (
    id varchar(36) NOT NULL,
	name varchar(50) NOT NULL,
	started_at timestamp NOT NULL,
	ended_at timestamp NOT NULL,
	errors text[] NULL,
	result numeric NULL,
	created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT task_p_k PRIMARY KEY (id)
);

CREATE TABLE core.tags (
    id varchar(36) NOT NULL,
	name varchar(50) NOT NULL,
	value_en varchar(255) NOT NULL,
	value_fr varchar(255) NULL,
	value_sp varchar(255) NULL,
	created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT tag_p_k PRIMARY KEY (id)
);


CREATE TABLE core.book_tags (
    id varchar(36) NOT NULL,
	isbn varchar(50) NOT NULL,
	tag_id varchar(36) NOT NULL,
	created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT book_tag_p_k PRIMARY KEY (id),
	FOREIGN KEY (isbn) REFERENCES core.books(isbn),
	FOREIGN KEY (tag_id) REFERENCES core.tags(id)
);
