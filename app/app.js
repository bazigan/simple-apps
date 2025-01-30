const express = require('express')
const mysql = require('mysql');
const app = express()
const path = require('path')
const client = require('prom-client');
require('dotenv').config();
app.disable("x-powered-by");

// Import Middleware
const logger = require('./middleware/logger')
app.use(logger)
const connection = require('./middleware/db_connect');
const { ClientRequest } = require('http');

// Dashboard
app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/app1', async (req, res) => {
  
  res.send('Hello this App 1!')
});

app.get('/app2', async (req, res) => {
  res.send('Hello this App 2!')
});

app.get('/users', async (req, res, next) => {
  const sql = "SELECT * FROM tb_data ORDER BY id desc"
  connection.query(sql,(error, fields) => {
    if (error) {
      console.log('error', error)
    } else {
      res.send(fields)
    }
  })
});

//Test Prom-Client 
let collectDefaultMetrics = client.collectDefaultMetrics;
const register = new client.Registry();
//let register = new client.Registry();


// Create custom metrics
const customCounter = new client.Counter({
    name: "my_custom_counter",
    help: "Custom counter for my application",
});

// Create custom metrics
const userCounter = new client.Counter({
    name: "my_user_counter",
    help: "User counter for my application",
});

// Create custom metrics
const fileCounter = new client.Counter({
    name: "my_file_counter",
    help: "File counter for my application",
});

// Add your custom metric to the registry
register.registerMetric(customCounter);
register.registerMetric(userCounter);
register.registerMetric(fileCounter);

client.collectDefaultMetrics({
    app: 'node-application-monitoring-app',
    prefix: 'node_',
    timeout: 10000,
    gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
    register
});

// Create a route to expose metrics
app.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', register.contentType);
  res.send(await register.metrics());
});


app.listen(process.env.APP_PORT, () => {
  console.log(`Example app listening on port ${process.env.APP_PORT}`)
})

module.exports = app