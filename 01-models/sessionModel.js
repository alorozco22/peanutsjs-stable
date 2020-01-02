/*
	THIS IS AN EXAMPLE OF A SESSIONS AND AUTHENTICATION MODEL
	IT HAS ACESS TO THE DATABASE.
*/
// To allow connection to database with nodejs, excecute the following query in the mySQL workbench:
// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '[yourpassword]'

let mysql;
const bcrypt = require('bcryptjs');
let dbOptions = {
	host: process.env.DBURL,
	port: process.env.DBPORT,
	user: process.env.DBUSER,
	password: process.env.DBPASSWORD,
	database: process.env.DBNAME
};

/* Table creation */
let createTableOfUsers = function(){
	return new Promise((resolve, reject)=>{
		let con = mysql.createConnection(dbOptions);

		con.connect(function(err){
			if(err) {console.log('::Sessions Model:: Error connecting to DB.');reject(err);}
		});
		
		sql = 'CREATE TABLE IF NOT EXISTS users (username VARCHAR(40), hash CHAR(60))';
		con.query(sql, function(err, result){
			if (err) {console.log('::Sessions Model:: creating table of users.');reject(err);}
			resolve('::Sessions Model:: Table of users created.');
		});
		con.end();
	});
}

/* Add a new user to the database */
let insertNewUser = function(pUser, pPass){
	return new Promise((resolve,reject)=>{
		let con = mysql.createConnection(dbOptions);

		con.connect(function(err){
			if(err) {console.log('::Sessions Model:: Error connecting to DB.');reject(err);}
		});

		let hash = bcrypt.hashSync(pPass, 14);

		userAlreadyTaken(con, pUser)
		.then(data=>{
			if(data==true){
				// Already taken.
				reject('Error: Username already taken.');
			} else{
				// Now we proceed:
				sql = 'INSERT INTO users (username, hash) VALUES ("'+pUser+'", "'+hash+'")';
				con.query(sql, function(err, result){
					if (err) {console.log('::Sessions Model:: Error inserting new user to users table.');reject(err);}
					resolve({message:'::Sessions Model:: New user inserted to users table.',hash:hash});
				});
				
			}
			con.end();
		}, err=>{
			// Error.
			reject(err);
		});
	});
}

/* Called by insertNewUser */
let userAlreadyTaken = function(con, pUser){
	return new Promise((resolve, reject)=>{
		let sql = 'SELECT username FROM users WHERE username = "'+pUser+'"';
		con.query(sql, function(err,result){
			if(err){console.log('::Sessions Model:: Error checking uniqueness of username.');reject(err);}
			else {
				if(result[0] != undefined){
					console.log('::Sessions Model:: User already existed. '); resolve(true);
				} else{
					console.log('::Sessions Model:: New user available.');
					resolve(false);
				}
			}
		})
	});
}

/* Comparing passwords MISSING TO IMPLEMENT HASH COMPARISON WITH BCRYPT!! */
let compareCredentials = function(pUser, pPass){
	return new Promise((resolve,reject)=>{
		let con = mysql.createConnection(dbOptions);
		let authenticated = false;
		con.connect(function(err){
			if (err){console.log('::Sessions Model:: Error connecting to DB.');reject(err);}
		});

		let sql = 'SELECT hash FROM users WHERE username = "'+pUser+'"';

		con.query(sql, function(err, result){
			if(err){console.log('::Sessions Model:: Error authenticating user. ');reject(err);}
			else {
				if(result[0] != undefined && bcrypt.compareSync(pPass, result[0].hash)){
					// There is a correspondent user and the hash matches with input.
					console.log('::Sessions Model:: User authenticated. '); resolve(true);
				} else {
					console.log('::Sessions Model:: User not authenticated. '); resolve(false);
				}
			}
		});
		con.end();
	});
}

/* Constructor */
let init_model = function(pMySQL){
	return new Promise((resolve, reject)=>{
		// Initializing this model
		mysql = pMySQL;
		createTableOfUsers()
		.then(data=>{
			console.log(data);
			resolve('::Sessions Model:: Sessions Model initialized.');
		}, err=>{
			console.log('::Sessions Model:: Error initializing Sessions Model.');
			reject(err);
		});
	});
}


module.exports={
	'init_model':init_model,
	'insertNewUser':insertNewUser,
	'compareCredentials':compareCredentials
}


// 1. la página de login, y una página con contenido restringido.
// APENAS TENGAMOS ESTO, IMPLEMENTAMOS EL REFACTORING DE RANDAL.

// Luego simplificamos el ejemplo al mínimo. Sin ninguna página, y sin autenticación. 

// Revisamos ortografía Y lo subimos CON y SIN ejemplos!
