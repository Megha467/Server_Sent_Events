const express = require('express');
const app = express()
const fs = require("fs");
const path = require("path");
var globalVersion =0;
var companies = {
    "aaa":{"subscribers":0},
    "w3certified":{"subscribers":0},
    "bbb":{"subscribers":0},
  }
  app.use("/style", express.static("public/"));

app.get("/", (req, res) => {
    var html = fs.readFileSync(path.join(__dirname,"index.html"), "utf8")
    res.status(200).send(html);
})

app.get("/subscribe/:companyId", (req, res) => {
    console.log(`subscribe to ${req.params.companyId}`);
    companies[req.params.companyId].subscribers++
    globalVersion++;
    res.status(200).json({"msg": `subscribed to ${req.params.companyId}`});
})


app.get("/sse", (req, res) => {
    var localVersion = 0
    res.set('Content-Type', "text/event-stream")
    res.set("Connection", "keep-alive")
    res.set("Cache-Control", "no-cache")
    res.set("Access-Control-Allow-Origin", "*")
    console.log('client connected to server')
    setInterval(function(){
        if(localVersion < globalVersion) {
        res.status(200).write(`data: ${JSON.stringify(companies)}\n\n`)
        localVersion = globalVersion
    }
    }, 100)
})

app.listen(3000, err => {
    if(err){
        console.log('server can not listen');
        return;
    }

    console.log('server listening')
})