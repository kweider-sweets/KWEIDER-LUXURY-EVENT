-- Private Events STAGING only. Never use a database from another project.
CREATE TABLE IF NOT EXISTS event_catalog_revisions (
 revision INTEGER PRIMARY KEY CHECK (revision >= 1),
 catalog_json TEXT NOT NULL CHECK (json_valid(catalog_json)),
 published_at TEXT NOT NULL,
 actor TEXT NOT NULL,
 restored_from INTEGER REFERENCES event_catalog_revisions(revision)
);
CREATE TRIGGER IF NOT EXISTS event_catalog_no_update BEFORE UPDATE ON event_catalog_revisions
 BEGIN SELECT RAISE(ABORT,'Catalog revisions are immutable'); END;
CREATE TRIGGER IF NOT EXISTS event_catalog_no_delete BEFORE DELETE ON event_catalog_revisions
 BEGIN SELECT RAISE(ABORT,'Catalog revisions are immutable'); END;
