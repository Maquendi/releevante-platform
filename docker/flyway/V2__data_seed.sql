    INSERT INTO identity_management.org(id, name, type, is_active)
    VALUES ('4e47b8d6-c330-4cd6-9d46-e484a79f0b26', 'Master', 'master org', true);

	INSERT INTO identity_management.accounts(id, user_name, password_hash, email, roles, is_active, org_id)
	VALUES ('0b96ac7b-1191-4af3-a3c3-7842bd0c9a64', 'admin', '$2a$10$16GykcL0tOjHsdnLznirSup/tBo5JPUcWa2pAU51CuG8mbCsP0v3e', 'super_admin@gmail.com', Array['super-admin'], true, '4e47b8d6-c330-4cd6-9d46-e484a79f0b26');

    INSERT INTO identity_management.roles(role, privilege)
    VALUES ('sys-admin', 'org:create');

    INSERT INTO identity_management.roles(role, privilege)
    VALUES ('super-admin', 'all:all');