-- Reset navigation_nodes and navigation_paths to sample-data.sql values
-- This will clean up any auto-generated nodes and restore the original structure

-- Step 1: Clear all existing navigation data
DELETE FROM navigation_paths;
DELETE FROM navigation_nodes;

-- Step 2: Update rooms to remove node_id references temporarily
UPDATE rooms SET node_id = NULL;

-- Step 3: Insert sample navigation nodes
-- Using ACTUAL floor IDs from your database:
-- Floor 1: 00000000-0000-0000-0000-00000000f001
-- Floor 2: 00000000-0000-0000-0000-00000000f002
-- Floor 3: 00000000-0000-0000-0000-00000000f003

-- Insert navigation nodes for Floor 1 (entrance + elevator + junctions only)
INSERT INTO navigation_nodes (id, floor_id, x, y, node_type, name) VALUES
('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00000000f001', 25.0, 5.0, 'entrance', 'Main Entrance'),
('20000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-00000000f001', 25.0, 20.0, 'elevator', 'Elevator Lobby'),
('20000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-00000000f001', 15.0, 20.0, 'junction', 'West Junction'),
('20000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-00000000f001', 35.0, 20.0, 'junction', 'East Junction');

-- Insert navigation nodes for Floor 2 (elevator + junctions only)
INSERT INTO navigation_nodes (id, floor_id, x, y, node_type, name) VALUES
('20000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-00000000f002', 25.0, 20.0, 'elevator', 'Elevator Lobby'),
('20000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-00000000f002', 15.0, 20.0, 'junction', 'West Junction'),
('20000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-00000000f002', 35.0, 20.0, 'junction', 'East Junction');

-- Insert navigation nodes for Floor 3
INSERT INTO navigation_nodes (id, floor_id, x, y, node_type, name) VALUES
('20000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-00000000f003', 25.0, 20.0, 'elevator', 'Elevator Lobby'),
('20000000-0000-0000-0000-000000000023', '00000000-0000-0000-0000-00000000f003', 15.0, 20.0, 'junction', 'West Junction'),
('20000000-0000-0000-0000-000000000024', '00000000-0000-0000-0000-00000000f003', 35.0, 20.0, 'junction', 'East Junction');

-- Insert navigation nodes for Floor 4
INSERT INTO navigation_nodes (id, floor_id, x, y, node_type, name) VALUES
('20000000-0000-0000-0000-000000000032', '4f13a6a6-b5e4-410c-92a4-3b35529e855a', 25.0, 20.0, 'elevator', 'Elevator Lobby'),
('20000000-0000-0000-0000-000000000033', '4f13a6a6-b5e4-410c-92a4-3b35529e855a', 15.0, 20.0, 'junction', 'West Junction'),
('20000000-0000-0000-0000-000000000034', '4f13a6a6-b5e4-410c-92a4-3b35529e855a', 35.0, 20.0, 'junction', 'East Junction');

-- Insert navigation nodes for Floor 5
INSERT INTO navigation_nodes (id, floor_id, x, y, node_type, name) VALUES
('20000000-0000-0000-0000-000000000042', '02cbd1d2-0e0f-434d-b89e-ca13f080e674', 25.0, 20.0, 'elevator', 'Elevator Lobby'),
('20000000-0000-0000-0000-000000000043', '02cbd1d2-0e0f-434d-b89e-ca13f080e674', 15.0, 20.0, 'junction', 'West Junction'),
('20000000-0000-0000-0000-000000000044', '02cbd1d2-0e0f-434d-b89e-ca13f080e674', 35.0, 20.0, 'junction', 'East Junction');

-- Insert navigation nodes for Floor 6
INSERT INTO navigation_nodes (id, floor_id, x, y, node_type, name) VALUES
('20000000-0000-0000-0000-000000000052', '0a18aa20-6cc2-427f-9e13-b51c950c1bb3', 25.0, 20.0, 'elevator', 'Elevator Lobby'),
('20000000-0000-0000-0000-000000000053', '0a18aa20-6cc2-427f-9e13-b51c950c1bb3', 15.0, 20.0, 'junction', 'West Junction'),
('20000000-0000-0000-0000-000000000054', '0a18aa20-6cc2-427f-9e13-b51c950c1bb3', 35.0, 20.0, 'junction', 'East Junction');

-- Insert navigation nodes for Floor 7
INSERT INTO navigation_nodes (id, floor_id, x, y, node_type, name) VALUES
('20000000-0000-0000-0000-000000000062', '91ff87c3-420f-4f4c-866e-46890acbd429', 25.0, 20.0, 'elevator', 'Elevator Lobby'),
('20000000-0000-0000-0000-000000000063', '91ff87c3-420f-4f4c-866e-46890acbd429', 15.0, 20.0, 'junction', 'West Junction'),
('20000000-0000-0000-0000-000000000064', '91ff87c3-420f-4f4c-866e-46890acbd429', 35.0, 20.0, 'junction', 'East Junction');

-- Step 4: Insert navigation paths (hallway connections only, no room nodes needed)
-- Rooms already have their own coordinates in the rooms table
-- Floor 1 paths (entrance → elevator → junctions)
INSERT INTO navigation_paths (from_node_id, to_node_id, distance, direction, instructions) VALUES
('20000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000002', 15.0, 'north', 'Walk straight north'),
('20000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 15.0, 'south', 'Walk straight south'),
('20000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000003', 10.0, 'west', 'Turn left'),
('20000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', 10.0, 'east', 'Turn right'),
('20000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000004', 10.0, 'east', 'Turn right'),
('20000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000002', 10.0, 'west', 'Turn left');

-- Floor 2 paths (elevator → junctions)
INSERT INTO navigation_paths (from_node_id, to_node_id, distance, direction, instructions) VALUES
('20000000-0000-0000-0000-000000000012', '20000000-0000-0000-0000-000000000013', 10.0, 'west', 'Turn left'),
('20000000-0000-0000-0000-000000000013', '20000000-0000-0000-0000-000000000012', 10.0, 'east', 'Turn right'),
('20000000-0000-0000-0000-000000000012', '20000000-0000-0000-0000-000000000014', 10.0, 'east', 'Turn right'),
('20000000-0000-0000-0000-000000000014', '20000000-0000-0000-0000-000000000012', 10.0, 'west', 'Turn left');

-- Floor 3 paths (elevator → junctions)
INSERT INTO navigation_paths (from_node_id, to_node_id, distance, direction, instructions) VALUES
('20000000-0000-0000-0000-000000000022', '20000000-0000-0000-0000-000000000023', 10.0, 'west', 'Turn left'),
('20000000-0000-0000-0000-000000000023', '20000000-0000-0000-0000-000000000022', 10.0, 'east', 'Turn right'),
('20000000-0000-0000-0000-000000000022', '20000000-0000-0000-0000-000000000024', 10.0, 'east', 'Turn right'),
('20000000-0000-0000-0000-000000000024', '20000000-0000-0000-0000-000000000022', 10.0, 'west', 'Turn left');

-- Floor 4 paths (elevator → junctions)
INSERT INTO navigation_paths (from_node_id, to_node_id, distance, direction, instructions) VALUES
('20000000-0000-0000-0000-000000000032', '20000000-0000-0000-0000-000000000033', 10.0, 'west', 'Turn left'),
('20000000-0000-0000-0000-000000000033', '20000000-0000-0000-0000-000000000032', 10.0, 'east', 'Turn right'),
('20000000-0000-0000-0000-000000000032', '20000000-0000-0000-0000-000000000034', 10.0, 'east', 'Turn right'),
('20000000-0000-0000-0000-000000000034', '20000000-0000-0000-0000-000000000032', 10.0, 'west', 'Turn left');

-- Floor 5 paths (elevator → junctions)
INSERT INTO navigation_paths (from_node_id, to_node_id, distance, direction, instructions) VALUES
('20000000-0000-0000-0000-000000000042', '20000000-0000-0000-0000-000000000043', 10.0, 'west', 'Turn left'),
('20000000-0000-0000-0000-000000000043', '20000000-0000-0000-0000-000000000042', 10.0, 'east', 'Turn right'),
('20000000-0000-0000-0000-000000000042', '20000000-0000-0000-0000-000000000044', 10.0, 'east', 'Turn right'),
('20000000-0000-0000-0000-000000000044', '20000000-0000-0000-0000-000000000042', 10.0, 'west', 'Turn left');

-- Floor 6 paths (elevator → junctions)
INSERT INTO navigation_paths (from_node_id, to_node_id, distance, direction, instructions) VALUES
('20000000-0000-0000-0000-000000000052', '20000000-0000-0000-0000-000000000053', 10.0, 'west', 'Turn left'),
('20000000-0000-0000-0000-000000000053', '20000000-0000-0000-0000-000000000052', 10.0, 'east', 'Turn right'),
('20000000-0000-0000-0000-000000000052', '20000000-0000-0000-0000-000000000054', 10.0, 'east', 'Turn right'),
('20000000-0000-0000-0000-000000000054', '20000000-0000-0000-0000-000000000052', 10.0, 'west', 'Turn left');

-- Floor 7 paths (elevator → junctions)
INSERT INTO navigation_paths (from_node_id, to_node_id, distance, direction, instructions) VALUES
('20000000-0000-0000-0000-000000000062', '20000000-0000-0000-0000-000000000063', 10.0, 'west', 'Turn left'),
('20000000-0000-0000-0000-000000000063', '20000000-0000-0000-0000-000000000062', 10.0, 'east', 'Turn right'),
('20000000-0000-0000-0000-000000000062', '20000000-0000-0000-0000-000000000064', 10.0, 'east', 'Turn right'),
('20000000-0000-0000-0000-000000000064', '20000000-0000-0000-0000-000000000062', 10.0, 'west', 'Turn left');

-- Step 6: Verify results
SELECT 'Navigation Nodes Reset Complete!' as status;
SELECT floor_id, COUNT(*) as node_count FROM navigation_nodes GROUP BY floor_id ORDER BY floor_id;
SELECT 'Total Navigation Paths:' as label, COUNT(*) as count FROM navigation_paths;
