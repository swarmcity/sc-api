var express = require('express');
var app = express();
var config = require('./config.json');
var request = require('request');
var cors = require('cors');
var cache = require('memory-cache');

// start webserver...
app.listen(config.httpport, function() {
	console.log('API listening on port ', config.httpport);
});

app.use(cors());

app.get('/swtprice', function(req, res) {

	var r = cache.get('swtprice');
	if (r) {
		res.status(200).json(r);
	} else {

		request('https://api.coinmarketcap.com/v1/ticker/swarm-city/?convert=EUR', function(error, response, body) {

			if (error && (response || response.statusCode !== 200)){
				return res.status(response.statusCode).json({error:error});
			}

			var p = JSON.parse(body);

			cache.put('swtprice', [Object.assign({}, p[0], {
				cached_at: new Date()
			})], 60 * 1000);

			res.status(200).json(p);

		});

	}



});