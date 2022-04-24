const Pool = require("pg").Pool;

const pool = new Pool({
    user: "pehcarmine",
    password: "",
    host: "localhost",
    port: 5432,
    database: "testdb"
});

module.exports = pool;