////////////////////////////////
// PEANUTSJS - MVC Server
// NodeJS Server Framework
// Dec 2019
// Alfredo Orozco Quesada
// ae.orozco10@uniandes.edu.co
////////////////////////////////

/* Configuring environment variables file */
const dotenv = require('dotenv').config();

/* Consulting environment variables */
const port = process.env.PORT;

/* Requiring libraries */
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const mysql = require('mysql');

/* Requiring libraries: Sessions store (mySQL) */
let dbOptions = {
	database: process.env.DBNAME,
	host: process.env.DBURL,
	port: process.env.DBPORT,
	user: process.env.DBUSER,
	password: process.env.DBPASSWORD,
};

const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const sessionStore = new MySQLStore(dbOptions);
const csurf = require('csurf'); // For CSRF protection in request forms


/* Requiring MVC modules */
// Note: View files are rendered from the controller module once it has the data.
const model = require('./01-models/mainModel');
const controller = require('./03-controllers/controller');
const router = require('./02-router');

/* Using middlewares */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* Using middlewares: Static references to views: css, js (client-side), etc. */
app.use('/css', express.static(__dirname + '/02-views/css'));
app.use('/js', express.static(__dirname + '/02-views/js'));
app.use('/ico', express.static(__dirname + '/02-views/favicon'));
app.use('/html', express.static(__dirname + '/02-views/html'));
app.use('/img', express.static(__dirname + '/02-views/img'));

/* Using middlewares: template engine (EJS) */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '02-views'));

/* Using middlewares: in case the front-end is in a different server than the backend */
app.use(cors());

/* Using middlewares: Sessions store (mySQL) */
app.use(
	session({
	store: sessionStore,
	secret: process.env.SESSIONSECRET,
	resave: false,
	saveUninitialized: false,
	httpOnly: true,
	ephemeral: true
	})
);

/* Ussing middlewares: initialize CSRF protection */
app.use(csurf());

/* Initializing modules and listening to requests */
model.init_models(mysql)
.then(data=>{
	console.log(data);
	return controller.init_controller(model);
})
.then(data=>{
	console.log(data);
	return router.init_router(app, controller);
})
.then(data=>{
	console.log(data);
	app.listen(port);
	console.log('::Main:: Ready! Listening on port: '+port);
}, err=>{
	console.log(err);
});