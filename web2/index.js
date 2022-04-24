const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware
app.use(cors());
app.use(express.json());

app.get("/facts", async (req, res) => {
    try {
        const allFacts = await pool.query("SELECT * FROM facts");
        res.send(JSON.stringify(allFacts.rows));
    } catch (err) {
        console.log(err.message);
    }
});

app.get("/facts/:time", async (req, res) => {
    try {
        const facts = await pool.query(`SELECT * FROM facts WHERE hour::text LIKE '${req.params.time}%'`);
        res.json(facts.rows);
        console.log(facts.rows[0]);
    } catch (err) {
    console.log(err.message);
    }
});

app.listen(8080, () => {
    console.log("Server started on port 8080");
});