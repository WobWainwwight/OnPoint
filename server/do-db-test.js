var mysql = require('mysql')

var connection = mysql.createConnection({
  host : '104.248.167.239',
  user : 'wob',
  password : 'B3nd1g3d1g123',
  database: 'shouter',
})

connection.query("describe Writers", (err, result) => {
  if(err) throw err
  console.log(result)
})