const express = require("express");
const app = express();
const {spawn} = require('child_process');
const cors = require("cors");

app.use(cors());
app.use(express.json());

const exec = require('child_process').exec;

function os_func() {
    this.execCommand = function (cmd) {
        return new Promise((resolve, reject)=> {
           exec(cmd, (error, stdout, stderr) => {
             if (error) {
                reject(error);
                return;
            }
            resolve(stdout)
           });
       })
   }
}
var os = new os_func();

app.get('/monitor', (req, res) => {
    os.execCommand('python3 ../client_scripts/monitor.py').then(response => {
        console.log(response);
        res.send(response);
    }).catch(err => {
        console.log(err);
    });
    
})
    
app.listen(8081, () => {
    console.log("Server started on port 8081");
});

