var Q 						= 	require('q');
var q 						=	require('./quick-console.js');
var html 					=	require('./petrify-html.js');
var fs 						= 	require('fs');


module.exports = {
	
	init: function(website) {

		var deferred = Q.defer();

		q.c('Started Creating Files', 1);
		this.make(website).then(function() {
			q.c('Finsihed Creating Files', 1, 2);
			deferred.resolve();
		})

		return deferred.promise;

	},

	make: function(website) {

		var promises = []
		var progress = 0;

		for (var loop = 0; loop < website.length; loop++) {
			var websitehtml = website[loop].html;
			var url = website[loop].url;
			var dir = url.replace(appUrl, "");
			progress++;

			q.c(progress + "/" + website.length + ": Creating file " + dir + "/index.html", 2, 5);
			promises.push(this.grab('public'+ dir + '/index.html', websitehtml))
		}

		return Q.all(promises);
	},

	grab: function(dir, websitehtml) {

		var deferred = Q.defer();

		fs.writeFile(dir, websitehtml, function(err) {
			if (err) {
				q.c('Error Writing to ' + dir, 0, 4);
			} else {
				deferred.resolve();
			}
		})

		return deferred.promise;
	}


}