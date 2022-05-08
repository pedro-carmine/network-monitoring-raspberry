CREATE OR REPLACE VIEW data AS
    SELECT * FROM facts
    NATURAL JOIN d_date
    NATURAL JOIN raspberry
    ORDER BY (id_date, hour) DESC;