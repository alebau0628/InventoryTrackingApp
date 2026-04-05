-- ============================================================
-- Seed data — Photo Lab Inventory
-- Run once in the Supabase SQL editor on an empty items table.
-- ============================================================
--
-- NOTE: low_stock_threshold is set to 1 for everything as a
-- starting point. Adjust per item after loading.
--
-- NOTE: Printer model normalised to "P20070" throughout
-- (the ink heading read "P200700" — verify this is correct).
-- ============================================================

INSERT INTO items (name, category, unit, size, printer, current_stock, low_stock_threshold) VALUES

-- ── Art Paper Rolls ─────────────────────────────────────────

('Canson Edition Etching Rag',    'Art Paper Rolls', 'rolls', '24"', NULL, 3, 1),
('Canson Edition Etching Rag',    'Art Paper Rolls', 'rolls', '36"', NULL, 1, 1),
('Canson Edition Etching Rag',    'Art Paper Rolls', 'rolls', '44"', NULL, 1, 1),

('Canson Aquarelle Rag',          'Art Paper Rolls', 'rolls', '24"', NULL, 4, 1),
('Canson Aquarelle Rag',          'Art Paper Rolls', 'rolls', '36"', NULL, 1, 1),
('Canson Aquarelle Rag',          'Art Paper Rolls', 'rolls', '44"', NULL, 4, 1),

('Canson Rag Photographique II',  'Art Paper Rolls', 'rolls', '24"', NULL, 7, 1),
('Canson Rag Photographique II',  'Art Paper Rolls', 'rolls', '36"', NULL, 1, 1),
('Canson Rag Photographique II',  'Art Paper Rolls', 'rolls', '44"', NULL, 1, 1),
('Canson Rag Photographique II',  'Art Paper Rolls', 'rolls', '60"', NULL, 2, 1),

('Ilford Galerie Gold Fibre',     'Art Paper Rolls', 'rolls', '24"', NULL, 2, 1),
('Ilford Galerie Gold Fibre',     'Art Paper Rolls', 'rolls', '44"', NULL, 1, 1),

('Canson Platine Fibre Rag',      'Art Paper Rolls', 'rolls', '44"', NULL, 1, 1),
('Canson Platine Fibre Rag',      'Art Paper Rolls', 'rolls', '60"', NULL, 1, 1),

-- ── Lustre Paper Rolls ──────────────────────────────────────

('Kodak Lustre', 'Lustre Paper Rolls', 'rolls', '44"', NULL, 4, 1),

-- ── Decal Paper Rolls ───────────────────────────────────────

('Photo Decal', 'Decal Paper Rolls', 'rolls', '24"', NULL, 1, 1),
('Photo Decal', 'Decal Paper Rolls', 'rolls', '42"', NULL, 2, 1),

-- ── Canvas Rolls ────────────────────────────────────────────

('Canvas', 'Canvas Rolls', 'rolls', '24"', NULL, 3, 1),
('Canvas', 'Canvas Rolls', 'rolls', '36"', NULL, 2, 1),
('Canvas', 'Canvas Rolls', 'rolls', '44"', NULL, 3, 1),
('Canvas', 'Canvas Rolls', 'rolls', '60"', NULL, 2, 1),

-- ── Ink Cartridges — P20070 ─────────────────────────────────

('Ink Cartridge', 'Ink Cartridges', 'cartridges', 'VLM', 'P20070', 1, 1),
('Ink Cartridge', 'Ink Cartridges', 'cartridges', 'C',   'P20070', 1, 1),
('Ink Cartridge', 'Ink Cartridges', 'cartridges', 'GY',  'P20070', 1, 1),
('Ink Cartridge', 'Ink Cartridges', 'cartridges', 'LGY', 'P20070', 1, 1),
('Ink Cartridge', 'Ink Cartridges', 'cartridges', 'LC',  'P20070', 3, 1),
('Ink Cartridge', 'Ink Cartridges', 'cartridges', 'PK',  'P20070', 2, 1),
('Ink Cartridge', 'Ink Cartridges', 'cartridges', 'MK',  'P20070', 2, 1),
('Ink Cartridge', 'Ink Cartridges', 'cartridges', 'DGY', 'P20070', 2, 1),

-- ── Ink Cartridges — P9560 ──────────────────────────────────

('Ink Cartridge', 'Ink Cartridges', 'cartridges', 'GY',  'P9560', 2, 1),
('Ink Cartridge', 'Ink Cartridges', 'cartridges', 'VM',  'P9560', 1, 1),
('Ink Cartridge', 'Ink Cartridges', 'cartridges', 'OR',  'P9560', 1, 1),
('Ink Cartridge', 'Ink Cartridges', 'cartridges', 'PK',  'P9560', 2, 1),
('Ink Cartridge', 'Ink Cartridges', 'cartridges', 'VLM', 'P9560', 2, 1),
('Ink Cartridge', 'Ink Cartridges', 'cartridges', 'LGY', 'P9560', 1, 1),
('Ink Cartridge', 'Ink Cartridges', 'cartridges', 'LC',  'P9560', 1, 1),
('Ink Cartridge', 'Ink Cartridges', 'cartridges', 'Y',   'P9560', 1, 1),
('Ink Cartridge', 'Ink Cartridges', 'cartridges', 'GR',  'P9560', 1, 1),
('Ink Cartridge', 'Ink Cartridges', 'cartridges', 'MK',  'P9560', 1, 1),
('Ink Cartridge', 'Ink Cartridges', 'cartridges', 'V',   'P9560', 1, 1),
('Ink Cartridge', 'Ink Cartridges', 'cartridges', 'C',   'P9560', 2, 1),

-- ── Other ───────────────────────────────────────────────────

('Maintenance Box', 'Other', 'boxes', NULL, 'P9560',  3, 1),
('Maintenance Box', 'Other', 'boxes', NULL, 'P20070', 2, 1),

('Ilford Galerie Canvas Protect MATT 4L', 'Other', 'bottles', NULL, NULL, 6, 2);
