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
    console.log("body  11111: " + util.inspect(req.body));
   /* console.log("headers: " + req.headers);
    console.log("trailers: " + req.trailers);
    console.log("method: " + req.method);
    console.log("url: " + req.url);
    console.log("params: " + util.inspect(req.params));
    console.log("query: " + util.inspect(req.query));
    console.log("route: " + req.route);
    console.log("cookies: " + req.cookies);
    console.log("ip: " + req.ip);
    console.log("path: " + req.path);
    console.log("host: " + req.host);
    console.log("fresh: " + req.fresh);
    console.log("stale: " + req.stale);
    console.log("protocol: " + req.protocol);
    console.log("secure: " + req.secure);
    console.log("originalUrl: " + req.originalUrl);*/
}

/*
 * POST Handler for / route of Activity (this is the edit route).
 */
exports.edit = function (req, res) {

    console.log("5 -- For Edit");	

    //console.log("Edited: "+req.body.inArguments[0]);    
    
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    res.send(200, 'Edit');
};

/*
 * POST Handler for /save/ route of Activity.
 */
exports.save = function (req, res) {
    
    console.log("5 -- For Save");	

    //console.log("Saved: "+req.body.inArguments[0]);
    
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    res.send(200, 'Save');
};

/*
 * POST Handler for /execute/ route of Activity.
 */
exports.execute = function (req, res) {
    
    console.log("5 -- For EXECUTE");	
 
	var RequestBody = JSON.stringify(req.body);
	var  jsonRequestBody = JSON.parse(RequestBody);
    console.log( "jsonRequestBody "+  jsonRequestBody );
	
	
	
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
  		console.log(response.body);
		var body = JSON.parse(response.body);
		//console.log(":::::::::::::::::::::::::::::::::::::::::::::::::::::::::", body.access_token);	
		//console.log(":::::::::::::::::::::::::::::::::::::::::::::::::::::::::"+ body.access_token);	
		
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
		  
		  //console.log("====================================1======================:", body1.content);
	      //console.log("===================================2=======================:", body1.content[0].Purposes);

			var isActive = 'false';
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
				res.send({"status" : "OPT-IN"});	
			}
			else{ 
				res.send({"status" : "OPT-OUT"});
			}
					

		
		});
		
		// Actual request END here

	//res.send(JSON.parse(response.body)); 
	});


    //res.send({"access_token" : "success"});
};



/*
 * POST Handler for /publish/ route of Activity.
 */
exports.publish = function (req, res) {

    console.log("5 -- For Publish");	
    logData(req);
    res.send(200, 'Publish');

    //console.log("Published: "+req.body.inArguments[0]);        
    
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
//     logData(req);
//     res.send(200, 'Publish');
};

/*
 * POST Handler for /validate/ route of Activity.
 */
exports.validate = function (req, res) {

    console.log("5 -- For Validate");	
    console.log("4");	
    console.log("3");	
    console.log("2");	
    console.log("1");	
    //console.log("Validated: "+req.body.inArguments[0]);       
    
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    logData(req);
    res.send(200, 'Validate');
};
