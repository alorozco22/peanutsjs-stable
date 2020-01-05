/*
	THIS IS AN EXAMPLE OF A MODEL WITH DATABASE ACCESS
*/
// To allow connection to database with nodejs, excecute the following query in the mySQL workbench:
// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '[yourpassword]'

let mysql;
let dbOptions = {
	host: process.env.DBURL,
	port: process.env.DBPORT,
	user: process.env.DBUSER,
	password: process.env.DBPASSWORD,
};

let LOCAL = (process.env.RUNNING_LOCAL == 'true');

/* Database creation
	It shall not be called when in Heroku free mySQL
*/
let createDB = function(){
	return new Promise((resolve, reject)=>{
		if (LOCAL == true){
			let con = mysql.createConnection(dbOptions);
			dbOptions.database=process.env.DBNAME; // NOTE WE ADD THE ATTRIBUTE DATABASE ONCE WE CREATE IT
			
			con.connect(function(err){
				if(err) {console.log('::Example Model:: Error connecting to DB.');reject(err);}
			});

			con.query('CREATE DATABASE IF NOT EXISTS '+dbOptions.database, function(err, result) {
				if(err) {console.log('::Example Model:: Error creating peanutsDB database.');reject(err);}
				resolve('::Example Model:: Database peanutsDB created.');
			});
			con.end();	
		} else {
			dbOptions.database=process.env.DBNAME; // NOTE WE ADD THE ATTRIBUTE DATABASE ONCE WE CREATE IT
			resolve('::Example Model:: Database peanutsDB created.');
		}
	});
}

/* Table creation */
let createTable = function(){
	return new Promise((resolve, reject)=>{
		let con = mysql.createConnection(dbOptions);

		con.connect(function(err){
			if(err) {console.log('::Example Model:: Error connecting to DB.');reject(err);}
		});
		
		let sql = 'CREATE TABLE IF NOT EXISTS people (name VARCHAR(30), age INT)';
		con.query(sql, function(err, result){
			if (err) {console.log('::Example Model:: creating table of people.');reject(err);}
			resolve('::Example Model:: Table of people created.');
		});
		con.end();
	});
}

/* Example initialization of data */
let init_data = function(){
	return new Promise((resolve,reject)=>{
		let con = mysql.createConnection(dbOptions);

		con.connect(function(err){
			if(err) {console.log('::Example Model:: Error connecting to DB.');reject(err);}
		});

		let sql = 'INSERT INTO people (name, age) VALUES ("Andrés", 25)';
		con.query(sql, function(err, result){
			if (err) {console.log('::Example Model:: Error inserting Andrés to DB.');reject(err);}
		});

		sql = 'INSERT INTO people (name, age) VALUES ("Julián", 34)';
		con.query(sql, function(err, result){
			if (err) {console.log('::Example Model:: Error inserting Julián to DB.');reject(err);}
		});

		sql = 'INSERT INTO people (name, age) VALUES ("María", 28)';
		con.query(sql, function(err, result){
			if (err) {console.log('::Example Model:: Error inserting María to DB.');reject(err);}
		});

		con.end();
		resolve('::Example Model:: Example people inserted to DB.');

	});
}

/* Constructor */
let init_model = function(pMySQL){
	return new Promise((resolve, reject)=>{
		// Initializing this model
		mysql = pMySQL;
		createDB()
		.then(data =>{
			console.log(data);
			return createTable();
		})
		.then(data=>{
			console.log(data);
			return init_data();
		})
		.then(data=>{
			console.log(data);
			resolve('::Example Model:: Example model initialized.');
		}, err=>{
			console.log('::Example Model:: Error initializing Example model.');
			reject(err);
		});
	});
}

/*Example of recovering data from DB*/
let getData = function(){
	return new Promise((resolve, reject)=>{
		let sql = 'SELECT * FROM people';
		let con = mysql.createConnection(dbOptions);

		con.connect(function(err) {
		  if (err) {console.log('::Example Model:: Error connecting to DB.');reject(err);}
		});

		con.query(sql, function (err, result, fields) {
			if (err) {console.log('::Example Model:: Error selecting data from people table.');reject(err);}
			
			let num = Math.random();
			con.end();
			if(num < 0.3){
				resolve(result[0]);
			} else if (num >0.3 && num < 0.6){
				resolve(result[1]);
			} else {
				resolve(result[2]);
			}
		});

	});
}

module.exports={
	'getData':getData,
	'init_model':init_model,
}