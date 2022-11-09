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
	res.send({"status" : "OPT-IN"});	
};

/*
 * POST Handler for /save/ route of Activity.
 */
exports.save = function (req, res) {
    
    console.log("5 -- For Save");	
	res.send({"status" : "OPT-IN"});	
};

/*
 * POST Handler for /execute/ route of Activity.
 */
exports.execute = function (req, res) {
    
    console.log("5 -- For EXECUTE");	
	var RequestBody = JSON.stringify(req.body);
	var  jsonRequestBody = JSON.parse(RequestBody);
    console.log( "jsonRequestBody is:::  ",  jsonRequestBody.inArguments[0] );
	
	var clientId = 'bf57af864dda4364a64833a587876c55'; 
	var clinetsecret = 'be9F0I4PwiqjsqVZXmAGjIHSWUmBHR1w';
	var accesstokenURL = 'https://app-eu.onetrust.com/api/access/v1/oauth/token';
	var endPointURL = 'https://app-eu.onetrust.com/api/consentmanager/v1/datasubjects/profiles';
	var Purposeid  = jsonRequestBody.inArguments[0].PurposeId ;
	var email  = jsonRequestBody.inArguments[0].email;
	var Phone  = jsonRequestBody.inArguments[0].to; 
	var identifierValue = '';
	
	// Check the Purposeid for EMAIL
	if(Purposeid == '8a50804c-8502-4fa2-bf5f-bf661f7a3523' || Purposeid == '531dfa64-a963-4005-971a-d4dc48399ca7' || Purposeid == '74a012ac-db2d-464d-8b2a-581b63e0365b' || Purposeid == '9f4fbe04-9b74-42fe-9d51-cbbbb21688c1')
	{
		identifierValue = email;
	}
	// Check the Purposeid for SMS
	if(Purposeid == '97480c2d-f44a-4db4-8fc3-5e893fc3cdec' || Purposeid == 'b10a19cd-85a8-4d94-8e5b-a8d3d8642366' || Purposeid == '36bb5039-76d9-4f65-b8ca-8b2c0fc5b7bc'  || Purposeid == 'db1b65d5-3589-4fb2-9a44-ddf1427397e1')
	{
		identifierValue = '+'+Phone;
	}
	
	
	console.log( "------------------START--------------------------");
	console.log( "clientId value is "+  email);	
	console.log( "clientId value is "+  Phone);	
	console.log( "clientId value is "+  Purposeid);	
	console.log( "clientId value is "+  identifierValue);	
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
			'identifier': identifierValue,
			'Authorization': 'Bearer '+body.access_token
		  },
		  formData: {

		  }
		};
		accrequest(accoptions, function (error, response1) {
		  if (error) throw new Error(error);
		  //console.log(response1.body);
		  var body1 = JSON.parse(response1.body);
		 
			if(body1.content.length > 0) {
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
			}
			
			
			if(isActive == 'true' ){
				console.log(" -------------------true----------------");
				res.send({"status" : "OPT-IN"});	
			}
			if(isActive == 'false' ){
				console.log(" -------------------false----------------");
				res.send({"status" : "OPT-OUT"});
			}
			if(isActive == '' ){
				console.log(" -------------------no response----------------");
				res.send({"status" : "No-Response"});
			}
		});
	});
};



/*
 * POST Handler for /publish/ route of Activity.
 */
exports.publish = function (req, res) {

    console.log("5 -- For Publish");	
	res.send({"status" : "OPT-IN"});	
};

/*
 * POST Handler for /validate/ route of Activity.
 */
exports.validate = function (req, res) {

    console.log("5 -- For Validate");	
	res.send({"status" : "OPT-IN"});	
};
