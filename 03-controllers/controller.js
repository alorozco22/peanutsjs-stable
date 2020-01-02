let model;

let init_controller = function(pModel){
	return new Promise((resolve,reject)=>{
		model = pModel;
		resolve('::Controller:: Controller initialized.');
	});
}


let getIndex = function(req, res){
	// We consult model
	model.exampleModel.getData()
	.then(data=>{
		// We send
		res.render('./ejs/index', data);	
	}, err=>{
		console.log('::Controller:: Error rendering index. ', err);
	});
	
}

/* Authentication: registration page */
let getSignUp = function(req,res){
	// Check there is no already logged person
	if(!req.session.username){
		res.render('./ejs/signup', {csrfToken: req.csrfToken(), error:''});
	} else {
		// The person is already logged
		res.send('<h1>Hi, you are already logged in.</h1>');
	}
	
}

/* Authentication: registration page */
let postSignUp = function(req,res){
	model.sessionModel.insertNewUser(req.body.username, req.body.password)
	.then(data=>{
		console.log(data.message);
		req.body.password = data.hash;
		res.send('<h1>Hi! Welcome to the club!</h1>');
	}, err=>{
		console.log('::Controller:: Error handling submit of signup form. ', err);
		res.render('./ejs/signup', {csrfToken: req.csrfToken(), error: err});
	});
}

/* Authentication: login page */
let getLogin = function(req,res){
	// Check there is no already logged person
	if(!req.session.username){
		res.render('./ejs/login', {csrfToken: req.csrfToken(), error:''});
	} else {
		// The person is already logged
		res.send('<h1>Hi, you are already logged in.</h1>');
	}
}

/* Authentication: login page */
let postLogin = function(req,res){
	model.sessionModel.compareCredentials(req.body.username, req.body.password)
	.then(data=>{
		if (data == true){
			req.session.username = req.body.username;
			res.render('./ejs/restricted', {csrfToken: req.csrfToken()});
		} else {
			res.render('./ejs/login', {csrfToken: req.csrfToken(), error: 'Error: incorrect user/password.'});
		}
	}, err=>{
		console.log('::Controller:: Error handling submit of signup form. ', err);
		res.render('./ejs/login', {csrfToken: req.csrfToken(), error: err});
	});
}

/* Authentication: restricted page */
let getRestricted = function(req,res){
	if(req.session.username==undefined){
		res.render('./ejs/login', {csrfToken: req.csrfToken(), error:'You are not authorized to see this content, please login.'});
	} else {
		// Consult some model and then render with data. Let's just send an static page:
		res.render('./ejs/restricted', {csrfToken: req.csrfToken()});
	}
}

/* Authentication: restricted page */
let logout = function(req,res){
	if(req.session.username!=undefined){
		req.session.destroy(function(err){
			if (err){
				res.send('<h1>Your session could not be closed.</h1>');
			} else {
				res.send('<h1>Your session has been closed.</h1>')
			}
		});
	} else {
		res.send('<h1>You have no active session.</h1>');
	}
}

module.exports={
	'init_controller':init_controller,
	'getIndex':getIndex,
	'getSignUp':getSignUp,
	'postSignUp':postSignUp,
	'getLogin':getLogin,
	'postLogin':postLogin,
	'getRestricted':getRestricted,
	'logout':logout
}