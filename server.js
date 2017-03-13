var express = require('express');
var path = require('path');
var app = express();
var csvPath = '../sample.csv';
var csv = require('csvtojson');
var bodyParser = require('body-parser')
var validator = require('validator');

var mysql      = require('mysql');
//var db = require('node-mysql');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
// in latest body-parser use like below.
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/css', express.static('css'));
app.use('/js', express.static('js'));

var connection = mysql.createConnection({
  host     : 'ec2-34-195-179-212.compute-1.amazonaws.com',
  user     : 'nijjarm',
  debug    : ['ComQueryPacket', 'RowDataPacket'],
  password : 'ES-yUW2k-xn3^hFU',
  database : 'hgsops'
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
  /*
  connection.query('SELECT COUNT(*) FROM `TEST`', function (error, results, fields) {
  console.log(results)
});
*/
});

//connection.end();


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname+'/index.html'));
  
})

app.get('/output.html', function (req, res) {
  res.sendFile(path.join(__dirname+'/output.html'));
  
})

app.post('/data', function(req, res){
  var swuery = 'SELECT CONTRACTS.`unique_transaction_id`, CONTRACTS.`dollarsobligated`, CONTRACTS.`currentcompletiondate`, CONTRACTS.`ultimatecompletiondate`, CONTRACTS.`vendorname`, CONTRACTS.`principalnaicscode`, CONTRACTS.`phoneno` FROM `CONTRACTS`, `CONTRACTEND` WHERE CONTRACTS.`unique_transaction_id` = CONTRACTEND.`unique_transaction_id` AND CONTRACTS.`firm8aflag`="TRUE"';
  //'SELECT * FROM `CONTRACTS` WHERE `firm8aflag`="TRUE"'
 // connection.query(swuery, function (error, results, fields) {
  //console.log(results)
  //res.send(results);
  //});
  if(req.body.PVMEMO != "" && validator.isAlphanumeric(req.body.PVMEMO)){
    swuery += " AND CONTRACTS.`vendorname` LIKE '%" + req.body.PVMEMO + "%'";
  }
  if(req.body.NAICS != "" && validator.isInt(req.body.NAICS)){
     swuery += " AND CONTRACTS.`principalnaicscode` = '" + req.body.NAICS + "'";
  }
  if(req.body.SACODE != "" && validator.isAlphanumeric(req.body.SACODE)){
    swuery += " AND CONTRACTS.`typeofsetaside` LIKE '%" + req.body.SACODE + "%'";
  }
  if(req.body.CEND != "" && validator.isDate(req.body.CEND)){
    swuery += " AND CONTRACTEND.`enddate` < '" + req.body.SACODE + "'";
  }
  if(req.body.POPCITY != "" && validator.isAlpha(req.body.POPCITY)){
    swuery += " AND CONTRACTS.`CITY` LIKE '%" + req.body.CITY + "%'";
  }
  if(req.body.STATE != "" && validator.isAlpha(req.body.POPCITY)){
    swuery += " AND CONTRACTS.`CITY` LIKE '%" + req.body.CITY + "%'";
  }
/*
  connection.query(swuery, function (error, results, fields) {
    res.send(results);
  });
*/

var datja = {};
var numbo = 0;
var juxta = true;
  var query = connection.query(swuery);
query
  .on('error', function(err) {
    // Handle error, an 'end' event will be emitted after this as well
  })
  .on('fields', function(fields) {
    // the field packets for the rows to follow
  })
  .on('result', function(row) {
    // Pausing the connnection is useful if your processing involves I/O
      connection.pause();
      console.log(numbo);
      datja[numbo] = row;
      numbo++;
      /*if(numbo > 3000 && juxta){
        juxta = false;
        res.send(datja);
  } */
      connection.resume();
  })
  .on('end', function() {
    // all rows have been received
    if(juxta){
      res.send(datja);

    }
    
  });

  //res.send(swuery);
})

app.listen(3000, function () {
  console.log('localhost:3000')
})