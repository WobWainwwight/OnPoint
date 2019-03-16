var express = require('express')
var app = express()
var path = require('path')
require('dotenv').config()

app.use(express.static(path.join(__dirname,'../client/build')))
app.get('/*',(req,res) => {
  res.sendFile(path.join(__dirname,'../client/build','index.html'))
})

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
var jwt = require('jsonwebtoken')

// for image uploading via cloudinary
const cloudinary = require('cloudinary')
const cors = require('cors')
const { CLIENT_ORIGIN } = require('./config')
const formData = require('express-form-data')
app.use(formData.parse())


cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET
})
  
app.use(cors({ 
  origin: CLIENT_ORIGIN 
})) 

var port = process.env.PORT || 5000 

app.listen(port, () => console.log('Connected! at ', port))

async function getPassword(email, cb){
  const query = "SELECT * FROM Writers WHERE Email = ?"
  await connection.query(query,[email],(err,results) => {
    if(err){
      return cb(error)
    }
    else if (results.length === 0){
      cb(undefined,undefined)
    }
    else{
      cb(undefined,results[0])
    }
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
        res.body = {
          "message": "Technical issue, please try again later",
          "accepted": false,
        }
        next()
        throw err
      }
      else if(!result){
        res.body = {
          "message": "No record of that email",
          "accepted": false,
        }
        console.log("No result",res.body)
        next()
      } 
      else if(bcrypt.compareSync(req.body.password,result.Password)){
        var payload = {
          id: result.WriterID,
        }
        // create JWT
        var token = jwt.sign(payload, process.env.JWT_SECRET)
        console.log(token)
        const userInfo = {
          id: result.WriterID,
          firstname: result.FirstName,
          lastname: result.LastName,
          email: result.Email,
          bio: result.Bio,
          articleCount: result.ArticleCount
        }
        res.body = { 
          "message": "Welcome " + result.FirstName,
          "accepted": true,
          "OPtoken": token,
          "OPuserInfo": userInfo,
        }
        console.log(res.body)
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
      "message": "Email was not valid",
      "accepted": false,
    }
    next()
  }
  else{
    console.log("Email valid")
    res.body = {
      "accepted": true,
      "message": "Email Valid"
    }
    console.log("Resbody 1",res.body)
    next()
  }
  
}

function addUserToDB(req, res, next){
  console.log("Reached addUserToDB")
  // res.body.accepted will be false if email was invalid
  // in that case we skip this method and go straight to sending the res
  if(res.body.accepted === false){
    next()
  }
  else{
     //first check whether the user already exists
    const checkQuery = "SELECT * FROM Writers WHERE Email = ?"
    connection.query(checkQuery,[req.body.email], (err,result) => {
      if(err){
        res.body = {
          "accepted": false,
          "message" : 'There was a problem please try again later',
        }
        console.log("resbody 2",res.body)
        throw err
      }
      // if no record exists add new writer
      else if (result.length === 0){
        //add new Writer
        const insertQuery = "INSERT INTO Writers (FirstName,LastName,Email,Password) VALUES (?,?,?,?)"
        // encrypt password
        const encrypted = bcrypt.hashSync(req.body.password)
        connection.query(insertQuery,[req.body.firstname,req.body.lastname,req.body.email,encrypted],(err,result) => {
          if(err){
            res.body = {
              "accepted": false,
              "message" : 'Sorry there was a technical problem please try again later',
            }
            console.log("resbody 3",res.body)
            throw err
          }
          else{
            console.log("Added " + req.body.email + " to Writers")
            res.body= {
              "accepted": true,
              "message": 'Welcome to OnPoint, please login with your details'
            }
            console.log("resbody 4",res.body)
            next()
          }
        })
      }
      else {
        console.log("result",result)
        res.body = {
          "accepted": false,
          "message" : 'There is already an account for this email, please login',
        }
        console.log("resbody 5",res.body)
        next()
      }
    })
  }
}

app.post('/login',[validateEmail, validateLogin],(req,res) => {
  res.json(res.body)   
})

app.post('/signup',[validateEmail, addUserToDB],(req,res) =>{
  console.log("RESBOdy out",res.body)
  res.json(res.body)
})

app.post('/updateBio', async (req,res) => {
  const updateBioQuery = "UPDATE Writers SET Bio = ? WHERE WriterID = ?"
  connection.query(updateBioQuery,[req.body.bio,req.body.id],(err) => {
    if(err){
      res.body = {
        "message": "There was a problem, your bio wasn't updated, please try again later",
        "accepted": false,
      }
      throw err
    }
    else{
      res.body = {
        "message": "Bio was successfully updated",
        "accepted": true,
      }
      console.log("Bio for user " + req.body.id + " changed")
    }
    res.json(res.body)
  })
})

app.post('/upload-img', async (req,res) => {
  console.log("Add image request",req)
  const imgName = "wid" + req.body.writerId + "aid" + req.body.articleId + "t" + req.body.type
  const storedIn = "/shouterImg/" + req.body.writerId + "/" + req.body.articleId + "/"
  
  // upload image to cloudinary
  try {
    console.log("entered try catch")
    cloudinary.v2.uploader.upload(req.files.img.path, {
      folder: storedIn,
      public_id: imgName
    }, (err,cloudinary) => {
      if (err) throw err
      else {
        console.log("succes")
        // send back the result so I can show the image
        res.body = {
          cloudinary,
          "accepted": true,
        }
        res.json(res.body)
      }
    })
  }
  catch(e){
    console.log(error)
    res.body = {
      "accepted": false
    }
    res.json(res.body)
  }
})

app.post('/add-article', (req,res) => {
  console.log("Adding article", req.body)
  //New articles in DB should have writerid, content, headerimg url, title
  res.body= {"madeit":"madeit"}
  const contentString = JSON.stringify(req.body.content)
  const insertArticleQuery = "INSERT INTO Articles (WriterID, Title, Content, HeadImage) VALUES (?,?,?,?)"
  connection.query(insertArticleQuery,[req.body.writer_id,req.body.title,contentString,req.body.header_url],(err,result) => {
    if(err){
      res.body={accepted:false}
      throw err
    }
    else{
      res.body={accepted:true}
    }
    res.json(res.body)
  })
})

app.post('/get-feed',(req,res) =>{
  console.log("get feed")
  const getFeed = "SELECT * FROM ARTICLES ORDER BY ArticleID DESC"
  connection.query(getFeed,(err,result) => {
    if(err){
      res.body = {
        "accepted": false
      }
    }
    else{
      res.body = {
        result
      }
    }
    res.json(res.body)
  })
  
})

  


