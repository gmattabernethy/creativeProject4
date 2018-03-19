const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
var https = require('https');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'))

let purchases = [];
let id = 0;

// API to get Static Watch information
app.get('/api/watch/:id', (req, res) => {
  let watch = req.params.id;
  console.log("Static Watch API Lookup for : " + watch + " has been called.")
  let validWatches = ["vostokN1","vostokAmphibia","poljotOkean"];
  if (validWatches.indexOf(watch)>=0){
    res.sendFile(path.resolve('./public/json/' + watch + '.json'));
  }else{ // Force them to look at an Amphibia
    res.sendFile(path.resolve('./public/json/vostokAmphibia.json'));
  }
});

// API to show all purchases
app.get('/api/purchases', (req, res) => {
  res.send(purchases);
});

// API to add a purchase
app.post('/api/purchases', (req, res) => {
  id = id + 1;
  let watch = req.body.watch;
  let watchInfo = require('./public/json/' + watch + '.json');

  let purchase = {id:id, watch:watch, date:req.body.date, watchName:watchInfo.name, name:req.body.name,
    price:watchInfo.price,text:req.body.text, rating:req.body.rating, completed: req.body.completed};
  purchases.push(purchase);
  res.send(purchase);
});

// API to delete a purchase
app.delete('/api/purchases/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let removeIndex = purchases.map(purchase => { return purchase.id; }).indexOf(id);
  if (removeIndex === -1) {
    res.status(404).send("Sorry, that item doesn't exist.");
    return;
  }
  purchases.splice(removeIndex, 1);
  res.sendStatus(200);
});

// API to change a purchase (may not be required)
app.put('/api/purchases/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let purchasesMap = purchases.map(purchase => { return purchase.id; });
  let index = purchasesMap.indexOf(id);
  let purchase = purchases[index];
  purchase.name = req.body.name;

  purchases.splice(index,1);
  purchases.splice(index,0,purchase);

  res.send(purchase);
});

app.listen(3000, () => console.log('Server listening on port 3000!'))
