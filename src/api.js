// // All //XX content must be un commented when upload to hosted server

import express from "express";
// const express = require("express");
// //XX const serverless = require("serverless-http");
import path from "path";
// const path = require("path");
// import {fs} from "fs/promises";
// const fs = require("fs");
import {router} from "./routes.js";
// const router = require("./routes");
import bodyParserPkg from "body-parser";
const {bodyParser} = bodyParserPkg;
// const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 9999;

const corsList = [`http://192.168.100.20:${port}`,
"http://127.0.0.1:5500/dist/index.html",
`http://127.0.0.1:${port}`];

app.use((req, res, next)=>{
    if(!corsList.includes(req.headers.origin)){
        res.header("Access-Control-Allow-Origin", req.headers.origin);
        res.header(('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'));
    }
    next();
});

app.use(bodyParser.urlencoded({extended: true})); 
app.use(bodyParser.json({limit: "1mb"})); 

// //XX router.get("/", express.static(path.join("dist")));
app.use("/", express.static(path.join(__dirname, "..", "dist")));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// //XX app.use("/.netlify/functions/api", router);
app.use(router);

// This must be deleted when upload to hosted server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// //XX module.exports = app;
// //XX module.exports.handler = serverless(app);