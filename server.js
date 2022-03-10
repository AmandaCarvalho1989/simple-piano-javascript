const express = require('express')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/songRecorder')
const app= express()

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.static('public'))

app.get('/', (req,res) =>{
  res.render('index')
})
app.post('/songs', (req,res)=>{
  req.body.songNotes
})
app.listen(5000)