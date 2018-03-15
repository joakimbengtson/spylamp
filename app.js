#!/usr/bin/env node

var express = require('express');
var app = express();
var cors = require('cors');
var sprintf = require('yow').sprintf;
var bodyParser = require('body-parser');
var redirectLogs = require('yow').redirectLogs;
var prefixLogs = require('yow').prefixLogs;
var yahooFinance = require('yahoo-finance');
var API = require('rgb-globe-api');
var api = new API({id:'meg'});
var random = require('yow/random');

var PORT = 4000;
var CHECK_INTERVAL = 10000; // milliseconds
var DEMO_DURATION = 2000; 
var gSleeping = false;
var gLastRegularMarketPrice = 0;
var gTimestamp;

var Server = function(args) {

	args = parseArgs();

	function parseArgs() {
		var commander = require('commander');

		commander.version('1.0.0');
		commander.option('-l --log', 'redirect logs to file');
		commander.option('-p --port <port>', 'listens to specified port', PORT);
		commander.parse(process.argv);

		var args = ['port', 'log'];

		args.forEach(function(item) {
			args[item] = commander[item];
		});

		return args;
	}
	
	function getFormattedDate(d) {
		var dd = d.getDate();
		var mm = d.getMonth()+1; //January is 0!
		var yyyy = d.getFullYear();
		
		if (dd < 10) {
		    dd = '0' + dd;
		} 
		
		if(mm < 10) {
		    mm = '0' + mm;
		} 
		
		return yyyy + '-' + mm + '-' + dd;		
	}	
	
	function getYahooHistorical(options) {

		return new Promise(function(resolve, reject) {
			
			var yahoo = require('yahoo-finance');

			yahoo.historical(options, function (error, quotes) {

				try {					
					if (error)
						reject(error);
					else
						resolve(quotes);
				}
				catch (error) {
					reject(error);
				}
						
			});
			
		});
	}
	
	function getYahooQuote(options) {

		return new Promise(function(resolve, reject) {
			
			var yahoo = require('yahoo-finance');
			
			yahoo.quote(options, function (error, snapshot) {

				try {					
					if (error)
						reject(error);
					else
						resolve(snapshot);
				}
				catch (error) {
					reject(error);
				}
						
			});
			
		});
	}
	
	
	function listen() {
		
		app.set('port', (args.port || PORT));
		app.use(cors());
		app.listen(app.get('port'), function() {
			console.log("SPY Lamp is running on port " + app.get('port'));
		});

	}
	
	
	function isNumeric(num) {
		return !isNaN(num);
	}
	

	function fireworks() {
				
		return new Promise((resolve, reject) => {
			Promise.resolve().then(() => {
				return api.random({duration:10000, priority:'!'});
			})
			.then(() => {
				resolve();
			})
	
			.catch((error) => {
			    console.log(error);
			    reject(error);
			});
		});											
	}	
	
	
	function startupSequence() {
				
		return new Promise((resolve, reject) => {
			Promise.resolve().then(() => {
				RGB = "rgb(131, 21, 11)";
				return api.color({color:RGB, duration:DEMO_DURATION});
			})
			.then(() => {
				RGB = "rgb(165, 24, 12)"; 
				return api.color({color:RGB, duration:DEMO_DURATION});			
			})
			.then(() => {
				RGB = "rgb(197, 27, 12)"; 
				return api.color({color:RGB, duration:DEMO_DURATION});			
			})
			.then(() => {
				RGB = "rgb(230, 31, 7)"; 
				return api.color({color:RGB, duration:DEMO_DURATION});			
			})
			.then(() => {
				RGB = "rgb(255, 33, 4)"; 
				return api.color({color:RGB, duration:DEMO_DURATION});			
			})
			.then(() => {
				RGB = "rgb(255, 82, 70)"; 
				return api.color({color:RGB, duration:DEMO_DURATION});			
			})
			.then(() => {
				RGB = "rgb(255, 121, 111)"; 
				return api.color({color:RGB, duration:DEMO_DURATION});			
			})
			.then(() => {
				resolve();
			})
	
			.catch((error) => {
			    console.log(error);
			    reject(error);
			});
		});											
	}
	
	function displayColor(percentage) {
		return new Promise((resolve, reject) => {
			Promise.resolve().then(() => {
				var RGB;
				
				switch (true) {
					case (gSleeping): // Kallt blå när vi sover
					RGB = "rgb(0, 0, 50)"; 
					break;
										
					// Negative
					case (percentage < -0.9):
					RGB = "rgb(131, 21, 11)"; 
					break;

					case (percentage < -0.8):
					RGB = "rgb(165, 24, 12)"; 
					break;

					case (percentage < -0.7):
					RGB = "rgb(197, 27, 12)"; 
					break;

					case (percentage < -0.6):
					RGB = "rgb(230, 31, 7)"; 
					break;

					case (percentage < -0.5):
					RGB = "rgb(255, 33, 4)"; 
					break;

					case (percentage < -0.4):
					RGB = "rgb(255, 82, 70)"; 
					break;
					
					case (percentage < -0.3):
					RGB = "rgb(255, 121, 111)"; 
					break;
					
					case (percentage < -0.2):
					RGB = "rgb(255, 155, 149)";
					break;
					
					case (percentage < -0.1):
					RGB = "rgb(255, 196, 192)";
					break;
					
					case (percentage < 0):
					RGB = "rgb(255, 235, 234)";
					break;

					
					// Neutral
					case (percentage == 0):
					RGB = "rgb(229, 232, 255)";
					break;					
					
					
					// Positive
					case (percentage > 1.2):
					RGB = "rgb(0, 255, 0)";
					break;

					case (percentage > 1.1):
					RGB = "rgb(0, 139, 35)";
					break;

					case (percentage > 1):
					RGB = "rgb(0, 161, 57)";
					break;

					case (percentage > 0.9):
					RGB = "rgb(37, 171, 72)";
					break;

					case (percentage > 0.8):
					RGB = "rgb(37, 171, 72)";
					break;

					case (percentage > 0.7):
					RGB = "rgb(112, 202, 111)";
					break;

					case (percentage > 0.6):
					RGB = "rgb(142, 212, 134)";
					break;

					case (percentage > 0.5):
					RGB = "rgb(86, 202, 101)";
					break;

					case (percentage > 0.4):
					RGB = "rgb(115, 215, 118)";
					break;
					
					case (percentage > 0.3):
					RGB = "rgb(152, 222, 145)";
					break;
					
					case (percentage > 0.2):
					RGB = "rgb(163, 229, 166)";
					break;
					
					case (percentage > 0.1):
					RGB = "rgb(195, 240, 192)";
					break;

					case (percentage > 0):
					RGB = "rgb(226, 246, 226)";
					break;

										
				}

			    return api.color({color:RGB, duration:-1, priority:'!'});				
			})
			.then(() => {
				resolve();
			})
			.catch((error) => {
				reject(error);
			});
			
		});						

	};	


	function loopAndDisplaySPY() {
		var percentage;
		var i = 0;
		var previousClose = -1;
		
		//var yesterday = getFormattedDate(new Date(+new Date - (1000 * 60 * 60 * 24)));
		var today = getFormattedDate(new Date(+new Date));
		var sevendaysago = getFormattedDate(new Date(+new Date - (1000 * 60 * 60 * 24 * 5)));

		console.log("today=", today);
		console.log("sevendaysago=", sevendaysago);
		
		getYahooHistorical({symbol:'SPY', from:sevendaysago, to:today}).then(function(snapshot) {
			console.log(snapshot);
			do {
				if (typeof(snapshot[i]) != "undefined")
					previousClose = snapshot[i].close;
				else
					++i;
			} while (previousClose == -1);
			
			console.log("previousClose", previousClose);

			getYahooQuote({symbol:'SPY', modules:['price']}).then(function(snapshot) {
				console.log("quote", snapshot.price.regularMarketPrice);
								
				if (!isNaN(snapshot.price.regularMarketPrice)) {
									
					// Kolla om vi ska sova (SPY stängd)
					if (gLastRegularMarketPrice == snapshot.price.regularMarketPrice) {
						if (Date.now() - gTimestamp > (1000*60*10)) { // Samma kurs i 10 minuter, börsen stängd
							gSleeping = true;	
							console.log("ZZzzzzzz.....");
						}
					}
					else {
						if (gSleeping) {
							console.log("Wake up!");
							fireworks();						
						}
							
						gLastRegularMarketPrice = snapshot.price.regularMarketPrice;
						gTimestamp = Date.now();
						gSleeping = false;					
					}
					
					percentage = (1 - (previousClose/snapshot.price.regularMarketPrice)) * 100;
					percentage = parseFloat(Math.round(percentage * 100) / 100).toFixed(2); 
	
					console.log("percentage", percentage);
	
					displayColor(percentage).then(function() {
						setTimeout(loopAndDisplaySPY, CHECK_INTERVAL);
					})
					.catch(function(error) {
						console.log("Fel: ", error);
						setTimeout(loopAndDisplaySPY, CHECK_INTERVAL);
					});
				}
				else
					setTimeout(loopAndDisplaySPY, CHECK_INTERVAL);

			})
			.catch(function(error) {
				console.log("Error loopAndDisplaySPY:getYahooQuote", error);
				setTimeout(loopAndDisplaySPY, CHECK_INTERVAL);
			});		
				
			
		})
		.catch(function(error) {
			console.log("Error loopAndDisplaySPY:getYahooHistorical", error);
			setTimeout(loopAndDisplaySPY, CHECK_INTERVAL);
		});		


	};

	prefixLogs();

	if (args.log) {
		redirectLogs();
	}
	
	listen();	
	
	//setTimeout(loopAndDisplaySPY, CHECK_INTERVAL);
	
	startupSequence().then(function() {
		loopAndDisplaySPY();
	});
		
}

module.exports = new Server();
