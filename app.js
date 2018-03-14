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

var Server = function(args) {

	args = parseArgs();

	function parseArgs() {
		var commander = require('commander');

		commander.version('1.0.0');
		commander.option('-l --log', 'redirect logs to file');
		commander.option('-p --port <port>', 'listens to specified port', 3000);
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
		
		app.set('port', (args.port || 3000));
		app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
		app.use(bodyParser.json({limit: '50mb'}));
		app.use(cors());
		
		// ----------------------------------------------------------------------------------------------------------------------------
		// Returnerar alla aktier med aktuell kurs och utfall i % mot köp
		app.get('/stocks', function (request, response) {
			
			_pool.getConnection(function(err, connection) {
				if (!err) {					
					console.log("Hämtar alla aktier från DB.");
					connection.query('SELECT * FROM aktier WHERE såld=0', function(error, rows, fields) {
						if (!error) {
							if (rows.length > 0) {
								var tickerCheckList = [];
								
								for (var i = 0; i < rows.length; i++) {
									tickerCheckList[i] = rows[i].ticker;	
								};					
																		
								yahooFinance.snapshot({
								  symbols: tickerCheckList,
								  fields: ['l1', 'm3', 'm4']
								}, function (err, snapshot) {
									if (err) {
										console.log(err);	
										response.status(404).json({error:err});						
									}
									else {
										var percentage;
										
										for (var i = 0; i < Object.keys(snapshot).length; i++) {
											rows[i].senaste = snapshot[i].lastTradePriceOnly;
											rows[i].sma50 = snapshot[i]['50DayMovingAverage'];
											rows[i].sma200 = snapshot[i]['200DayMovingAverage'];
											
											// Beräkna % med 2 decimaler
											percentage = (1 - (rows[i].kurs/snapshot[i].lastTradePriceOnly)) * 100;
											rows[i].utfall = parseFloat(Math.round(percentage * 100) / 100).toFixed(2); 
										}
																		
										response.status(200).json(rows);							
									}
								});
							}
							else
								response.status(200).json([]);
						}
						else {
							console.log("SELECT * FROM aktier misslyckades: ", error);
							response.status(200).json([]);					
						}	
						connection.release();
					});
				}
				else {
					console.log("Kunde inte skapa en connection: ", err);
					response.status(200).json([]);					
				}				
			});					
		})
		

		app.listen(app.get('port'), function() {
			console.log("JBN SPY Lamp is running on port " + app.get('port'));
		});

	};
	
	function doSomeWork(percentage) {
		return new Promise((resolve, reject) => {
			Promise.resolve().then(() => {
				var RGB;
				
				switch (true) {
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
//			    return api.color({color:sprintf("rgb(%d, %d, %d)", R, G, B), duration:-1, priority:'!'});
			    //color:sprintf(’rgb(%d, %d, %d)’, 4, 5, 6)
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
		
		var yesterday = getFormattedDate(new Date(+new Date - (1000 * 60 * 60 * 24)));
		var sevendaysago = getFormattedDate(new Date(+new Date - (1000 * 60 * 60 * 24 * 5)));

		console.log("yesterday=", yesterday);
		console.log("sevendaysago=", sevendaysago);
		
		getYahooHistorical({symbol:'SPY', from:sevendaysago, to:yesterday}).then(function(snapshot) {
			
			do {
				if (typeof(snapshot[i]) != "undefined")
					previousClose = snapshot[i].close;
				else
					++i;
			} while (previousClose == -1);
			
			console.log("previousClose", previousClose);

			getYahooQuote({symbol:'SPY', modules:['price']}).then(function(snapshot) {
				console.log("quote", snapshot.price.regularMarketPrice);

				percentage = (1 - (previousClose/snapshot.price.regularMarketPrice)) * 100;
				percentage = parseFloat(Math.round(percentage * 100) / 100).toFixed(2); 

				console.log("percentage", percentage);

				doSomeWork(percentage).then(function() {
					setTimeout(loopAndDisplaySPY, 10000);
				})
		
				.catch(function(error) {
					console.log("Fel: ", error);
		
					// Och börja om igen
					setTimeout(loopAndDisplaySPY, 10000);
				});
			})
			.catch(function(error) {
				console.log("Error loopAndDisplaySPY:getYahooQuote", error);
			});		
				
			
		})
		.catch(function(error) {
			console.log("Error loopAndDisplaySPY:getYahooHistorical", error);
			setTimeout(loopAndDisplaySPY, 10000);
		});		


	};

	prefixLogs();

	if (args.log) {
		redirectLogs();
	}
	
	listen();	

	loopAndDisplaySPY();
}

module.exports = new Server();
