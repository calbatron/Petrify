var Q 	=	require('q');
var q 	=	require('./quick-console.js');
var http 					= 	require('http');
var parseString 			= 	require('xml2js').parseString;


module.exports = {
	
	sitemap: "",
	init: function() {
		var deferred = Q.defer();

		this.getSiteMap()
		.then(this.parseXML)
		.then(this.parseJSON)
		.then(function(urls) {
			q.c('Finised With Sitemap', 1, 2);
			deferred.resolve(urls);
		})

		return deferred.promise;	
	},

	getSiteMap: function() {
		var deferred = Q.defer();
		var chunk = "";

		q.c('Looking for Sitemap', 1);
		
		http.get(global.fullUrl, function(res) {
			res.on('data', function(e) {	
				chunk += e
			})
			res.on('end', function() {
				q.c('Sitemap Recieved', 1, 2);
				deferred.resolve(chunk);
			})
		})
		return deferred.promise;	
	},

	parseXML: function(xml) {
		
		var deferred = Q.defer();
		q.c('Processing Sitemap', 1);

		parseString(xml, function(err, result) {
		if (err) {
			q.c('there is an error with parseXML', 0, 4);
		}
		else {
			deferred.resolve(result);
		}
	});

	return deferred.promise;

	},

	parseJSON: function(json) {

		var deferred = Q.defer();
		var locArray = []		
		for (var k in json.urlset.url) {
			locArray.push(json.urlset.url[k].loc[0]);
		}
		deferred.resolve(locArray);		
		return deferred.promise;

	}
}