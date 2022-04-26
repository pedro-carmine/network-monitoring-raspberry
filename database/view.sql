CREATE OR REPLACE VIEW data AS
    SELECT * FROM facts
    NATURAL JOIN d_date
    ORDER BY (id_date, hour) DESC;