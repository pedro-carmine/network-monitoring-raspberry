const client = require('./connection.js');
const express = require('express');
const app = express();

app.listen(3000, () => {
    console.log("Server is listening on port 3000");
})

client.connect();

app.get('/data', (req, res) => {
    client.query(`SELECT * FROM data`, (err, result) => {
        if (!err) {
            console.table(result.rows);
            res.send(JSON.stringify(result.rows));
        }
    });
    client.end;
})

app.get('/data/:id', (req, res) => {
    client.query(`SELECT * FROM data WHERE id = '${req.params.id}'`, (err, result) => {
        if (!err) {
            console.table(result.rows);
            res.send(JSON.stringify(result.rows));
        }
    });
    client.end;
})
