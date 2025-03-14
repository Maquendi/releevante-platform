    INSERT INTO core.org(id, name, type, is_active)
    VALUES ('4e47b8d6-c330-4cd6-9d46-e484a79f0b26', 'Master', 'master org', true);

    INSERT INTO core.org(id, name, type, is_active)
    VALUES ('4e11b8d6-c330-4cd6-9d46-e484a79f0b88', 'Hotel Punta Cana Bavaro Beach', 'All inclusive resort', true);

    INSERT INTO core.org(id, name, type, is_active)
    VALUES ('4e11b8d6-c797-4cd6-9d46-e484a79f0b66', 'Hotel Hyatt', 'All inclusive resort', true);

	INSERT INTO core.accounts(id, user_name, password_hash, email, roles, is_active, org_id)
	VALUES ('0b96ac7b-1191-4af3-a3c3-7842bd0c9a64', 'superAdmin', '$2a$10$16GykcL0tOjHsdnLznirSup/tBo5JPUcWa2pAU51CuG8mbCsP0v3e', 'super_admin@gmail.com', Array['SYSADMIN','ADMIN','CLIENT','AGGREGATOR'], true, '4e47b8d6-c330-4cd6-9d46-e484a79f0b26');

    INSERT INTO core.users(id, full_name, email, phone_number)
	VALUES ('0b96ac7b-1191-4af3-a3c3-7842bd0c9a64', 'John Doe', 'super_admin@gmail.com', '829-120-0000');

   --helloworld12345
	INSERT INTO core.accounts(id, user_name, password_hash, email, roles, is_active, org_id)
    VALUES ('0b96ac7b-1191-4af3-a7c9-7842bd0c9a00', 'bavaroBeachAdmin', '$2a$10$16GykcL0tOjHsdnLznirSup/tBo5JPUcWa2pAU51CuG8mbCsP0v3e', 'admin@bavarobeachhotel.com', Array['ADMIN','CLIENT'], true, '4e11b8d6-c330-4cd6-9d46-e484a79f0b88');

    INSERT INTO core.accounts(id, user_name, password_hash, email, roles, is_active, org_id)
    VALUES ('0b96ac7b-7777-4af3-a7c9-7842bd0c9a55', 'hyattAdmin', '$2a$10$16GykcL0tOjHsdnLznirSup/tBo5JPUcWa2pAU51CuG8mbCsP0v3e', 'admin@hyatthotel.com', Array['ADMIN', 'CLIENT'], true, '4e11b8d6-c797-4cd6-9d46-e484a79f0b66');

    INSERT INTO core.users(id, full_name, email, phone_number)
    VALUES ('0b96ac7b-7777-4af3-a7c9-7842bd0c9a55', 'Susan Gunter', 'admin@hyatthotel.com', '829-777-6666');

    INSERT INTO core.users(id, full_name, email, phone_number)
    VALUES ('0b96ac7b-1191-4af3-a7c9-7842bd0c9a00', 'Leticia Amparo', 'admin@bavarobeachhotel.com', '829-000-1111');

    INSERT INTO core.roles(id, role, privilege)
    VALUES ('6593af1c-1427-4bed-8875-184b256ae141','admin', 'org:view');

    INSERT INTO core.roles(id, role, privilege)
    VALUES ('6593af1c-1427-4bed-8875-184b256ae000','admin', 'org:update');

    INSERT INTO core.roles(id, role, privilege)
    VALUES ('6593af1c-1427-4bed-8875-184b256ae963','admin', 'access:create');

    INSERT INTO core.roles(id, role, privilege)
    VALUES ('6593af1c-1427-4bed-8875-184b256ae999','super-admin', 'all:all');

    INSERT INTO core.smart_libraries(slid, model_name)
    VALUES ('4e47b8d6-c330-4cd6-9d46-e484a79f0b00', 'smart library v.0.0.1');

    INSERT INTO core.smart_libraries(slid, model_name)
    VALUES ('4e47b8d6-c330-4cd6-9d46-e484a79f8b99', 'smart library v.0.0.2');

    INSERT INTO core.library_events
    (id, "type", slid, created_at)
    VALUES('4e47b8d6-c330-4cd6-9d46-e484a79f0b85', 'never', '4e47b8d6-c330-4cd6-9d46-e484a79f0b00', '2024-11-16 11:43:36.113');
    INSERT INTO core.library_events
    (id, "type", slid, created_at)
    VALUES('4e47b8d6-c330-4cd6-9d46-e484a79f0b96', 'online', '4e47b8d6-c330-4cd6-9d46-e484a79f0b00', '2024-11-17 11:43:36.113');
    INSERT INTO core.library_events
    (id, "type", slid, created_at)
    VALUES('4e47b8d6-c330-4cd6-9d46-e484a79f8b44', 'online', '4e47b8d6-c330-4cd6-9d46-e484a79f8b99', '2024-11-17 11:43:36.113');

    INSERT INTO core.authorized_origins(id,type, org_id,is_active, role, session_ttl_hours)
    VALUES ('4e47b8d6-c330-4cd6-9d46-e484a79f0b00', 'smart library v.0.0.1', '4e11b8d6-c330-4cd6-9d46-e484a79f0b88', true, 'AGGREGATOR', 240);

    INSERT INTO core.authorized_origins(id,type, org_id,is_active, role, session_ttl_hours)
    VALUES ('4e47b8d6-c330-4cd6-9d46-e484a79f8b99', 'smart library v.0.0.2', '4e11b8d6-c797-4cd6-9d46-e484a79f0b66', true, 'AGGREGATOR', 240);

    INSERT INTO core.authorized_origins(id, type, org_id, is_active, role, session_ttl_hours)
    VALUES ('3882be68-68ba-4d5f-8d62-38f8e79ae2dd', 'ui-web', '4e47b8d6-c330-4cd6-9d46-e484a79f0b26', true, 'UI-WEB-PUBLIC', 24);

    INSERT INTO core.authorized_origins(id, type, org_id, is_active, role, session_ttl_hours)
    VALUES ('6a031db4-9a4b-4966-964f-a4dfaf58490f', 'ui-web', '4e47b8d6-c330-4cd6-9d46-e484a79f0b26', true, 'UI-WEB-ADMIN', 24);