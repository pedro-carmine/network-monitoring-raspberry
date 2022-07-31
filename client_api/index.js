const express = require("express");
const app = express();
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

const update = () => {
    os.execCommand('python3 ../client_scripts/update.py').then(response => {
        return response;
    });
};

app.get('/monitor', (req, res) => {
    os.execCommand('python3 ../client_scripts/monitor.py').then(response => {
        const monitorResponse = response;
        const updateResponse = update();
        res.send(monitorResponse + ' ' + updateResponse);
    }).catch(err => {
        console.log(err);
    });
    
})

app.get(`/destination_ping/:ip`, async (req, res) => {
    new_dest = req.params.ip;
    console.log(new_dest);
    os.execCommand(`python3 ../client_scripts/change_dest_ping.py ${new_dest}`).then(response => {
        res.send(response);
    }).catch(err => {
        console.log(err);
    });
});
    
app.listen(8081, () => {
    console.log("Server started on port 8081");
});

