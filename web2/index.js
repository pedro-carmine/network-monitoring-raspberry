const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const e = require("express");

//middleware
app.use(cors());
app.use(express.json());

app.get("/data", async (req, res) => {
    try {
        const allFacts = await pool.query("SELECT * FROM data");
        res.send(JSON.stringify(allFacts.rows));
    } catch (err) {
        console.log(err.message);
    }
});

app.get("/data/:time", async (req, res) => {
    try {
        const facts = await pool.query(`SELECT * FROM facts WHERE hour::text LIKE '${req.params.time}%'`);
        res.json(facts.rows);
    } catch (err) {
    console.log(err.message);
    }
});

app.get("/data/id/:id", async (req, res) => {
    try {
        const specificFacts = await pool.query(`SELECT * FROM facts NATURAL JOIN d_date WHERE id_pi = '${req.params.id}' ORDER BY (id_date, hour) DESC`);
        if (specificFacts.rowCount == 0) {
            res.json("No data found");
        }
        else {
            res.json(specificFacts.rows);
        }
    } catch (error) {
        console.log(error.message);
    }
});

app.listen(8080, () => {
    console.log("Server started on port 8080");
});