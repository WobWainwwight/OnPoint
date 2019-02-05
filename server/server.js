var express = require('express')
var app = express()

var helmet = require('helmet')
app.use(helmet())

var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({  extended: true }));

var mysql = require('mysql')
var connection = mysql.createConnection({
  host : "localhost",
  user : "root",
  password : process.env.MYSQL,
  database : 'OnPoint'
})
connection.connect()

var emailValidator = require('email-validator')
var bcrypt = require('bcrypt-nodejs')

var port = process.env.PORT || 5000 

app.listen(port, () => console.log('Connected at ', port))

app.get('/backend', (req,res) => { 
  res.send({ express: 'express connected'})
})

async function getPassword(email, cb){
  const query = "SELECT * FROM Writers WHERE Email = ?"
  await connection.query(query,[email],(err,results) => {
    if(err){
      return cb(error)
    }
    console.log("result", results[0].Password)
    cb(undefined,results[0].Password)
  })
}

function validateLogin(req, res, next) {
  console.log("Validating login")
  // if email was invalid, no need to check DB
  if(res.body.accepted === false){
    next()
  }
  else{
    // calling get password and then using a callback function to
    // use bcrypt, making sure that the user password matches the hashed password
    getPassword(req.body.email, (err,result) =>{
      if (err){
        req.body = {
          "message": "Technical issue, please try again later",
          "accepted": false,
        }
        throw err
      } 
      if(bcrypt.compareSync(req.body.password,result)){
        res.body = { 
          "message": "Password and Email correct",
          "accepted": true,
        }      
        console.log("Login accepted")
      }
      else{
        res.body = {
          "message": "Password invalid",
          "accepted": false,
        }
        console.log("Login not accepted, res.body=",res.body)
      }
      next()
    })
  }
}   

// Using email-validator package to quickly validate the email
function validateEmail(req,res,next){
  if(emailValidator.validate(req.body.email) !== true){
    console.log("emailInvalid")
    res.body = { 
      "message": 'Email was not valid',
      "accepted": false,
    }
    next()
  }
  else{
    console.log("Email valid")
    res.body = { "accepted": true }
    next()
  }
}

app.post('/login',[validateEmail, validateLogin],(req,res) => {
  res.json(res.body)   
})

  



