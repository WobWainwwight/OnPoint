var mysql = require('mysql');

var connection = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : process.env.MYSQL
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

//creating Writers table
connection.query("CREATE TABLE Writers (" + 
    "WriterID smallint unsigned auto_increment not null, "+
    "FirstName varchar(20) not null, "+
    "LastName varchar(25) not null, " +
    "Email varchar(40) not null, " +
    "Password varchar(20) not null, " +
    "Bio mediumtext," +
    "JoinDate datetime default current_timestamp not null," + 
    "NumOfArticles tinyint not null default (0), " +
    "primary key (WriterID))",function(error,results){
    if(error) throw error;
    console.log("Writers Created");
});

//make trigger for adding join date to writers
/*
connection.query("CREATE TRIGGER add_date " +
    "AFTER INSERT ON Writers " +
    "FOR EACH ROW  IF(isnull(new.query_date)) then " + 
        "if (isnull(new.query_date) ) then" +
        "set new.query_date=curdate();" +
        "end if " + 
        "NEW.Date = CURDATE()",function(error,results){
    if(error) throw error;
    console.log("Add date to writers column trigger created");
})*/
connection.query("INSERT INTO Writers",function(error,results){
    if(error) throw error;
    console.log(results);
})
connection.query("DESCRIBE Writers",function(error,results){
    if(error) throw error;
    console.log(results);
})