const express = require('express')
const app = express();
const http = require('https');
let bodyParser = require('body-parser'); // turns response into usable format
let morgan = require('morgan'); // logs requests
let pg = require('pg');
let request = require('request');
// let request = require('request'); //Request handler library
// let q = require('q'); //Promise library
app.get('/', (req, res) => {
  res.send('Hello World!')
});

var creditCount = 0;
var debitCount = 0;
var flag = false;
app.listen(8000, () => {
  console.log('Example app listening on port 8000!')
});


function createtransaction() {
  // var result;
  return new Promise((resolve, reject) => {
    request.post({
      headers: {
        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJuYmYiOjE1NzM4MjM4MjQsInBsYyI6IjVkY2VjNzRhZTk3NzAxMGUwM2FkNjQ5NSIsImV4cCI6MTU3NDAzNTE5OSwiZGV2ZWxvcGVyX2lkIjoiODg2YjM0Yjc1NWI5MzAxYjY1YjhlODcwMjBjNzU3ZDRhMzlmNTI1YjY1MTJhNTc1MGI4NTZkYzg0NDIyZjNjOSJ9.DBhyS1A8a71c8l1ThLw0lwYaH-_KXterCD_jPspxbCQk4GSaMEe9KsORhnqx76HOg-fjf2BKnIGGVsOSTTogJfFzE-fkjTIyHz5slCSqXEzfNpCYX_nSUkMtHxFFWIMhYKosk6bYSLy2AeB-Cu0QlijLFhsobSkEyXIEUfc-Klgw1MkVQejJL7YPqm2ojKuwP0HXwrr_klBC8ACuvtW9R0lwl9-6nwa86qA-iiSiAPFkn0UETRLZMyjclCBgC9aZmMcd-f1WIXRl8HH8Qh8JBQyeQdJKsfZDc4PL2e9KONedxuHLLgH0we06KdyJ-ebRc4I6KuF6a1yF0aJrrkXVIA',
        'Content-Type': 'application/json',
        'version': '1.0'
      },
      url: 'https://sandbox.capitalone.co.uk/developer-services-platform-pr/api/data/transactions/accounts/68660894/create',
      body: "{\"quantity\":1}"
    }, function (error, response, body) {
      // bodyparsed = JSON.parse(body)
      // console.log('Transindicator', bodyparsed.Transactions[0].creditDebitIndicator);
      // result = bodyparsed.Transactions[0].creditDebitIndicator
      if (error) reject(error);
      else resolve(body);
    });
  })
  
}
function getTransaction() {
  return new Promise((resolve, reject) => {
    request.get({
      headers: {
        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJuYmYiOjE1NzM4MjM4MjQsInBsYyI6IjVkY2VjNzRhZTk3NzAxMGUwM2FkNjQ5NSIsImV4cCI6MTU3NDAzNTE5OSwiZGV2ZWxvcGVyX2lkIjoiODg2YjM0Yjc1NWI5MzAxYjY1YjhlODcwMjBjNzU3ZDRhMzlmNTI1YjY1MTJhNTc1MGI4NTZkYzg0NDIyZjNjOSJ9.DBhyS1A8a71c8l1ThLw0lwYaH-_KXterCD_jPspxbCQk4GSaMEe9KsORhnqx76HOg-fjf2BKnIGGVsOSTTogJfFzE-fkjTIyHz5slCSqXEzfNpCYX_nSUkMtHxFFWIMhYKosk6bYSLy2AeB-Cu0QlijLFhsobSkEyXIEUfc-Klgw1MkVQejJL7YPqm2ojKuwP0HXwrr_klBC8ACuvtW9R0lwl9-6nwa86qA-iiSiAPFkn0UETRLZMyjclCBgC9aZmMcd-f1WIXRl8HH8Qh8JBQyeQdJKsfZDc4PL2e9KONedxuHLLgH0we06KdyJ-ebRc4I6KuF6a1yF0aJrrkXVIA',
        'Content-Type': 'application/json',
        'version': '1.0'
      },
      url: 'https://sandbox.capitalone.co.uk/developer-services-platform-pr/api/data/transactions/accounts/68660894/transactions'
    }, (error, res, body) => {

      if (error) reject(error);
      else resolve(body);
    });
  });
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cors(corsOptions))
app.use(morgan('dev'));

app.use(function (request, response, next) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/api/card-details', function (request, response) {
  console.log(request.body);
  var _email = request.body.email;
  var _number = request.body.number;
  var _name = request.body.name;
  var _expiry = request.body.expiry;
  var _cvc = request.body.cvc;
  console.log('request:', request);
  //query the card details to db and find the accountid using the card number
  var ind='';
  createtransaction().then(data =>
     {
       bodyparsed = JSON.parse(data)
      console.log('Transindicator', bodyparsed.Transactions[0].creditDebitIndicator);
      this.ind = bodyparsed.Transactions[0].creditDebitIndicator
     }).catch(error => console.log(error));
  console.log('Current transaction status: ', this.ind);
  // var alltransflag = 
  getTransaction().then(
    data => {
      bodyparsed = JSON.parse(data)
      bodyparsed.Transactions.forEach(function (element, i) {
        if (element.creditDebitIndicator == 'Credit') {
          creditCount++;
        }
        else {
          debitCount++
        }
      });
      console.log('CreditCount:', creditCount);
      console.log('DebitCount:', debitCount);
      if (creditCount > debitCount) {
        console.log('your score is less');
        if (ind == 'Credit') {
          response.status(201).send({ code: "201", "message": "Please rethink on your purchase..! It might make your credit score low..!" });
        }
        // flag = true;
      }
      //debitCount>creditCount and creditCount == debitCount
      else {
        if (creditCount == debitCount && ind == 'Credit') {
          response.status(202).send({ code: "202", "message": "your credit score might decrease with your current purchase.!" });
        }
        response.status(200).send({ code: "200", "message": "your credit score is good. your payment is processed..!" });
        console.log('proceed with the transaction..!')
        // flag = false;
      }
    }).catch(error => console.log(error));
})

