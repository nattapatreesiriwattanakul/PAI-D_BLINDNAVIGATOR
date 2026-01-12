-- Generated SQL for Floor 4
-- Floor ID: 4f13a6a6-b5e4-410c-92a4-3b35529e855a

-- Insert Rooms:
INSERT INTO rooms (floor_id, room_number, room_name, x, y, description) VALUES
('4f13a6a6-b5e4-410c-92a4-3b35529e855a', '403', 'สำนักงานภาคอุตสาหการ', 39.21, 32.57, '');

INSERT INTO rooms (floor_id, room_number, room_name, x, y, description) VALUES
('4f13a6a6-b5e4-410c-92a4-3b35529e855a', '407', 'สำนักงานภาคเครื่องกล', 24.85, 30.18, '');

INSERT INTO rooms (floor_id, room_number, room_name, x, y, description) VALUES
('4f13a6a6-b5e4-410c-92a4-3b35529e855a', '411', 'ห้องพักอาจารย์', 10.72, 32.92, '');

INSERT INTO rooms (floor_id, room_number, room_name, x, y, description) VALUES
('4f13a6a6-b5e4-410c-92a4-3b35529e855a', '415', 'สำนักงานภาคโยธา', 9.67, 13.99, '');

INSERT INTO rooms (floor_id, room_number, room_name, x, y, description) VALUES
('4f13a6a6-b5e4-410c-92a4-3b35529e855a', '422', 'ห้องพักอาจารย์', 39.51, 7.03, '');

-- Alternative: Insert as Beacons:
INSERT INTO beacons (uuid, major, minor, floor_id, x, y, name, tx_power) VALUES
('FDA50693-A4E2-4FB1-AFCF-C6EB07647825', 1, 403, '4f13a6a6-b5e4-410c-92a4-3b35529e855a', 39.21, 32.57, 'สำนักงานภาคอุตสาหการ', -59);

INSERT INTO beacons (uuid, major, minor, floor_id, x, y, name, tx_power) VALUES
('FDA50693-A4E2-4FB1-AFCF-C6EB07647825', 1, 407, '4f13a6a6-b5e4-410c-92a4-3b35529e855a', 24.85, 30.18, 'สำนักงานภาคเครื่องกล', -59);

INSERT INTO beacons (uuid, major, minor, floor_id, x, y, name, tx_power) VALUES
('FDA50693-A4E2-4FB1-AFCF-C6EB07647825', 1, 411, '4f13a6a6-b5e4-410c-92a4-3b35529e855a', 10.72, 32.92, 'ห้องพักอาจารย์', -59);

INSERT INTO beacons (uuid, major, minor, floor_id, x, y, name, tx_power) VALUES
('FDA50693-A4E2-4FB1-AFCF-C6EB07647825', 1, 415, '4f13a6a6-b5e4-410c-92a4-3b35529e855a', 9.67, 13.99, 'สำนักงานภาคโยธา', -59);

INSERT INTO beacons (uuid, major, minor, floor_id, x, y, name, tx_power) VALUES
('FDA50693-A4E2-4FB1-AFCF-C6EB07647825', 1, 422, '4f13a6a6-b5e4-410c-92a4-3b35529e855a', 39.51, 7.03, 'ห้องพักอาจารย์', -59);

