'use strict';
var util = require('util');

// Deps
const Path = require('path');
const JWT = require(Path.join(__dirname, '..', 'lib', 'jwtDecoder.js'));
var http = require('https');

exports.logExecuteData = [];

function logData(req) {
    exports.logExecuteData.push({
        body: req.body,
        headers: req.headers,
        trailers: req.trailers,
        method: req.method,
        url: req.url,
        params: req.params,
        query: req.query,
        route: req.route,
        cookies: req.cookies,
        ip: req.ip,
        path: req.path, 
        host: req.host,
        fresh: req.fresh,
        stale: req.stale,
        protocol: req.protocol,
        secure: req.secure,
        originalUrl: req.originalUrl
    });
}

/*
 * POST Handler for / route of Activity (this is the edit route).
 */
exports.edit = function (req, res) {

    console.log("5 -- For Edit");	 
    //logData(req);
    //res.send(200, 'Edit'); 
	res.send({"status" : "OPT-IN"});	
};

/*
 * POST Handler for /save/ route of Activity.
 */
exports.save = function (req, res) {
    
    console.log("5 -- For Save");	
    //logData(req);
    //res.send(200, 'Save');
	res.send({"status" : "OPT-IN"});	
};

/*
 * POST Handler for /execute/ route of Activity.
 */
exports.execute = function (req, res) {
    
    console.log("5 -- For EXECUTE");	
 
	var RequestBody = JSON.stringify(req.body);
	var  jsonRequestBody = JSON.parse(RequestBody);
    console.log( "jsonRequestBody is::  "+  jsonRequestBody.inArguments[0] );
	
	var clientId = jsonRequestBody.inArguments[0].clientId;
	var clinetsecret =jsonRequestBody.inArguments[0].clientsecret;
	var accesstokenURL = jsonRequestBody.inArguments[0].AccessTokenURL;
	var endPointURL = jsonRequestBody.inArguments[0].EndPoint;
	var Purposeid  = jsonRequestBody.inArguments[0].PurposeId 
	
	console.log( "------------------START--------------------------");
    console.log( "AccessTokenURL value is "+  accesstokenURL );	
	console.log( "EndPoint value is "+  endPointURL );	
	console.log( "clientsecret value is "+  clinetsecret );	
	console.log( "clientId value is "+  clientId);	
	console.log( "clientId value is "+  Purposeid);	
	console.log( "-------------------END-------------------------");

    logData(req);
    //res.send(200, 'Publish');
	var isActive = '';
	var request = require('request');
	var options = {
  	'method': 'POST',
  	'url': accesstokenURL,
  	'headers': {
  	},
  	formData: {
    	'grant_type': 'client_credentials',
    	'client_id': clientId,
    	'client_secret': clinetsecret
  	}
	};
	request(options, function (error, response) {
  		if (error) throw new Error(error);
  		//console.log(response.body);
		var body = JSON.parse(response.body);
		
		// Actual request start from here
		var accrequest = require('request');
		var accoptions = {
		  'method': 'GET',
		  'url': endPointURL,
		  'headers': {
			'identifier': 'test@gmail.com',
			'Authorization': 'Bearer '+body.access_token
		  },
		  formData: {

		  }
		};
		accrequest(accoptions, function (error, response1) {
		  if (error) throw new Error(error);
		  //console.log(response1.body);
		  var body1 = JSON.parse(response1.body);
		 
			for(const val of body1.content[0].Purposes) {
				//console.log("INSIDE ARRAY"+ val.Id);
				
				
				//Arçelik Email Active
				if(val.Id == Purposeid && val.Status == "ACTIVE"){
					isActive = 'true';	
				}
				if(val.Id == Purposeid && ( val.Status == "NO_CONSENT" || val.Status == "WITHDRAW")){
					isActive = 'false';
				}
			}
			
			
			if(isActive == 'true' ){
				console.log(" -------------------true----------------");
				res.send({"status" : "OPT-IN"});	
			}
			if(isActive == 'false' ){
				console.log(" -------------------false----------------");
				res.send({"status" : "OPT-OUT"});
			}
		});
		

	//res.send(JSON.parse(response.body)); 
	});
	//if(isActive == ''){
		//res.send({"status" : "NO-Response"});
	//}
    //res.send({"access_token" : "success"});
		
};



/*
 * POST Handler for /publish/ route of Activity.
 */
exports.publish = function (req, res) {

    console.log("5 -- For Publish");	
    //logData(req);
    //res.send(200, 'Publish');
	res.send({"status" : "OPT-IN"});	
};

/*
 * POST Handler for /validate/ route of Activity.
 */
exports.validate = function (req, res) {

    console.log("5 -- For Validate");	
    //logData(req);
    //res.send(200, 'Validate');
	res.send({"status" : "OPT-IN"});	
};
