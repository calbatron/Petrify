var Q 	= 	require('q');
var q 	=	require('./quick-console.js');
var http 	= 	require('http');

module.exports = {

	gettingProgress: 0,
	recievedProgress: 0,
	totalPages: 0,
	website: [],
	init: function(json) {
		var deferred = Q.defer();
		q.c('Downloading HTLM Pages', 1);

		this.loopUrls(json).then(function(websiteHTML){
			q.c('Compeleted Downloading HTLM Pages', 1, 2);
			deferred.resolve(websiteHTML);
		});

		return deferred.promise;	
	},

	loopUrls: function(json) {

		var promises = []
		var htmlFiles = []
		this.totalPages = json.length;

		for (var k in json) {
			promises.push(this.getPage(json[k]));
		}	

		return Q.all(promises);
	},

	getPage: function(url) {
		
		var deferred = Q.defer();
		var website = this.website;
		var chunk = "";
		http.get(url, function(res) {

			module.exports.gettingProgress++
			q.c(module.exports.gettingProgress + "/" + module.exports.totalPages + ": Getting Page " + url, 3, 5);

			res.on('data', function(e) {	

				chunk += e
			})
			res.on('end', function() {

				module.exports.recievedProgress++;
				q.c(module.exports.recievedProgress + "/" + module.exports.totalPages + ": Recieved Page " + url, 2, 5);
				deferred.resolve({"url":url, "html":chunk});
			})
		})

		return deferred.promise;	

	}	

}