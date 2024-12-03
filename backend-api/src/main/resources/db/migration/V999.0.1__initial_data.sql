    INSERT INTO core.org(id, name, type, is_active)
    VALUES ('4e47b8d6-c330-4cd6-9d46-e484a79f0b26', 'Master', 'master org', true);

    INSERT INTO core.org(id, name, type, is_active)
    VALUES ('4e11b8d6-c330-4cd6-9d46-e484a79f0b88', 'Hotel Punta Cana Bavaro Beach', 'All inclusive resort', true);

    INSERT INTO core.org(id, name, type, is_active)
    VALUES ('4e11b8d6-c797-4cd6-9d46-e484a79f0b66', 'Hotel Hyatt', 'All inclusive resort', true);

	INSERT INTO core.accounts(id, user_name, password_hash, email, roles, is_active, org_id)
	VALUES ('0b96ac7b-1191-4af3-a3c3-7842bd0c9a64', 'superAdmin', '$2a$10$16GykcL0tOjHsdnLznirSup/tBo5JPUcWa2pAU51CuG8mbCsP0v3e', 'super_admin@gmail.com', Array['super-admin'], true, '4e47b8d6-c330-4cd6-9d46-e484a79f0b26');

    INSERT INTO core.users(id, account_id, full_name, email, phone_number)
	VALUES ('6593af1c-1427-4bed-8875-184b256ae722', '0b96ac7b-1191-4af3-a3c3-7842bd0c9a64', 'John Doe', 'super_admin@gmail.com', '829-120-0000');

	INSERT INTO core.accounts(id, user_name, password_hash, email, roles, is_active, org_id)
    VALUES ('0b96ac7b-1191-4af3-a7c9-7842bd0c9a00', 'bavaroBeachAdmin', '$2a$10$16GykcL0tOjHsdnLznirSup/tBo5JPUcWa2pAU51CuG8mbCsP0v3e', 'admin@bavarobeachhotel.com', Array['admin'], true, '4e11b8d6-c330-4cd6-9d46-e484a79f0b88');

    INSERT INTO core.accounts(id, user_name, password_hash, email, roles, is_active, org_id)
    VALUES ('0b96ac7b-7777-4af3-a7c9-7842bd0c9a55', 'hyattAdmin', '$2a$10$16GykcL0tOjHsdnLznirSup/tBo5JPUcWa2pAU51CuG8mbCsP0v3e', 'admin@hyatthotel.com', Array['admin'], true, '4e11b8d6-c797-4cd6-9d46-e484a79f0b66');

    INSERT INTO core.users(id, account_id, full_name, email, phone_number)
    VALUES ('6593af1c-0085-4bed-8875-184b256ae630', '0b96ac7b-7777-4af3-a7c9-7842bd0c9a55', 'Susan Gunter', 'admin@hyatthotel.com', '829-777-6666');

    INSERT INTO core.users(id, account_id, full_name, email, phone_number)
    VALUES ('6593af1c-0085-4bed-9620-184b256ae788', '0b96ac7b-1191-4af3-a7c9-7842bd0c9a00', 'Leticia Amparo', 'admin@bavarobeachhotel.com', '829-000-1111');

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

    INSERT INTO core.books(isbn, title, price, correlation_id, author, description, description_fr, description_es, lang, qty)
    VALUES ('4e47b8d6-c330-4cd6-9d46-e484a79f0b66', 'Adentrando a la selva', 145.52, 'c68e5302-d719-488b-9655-aa2739df6c44', 'Homero', 'Deep in the Amazon jungles, there are invaluable treasures, worth exploring.', 'Au cœur de la jungle amazonienne se cachent des trésors inestimables qui valent la peine d’être explorés.', 'En lo profundo de las selvas amazonicas, se encuentran tesoros invaluables, dignos de explorarse.', 'Espanol', 3);

    INSERT INTO core.books(isbn, title, price, correlation_id, author, description, description_fr, description_es, lang, qty)
    VALUES ('4e47b8d6-c330-4cd6-9d46-e484a79f8a44', 'Gran canon', 1450.52, 'c68e5302-d719-488b-9422-aa2739df6c56', 'Homero', 'great book of philosophers', 'grand livre de philosophes', 'gran libro de filosofos', 'Espanol', 5);

    INSERT INTO core.books(isbn, title, price, correlation_id, author, description, description_fr, description_es, lang, qty)
    VALUES ('4e47b8d6-c330-4cd6-9d46-e484a79f9a88', 'Anita no te raje', 160, 'c68e0085-d719-488b-9422-aa2739df6c00', 'Marco aurelio', 'soap opera Anita dont give up.', 'telenovela anita, ne te fâche pas.', 'telenovela anita no te rajes.', 'Espanol', 7 );

	INSERT INTO core.library_inventories(cpy,isbn,slid,is_sync,status)
    VALUES ('4e47b8d6-c330-4cd6-9d46-e484a79f4a99', '4e47b8d6-c330-4cd6-9d46-e484a79f0b66', '4e47b8d6-c330-4cd6-9d46-e484a79f0b00', true, 'AVAILABLE');

	INSERT INTO core.library_inventories(cpy,isbn,slid,is_sync,status)
    VALUES ('4e47b8d6-c330-4cd6-9d46-e484a79f9f52', '4e47b8d6-c330-4cd6-9d46-e484a79f9a88', '4e47b8d6-c330-4cd6-9d46-e484a79f0b00', true, 'AVAILABLE');

	INSERT INTO core.library_inventories(cpy,isbn,slid,is_sync,status)
    VALUES ('4e47b8d6-c330-4cd6-9d46-e484a79f9f11', '4e47b8d6-c330-4cd6-9d46-e484a79f8a44', '4e47b8d6-c330-4cd6-9d46-e484a79f0b00', true, 'AVAILABLE');

    INSERT INTO core.library_inventories(cpy,isbn,slid,is_sync,status)
    VALUES ('4e47b8d6-c330-4cd6-9d46-e484a79f4a33', '4e47b8d6-c330-4cd6-9d46-e484a79f0b66', '4e47b8d6-c330-4cd6-9d46-e484a79f0b00', true, 'AVAILABLE');

    INSERT INTO core.library_events
    (id, "type", slid, created_at)
    VALUES('4e47b8d6-c330-4cd6-9d46-e484a79f0b85', 'never', '4e47b8d6-c330-4cd6-9d46-e484a79f0b00', '2024-11-16 11:43:36.113');
    INSERT INTO core.library_events
    (id, "type", slid, created_at)
    VALUES('4e47b8d6-c330-4cd6-9d46-e484a79f0b96', 'online', '4e47b8d6-c330-4cd6-9d46-e484a79f0b00', '2024-11-17 11:43:36.113');
    INSERT INTO core.library_events
    (id, "type", slid, created_at)
    VALUES('4e47b8d6-c330-4cd6-9d46-e484a79f8b44', 'online', '4e47b8d6-c330-4cd6-9d46-e484a79f8b99', '2024-11-17 11:43:36.113');

    INSERT INTO core.authorized_origins(id,type, org_id,is_active)
    VALUES ('4e47b8d6-c330-4cd6-9d46-e484a79f0b00', 'smart library v.0.0.1', '4e11b8d6-c330-4cd6-9d46-e484a79f0b88', true);

    INSERT INTO core.authorized_origins(id,type, org_id,is_active)
    VALUES ('4e47b8d6-c330-4cd6-9d46-e484a79f8b99', 'smart library v.0.0.2', '4e11b8d6-c797-4cd6-9d46-e484a79f0b66', true);
