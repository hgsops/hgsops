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
  var swuery = 'SELECT CONTRACTS.`unique_transaction_id`, CONTRACTS.`dollarsobligated`, CONTRACTS.`currentcompletiondate`, CONTRACTS.`ultimatecompletiondate`, CONTRACTS.`vendorname`, CONTRACTS.`principalnaicscode` FROM `CONTRACTS` WHERE CONTRACTS.`firm8aflag`="TRUE"';
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
  res.send(swuery);
})

app.listen(3000, function () {
  console.log('localhost:3000')
})