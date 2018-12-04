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

// Creating Writers table
// Queries formatted using concatenation for better readability
connection.query("CREATE TABLE Writers (" + 
    "WriterID smallint unsigned auto_increment not null, "+
    "FirstName varchar(20) not null, "+
    "LastName varchar(25) not null, " +
    "Email varchar(40) not null, " +
    "Password varchar(20) not null, " +
    "Bio mediumtext," +
    "JoinDate datetime default current_timestamp not null," + 
    "ArticleCount tinyint not null default (0), " +
    "primary key (WriterID))",function(error,results){
        if(error) throw error;
        console.log("Writers table Created");
});

connection.query("CREATE TABLE Articles (" + 
    "ArticleID smallint unsigned auto_increment not null, "+
    "WriterID smallint unsigned not null," + 
    "Title varchar(100) not null, "+
    "Content longtext not null, " +
    "HeadImage varchar(255) not null, " + 
    "Length varchar(5), " +
    "PublishDate datetime default current_timestamp not null, " +
    "primary key (ArticleID), " +
    "foreign key (WriterID) references Writers(WriterID))",function(error,results){
        if(error) throw error;
        console.log("Articles table Created");
});

connection.query("CREATE TABLE Tags (" + 
    "TagID smallint unsigned auto_increment not null, "+
    "TagName varchar(20) not null, " + 
    "primary key (TagID))",function(error,results){
        if(error) throw error;
        console.log("Tags table Created");
});


connection.query("CREATE TABLE ArticleTags (" + 
    "TagID smallint unsigned not null, "+
    "ArticleID smallint unsigned not null, " +
    "foreign key (TagID) references Tags(TagID), " +
    "foreign key (ArticleID) references Articles(ArticleID))",function(error,results){
        if(error) throw error;
        console.log("ArticleTags table Created");
});

connection.query("CREATE TABLE Admins (" + 
    "AdminID smallint unsigned auto_increment not null, "+
    "FirstName varchar(20) not null,"+
    "LastName varchar(25) not null, " +
    "Email varchar(40) not null, " +
    "Password varchar (20) not null, " +
    "primary key (AdminID))",function(error,results){
        if(error) throw error;
        console.log("Tags table Created");
});

// trigger for incrementing numofarticles with addition of article
connection.query("CREATE TRIGGER incr_article_count " + 
    "AFTER INSERT ON Articles FOR EACH ROW " +
    "UPDATE Writers SET ArticleCount = ArticleCount + 1 "+
    "WHERE WriterID = NEW.WriterID; ",function(error,results){
    if(error) throw error;
    console.log(results);
})
// Adding me for testing
connection.query("INSERT INTO Writers (" +
    "FirstName,LastName,Email,Password) "+
    "VALUES ('Rob','Wainwright','RWainwright37@gmail.com','sausage')",function(error,results){
    if(error) throw error;
    console.log(results);
})

connection.query("INSERT INTO Articles (" +
    "WriterID,Title,Content,HeadImage) "+
    "VALUES ('1','The First One','RWainwright37@gmail.com','sausage')",function(error,results){
    if(error) throw error;
    console.log(results);
})

connection.query("DESCRIBE Writers",function(error,results){
    if(error) throw error;
    console.log(results);
})

connection.query("SELECT * FROM Writers",function(error,results){
    if(error) throw error;
    console.log(results);
})
