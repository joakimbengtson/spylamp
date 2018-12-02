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
var CHECK_INTERVAL = 20000; // milliseconds
var DEMO_DURATION = 1000; 
var gSleeping = false;
var gLastRegularMarketPrice = 0;
var gTimestamp;

var COLORS = [
	"rgb(0, 0, 50)", // sleeping
	
	// reds
	"rgb(255, 170, 170)", // 1
	"rgb(255, 160, 160)",
	"rgb(240, 140, 140)",
	"rgb(255, 130, 130)", 
	"rgb(255, 110, 110)",
	"rgb(255, 90, 90)", 
	"rgb(255, 70, 70)", 
	"rgb(255, 51, 51)", 
	"rgb(255, 40, 40)",
	"rgb(255, 0, 0)", // 10
		
	"rgb(209,202,245)", // neutral
	
	// greens
	"rgb(0, 255, 0)", // 12
	"rgb(0, 240, 0)",
	"rgb(0, 230, 0)",
	"rgb(40, 220, 40)",
	"rgb(80, 220, 80)",
	"rgb(70, 240, 70)",
	"rgb(90, 240, 90)",
	"rgb(90, 250, 90)",
	"rgb(110, 250, 110)",
	"rgb(120, 252, 120)" // 21
];

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
					if (error) {
						console.log("error i getyahoohistorical");						
						reject(error);						
					}
					else
						resolve(quotes);
				}
				catch (error) {
					console.log("error i getyahoohistorical");						
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
					if (error) {
						console.log("error i getyahooquote");
						reject(error);						
					}
					else
						resolve(snapshot);
				}
				catch (error) {
					console.log("error i getyahooquote");
					reject(error);
				}
						
			});
			
		});
	}
	
	
	function listen() {
		
		app.set('port', (args.port || PORT));
		app.use(cors());
		app.listen(app.get('port'), function() {
			console.log("JBN: SPY Lamp is running on port " + app.get('port'), CHECK_INTERVAL);
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
			    console.log("Fel i fireworks", error);
			    reject(error);
			});
		});											
	}	
	
	function startupSequence() {
						
		return new Promise((resolve, reject) => {
			Promise.resolve().then(() => {
				return api.color({color:COLORS[10], duration:DEMO_DURATION});
			})
			.then(() => {
				return api.color({color:COLORS[9], duration:DEMO_DURATION});			
			})				
			.then(() => {
				return api.color({color:COLORS[8], duration:DEMO_DURATION});			
			})				
			.then(() => {
				return api.color({color:COLORS[7], duration:DEMO_DURATION});			
			})				
			.then(() => {
				return api.color({color:COLORS[6], duration:DEMO_DURATION});			
			})				
			.then(() => {
				return api.color({color:COLORS[5], duration:DEMO_DURATION});			
			})				
			.then(() => {
				return api.color({color:COLORS[4], duration:DEMO_DURATION});			
			})				
			.then(() => {
				return api.color({color:COLORS[3], duration:DEMO_DURATION});			
			})				
			.then(() => {
				return api.color({color:COLORS[2], duration:DEMO_DURATION});			
			})				
			.then(() => {
				return api.color({color:COLORS[1], duration:DEMO_DURATION});			
			})				
			
			.then(() => {
				return api.color({color:COLORS[11], duration:DEMO_DURATION}); // neutral
			})	
						
			.then(() => {
				return api.color({color:COLORS[21], duration:DEMO_DURATION});
			})				
			.then(() => {
				return api.color({color:COLORS[20], duration:DEMO_DURATION});			
			})				
			.then(() => {
				return api.color({color:COLORS[19], duration:DEMO_DURATION});			
			})				
			.then(() => {
				return api.color({color:COLORS[18], duration:DEMO_DURATION});			
			})				
			.then(() => {
				return api.color({color:COLORS[17], duration:DEMO_DURATION});			
			})				
			.then(() => {
				return api.color({color:COLORS[16], duration:DEMO_DURATION});			
			})				
			.then(() => {
				return api.color({color:COLORS[15], duration:DEMO_DURATION});			
			})				
			.then(() => {
				return api.color({color:COLORS[14], duration:DEMO_DURATION});			
			})				
			.then(() => {
				return api.color({color:COLORS[13], duration:DEMO_DURATION});			
			})				
			.then(() => {
				return api.color({color:COLORS[12], duration:DEMO_DURATION});			
			})				

			.then(() => {
				resolve();
			})
			.catch((error) => {
			    console.log("Fel i startupSequence", error);
			    reject(error);
			});
		});											
	}
	
	
	function displayColor(percentage) {
		return new Promise((resolve, reject) => {
			Promise.resolve().then(() => {
				var rgbIndex = 0;
				
				switch (true) {
					case (gSleeping): // Kallt blå när vi sover
					rgbIndex = 0; 
					break;
										
					// Negative
					case (percentage < -0.9):
					rgbIndex = 10; 
					break;

					case (percentage < -0.8):
					rgbIndex = 9; 
					break;

					case (percentage < -0.7):
					rgbIndex = 8; 
					break;

					case (percentage < -0.6):
					rgbIndex = 7; 
					break;

					case (percentage < -0.5):
					rgbIndex = 6; 
					break;

					case (percentage < -0.4):
					rgbIndex = 5; 
					break;
					
					case (percentage < -0.3):
					rgbIndex = 4; 
					break;
					
					case (percentage < -0.2):
					rgbIndex = 3; 
					break;
					
					case (percentage < -0.1):
					rgbIndex = 2; 
					break;
					
					case (percentage < 0):
					rgbIndex = 1; 
					break;

					
					// Neutral
					case (percentage == 0):
					rgbIndex = 11; 
					break;					
					
					
					// Positive
					case (percentage > 0.9):
					rgbIndex = 12; 
					break;

					case (percentage > 0.8):
					rgbIndex = 13; 
					break;

					case (percentage > 0.7):
					rgbIndex = 14; 
					break;

					case (percentage > 0.6):
					rgbIndex = 15; 
					break;

					case (percentage > 0.5):
					rgbIndex = 16; 
					break;

					case (percentage > 0.4):
					rgbIndex = 17; 
					break;

					case (percentage > 0.3):
					rgbIndex = 18; 
					break;

					case (percentage > 0.2):
					rgbIndex = 19; 
					break;

					case (percentage > 0.1):
					rgbIndex = 20; 
					break;
					
					case (percentage > 0):
					rgbIndex = 21; 
					break;
										
				}

				console.log("sätter färg", rgbIndex, COLORS[rgbIndex]);
				
			    return api.color({color:COLORS[rgbIndex], duration:-1});				
			})
			.then(() => {
				resolve();
			}) 
			.catch((error) => {
				console.log("Fel i displayColor", error);
				reject(error);
			});
			
		});						

	};	


	function loopAndDisplaySPY() {
		var percentage;
		var i = 0;
		var previousClose = -1;
		
		var today = getFormattedDate(new Date(+new Date));
		var sevendaysago = getFormattedDate(new Date(+new Date - (1000 * 60 * 60 * 24 * 5)));

		console.log("today=", today);
		console.log("sevendaysago=", sevendaysago);
		
		getYahooHistorical({symbol:'SPY', from:sevendaysago, to:today}).then(function(snapshot) {

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
					
					if (snapshot.price.regularMarketPrice == 0) {
						gSleeping = true;	
					}			
					// Kolla om vi ska sova (SPY stängd)
					else if (gLastRegularMarketPrice == snapshot.price.regularMarketPrice) {
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
	
	
					displayColor(percentage).then(function() {
						console.log("percentage", percentage);
					})
					
					.catch(function(error) {
						console.log("Fel i loopAndDisplaySPY", error);
					});
				}
				else
					console.log("regularMarketPrice är inte numeriskt.");

			})
			.catch(function(error) {
				console.log("Error loopAndDisplaySPY:getYahooQuote", error);
			});		
				
			
		})
		.catch(function(error) {
			console.log("Error loopAndDisplaySPY:getYahooHistorical", error);
		});		


	};

	prefixLogs();

	if (args.log) {
		redirectLogs();
	}
	
	listen();	
		
	startupSequence().then(function() {
		setInterval(loopAndDisplaySPY, CHECK_INTERVAL);
	});
		
}

module.exports = new Server();
