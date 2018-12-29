var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs')

var connection = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : process.env.MYSQL
});

connection.query("USE OnPoint", function(error,results){
  if(error) throw error;
  console.log("OnPoint DB used");
});
var encrypted = bcrypt.hashSync("sausage")
console.log(encrypted)
var email = "RWainwright37@gmail.com"
connection.query("UPDATE Writers SET Password = ? WHERE Email = ?",[encrypted,email], (err) =>{
  if(err){
    console.log(err)
  }
  console.log("UPDATED")
})
connection.query("SELECT * from WRITERS", (err,results)=>{
  if(err) throw err
  console.log(results[0])
})

connection.end()