CREATE SCHEMA identity_management AUTHORIZATION coex;

CREATE TABLE identity_management.org (
  id varchar(36) NOT NULL,
  name varchar(250) NULL,
  type varchar(50) NOT NULL,
  created_at timestamp NOT NULL,
  updated_at timestamp NOT NULL,
  CONSTRAINT org_pk PRIMARY KEY(id)
);

CREATE TABLE identity_management.accounts (
	id varchar(36) NOT NULL,
	user_name varchar(100) NOT NULL,
	created_at timestamp NOT NULL,
	updated_at timestamp NOT NULL,
	password_hash varchar(250) NOT NULL,
	roles text[] NOT NULL,
	is_active BOOLEAN NOT NULL,
	org_id varchar(36) NOT NULL,
	CONSTRAINT accounts_p_key PRIMARY KEY (id),
	CONSTRAINT user_name_unique UNIQUE (user_name),
	FOREIGN KEY(org_id) REFERENCES identity_management.org(id)
);

CREATE INDEX account_user_name_index ON identity_management.accounts USING btree (user_name);

CREATE TABLE identity_management.users (
	id varchar(36) NOT NULL,
	account_id varchar(36) NOT NULL,
	nfc_hash varchar(250) NULL,
	full_name varchar(250) NULL,
	email varchar NULL,
	phone_number varchar NULL,
	created_at timestamp NOT NULL,
    updated_at timestamp NOT NULL,
	CONSTRAINT id_pk PRIMARY KEY (id),
	FOREIGN KEY (account_id) REFERENCES identity_management.accounts(id)
);

CREATE INDEX user_account_id_index ON identity_management.users USING btree (account_id);

CREATE TABLE identity_management.roles (
	role varchar(50) NOT NULL,
	privilege varchar(100) NOT NULL,
	CONSTRAINT role_p_key PRIMARY KEY (role, privilege)
);

CREATE TABLE identity_management.auth_clients (
	id varchar(50) NOT NULL,
	secret varchar(250) NOT NULL,
	org_id varchar(36) NOT NULL,
	CONSTRAINT client_id_key PRIMARY KEY (id)
);