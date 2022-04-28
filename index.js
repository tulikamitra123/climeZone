// const dotenv = require('dotenv').config();

const bodyParser= require("body-parser");
const http = require("http");
const fs = require("fs");
var requests = require("requests");
const express = require("express");

var city="Delhi";  


const homeFile = fs.readFileSync("home.html", "utf-8");

var app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


   


const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.toString().replace("{%tempval%}",(orgVal.main.temp));
  temperature = temperature.toString().replace("{%tempmin%}", orgVal.main.temp_min);
  temperature = temperature.toString().replace("{%tempmax%}", orgVal.main.temp_max);
  temperature = temperature.toString().replace("{%location%}", orgVal.name);
  temperature = temperature.toString().replace("{%country%}", orgVal.sys.country);
  temperature = temperature.toString().replace("{%tempstatus%}", orgVal.weather[0].main);
  temperature = temperature.toString().replace("{%feelsLike%}", orgVal.main.feels_like);
  temperature = temperature.toString().replace("{%humidity%}", orgVal.main.humidity);

  return temperature;
};

// api.openweathermap.org/data/2.5/weather?q=Pune&units=metric&appid=1c799347fe4f54d66a72fc1ce5c8dd4b
let apiKey = "YOUR KEY";

app.post('/', function(req, res) {

  // Get city name passed in the form
  city = req.body.city;

});
  const server = http.createServer((req, res) => {

    if (req.url == "/") {
      city = "Pune";
      var address = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=1c799347fe4f54d66a72fc1ce5c8dd4b`;
      requests(address)
      .on("data",(chunk) => {
       const objdata = JSON.parse(chunk);
       const arrData = [objdata];
      //console.log(arrData[0].main.temp);
      const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join("");

      res.write(realTimeData);
  //console.log(realTimeData);
  
    })
      .on("end", (err) => {
      if (err) return console.log('connection closed due to errors', err);
      res.end();
        });
     } 
    else{
    res.end("File not found");
    }
    });


server.listen(8000, "127.0.0.1");





