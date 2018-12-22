var express = require('express')
var app = express()

var port = process.env.PORT || 5000 

app.listen(port, () => console.log('Connected at ', port))

app.get('/backend', (req,res) => { 
  res.send({ express: 'express connected'})
})

app.post('/login',(req,res) => {
  console.log('req.body.username',req.body.username)
  res.send({ gwhizz: 'made it'})
})