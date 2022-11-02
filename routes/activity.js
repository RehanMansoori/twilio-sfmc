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
    console.log("body: " + util.inspect(req.body));
    console.log("headers: " + req.headers);
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
    console.log("originalUrl: " + req.originalUrl);
}

/*
 * POST Handler for / route of Activity (this is the edit route).
 */
exports.edit = function (req, res) {

    console.log("5 -- For Edit");	
    console.log("4");	
    console.log("3");	
    console.log("2");	
    console.log("1");	
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
    console.log("4");	
    console.log("3");	
    console.log("2");	
    console.log("1");	
    //console.log("Saved: "+req.body.inArguments[0]);
    
    // Data from the req and put it in an array accessible to the main app.
    console.log( req.body );
    logData(req);
    res.send(200, 'Save');
};

/*
 * POST Handler for /execute/ route of Activity.
 */
exports.execute = function (req, res) {
    
    console.log("5 -- For Publish");	
   // console.log("4");	
   // console.log("3");	
   // console.log("2");	
   // console.log("1");	
    //console.log("Saved: "+req.body.inArguments[0]);
    
    // Data from the req and put it in an array accessible to the main app.
    console.log( req.body );

    logData(req);
    //res.send(200, 'Publish');

	var request = require('request');
	var options = {
  	'method': 'POST',
  	'url': 'https://app-eu.onetrust.com/api/access/v1/oauth/token',
  	'headers': {
  	},
  	formData: {
    	'grant_type': 'client_credentials',
    	'client_id': 'bf57af864dda4364a64833a587876c55',
    	'client_secret': 'be9F0I4PwiqjsqVZXmAGjIHSWUmBHR1w'
  	}
	};
	request(options, function (error, response) {
  		if (error) throw new Error(error);
  		console.log(response.body);
		var body = JSON.parse(response.body);
		console.log(":::::::::::::::::::::::::::::::::::::::::::::::::::::::::", body.access_token);	
		console.log(":::::::::::::::::::::::::::::::::::::::::::::::::::::::::"+ body.access_token);	
		
		// Actual request start from here
		var accrequest = require('request');
		var accoptions = {
		  'method': 'GET',
		  'url': 'https://app-eu.onetrust.com/api/consentmanager/v1/datasubjects/profiles',
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

			for(const val of body1.content[0].Purposes) {
				//console.log("INSIDE ARRAY"+ val.Id);
				//Arçelik Email Active
				if(val.Id == "8a50804c-8502-4fa2-bf5f-bf661f7a3523" && val.Status == "ACTIVE"){
					res.send({"status" : "OPT-IN"})
				}
				
				//Arçelik Email Not active
				if(val.Id == "8a50804c-8502-4fa2-bf5f-bf661f7a3523" && ( val.Status == "NO_CONSENT" || val.Status == "WITHDRAW")){
					res.send({"status" : "OPT-OUT"})
				}
				 
				// Beko Email Active
				if(val.Id == "531dfa64-a963-4005-971a-d4dc48399ca7" &&  val.Status == "ACTIVE") {
					res.send({"status" : "OPT-IN"})
				}
				
				// Beko Email Not active
				if(val.Id == "531dfa64-a963-4005-971a-d4dc48399ca7" && ( val.Status == "NO_CONSENT" || val.Status == "WITHDRAW") ){
					res.send({"status" : "OPT-OUT"})
				}
				
				
				//Grundig Email Active
				if(val.Id == "74a012ac-db2d-464d-8b2a-581b63e0365b" && val.Status == "ACTIVE"){
					res.send({"status" : "OPT-IN"})
				}
				
				//Grundig Email not Active
				if(val.Id == "74a012ac-db2d-464d-8b2a-581b63e0365b" && ( val.Status == "NO_CONSENT" || val.Status == "WITHDRAW")){
					res.send({"status" : "OPT-OUT"})
				}
				
				//Oliz Email
				if(val.Id == "9f4fbe04-9b74-42fe-9d51-cbbbb21688c1" && val.Status == "ACTIVE" ){
					res.send({"status" : "OPT-IN"})
				}
				
				
				//Oliz Email
				if(val.Id == "9f4fbe04-9b74-42fe-9d51-cbbbb21688c1" && ( val.Status == "NO_CONSENT" || val.Status == "WITHDRAW") ){
					res.send({"status" : "OPT-OUT"})
				}
				
				
				//Arçelik SMS Active
				if(val.Id == "8a50804c-8502-4fa2-bf5f-bf661f7a3523" && val.Status == "ACTIVE"){
					res.send({"status" : "OPT-IN"})
				}
				 
				//Arçelik SMS Not Active
				if(val.Id == "8a50804c-8502-4fa2-bf5f-bf661f7a3523" && ( val.Status == "NO_CONSENT" || val.Status == "WITHDRAW") ){
					res.send({"status" : "OPT-OUT"})
				}
				
				
				//Beko SMS Active
				if(val.Id == "531dfa64-a963-4005-971a-d4dc48399ca7" && val.Status == "ACTIVE"){
					res.send({"status" : "OPT-IN"})
				}
				 
				//Beko SMS Not Active
				if(val.Id == "531dfa64-a963-4005-971a-d4dc48399ca7" && ( val.Status == "NO_CONSENT" || val.Status == "WITHDRAW") ){
					res.send({"status" : "OPT-OUT"})
				}
				
				
				//Grundig SMS Active
				if(val.Id == "74a012ac-db2d-464d-8b2a-581b63e0365b" && val.Status == "ACTIVE"){
					res.send({"status" : "OPT-IN"})
				}
				 
				//Grundig SMS Not Active
				if(val.Id == "74a012ac-db2d-464d-8b2a-581b63e0365b" && ( val.Status == "NO_CONSENT" || val.Status == "WITHDRAW") ){
					res.send({"status" : "OPT-OUT"})
				}
				
				
				//Oliz SMS Active
				if(val.Id == "9f4fbe04-9b74-42fe-9d51-cbbbb21688c1" && val.Status == "ACTIVE"){
					res.send({"status" : "OPT-IN"})
				}
				 
				//Oliz SMS Not Active
				if(val.Id == "9f4fbe04-9b74-42fe-9d51-cbbbb21688c1" && ( val.Status == "NO_CONSENT" || val.Status == "WITHDRAW") ){
					res.send({"status" : "OPT-OUT"})
				}
				
				
				
				
				
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
    console.log("4");	
    console.log("3");	
    console.log("2");	
    console.log("1");	

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
