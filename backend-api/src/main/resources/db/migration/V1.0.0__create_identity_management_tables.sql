CREATE SCHEMA identity_management AUTHORIZATION coex;

CREATE TABLE identity_management.org (
  id varchar(36) NOT NULL,
  name varchar(250) NULL,
  type varchar(50) NOT NULL,
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_active boolean NOT NULL DEFAULT false,
  CONSTRAINT org_pk PRIMARY KEY(id)
);

CREATE TABLE identity_management.accounts (
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
	FOREIGN KEY(org_id) REFERENCES identity_management.org(id)
);

CREATE INDEX account_user_name_index ON identity_management.accounts USING btree (user_name);

CREATE TABLE identity_management.users (
	id varchar(36) NOT NULL,
	account_id varchar(36) NOT NULL,
	full_name varchar(250) NULL,
	email varchar NULL,
	phone_number varchar NULL,
	created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT id_pk PRIMARY KEY (id),
	FOREIGN KEY (account_id) REFERENCES identity_management.accounts(id)
);

CREATE INDEX user_account_id_index ON identity_management.users USING btree (account_id);

CREATE TABLE identity_management.roles (
    id varchar(36) NOT NULL,
	role varchar(50) NOT NULL,
	privilege varchar(100) NOT NULL,
	CONSTRAINT role_p_k PRIMARY KEY (id)
);

CREATE TABLE identity_management.smart_library_access_ctrl (
	id varchar(36) NOT NULL,
	org_id varchar(36) NOT NULL,
	slid varchar(36) NOT NULL,
	credential varchar(100) NULL,
	credential_type varchar(100) NULL,
	user_id varchar(36) NOT NULL,
	access_due_days numeric NULL,
	expires_at timestamp NOT NULL,
	is_active BOOLEAN NOT NULL DEFAULT false,
	created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT slid_acc_id PRIMARY KEY (id),
	FOREIGN KEY (org_id) REFERENCES identity_management.org(id)
);

CREATE TABLE identity_management.smart_library (
	slid varchar(36) NOT NULL,
	org_id varchar(36) NOT NULL,
	is_active boolean NOT NULL DEFAULT false,
	CONSTRAINT slid_key PRIMARY KEY (slid)
);