const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const e = require("express");

//middleware
app.use(cors());
app.use(express.json());

app.get('/data/facts', async (req, res) => {
    try {
        const allFacts = await pool.query("SELECT * FROM data");
        res.send(JSON.stringify(allFacts.rows));
    } catch (err) {
        console.log(err.message);
    }
});

app.get("/data/devices", async (req, res) => {
    try {
        const allFacts = await pool.query("SELECT * FROM raspberry NATURAL JOIN last_updated NATURAL JOIN d_date");
        res.send(JSON.stringify(allFacts.rows));
    } catch (err) {
        console.log(err.message);
    }
});

app.listen(8080, () => {
    console.log("Server started on port 8080");
});