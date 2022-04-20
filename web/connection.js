const {Client} = require('pg')

const client = new Client({
    host: "localhost",
    user: "pehcarmine",
    port: 5432,
    database: "postgres",
    password: ""
})

module.exports = client

