
PRAGMA foreign_keys = ON;


-- All the table names are themed around the application name: Shoyu

-- Currency, I don't have a sexy name for this...
CREATE TABLE if NOT EXISTS currencies (
    code TEXT PRIMARY KEY CHECK (length(code) = 3),
    name TEXT NOT NULL,

    created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')), 
    updated_at TEXT DEFAULT NULL,
    deleted_at TEXT DEFAULT NULL
);

-- Salary, I don't have a sexy name for this...
CREATE TABLE if NOT EXISTS salaries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount REAL NOT NULL,

    created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')), 
    updated_at TEXT DEFAULT NULL,
    deleted_at TEXT DEFAULT NULL,

    currency_code TEXT NOT NULL,
    chef_id INTEGER NOT NULL,

    FOREIGN KEY (currency_code) REFERENCES currencies(code) ON DELETE RESTRICT,
    FOREIGN KEY (chef_id) REFERENCES chefs(id) ON DELETE CASCADE
);

CREATE INDEX if NOT EXISTS idx_salaries_chef_id ON salaries(chef_id);

-- used to denote a chefs relationship to the system (admin, user, etc)
CREATE TABLE if NOT EXISTS system_roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL UNIQUE
);

-- used to denote if a chef's relationship to a bottle (owner, member, viewer, etc)
CREATE TABLE if NOT EXISTS membership_roles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL UNIQUE
);

-- chef:additive 1:M (chefs may want to use the same additives across all of their projects)
CREATE TABLE if NOT EXISTS chef_additives (
    chef_id INTEGER NOT NULL,
    additive_id INTEGER NOT NULL,

    created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')), 
    updated_at TEXT DEFAULT NULL,
    deleted_at TEXT DEFAULT NULL,

    PRIMARY KEY (chef_id, additive_id),
    FOREIGN KEY (chef_id) REFERENCES chefs(id) ON DELETE CASCADE,
    FOREIGN KEY (additive_id) REFERENCES additives(id) ON DELETE CASCADE
);
CREATE INDEX if NOT EXISTS idx_chef_additives_additive_id ON chef_additives(additive_id);

-- chef:bottle M:M
CREATE TABLE if NOT EXISTS chef_bottles (
    chef_id INTEGER NOT NULL,
    bottle_id INTEGER NOT NULL,

    created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')), 
    updated_at TEXT DEFAULT NULL,
    deleted_at TEXT DEFAULT NULL,
    role_id INTEGER NOT NULL,

    PRIMARY KEY (chef_id, bottle_id),
    FOREIGN KEY (role_id) REFERENCES membership_roles(id),
    FOREIGN KEY (chef_id) REFERENCES chefs(id) ON DELETE CASCADE,
    FOREIGN KEY (bottle_id) REFERENCES bottles(id) ON DELETE CASCADE
);
CREATE INDEX if NOT EXISTS idx_chef_bottles_bottle_id ON chef_bottles(bottle_id);

-- chef:splash M:M
CREATE TABLE if NOT EXISTS chef_splashes (
    chef_id INTEGER NOT NULL,
    splash_id INTEGER NOT NULL,

    created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')), 
    updated_at TEXT DEFAULT NULL,
    deleted_at TEXT DEFAULT NULL,

    PRIMARY KEY (chef_id, splash_id),
    FOREIGN KEY (chef_id) REFERENCES chefs(id) ON DELETE CASCADE,
    FOREIGN KEY (splash_id) REFERENCES splashes(id) ON DELETE CASCADE
);
CREATE INDEX if NOT EXISTS idx_chef_splashes_splash_id ON chef_splashes(splash_id);

-- Chef: a user of Shoyu
CREATE TABLE if NOT EXISTS chefs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    display_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    
    created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')), 
    updated_at TEXT DEFAULT NULL,
    deleted_at TEXT DEFAULT NULL,

    role_id INTEGER NOT NULL,
    FOREIGN KEY (role_id) REFERENCES system_roles(id) ON DELETE RESTRICT
);

-- bottle:splash 1:M (a bottle may have many splashes, a splash may only have a single bottle)
CREATE TABLE if NOT EXISTS bottle_splashes (
    bottle_id INTEGER NOT NULL,
    splash_id INTEGER NOT NULL,

    created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')), 
    updated_at TEXT DEFAULT NULL,
    deleted_at TEXT DEFAULT NULL,

    PRIMARY KEY (bottle_id, splash_id),
    FOREIGN KEY (bottle_id) REFERENCES bottles(id) ON DELETE CASCADE,
    FOREIGN KEY (splash_id) REFERENCES splashes(id) ON DELETE CASCADE
);
CREATE INDEX if NOT EXISTS idx_bottle_splashes_splash_id ON bottle_splashes(splash_id);

-- bottle:additive 1:M (a bottle may define custom additives to be used across all splashes/chefs within the scope of the project)
CREATE TABLE if NOT EXISTS bottle_additives (
    bottle_id INTEGER NOT NULL,
    additive_id INTEGER NOT NULL,

    created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')), 
    updated_at TEXT DEFAULT NULL,
    deleted_at TEXT DEFAULT NULL,

    PRIMARY KEY (bottle_id, additive_id),
    FOREIGN KEY (bottle_id) REFERENCES bottles(id) ON DELETE CASCADE,
    FOREIGN KEY (additive_id) REFERENCES additives(id) ON DELETE CASCADE
);
CREATE INDEX if NOT EXISTS idx_bottle_additives_additive_id ON bottle_additives(additive_id);

-- Bottle: a Shoyu project
CREATE TABLE if NOT EXISTS bottles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    "description" TEXT,

    created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')), 
    updated_at TEXT DEFAULT NULL,
    deleted_at TEXT DEFAULT NULL,

    owner_id INTEGER NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES chefs(id) ON DELETE CASCADE
);

-- splash:additive M:M (used to categories splashes)
CREATE TABLE if NOT EXISTS splash_additives (
    splash_id INTEGER NOT NULL,
    additive_id INTEGER NOT NULL,

    created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')), 
    updated_at TEXT DEFAULT NULL,
    deleted_at TEXT DEFAULT NULL,

    PRIMARY KEY (splash_id, additive_id),
    FOREIGN KEY (splash_id) REFERENCES splashes(id) ON DELETE CASCADE,
    FOREIGN KEY (additive_id) REFERENCES additives(id) ON DELETE CASCADE
);
CREATE INDEX if NOT EXISTS splash_additives_additive_id ON splash_additives(additive_id);

-- Splash: a Shoyu ticket/entry
CREATE TABLE if NOT EXISTS splashes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    "description" TEXT,

    created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')), 
    deleted_at TEXT DEFAULT NULL, 
    updated_at TEXT DEFAULT NULL,

    bottle_id INTEGER NOT NULL,
    FOREIGN KEY (bottle_id) REFERENCES bottles(id) ON DELETE CASCADE
);

-- Additives (tags, labels, etc)
CREATE TABLE if NOT EXISTS additives (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    "description" TEXT,
    
    created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
    deleted_at TEXT DEFAULT NULL,
    updated_at TEXT DEFAULT NULL,

    owner_id INTEGER NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES chefs(id) ON DELETE CASCADE
);

-- Upsert system roles
INSERT INTO system_roles (name) VALUES ('ADMIN')
ON CONFLICT(name) DO UPDATE SET name=excluded.name;

INSERT INTO system_roles (name) VALUES ('USER')
ON CONFLICT(name) DO UPDATE SET name=excluded.name;
