let app;
let controller;

let timestamp = function(){
	let date = new Date();
	return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+':'+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()+':'+date.getMilliseconds();
}

let init_router = function(pApp, pController){
	return new Promise((resolve, reject)=>{
		app = pApp;
		controller = pController;

		app.get('/', (req,res)=>{
			console.log('::Router:: '+timestamp()+' GET "/" recieved from: '+req.connection.remoteAddress);
			controller.getIndex(req,res);
		});

		/* Authentication: registration page */
		app.get('/signup', (req,res)=>{
			console.log('::Router:: '+timestamp()+' GET "/signup" recieved from: '+req.connection.remoteAddress);
			controller.getSignUp(req,res);
		});

		/* Authentication: registration page */
		app.post('/signup', (req,res)=>{
			console.log('::Router:: '+timestamp()+' POST "/signup" recieved from: '+req.connection.remoteAddress);
			controller.postSignUp(req,res);
		});

		/* Authentication: login page */
		app.get('/login', (req,res)=>{
			console.log('::Router:: '+timestamp()+' GET "/login" recieved from: '+req.connection.remoteAddress);
			controller.getLogin(req,res);
		});

		/* Authentication: login page */
		app.post('/login', (req,res)=>{
			console.log('::Router:: '+timestamp()+' POST "/login" recieved from: '+req.connection.remoteAddress);
			controller.postLogin(req,res);
		});

		/* Authentication: restricted page */
		app.get('/restricted', (req,res)=>{
			console.log('::Router:: '+timestamp()+' GET "/restricted" recieved from: '+req.connection.remoteAddress);
			controller.getRestricted(req,res);
		});

		/* Authentication: restricted page */
		app.post('/logout', (req,res)=>{
			console.log('::Router:: '+timestamp()+' POST "/logout" recieved from: '+req.connection.remoteAddress);
			controller.logout(req,res);
		});

		resolve('::Router:: Routes are defined.');
	});
}

module.exports={
	'init_router':init_router
}