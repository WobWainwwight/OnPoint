var mysql = require('mysql');

var connection = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "B3nd1g3d1g123"
});

connection.query("DROP DATABASE OnPoint", function(error,results){
    if(error) throw error;
    console.log("DB Dropped");
});

connection.query("CREATE DATABASE OnPoint", function(error,results){
    if(error) throw error;
    console.log("OnPoint DB Created");
});

connection.query("USE OnPoint", function(error,results){
    if(error) throw error;
    console.log("OnPoint DB used");
});

var writersQuery = "\"CREATE TABLE Writers (" +
    "WriterID smallint unsigned auto_increment not null," +
    "FirstName varchar(20) not null, " +
    "LastName varchar(20) not null" +
")\"";

connection.query("CREATE TABLE Writers (" + 
    "WriterID smallint unsigned auto_increment not null,"+
    "FirstName varchar(20) "+
    "primary key (WriterID))"
    ,function(error,results){
    if(error) throw error;
    console.log("NONCE CREATED");
});

connection.query("DESCRIBE Writers",function(error,results){
    if(error) throw error;
    console.log(results);
})