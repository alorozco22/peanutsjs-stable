const exampleModel = require('./exampleModel');
const sessionModel = require('./sessionModel');

let init_models = function(mysql){
	return new Promise((resolve,reject)=>{
		exampleModel.init_model(mysql)
		.then(data=>{
			console.log(data);
			return sessionModel.init_model(mysql);
		})
		.then(data => {
			console.log(data);
			resolve('::Main Model:: Models initialized.');
		}, err=>{
			console.log('::Main Model:: Error initializing models.');
			reject(err);
		});
	});
}

module.exports={
	'init_models':init_models,
	'exampleModel':exampleModel,
	'sessionModel':sessionModel
}