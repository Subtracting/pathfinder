import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';
import newRouter from './db_router.js';

import express from 'express';
const app = express();

import cors from 'cors';

var url = "mongodb://127.0.0.1:27017/"

app.use(cors());

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());

MongoClient.connect(url)
  .then((client) => {
    const db = client.db('routes_db');
    const routesCollection = db.collection('saved_routes');
    const routesRouter = newRouter(routesCollection);
  
    app.use('/api/routes', routesRouter);
  })
  .catch(console.err);

app.listen(4000, function () {
  console.log(`Listening on this port: ${this.address().port}`);
});