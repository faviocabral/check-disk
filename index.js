const express = require('express')
const app = express()
const path = require('path')
const PORT = 3010
var cors = require('cors')
var moment = require('moment'); // require
const nodeDiskInfo = require('node-disk-info')
const axios = require('axios')
require('dotenv').config()
const {discos ,saveImage} = require('./utils.js')
app.use(express.json())

app.get('/',(req, res)=>{
  res.send('server disk status')
})

app.get('/disk-status', async(req, res)=>{

  try {
    const datos = await discos()
    res.status(200).json(datos)
  } catch (error) {
    console.log('error al consultar discos ', error )
    res.status(500).send('error 500 al consultar estados de discos !! ')
  }
})

app.listen(PORT, function (err) {
  if (err) console.log(err);
  console.log("Server disk status listening on PORT", PORT);
});