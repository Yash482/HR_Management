const path = require('path');
//j6Nw9JmNhefMlgMh
//mongodb+srv://ayushi:<password>@cluster0.pffz0.mongodb.net/<dbname>?retryWrites=true&w=majority
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');

const employeeRoutes = require('./routes/employee');
const hrRoutes = require('./routes/hr');
const { request } = require('http');
const Hr = require('./models/hr');

mongoose.connect("mongodb+srv://ayushi:j6Nw9JmNhefMlgMh@cluster0.pffz0.mongodb.net/hr_db?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});

mongoose.connection.on('connected',()=>{
  console.log("connected to mongodb")
})
mongoose.connection.on('error',(err)=>{
  console.log("error connecting")
})
const app = express();

// app.use(bodyParser.urlencoded()); // x-www-form-urlencoded <form>
app.use(bodyParser.json()); // application/json


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/employee', employeeRoutes);
app.use('/hr', hrRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});


app.listen(5000, ()=> {
  console.log("server started")
})
