var mysql = require('mysql')
var connection = mysql.createConnection({
  host : "localhost",
  user : "root",
  password : process.env.MYSQL,
  database : 'OnPoint'
})
connection.connect()

const addWriterProcedure = "CREATE PROCEDURE AddWriter " +
                       "( @firstname varchar(20), @lastname varchar(25), @password varchar(255), @email varchar(40) ) " +
                       "AS IF EXISTS(SELECT 'True' FROM Writers WHERE @email = Email) " +
                       "BEGIN SELECT 'This Writer Already Exists' END" +
                       "ELSE BEGIN SELECT 'Writer Added' INSERT INTO Writers(FirstName,LastName,Password,Email) " +
                       "VALUES (@firstname, @lastname, @password, @email) END"
console.log(addWriterProcedure)
const addUserProcedure = ""                      
connection.query(addWriterProcedure, (err,result) =>{
  if (err) throw err
  console.log(result)
})
