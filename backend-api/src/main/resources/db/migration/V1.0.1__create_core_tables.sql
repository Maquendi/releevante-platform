CREATE SCHEMA core AUTHORIZATION coex;

CREATE TABLE core.book_editions (
  isbn varchar(36) NOT NULL,
  title varchar(250) NULL,
  price numeric NOT NULL,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT isbn_pk PRIMARY KEY(isbn)
);

CREATE TABLE core.carts (
	id varchar(36) NOT NULL,
	client_id varchar(36) NULL,
	state varchar(50) NOT NULL,
	created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT carts_p_key PRIMARY KEY (id)
);

CREATE TABLE core.cart_items (
	id varchar(36) NOT NULL,
	book_id varchar(36) NULL,
	isbn varchar(36) NOT NULL,
	item_price numeric NOT NULL,
	qty numeric NOT NULL,
	cart_id varchar(36) NOT NULL,
	created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT cart_items_p_key PRIMARY KEY (id),
	FOREIGN KEY(cart_id) REFERENCES core.carts(id),
	FOREIGN KEY(isbn) REFERENCES core.book_editions(isbn)
);


CREATE TABLE core.book_reservation_detail (
	id varchar(36) NOT NULL,
	isbn varchar(36) NOT NULL,
	qty numeric NOT NULL,
	CONSTRAINT book_reservation_detail_pk PRIMARY KEY (id),
	FOREIGN KEY (isbn) REFERENCES core.book_editions(isbn)
);


CREATE TABLE core.book_reservations (
	id varchar(36) NOT NULL,
	client_id varchar(36) NOT NULL,
	start_time timestamp NOT NULL,
    end_time timestamp NOT NULL,
	created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT book_reservations_p_key PRIMARY KEY (id)
);

CREATE TABLE core.auth_clients (
	id varchar(50) NOT NULL,
	secret varchar(250) NOT NULL,
	org_id varchar(36) NOT NULL,
	CONSTRAINT client_id_key PRIMARY KEY (id)
);

CREATE TABLE core.smart_library_access_ctrl (
	id varchar(36) NOT NULL,
	slid varchar(36) NOT NULL,
	is_active BOOLEAN NOT NULL DEFAULT false,
	org_id varchar(36) NOT NULL,
	access_code varchar(100) NULL,
	nfc_hash varchar(100) NULL,
	created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT slid_acc_id PRIMARY KEY (id),
	FOREIGN KEY (org_id) REFERENCES identity_management.org(id)
);

CREATE TABLE core.smart_library (
	slid varchar(36) NOT NULL,
	org_id varchar(36) NOT NULL,
	is_active boolean NOT NULL DEFAULT false,
	CONSTRAINT slid_key PRIMARY KEY (slid)
);