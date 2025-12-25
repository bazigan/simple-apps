const express = require('express')
const mysql = require('mysql');
const app = express()
app.disable("x-powered-by");
const path = require('node:path')
require('dotenv').config();

// Import Middleware
const logger = require('./middleware/logger')
app.use(logger)
const connection = require('./middleware/db_connect');

// Dashboard
app.use('/', express.static(path.join(__dirname, 'public')));

app.use('/app1', express.static(path.join(__dirname, 'app1')));

app.get('/app2', (req, res) => {
  res.send('Hello this Apps 2!')
});

app.get('/app3', (req, res) => {
  res.send('Hello this Apps 3!')
});

app.get('/app4', (req, res) => {
  res.send('Hello this Apps 4!')
});

app.get('/users', (req, res, next) => {
  const sql = "SELECT * FROM tb_data ORDER BY id desc"
  connection.query(sql,(error, fields) => {
    if (error) {
      console.log('error', error)
    } else {
      res.send(fields)
    }
  })
});

app.listen(process.env.APP_PORT, () => {
  console.log(`Example app listening on port ${process.env.APP_PORT}`)
})

module.exports = app