DROP TABLE IF EXISTS raspberry CASCADE;
DROP TABLE IF EXISTS data CASCADE;


CREATE TABLE raspberry(
    id VARCHAR(12),
    model VARCHAR(20),
    PRIMARY KEY (id)
    -- can add more fields if useful
);

CREATE TABLE data(
    id VARCHAR (12),
    collected_at DATE NOT NULL , --DEFAULT CURRENT_DATE
    max INTEGER,
    min INTEGER,
    avg INTEGER,
    CHECK (max >= 0),
    CHECK (min >= 0),
    CHECK (avg >= 0),
    CHECK (collected_at <= CURRENT_DATE),
    PRIMARY KEY(id, collected_at),
    FOREIGN KEY (id) REFERENCES raspberry(id)
);